var redmine = require('./lib/redmine');
var redmineIssue = require('./lib/redmine-issue');
var config = require('./config.json');
var momentRange = require('moment-range');

var r = new redmine(config.host, config.port, config.key);

// Hardcoded project id.
var projectId = 329;


var fromDate = new Date('2014-01-01');
var toDate = Date.now();

var dateRange = momentRange().range(fromDate, toDate);
dateRange.by('days', function(moment) {
  console.log('Moment', moment.toString());
});

redmineIssue.getAll(r, {project_id: projectId}, function(err, issues) {
  if (err) {
    console.log('ERROR', err);
  }
  console.log('Collected issues:', issues.length);

  for (var i in issues) {
    var issue = issues[i];
    console.log(issue.id + ' - Status: ' + issue.getStatus(Date.now()));
  }
});
