var STORAGE_SINGLETON = (function(){

    // Storage class
    function Storage(){
        this._storageProperties = [
            "checkbox",
            "annotations",
            "cards",
            "end_screens",
            "used_channels",
            "plugin_id",
            "yandex_languages",
            "yandex_translate_key",
            "logs",
            "selected_languages",
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
        if(options.value || options.value === 0) value = options.value;

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


STORAGE_SINGLETON.updateStorageVariable(function(items){
    console.log('items', items);
    if(!items.checkbox){
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.addYoutubeTagsToTags',
            value : true
        });
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.addHintsToTags',
            value : true
        });
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.addTrendsToTags',
            value : true
        });
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.addYandexKeywordsToTags',
            value : true
        });
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.showTagsPanel',
            value : true
        });
    }

    /*STORAGE_SINGLETON.removeFromStorage({
        propertyName: 'used_channels'
    });*/

    /*STORAGE_SINGLETON.removeFromStorage({
        propertyName: 'annotations.channels'
    });*/
});