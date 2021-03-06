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
learnerLogCtrl.controller('newLogCtrl', ['$scope', '$location', '$filter', '$rootScope', '$http', '$routeParams','amMoment',function($scope, $location, $filter, $rootScope, $http, $routeParams, amMoment){
    $scope.testvars = ['var1','var2'];
	$scope.gpsStatus = ['initialising','ready'];
    $scope.track = {date: $filter('date')(Date.now(), "yyyy-MM-dd"), title: ''};
    $scope.accuracy = -1;
    $scope.initLatLong = "-33.8738362136655, 151.18457794189453"; //initialise for marker
    $scope.startGpsState = false;
    $scope.stopGpsState = true;
    $scope.pauseGpsState = true;
    $scope.initVars = true;
    
	var runOnceSet = false;
    var watchID = null;
    
	console.log("controller: newLogCtrl");
    console.log("date:" + $scope.track.date)
    
    //$scope.$watch('myMap', function(newValue, oldValue) {
    //    console.log("map watch");
        //console.log($scope.myMap);
        
        //TODO abstract map code so we can swap out easily
        //var currentPosLatLon = new google.maps.LatLng(-33.8738362136655, 151.18457794189453);
        //$scope.currentPosMarker = new google.maps.Marker( {position: currentPosLatLon, map: $scope.myMap} );
        /*
        $scope.onMapIdle = function() {
            if (runOnceSet === false){
                $scope.currentPosMarker;
                runOnceSet = true;
                console.log("run once idle");
            }
            console.log("map idle 1");
        };
        */
    //});
    
	$scope.startGpsRecord = function(){
		console.log("startGpsRecord clicked");
        

        /*
        if(watchID != null){
            navigator.geolocation.clearWatch(watchID);
        }
        */
        if($scope.watchID != null){
            clearInterval($scope.watchID);
        }
        
        //Don't re-initialise if pause was pressed.
        if ($scope.initVars){
            console.log("initialising scope variables.");
            $scope.initVars = false; //don't initialise again.
            dataArray = {};
            coordsArray = new Array();
            
            console.log("track scope:");
            console.log($scope.track);
            
            $scope.recordtime = Date.now();
            console.log("recordtime:" + $scope.recordtime);
            
            dataArray.id = $scope.track.title;
            dataArray.date = $scope.track.date;
            dataArray.timestamp = {};
            dataArray.timestamp.start = Date.now();
        }
        
        $scope.startGpsState = !$scope.startGpsState;
        $scope.pauseGpsState = !$scope.pauseGpsState;
        $scope.stopGpsState = $scope.stopGpsState ? !$scope.stopGpsState : false;
        //navigator.geolocation.getCurrentPosition(onSuccess, onError);
        


        //watchID = navigator.geolocation.watchPosition($scope.onSuccess, $scope.onError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 3000 });
        $scope.watchID = setInterval( function(){
            navigator.geolocation.getCurrentPosition($scope.onSuccess, $scope.onError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 3000 });
        }, 2000);
	}
    
    //Clear interval and do nothing.
    $scope.pauseGpsRecord = function(){
        console.log("pauseGpsRecord clicked");
        $scope.pauseGpsState = !$scope.pauseGpsState;
        $scope.startGpsState = !$scope.startGpsState;
        //$scope.stopGpsState = !$scope.stopGpsState;
        
        //navigator.geolocation.clearWatch(watchID);
        clearInterval($scope.watchID);
        //watchID = navigator.geolocation.watchPosition($scope.onPause, $scope.onError, { enableHighAccuracy: true, timeout: 10000 });
    }
	
	$scope.stopGpsRecord = function(){
		console.log("stopGpsRecord clicked");
        console.log("stop, accuracy:" + $scope.accuracy);
        
        $scope.stopGpsState = !$scope.stopGpsState;
        
        //navigator.geolocation.clearWatch(watchID);
        clearInterval($scope.watchID);
        
        dataArray.coords = coordsArray;
        dataArray.debug = debugArray;
        
        var dateId = Date.now(); //milliseconds
        dataArray.timestamp.stop = dateId;
        $rootScope.dataStore.setKeyVal(dateId, JSON.stringify(dataArray));
        
        $location.path("/home");
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
        
        //$scope.latest = {'lat': position.coords.latitude, 'lon': position.coords.longitude};
        
        //TODO abstract map code so we can swap out easily
        //$scope.currentPosMarker.setPosition(new google.maps.LatLng(latlong.lat, latlong.lon));
        $scope.accuracy = position.coords.accuracy;
        $scope.gpsSuccessLoggedCount = coordsArray.length;
        $scope.$digest();
    };
    
    $scope.onPause = function(position) {
        console.log('PAUSED: ' + '\n' +
              'Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + position.timestamp                + '\n');

        var latlong = {"lat": position.coords.latitude, "lon": position.coords.longitude  };

        //TODO abstract map code so we can swap out easily
        //$scope.currentPosMarker.setPosition(new google.maps.LatLng(latlong.lat, latlong.lon));
        $scope.accuracy = position.coords.accuracy;
        
        $scope.$digest();
    };
    
    // onError Callback receives a PositionError object
    $scope.onError = function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    //TODO abstract map code so we can swap out easily
    /*
    $scope.mapOptions = {
        center: new google.maps.LatLng(-33.8738362136655, 151.18457794189453),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    */

}]);

