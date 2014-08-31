/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
function showAlert(message, title) {
  if (navigator.notification) {
    navigator.notification.alert(message, null, title, 'OK');
  } else {
    alert(title ? (title + ": " + message) : message);
  }
}

var DriverLoggingApp = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        DriverLoggingApp.receivedEvent('deviceready');
        //DriverLoggingStorage.initialise();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.receivedElement');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        */
        //showAlert('PhoneGap Initialized', 'Message');
        console.log('Received Event: ' + id);
        /*
        if (this.isDataAvailable()){
            console.log("native");
            DriverLoggingApp.javascriptInclude("https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=initMapCallback", function() {
                console.log("google maps api loaded");
            });
        }
        */
    },
    javascriptInclude: function(script, callback){
        var e = document.createElement("script");
        e.onload = callback;
        e.src = script;
        e.type = "text/javascript";
        document.getElementsByTagName("head")[0].appendChild(e);
    },
    getConnectionStatus: function(){
        var status = "offline";
        var vendor = navigator.vendor.toUpperCase();
        console.log("vendor:" + vendor);
        if (navigator.connection){
            var type = navigator.connection.type;
            console.log("type check:" + type);
            if (type.toUpperCase() === "WIFI" || type.toUpperCase() === "CALL_3G" || type.toUpperCase() === "CALL_4G" ){
                status = "online";
            }

        } else {
            if (vendor.indexOf("GOOGLE") != -1){
                status = "online"; //hack to deal with ripple emulator when using chrome
            }
        }
        return status;
    },
    isDataAvailable: function(){
        var status = false;
        
        if (DriverLoggingApp.getConnectionStatus() == "online"){
            status = true;
        }
        console.log("isDataAvailable: " + status);
        return status;
    }
};

DriverLoggingApp.initialize();
