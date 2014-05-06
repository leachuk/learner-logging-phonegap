'use strict';

var learnerLoggingUi2App = angular.module('learnerLoggingUi2App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ui.map',
  'ui.event',
  'learnerLogCtrl',
  'getAllLogDataJsonService'
]);

learnerLoggingUi2App.run(function($rootScope, $window) {
  // publish current transition direction on rootScope
  //$rootScope.direction = 'ltr'; //don't want initial animation
  // listen change start events
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    //$rootScope.direction = 'rtl';
    //set animation direction for initial event, otherwise no animation
    if (current && next) {
      $rootScope.direction = 'rtl';  
    }
    //console.log(next);
    if (current && next && (current.depth > next.depth)) {
      $rootScope.direction = 'ltr';  
    }
    // back
    $rootScope.back = function() {
		console.log("back");
		$window.history.back();
    }
  });
});
  
learnerLoggingUi2App.config(function ($routeProvider) {
	$routeProvider.when('/newlog',{
		templateUrl: 'views/newlog.html',
		controller: 'newLogCtrl',
		depth:2
	}),
	$routeProvider.when('/logdetail/:logid',{
		templateUrl: 'views/logdetail.html',
		controller: 'logDetailCtrl',
		depth:2
	})
	.otherwise({
        redirectTo: '/home',
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        depth:1
     });;
});

function initMapCallback() {
  console.log('Google maps api initialized.');
  angular.bootstrap(document, ['learnerLoggingUi2App']);
}