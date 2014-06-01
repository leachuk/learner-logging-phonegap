'use strict';



var DriverLoggingStorage = {
    // Application Constructor
    initialise: function() {
        console.log("Initialising storage obj DriverLoggingApp");
        //set vars
        this.storageObject = window.localStorage;
        this.keyId = "dvrlog";
        this.keySeperator = ".";
    },
    setKeyVal: function(key, value){
        this.storageObject.setItem(this.keyId + this.keySeperator + key, value);
    },
    getVal: function(key){
        return this.storageObject.getItem(key);
    },
    removeKey: function(key){
        this.storageObject.removeItem(key);
    },
    clearAll: function(){
        this.storageObject.clear();
    },
    getAllLogsAsJSON: function(){
        console.log("localstorage length:" +this.storageObject.length);
        
        var archive = [];
        var keys = Object.keys(this.storageObject);
        var i = 0, key;

        for (; key = keys[i]; i++) {
            if (key.indexOf(this.keyId) > -1)
                archive.push(JSON.parse(this.storageObject.getItem(key)));
        }
        //console.log(archive);
        return archive;
    }

};


