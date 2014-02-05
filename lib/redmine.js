var http = require('http');
var qs = require('qs');
var redmineIssue = require('./redmine-issue');

var redmine = function(url, port, authkey) {
  this.host = url;
  this.port = port;
  this.authKey = authkey;
}

redmine.prototype.request = function(path, query, method, callback) {

  // Add authkey.
  query.key = this.authKey;

  var options = {
    host: this.host,
    port: this.port,
    path: '/'+ path + '.json?' + qs.stringify(query),
    method: method
  };

  http.request(options, function(res) {
    res.setEncoding('utf8');

    var body = '';

    res.on('data', function(chunk) {
      body += chunk;
    });

    res.on('end', function() {
      var data = JSON.parse(body);
      callback(undefined, data);
    });

    res.on('error', function(err) {
      console.log('res Error', err);
      callback(err);
    });

  }).on('error', function(err) {
    console.log('req Error', err);
    callback(err);
  }).end();
}

/**
 * Get multiple objects from the redmine ressource.
 *
 * @param {String} path
 *   e.g. issues, projects
 * @param {Function} callback
 */
redmine.prototype.getAll = function(path, query, callback) {

  var path = path;
  var limit = 50;
  var red = this;
  var overallData = [];


  var internalRequest = function (page) {

    query.limit = limit;
    query.offset = page * limit;

    red.request(path, query, "GET", function(err, data) {

      if (err) {
        callback(err);
        return;
      }
      // If we
      else if (data[path] == undefined) {
        var err = new Error('No data given in ' + path);
        callback(err);
        return;
      }

      // If we got data, add it to the overall data.
      if (data[path].length) {

        console.log(path, '[' + page + ']:', data[path].length);

        for (var i in data[path]) {
          var d = data[path][i];
          // Push data keyed by ID.
          overallData.push(d);
        }

        // Proceed with our request on the next page.
        internalRequest(page + 1);

      }
      // If we got an empty result, we are at the end of our tour.
      else {
        callback(undefined, overallData);
      }

    });
  }

  // We start with the first page.
  internalRequest(0);
}

/**
 *
 * @param type
 * @param id
 * @param query
 * @param callback
 */
redmine.prototype.getSingle = function(type, id, query, callback) {

  var path = type + 's/' + id;

  this.request(path, query, "GET", function(err, data) {

    if (err) {
      callback(err);
      return;
    }
    else if (data[type] == undefined) {
      var err = new Error('No ' + type + 'given with id:' +  id);
      callback(err);
      return;
    }

    callback(undefined, data[type]);
  });
}

/**
 * Wrapper for loading a single issue.
 *
 * @param {int} id
 * @param {Function} callback
 */
redmine.prototype.getIssue = function(id, callback) {
  redmineIssue.load(this, id, callback);
}

module.exports = redmine;
