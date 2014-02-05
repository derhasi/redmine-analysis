
angular.module('redmineAnalysisApp', [])
  .factory('redmine', ['$http', function redmineFactory($http) {


  var redmine = function(host, port, authkey) {
    this.url = host + ':' + port;
    this.authKey = authkey;
    this.statuses = {};
  }

  redmine.prototype.get = function(path, query, callback) {

    // Add authkey.
    query.key = this.authKey;

    var options = {
      url: this.url + '/' + path + '.json',
      params: query
    };

    $http.get(options)
      .success(function(data, status, headers, config) {
        console.log(data);
      })
      .error(function(data, status, headers, config) {
        // @todo
      });
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

      red.get(path, query, function(err, data) {

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

          // Proceed with our request on the next page (if the request has
          // multiple pages).
          if (data.total_count != undefined) {
            internalRequest(page + 1);
          }
          // If we ar at the end, pass the values.
          else {
            callback(undefined, overallData);
          }

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

    this.get(path, query, function(err, data) {

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

}]);
