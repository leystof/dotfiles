function appViewOn(options){
    var tabId = options.tabId;
    STORAGE_SINGLETON.saveToStorage({
        propertyName : 'app_view',
        value : true
    });
    chrome.tabs.executeScript(tabId, {
        file : 'js/content/style/add_style/app_view.js',
        runAt : "document_start"
    });
    chrome.tabs.sendMessage(
        tabId, {
            'title': 'appViewOn',
            'body': {
                videoTime : options.videoTime
            }
        }
    );
}

function appViewOff(options){
    var tabId = options.tabId;
    var tabUrl= options.tabUrl;
    var videoTime = options.videoTime;
    STORAGE_SINGLETON.saveToStorage({
        propertyName : 'app_view',
        value : false
    });
    //chrome.tabs.reload(tabId);
    chrome.tabs.update(tabId, {
        url : tabUrl + '&time_continue=' + videoTime
    });
}


function isAppView(){
    var designToggle = STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'settings.designToggle'
    });

    if(designToggle && designToggle != 2) return false;


    return STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'app_view'
    });
}