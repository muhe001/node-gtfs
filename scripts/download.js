var async = require('async');
var exec = require('child_process').exec;
var csv = require('csv');
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var path = require('path');
var proj4 = require('proj4');
var request = require('request');
var unzip = require('unzip2');
var q;

var mongooseDb = mongoose.connect('mongodb://localhost:27017/gtfs');

var elasticsearch = require('elasticsearch');

var esClient = new elasticsearch.Client({host: 'http://localhost:9200'});

// check if this file was invoked direct through command line or required as an export
var invocation = (require.main === module) ? 'direct' : 'required';

var config = {};
if(invocation === 'direct') {
  try {
    var config = require('../config.js');
  } catch(e) {
    try {
      var config = require('../config-sample.js');
    } catch(e) {
      handleError(new Error('Cannot find config.js'));
    }
  }


  if(!config.agencies) {
    handleError(new Error('No agency_key specified in config.js\nTry adding \'capital-metro\' to the agencies in config.js to load transit data'));
    process.exit();
  }
}

/*
 * Models are added to schemas with elasticsearch indexed properties es_indexed
 * */
var GTFSFiles = [{
  fileNameBase: 'agency',
  collection: 'agencies',
  model: require('../models/Agency')(esClient)
}, {
  fileNameBase: 'calendar_dates',
  collection: 'calendardates',
  model: null
}, {
  fileNameBase: 'calendar',
  collection: 'calendars',
  model: null
}, {
  fileNameBase: 'fare_attributes',
  collection: 'fareattributes',
  model: null
}, {
  fileNameBase: 'fare_rules',
  collection: 'farerules',
  model: null
}, {
  fileNameBase: 'feed_info',
  collection: 'feedinfos',
  model: require('../models/FeedInfo')(esClient)
}, {
  fileNameBase: 'frequencies',
  collection: 'frequencies',
  model: null
}, {
  fileNameBase: 'routes',
  collection: 'routes',
  model: require('../models/Route')(esClient)
}, {
  fileNameBase: 'shapes',
  collection: 'shapes',
  model: null
}, {
  fileNameBase: 'stop_times',
  collection: 'stoptimes',
  model: null
}, {
  fileNameBase: 'stops',
  collection: 'stops',
  model: require('../models/Stop')(esClient)
}, {
  fileNameBase: 'transfers',
  collection: 'transfers',
  model: null
}, {
  fileNameBase: 'trips',
  collection: 'trips',
  model: null
}, {
  fileNameBase: 'timetables',
  collection: 'timetables',
  model: null
}, {
  fileNameBase: 'route_directions',
  collection: 'routedirections',
  model: require('../models/RouteDirection')(esClient)
}];


