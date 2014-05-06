'use strict';

angular.module('getAllLogDataJsonService', ['ngResource'])
.factory('GetAllLogDataJsonService', function($resource) {
  return $resource('../../../data/tempdata.json');
});