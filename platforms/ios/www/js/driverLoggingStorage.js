'use strict';



var DriverLoggingStorage = {
    // Application Constructor
    initialise: function() {
        console.log("Initialising storage obj DriverLoggingApp");
        //set vars
        this.storageObject = window.localStorage;
    },
    setKeyVal: function(key, value){
        this.storageObject.setItem(key, value);
    },
    getVal: function(key){
        return this.storageObject.getItem(key);
    },
    removeKey: function(key){
        this.storageObject.removeItem(key);
    },
    clearAll: function(){
        this.storageObject.clear();
    }

};


