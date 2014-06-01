'use strict';

angular.module('driverLoggingFilters', []).filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});