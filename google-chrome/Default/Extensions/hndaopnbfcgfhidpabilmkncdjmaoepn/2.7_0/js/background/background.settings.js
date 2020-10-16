//page listener
chrome.runtime.onMessage.addListener(function(response, sender) {
    var title = response.title;
    if(response.body) var body = response.body;

    if(title == 'checkboxHints' && body){
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.hints',
            value : body.checked
        });
    }

    if(title == 'checkboxAddHintsToTags' && body){
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.addHintsToTags',
            value : body.checked
        });
    }

    if(title == 'checkboxAddTrendsToTags' && body){
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.addTrendsToTags',
            value : body.checked
        });
    }

    if(title == 'checkboxAddYoutubeTagsToTags' && body){
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.addYoutubeTagsToTags',
            value : body.checked
        });
    }

    if(title == 'checkboxAddYandexKeywordsToTags' && body){
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.addYandexKeywordsToTags',
            value : body.checked
        });
    }

    if(title == 'checkboxShowTagsPanel' && body){
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'checkbox.showTagsPanel',
            value : body.checked
        });
    }
});