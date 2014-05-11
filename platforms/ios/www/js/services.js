'use strict';

angular.module('getAllLogDataJsonService', ['ngResource'])
.factory('GetAllLogDataJsonService', function($resource) {
  console.log("In GetAllLogDataJsonService");
  return $resource('js/tempdata.json');
});