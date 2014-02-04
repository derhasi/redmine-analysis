var redmine = require('./lib/redmine');
var config = require('./config.json');

var r = new redmine(config.host, config.port, config.key);

var query = {
  project_id: 329,
  limit: 100,
  offset: 0
};

r.getAll('issues', function(err, data) {
  if (err) {
    console.log('ERROR', err);
  }
  console.log('Data', data.length);
});
