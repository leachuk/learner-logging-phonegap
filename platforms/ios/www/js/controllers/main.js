'use strict';

var learnerLogCtrl = angular.module('learnerLogCtrl', []);
var coordsArray = new Array();
var onSuccess = function(position) {
    console.log('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    
    var latlong = {"lat": position.coords.latitude, "lon": position.coords.longitude  };
    coordsArray.push(latlong);
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}



//controller for creating a new log
learnerLogCtrl.controller('newLogCtrl', ['$scope', '$rootScope', '$http', '$routeParams',function($scope, $rootScope, $http, $routeParams){

	$scope.testvars = ['var1','var2'];
	$scope.gpsStatus = ['initialising','ready'];
    $scope.track = {date: new Date(), title: ''};
	var runOnceSet = false;
    var watchID = null;
	console.log("controller: newLogCtrl");
	
	$scope.startGpsRecord = function(){
		console.log("startGpsRecord clicked");
        //navigator.geolocation.getCurrentPosition(onSuccess, onError);
        console.log("track scope:");
        console.log($scope.track);
        $rootScope.dataStore.setKeyVal($scope.track.title, $scope.track.title);
        $rootScope.dataStore.setKeyVal("date-"+$scope.track.title, $scope.track.date);
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true, timeout: 5000 });
	}
	
	$scope.stopGpsRecord = function(){
		console.log("stopGpsRecord clicked");
        navigator.geolocation.clearWatch(watchID);
        
        $rootScope.dataStore.setKeyVal("data-" + $scope.track.title, JSON.stringify(coordsArray));
    }
	
	$scope.mapOptions = {
      center: new google.maps.LatLng(-33.8738362136655, 151.18457794189453),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
  	$scope.onMapIdle = function() {
        if (runOnceSet === false){
            new google.maps.Marker({
                map: $scope.myMap,
                position: new google.maps.LatLng(-33.8738362136655, 151.18457794189453)
            });    
       
			runOnceSet = true;
			console.log("run once idle");
        }  
    };
}]);

learnerLogCtrl.controller('homeCtrl', ['$scope', '$rootScope', '$http', '$routeParams', 'GetAllLogDataJsonService', function($scope, $rootScope, $http, $routeParams, GetAllLogDataJsonService){
                                       
	$scope.testvarshome = ['var3','var4'];
	console.log("controller: homeCtrl");
	GetAllLogDataJsonService.query(function(data){
		console.log(data);
		$rootScope.logData = data;
	})
}]);

learnerLogCtrl.controller('logDetailCtrl', ['$scope', '$rootScope', '$routeParams', '$filter',function($scope, $rootScope, $routeParams, $filter){
	console.log("controller: logDetailCtrl");
	var runOnceSet = false;
	var itemData = $filter('filter')($rootScope.logData, {id: $routeParams.logid});
	$scope.logItemData = itemData[0];
	$scope.mapOptions = {
      center: new google.maps.LatLng(-33.8738362136655, 151.18457794189453),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var mapPolyLine = [];
    for (var i=0; i < itemData[0].coords.length; i++){
    	var lat = itemData[0].coords[i].lat;
    	var lon = itemData[0].coords[i].lon;
    	var latLon = new google.maps.LatLng(lat,lon);
    	mapPolyLine.push(latLon);
    }
 
  	$scope.onMapIdle = function() {
        if (runOnceSet === false){
            new google.maps.Marker({
                map: $scope.myMap,
                position: new google.maps.LatLng(-33.8738362136655, 151.18457794189453)
            });    
       		
        	new google.maps.Polyline({
				map: $scope.myMap,
				path: mapPolyLine,
				geodesic: true,
				strokeColor: '#000FFF',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});
			
			runOnceSet = true;
			console.log("run once idle");
        }  
    };
      	
}]);

