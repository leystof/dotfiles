var productionApplicationId = 'foebmdjoebmbfmpfehodpfbjchhchikl';
var developmentApplicationId = 'fhfajfgclhoibblpbmdonmehdlecfpll';
//productionApplicationId = developmentApplicationId;

//page listener
chrome.runtime.onMessage.addListener(function(response, sender) {
    var title = response.title;
    if (response.body) var body = response.body;


    if (title == 'openAppWindow' ) {
        openAppWindow(body, sender);
    }
});


function openAppWindow(body, sender){

    chrome.management.get(productionApplicationId, function (application) {
        if(application) {
            var videoUrl = sender.tab.url;
            if(body.videoUrl) videoUrl = body.videoUrl;

            if(application.enabled){

                chrome.runtime.sendMessage(productionApplicationId, {
                    'url': videoUrl,
                    'videoTime' : body.videoTime,
                    'recommendedVideos' : body.recommendedVideos
                });
            }
            else{
                chrome.management.setEnabled(productionApplicationId,true, function(){
                    chrome.runtime.sendMessage(productionApplicationId, {
                        'url': videoUrl,
                        'videoTime' : body.videoTime,
                        'recommendedVideos' : body.recommendedVideos
                    });
                });
                /*chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                        'title': 'appNoEnabled',
                        'body': { appName : application.name }
                    }
                );*/
            }
        }
        else {
            chrome.tabs.create({
                url : "https://chrome.google.com/webstore/detail/my-first-chrome-applicati/foebmdjoebmbfmpfehodpfbjchhchikl"
            });
        }
    });
}