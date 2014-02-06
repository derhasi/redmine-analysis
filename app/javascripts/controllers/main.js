'use strict';

redmineAnalysis.controller('MainCtrl', ['$scope', 'redmine', function ($scope, redmine) {

  $scope.connect = function() {
    var redInstance = new redmine($scope.host, $scope.port, $scope.apikey);

    redInstance.get('issues', {}, function(err, data) {
      $scope.data = data;
      $scope.$apply();
    });
  }

}]);
