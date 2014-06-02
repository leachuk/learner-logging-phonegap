'use strict';
var dataArray = {};
var learnerLogCtrl = angular.module('learnerLogCtrl', []);
var coordsArray = new Array();
var debugArray = new Array();

var getTimeLength = function(starttime, endtime){
    var timelength = endtime - starttime;
    return timelength;
}

//controller for creating a new log
learnerLogCtrl.controller('newLogCtrl', ['$scope', '$filter', '$rootScope', '$http', '$routeParams','amMoment',function($scope, $filter, $rootScope, $http, $routeParams, amMoment){
    $scope.testvars = ['var1','var2'];
	$scope.gpsStatus = ['initialising','ready'];
    $scope.track = {date: $filter('date')(Date.now(), "yyyy-MM-dd"), title: ''};
    $scope.accuracy = -1;
    
	var runOnceSet = false;
    var watchID = null;
	console.log("controller: newLogCtrl");
    console.log("date:" + $scope.track.date)
	
	$scope.startGpsRecord = function(){
		console.log("startGpsRecord clicked");
        //navigator.geolocation.getCurrentPosition(onSuccess, onError);
        console.log("track scope:");
        console.log($scope.track);
        
        $scope.recordtime = Date.now();
        console.log("recordtime:" + $scope.recordtime);
        
        dataArray.id = $scope.track.title;
        dataArray.date = $scope.track.date;
        dataArray.timestamp = {};
        dataArray.timestamp.start = Date.now();

        watchID = navigator.geolocation.watchPosition($scope.onSuccess, $scope.onError, { enableHighAccuracy: true, timeout: 5000 });
	}
	
	$scope.stopGpsRecord = function(){
		console.log("stopGpsRecord clicked");
        console.log("stop, accuracy:" + $scope.accuracy);
        navigator.geolocation.clearWatch(watchID);
        dataArray.coords = coordsArray;
        dataArray.debug = debugArray;
        
        var dateId = Date.now(); //milliseconds
        dataArray.timestamp.stop = dateId;
        $rootScope.dataStore.setKeyVal(dateId, JSON.stringify(dataArray));
    }
    
    $scope.onSuccess = function(position) {
        console.log('Latitude: '    + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');
        var debugData = {};
        debugData.altitude = position.coords.altitude;
        debugData.accuracy = position.coords.accuracy;
        debugData.heading = position.coords.heading;
        debugData.speed = position.coords.speed;
        debugData.timestamp = position.timestamp;
        var latlong = {"lat": position.coords.latitude, "lon": position.coords.longitude  };
        coordsArray.push(latlong);
        debugArray.push(debugData);
        $scope.accuracy = position.coords.accuracy;
        $scope.$digest();
    };
    
    // onError Callback receives a PositionError object
    $scope.onError = function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
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

    /*GetAllLogDataJsonService.query(function(data){
		console.log(data);
		$rootScope.logData = data;
	});*/

    console.log($rootScope.dataStore.getAllLogsAsJSON());
    $rootScope.logData = $rootScope.dataStore.getAllLogsAsJSON();
}]);

learnerLogCtrl.controller('logDetailCtrl', ['$scope', '$rootScope', '$routeParams', '$filter',function($scope, $rootScope, $routeParams, $filter){
	console.log("controller: logDetailCtrl");
	var runOnceSet = false;
    console.log($routeParams);
	var itemData = $filter('filter')($rootScope.logData, {id: $routeParams.logid});
    console.log(itemData);
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
    console.log(mapPolyLine);
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

