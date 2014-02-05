/**
 * Builds a redmine issue handler.
 *
 * @param {Redmine} redmine
 * @constructor
 */
var redmineIssue = function(redmine) {
  this.redmine = redmine;
  this.data = undefined;
  this.id = undefined;
  this.created = undefined;
  this.updated = undefined;
}

/**
 * Static function to load issue from redmine.
 *
 * @param {Redmine} redmine
 * @param {Int} id
 * @param {Function} callback
 */
redmineIssue.load = function(redmine, id, callback) {
  redmine.getSingle('issue', id, {include: 'journals'}, function(err, issue) {
    // Build object an initialize.
    var rIssue = new redmineIssue(redmine);
    rIssue.init(issue);
    callback(undefined, rIssue);
  });
}

/**
 * Gets all issues matching the given query.
 *
 * @param {Redmine} redmine
 * @param {Object} query
 * @param {Function} callback
 *   - {Error} err
 *   - {redmineIssue[]} issues
 */
redmineIssue.getAll = function(redmine, query, callback) {

  var collectedIssues = [];
  var totalIssues = 0;

  redmine.getAll('issues', query, function(err, issues) {

    if (err) {
      callback(err);
      return;
    }

    totalIssues = issues.length;

    for (var i in issues) {

      redmineIssue.load(redmine, issues[i].id, function(err2, rIssue) {
        if (err2) {
          callback(err2);
          // Push empty object, so there will be no infinite loop.
          collectedIssues.push({});
          return;
        }

        collectedIssues.push(rIssue);

        // When we reach the total number of issues, we
        if (collectedIssues.length == totalIssues) {
          callback(undefined, collectedIssues);
        }
      });
    }

  });
}

/**
 * Initialize object with default data.
 *
 * @param data
 */
redmineIssue.prototype.init = function(data) {
  this.data = data;
  this.id = data.id;
  this.created = new Date(data.created_on);

  if (data.updated_on == undefined) {
    this.updated = created;
  }
  else {
    this.updated = new Date(data.updated_on);
  }
}

/**
 *
 * @param {Date} date
 */
redmineIssue.prototype.getStatus = function(maxDate) {

  var curDate = new Date(0);
  var curVal = undefined;

  var attrName = "status_id";

  if (this.data.journals.length) {

    for (var i in this.data.journals) {
      var entry = this.data.journals[i];

      var entryDate = new Date(entry.created_on);

      // Proceed only if the journal entry is older than the maxDate.
      if (entryDate < maxDate && entryDate > curDate) {
        // Now we check the details for a change on our attribute.
        for (var d in entry.details) {
          // If we found the correct attribute, we set the value.
          if (entry.details[d].name == attrName) {
            curDate = entryDate;
            curVal = entry.details[d].new_value;
          }
        }
      }
    }
  }

  // If we did not find any value, we look at the current status, as this has
  // never changed since creation.
  if (curVal == undefined) {
    if (this.created < maxDate) {
      curVal = this.data.status.id;
    }
  }

  // Return as string.
  return '' + curVal;
}


module.exports = redmineIssue;
