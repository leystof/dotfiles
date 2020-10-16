//geo location
var useGeolocation = false;
if(useGeolocation) {
    chrome.storage.local.get('countryCode', function (items) {
        if (!items.countryCode) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $.get(
                    'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=true',
                    '',
                    function (res) {
                        chrome.storage.local.set({'countryCode': res.results[res.results.length - 1].address_components[0].short_name});
                    }
                )
            });
        }
    });
}

//cookies
var useCookies = false;
if(useCookies) chrome.cookies.getAll({}, function (cookies) {});

//notification
var useNotification = false;
if(useNotification) chrome.notifications.getAll(function(notifications){});

//context-menu
var useContextMenu = false;
if(useContextMenu) {
    chrome.contextMenus.create({
        "id": 'test-menu',
        "title": 'Test menu',
        "contexts": ["selection"]
    });
}


STORAGE_SINGLETON.updateStorageVariable(function(items){
    console.log(items);
    setDefaultSettings();

    if(
        !items
        || (!items.install_time && !items.advertising_videos)
    ){
        STORAGE_SINGLETON.saveToStorage({
            propertyName: 'install_time',
            value: (new Date()).getTime()
        });
    }
    else if(items && items.advertising_videos && !items.install_time){
        STORAGE_SINGLETON.saveToStorage({
            propertyName: 'install_time',
            value: 1
        });

        setSpecialSetting({
            name: 'recommendation', value: 2
        });
    }


    checkRecommendationSettingsTime();
    setInterval(function(){
        checkRecommendationSettingsTime();
    }, C_VALUE_HOUR_LIMIT);


    /*if(
        !items.advertising_videos
        || !items.advertising_videos[0]
        //|| !items.advertising_videos[0].upload_list_id
        || !items.advertising_videos[0].medium_img
    ){
        updateAdvertisingVideos();
    }*/



    removeVideoTimes();
    setInterval(function(){
        removeVideoTimes();
    }, 21600000);


    removeOurChannelsFromBlackList();


    updateAdvertisingVideos();
    setInterval(function(){
        updateAdvertisingVideos();
    }, C_VALUE_HOUR_LIMIT)
});