learnerLogCtrl.controller('homeCtrl', ['$scope', '$rootScope', '$http', '$routeParams', 'GetAllLogDataJsonService', function($scope, $rootScope, $http, $routeParams, GetAllLogDataJsonService){
                                       
	$scope.testvarshome = ['var3','var4'];
	console.log("controller: homeCtrl");

    //DriverLoggingApp.getConnectionStatus();
    /*GetAllLogDataJsonService.query(function(data){
		console.log(data);
		$rootScope.logData = data;
	});*/

    //console.log($rootScope.dataStore.getAllLogsAsJSON());
    $rootScope.logData = $rootScope.dataStore.getAllLogsAsJSON();
}]);

learnerLogCtrl.controller('logDetailCtrl', ['$scope', '$rootScope', '$routeParams', '$filter',function($scope, $rootScope, $routeParams, $filter){
	console.log("controller: logDetailCtrl");
	var runOnceSet = false;
    console.log($routeParams);
	var itemData = $filter('filter')($rootScope.logData, {id: $routeParams.logid});
    console.log(itemData);
	$scope.logItemData = itemData[0];
    //TODO abstract map code so we can swap out easily
    /*
	$scope.mapOptions = {
      center: new google.maps.LatLng(-33.8738362136655, 151.18457794189453),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    */
    //mobile device connection status
    $scope.connectionStatus = DriverLoggingApp.getConnectionStatus();
    console.log("ng connection status:" + $scope.connectionStatus);
    
    //TODO abstract map code so we can swap out easily
    
    // -- route length --//
    //var mapPolyLine = [];
    var routeLengthKm = 0;
    var latPrevious = 0, lonPrevious = 0;
    for (var i=0; i < itemData[0].coords.length; i++){
    	var lat = itemData[0].coords[i].lat;
    	var lon = itemData[0].coords[i].lon;
        latPrevious = i == 0 ? lat : itemData[0].coords[i-1].lat;
        lonPrevious = i == 0 ? lon : itemData[0].coords[i-1].lon;
    	//var latLon = new google.maps.LatLng(lat,lon);
    	//mapPolyLine.push(latLon);
        routeLengthKm += GeoUtils.getDistanceFromLatLonInKm(lat, lon, latPrevious, lonPrevious);

    }
    console.log(routeLengthKm);
    $scope.routeLengthKm = routeLengthKm.toFixed(2);
    
    // -- route recorded date -- //
    $scope.recordedDate = itemData[0].date;
    
    // -- time taken -- //
    $scope.startTime = itemData[0].timestamp.start;
    $scope.stopTime = itemData[0].timestamp.stop;
    $scope.timeTaken = (($scope.stopTime - $scope.startTime) / 60000).toFixed(2);
    
    /*
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
    */
      	
}]);

