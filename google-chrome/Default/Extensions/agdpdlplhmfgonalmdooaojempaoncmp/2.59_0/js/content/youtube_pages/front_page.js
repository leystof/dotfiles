chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;

    /*******/
    if (title == 'addOurVideoToFrontPage') {
        chrome.storage.local.get(['settings'], function(items) {
            var settings = items.settings;
            FUA_BLOCKER_GV.a_video = body.aVideo;
            if(settings.recommendation && settings.recommendation == 2) {
                FUA_BLOCKER_ADV.addOurVideoToFrontPage();
            }



            if(!settings || !settings.bAdvertising || settings.bAdvertising == 2) {
                $("#feed-pyv-container").hide();
                setTimeout(function(){
                    $("#feed-pyv-container").hide();
                }, 500);
                setTimeout(function(){
                    $("#feed-pyv-container").hide();
                }, 1000);
            }
        });
    }
});