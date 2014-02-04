var redmine = require('./lib/redmine');
var config = require('./config.json');

var r = new redmine(config.host, config.port, config.key);

// Hardcoded project id.
var projectId = 329;

var issues = [];

r.getAll('issues', {project_id: projectId}, function(err, data) {
  if (err) {
    console.log('ERROR', err);
  }
  console.log('Collected issues:', data.length);

  for (var i in data) {
    var d = data[i];

    r.getSingle('issue', d.id, {include: 'journals'}, function(err, issue) {
      issues.push(issue);
      console.log('Fetched:', issue.project.name, issue.id);
    });
  }
});