function main(config, callback) {
  var log = (config.verbose === false) ? function () {} : console.log;

  // open database and create queue for agency list
  MongoClient.connect(config.mongo_url, {
    w: 1
  }, function (e, db) {
    if(e) handleError(e);

    q = async.queue(downloadGTFS, 1);
    // loop through all agencies specified
    // If the agency_key is a URL, download that GTFS file, otherwise treat
    // it as an agency_key and get file from gtfs-data-exchange.com
    config.agencies.forEach(function (item) {
      var agency = {};

      if(typeof (item) == 'string') {
        agency.agency_key = item;
        agency.agency_url = 'http://www.gtfs-data-exchange.com/agency/' + item + '/latest.zip';
      } else if(item.url) {
        agency.agency_key = item.agency_key;
        agency.agency_url = item.url;
      } else if(item.path) {
        agency.agency_key = item.agency_key;
        agency.path = item.path;
      }

      if(!agency.agency_key) {
        handleError(new Error('No URL or Agency Key or path provided.'));
      }

      q.push(agency);
    });

    q.drain = function (e) {
      if(e) handleError(e);

      log('All agencies completed (' + config.agencies.length + ' total)');
      callback();
    };


    function downloadGTFS(task, cb) {
      var downloadDir = 'downloads';
      var gtfsDir = 'downloads';
      var agency_key = task.agency_key;
      var agency_bounds = {
        sw: [],
        ne: []
      };

      log(agency_key + ': Starting');

      async.series([
        cleanupFiles,
        getFiles,
        removeDatabase,
        importFiles,
        postProcess,
        cleanupFiles
      ], function (e, results) {
        log(e || agency_key + ': Completed');
        cb();
      });


      function cleanupFiles(cb) {
        //remove old downloaded file
        exec((process.platform.match(/^win/) ? 'rmdir /Q /S ' : 'rm -rf ') + downloadDir, function (e) {
          try {
            //create downloads directory
            fs.mkdirSync(downloadDir);
            cb();
          } catch(e) {
            if(e.code == 'EEXIST') {
              cb();
            } else {
              handleError(e);
            }
          }
        });
      }


      function getFiles(cb) {
        if(task.agency_url) {
          downloadFiles(cb);
        } else if(task.path) {
          readFiles(cb);
        }
      }


      function downloadFiles(cb) {
        // do download
        var file_protocol = require('url').parse(task.agency_url).protocol;
        if(file_protocol === 'http:' || file_protocol === 'https:') {
          log(agency_key + ': Downloading');
          request(task.agency_url, processFile).pipe(fs.createWriteStream(downloadDir + '/latest.zip'));

          function processFile(e, response, body) {
            if(response && response.statusCode != 200) {
              cb(new Error('Couldn\'t download files'));
            }
            log(agency_key + ': Download successful');

            fs.createReadStream(downloadDir + '/latest.zip')
              .pipe(unzip.Extract({
                path: downloadDir
              }).on('close', cb))
              .on('error', function (e) {
                log(agency_key + ': Error Unzipping File');
                handleError(e);
              });
          }
        } else {
          if(!fs.existsSync(task.agency_url)) {
            return cb(new Error('File does not exists'));
          }

          fs.createReadStream(task.agency_url)
            .pipe(fs.createWriteStream(downloadDir + '/latest.zip'))
            .on('close', function () {
              fs.createReadStream(downloadDir + '/latest.zip')
                .pipe(unzip.Extract({
                  path: downloadDir
                }).on('close', cb))
                .on('error', handleError);
            })
            .on('error', handleError);
        }
      }


      function readFiles(cb) {
        if(path.extname(task.path) === '.zip') {
          // local file is zipped
          fs.createReadStream(task.path)
            .pipe(unzip.Extract({
              path: downloadDir
            }).on('close', cb))
            .on('error', handleError);
        } else {
          // local file is unzipped, just read it from there.
          gtfsDir = task.path;
          cb();
        }
      }


      function removeDatabase(cb) {
        //remove old db records based on agency_key
        async.forEach(GTFSFiles, function (GTFSFile, cb) {
          db.collection(GTFSFile.collection, function (e, collection) {
            collection.remove({
              agency_key: agency_key
            }, cb);
          });
        }, function (e) {
          cb(e, 'remove');
        });
      }


      function importFiles(cb) {
        //Loop through each file and add agency_key
        async.forEachSeries(GTFSFiles, function (GTFSFile, cb) {
          var filepath = path.join(gtfsDir, GTFSFile.fileNameBase + '.txt');

          if(!fs.existsSync(filepath)) {
            log(agency_key + ': Importing data - No ' + GTFSFile.fileNameBase + ' file found');
            return cb();
          }

          log(agency_key + ': Importing data - ' + GTFSFile.fileNameBase);

          db.collection(GTFSFile.collection, function (e, collection) {

            var input = fs.createReadStream(filepath);
            var parser = csv.parse({
              columns: true,
              relax: true
            });

            var count = 0;
            
            console.log('loading ' + GTFSFile.collection + ':');

            parser.on('readable', function () {

              
              
              while(line = parser.read()) {

                if (count % 1000 === 0 ) {
                  process.stdout.write('.');
                }
                count++;

                //remove null values
                for(var key in line) {
                  if(line[key] === null) {
                    delete line[key];
                  }
                }

                //add agency_key
                line.agency_key = agency_key;

                //convert fields that should be int
                if(line.monday) {
                  line.monday = parseInt(line.monday, 10);
                }
                if(line.tuesday) {
                  line.tuesday = parseInt(line.tuesday, 10);
                }
                if(line.wednesday) {
                  line.wednesday = parseInt(line.wednesday, 10);
                }
                if(line.thursday) {
                  line.thursday = parseInt(line.thursday, 10);
                }
                if(line.friday) {
                  line.friday = parseInt(line.friday, 10);
                }
                if(line.saturday) {
                  line.satuday = parseInt(line.saturday, 10);
                }
                if(line.sunday) {
                  line.sunday = parseInt(line.sunday, 10);
                }
                if(line.start_date) {
                  line.start_date = parseInt(line.start_date, 10);
                }
                if(line.end_date) {
                  line.end_date = parseInt(line.end_date, 10);
                }
                if(line.date) {
                  line.date = parseInt(line.date, 10);
                }
                if(line.exception_type) {
                  line.exception_type = parseInt(line.exception_type, 10);
                }
                if(line.stop_sequence) {
                  line.stop_sequence = parseInt(line.stop_sequence, 10);
                }
                if(line.direction_id) {
                  line.direction_id = parseInt(line.direction_id, 10);
                }
                if(line.shape_pt_sequence) {
                  line.shape_pt_sequence = parseInt(line.shape_pt_sequence, 10);
                }

                // make lat/lon array for stops
                if(line.stop_lat && line.stop_lon) {
                  line.loc = [
                    parseFloat(line.stop_lon),
                    parseFloat(line.stop_lat)
                  ];

                  // if coordinates are not specified, use [0,0]
                  if(isNaN(line.loc[0])) {
                    line.loc[0] = 0;
                  }
                  if(isNaN(line.loc[1])) {
                    line.loc[1] = 0;
                  }

                  // Convert to epsg4326 if needed
                  if(task.agency_proj) {
                    line.loc = proj4(task.agency_proj, 'WGS84', line.loc);
                    line.stop_lon = line.loc[0];
                    line.stop_lat = line.loc[1];
                  }

                  // Calulate agency bounds
                  if(agency_bounds.sw[0] > line.loc[0] || !agency_bounds.sw[0]) {
                    agency_bounds.sw[0] = line.loc[0];
                  }
                  if(agency_bounds.ne[0] < line.loc[0] || !agency_bounds.ne[0]) {
                    agency_bounds.ne[0] = line.loc[0];
                  }
                  if(agency_bounds.sw[1] > line.loc[1] || !agency_bounds.sw[1]) {
                    agency_bounds.sw[1] = line.loc[1];
                  }
                  if(agency_bounds.ne[1] < line.loc[1] || !agency_bounds.ne[1]) {
                    agency_bounds.ne[1] = line.loc[1];
                  }
                }

                //make lat/long for shapes
                if(line.shape_pt_lat && line.shape_pt_lon) {
                  line.shape_pt_lon = parseFloat(line.shape_pt_lon);
                  line.shape_pt_lat = parseFloat(line.shape_pt_lat);
                  line.loc = [line.shape_pt_lon, line.shape_pt_lat];
                }

               

                if (GTFSFile.model === null) {

                   //insert into db
                  collection.insert(line, function (e, inserted) {
                    if(e) handleError(e);
                  });
                } else {

                  var model = new GTFSFile.model(line);
                  model.save(function (err) {
                    if(err) handleError(err);
                  });
                }
              }
            });
            parser.on('end', function (count) {
              console.log('.');
              cb();
            });
            parser.on('error', handleError);
            input.pipe(parser);
          });
        }, function (e) {
          cb(e, 'import');
        });
      }


      function postProcess(cb) {
        log(agency_key + ': Post Processing data');

        async.series([
          agencyCenter,
          updatedDate
        ], function (e, results) {
          cb();
        });
      }


      function agencyCenter(cb) {
        var lat = (agency_bounds.ne[0] - agency_bounds.sw[0]) / 2 + agency_bounds.sw[0];
        var lon = (agency_bounds.ne[1] - agency_bounds.sw[1]) / 2 + agency_bounds.sw[1];
        var agency_center = [lat, lon];

        db.collection('agencies')
          .update({
            agency_key: agency_key
          }, {
            $set: {
              agency_bounds: agency_bounds,
              agency_center: agency_center
            }
          }, cb);
      }


      function updatedDate(cb) {
        db.collection('agencies')
          .update({
            agency_key: agency_key
          }, {
            $set: {
              date_last_updated: Date.now()
            }
          }, cb);
      }
    }
  });
}

function handleError(e) {
  console.error(e || 'Unknown Error');
  process.exit(1);
}

// Allow script to be called directly from commandline or required (for testable code)
if(invocation === 'direct') {
  main(config, function () {
    process.exit();
  });
} else {
  module.exports = main;
}
