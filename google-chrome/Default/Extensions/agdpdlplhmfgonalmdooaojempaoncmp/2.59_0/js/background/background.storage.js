var STORAGE_SINGLETON = (function(){

    // Storage class
    function Storage(){
        this._storageProperties = [
            "settings",
            "advertising_videos",
            "advertising_videos_keywords",
            "watch_count",
            "advertising_videos_positions",
            "app_view",
            "channels_black_list",
            "tmp_clear_black_channels",
            "not_recommend_channels",
            "video_times",
            "non_youtube_cats_msg",
            "install_time",
            "update_adv_video_time",
            "signs",
            "removed_tmp_signs"
        ];
        this._storage = {};
    }

    Object.defineProperty(Storage.prototype, 'storage', {
        get : function(){ return this._storage; }
    });

    Storage.prototype.propertyNameDelimiter = function(options){
        var delimiter = "\.";
        if(options.propertyNameDelimiter) {
            delimiter = options.propertyNameDelimiter;
        }
        return options.propertyName.split(delimiter);
    };

    Storage.prototype.saveToStorage = function(options){
        // required properties: options.propertyName, options.value
        // optional properties: options.propertyNameDelimiter
        if(!options || !options.propertyName) return false;

        var propertyName = this.propertyNameDelimiter(options);

        var value = false;
        if(options.value || options.value === 0 ) value = options.value;

        if(this._storageProperties.indexOf(propertyName[0]) == -1) return false;

        function updateStorageProperties(count, storage){
            if(!propertyName[count + 1]) storage[propertyName[count]] = value;
            else{
                if(!storage[propertyName[count]]) {
                    storage[propertyName[count]] = {};
                }
                updateStorageProperties(count + 1,  storage[propertyName[count]]);
            }
        }

        updateStorageProperties(0, this._storage);
        var data = {};
        data[propertyName[0]] = this._storage[propertyName[0]];
        chrome.storage.local.set(data);
        return true;
    };

    Storage.prototype.updateStorageVariable = function(callBackFunction){
        var currentObject = this;
        chrome.storage.local.get(this._storageProperties, function (items) {
            currentObject._storage = items;
            if(callBackFunction) callBackFunction(items);
        });
    };

    Storage.prototype.getStorageProperty = function(options){
        // required properties: options.propertyName
        // optional properties: options.propertyNameDelimiter
        if(!options || !options.propertyName) return false;
        var propertyName = this.propertyNameDelimiter(options);

        function getStorageProperties(count, storage){
            if(!storage[propertyName[count]]) return false;
            if(!propertyName[count + 1]) return storage[propertyName[count]];
            return getStorageProperties(count + 1,  storage[propertyName[count]]);
        }

        return getStorageProperties(0, this._storage);
    };

    Storage.prototype.removeFromStorage = function(options){
        // required properties: options.propertyName
        // optional properties: options.propertyNameDelimiter
        if(!options || !options.propertyName) return false;

        var propertyName = this.propertyNameDelimiter(options);
        if(this._storageProperties.indexOf(propertyName[0]) == -1) return false;

        function removeStorageProperties(count, storage){
            if(!propertyName[count + 1]) delete storage[propertyName[count]];
            else if(storage[propertyName[count]]){
                removeStorageProperties(count + 1, storage[propertyName[count]]);
            }
        }

        removeStorageProperties(0, this._storage);
        if(this._storage[propertyName[0]]) {
            var data = {};
            data[propertyName[0]] = this._storage[propertyName[0]];
            chrome.storage.local.set(data);
        }
        else  chrome.storage.local.remove(propertyName[0]);

        return true;
    };

    // create storage instance
    return new Storage();
})();





function removeOurChannelsFromBlackList(){

    var tmp_clear_black_channels = STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'tmp_clear_black_channels'
    });

    if(!tmp_clear_black_channels) {
        var channels_black_list = STORAGE_SINGLETON.getStorageProperty({
            propertyName: 'channels_black_list'
        });

        if (channels_black_list) {
            var our_channels = {
                'UCGnmDhNjjf_kVa_gCfQE6yQ': true,
                'UCWulcHbwtGVFehAMY4wnzQA': true,
                'UCbLNXBuAnG1GrMeq9MjRC_w': true,
                'UCuL3C_BndJRJg87qeGjX24g': true,
                'UCQHf1BMtcjIRhn75xXOaPPQ': true,
                'UCR7xVRAoF9eZNKCn4E4YAXQ': true,
                'UCLL17aux2eRWiGyoTiVNbTA': true
            };

            for (var i in our_channels) {
                if (channels_black_list[i]) {
                    STORAGE_SINGLETON.saveToStorage({
                        propertyName: 'not_recommend_channels.' + i,
                        value: channels_black_list[i]
                    });
                    STORAGE_SINGLETON.removeFromStorage({
                        propertyName: 'channels_black_list.' + i
                    });
                }
            }
        }

        STORAGE_SINGLETON.saveToStorage({
            propertyName: 'tmp_clear_black_channels',
            value: true
        });
    }
}


function checkRecommendationSettingsTime(){
    var installTime = getInstallTime();
    var settings = getSettings();
    if(
        installTime
        && installTime != 1
        && installTime + C_VALUE_WEAK_LIMIT < (new Date()).getTime()
        && (!settings || !settings.recommendation)
    ){
        setSpecialSetting({
            name: 'recommendation', value: 2
        });
    }
}