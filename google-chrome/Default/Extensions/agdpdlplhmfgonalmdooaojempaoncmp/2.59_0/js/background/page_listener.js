chrome.tabs.onUpdated.addListener(function(tabId, tab, tabInfo){

    if(tabInfo.url.match('^https://www.youtube.com/')) {
        chrome.tabs.executeScript(tabId, {
            file: 'js/content/every_time/youtube/change_settings.js',
            runAt: "document_start"
        });
    }




    /*chrome.tabs.insertCSS(tabId, {
            file : 'css/pages/new_vision4.css',
            runAt : "document_start"
        });

        chrome.tabs.insertCSS(tabId, {
            file : 'css/pages/new_design.css',
            runAt : "document_start"
        });*/

    /*if(tabInfo.url.match('^(https://www.youtube.com/watch[\?]v=)')){
        if(isAppView()) {
            chrome.tabs.executeScript(tabId, {
                file: 'js/content/style/add_style/app_view.js',
                runAt: "document_start"
            });
        }
    }
    else if(tabInfo.url.match('^(https://www.youtube.com/)')){
        chrome.tabs.executeScript(tabId, {
            file : 'js/content/style/remove_style/remove_app_view.js',
            runAt : "document_start"
        });
    }*/


    if(tabInfo.url.match('^https://www.youtube.com/results.*(search_query|q)=')){
        if(!getSpecificSetting('searchView') || getSpecificSetting('searchView') == 2) {
            chrome.tabs.executeScript(tabId, {
                file : 'js/content/style/remove_style/remove_grid_search_view.js',
                runAt : "document_start"
            });
        }
    }
    if(tabInfo.url.match('^https://www.youtube.com/results.*(search_query|q)=(#|%23)')){
        if(!getSpecificSetting('searchView') || getSpecificSetting('searchView') == 2) {
            /*chrome.tabs.insertCSS(tabId, {
                file : 'css/pages/search_page_hash.css',
                runAt : "document_start"
            });*/

            chrome.tabs.executeScript(tabId, {
                file: 'js/content/style/add_style/add_grid_search_view_hash.js',
                runAt: "document_start"
            });
        }
    }
    else if(tabInfo.url.match('^https://www.youtube.com/results.*(search_query|q)=')){
        if(!getSpecificSetting('searchView') || getSpecificSetting('searchView') == 2) {
            /*chrome.tabs.insertCSS(tabId, {
                file : 'css/pages/search_page.css',
                runAt : "document_start"
            });*/

            chrome.tabs.executeScript(tabId, {
                file: 'js/content/style/add_style/add_grid_search_view.js',
                runAt: "document_start"
            });
        }
    }
    else if(tabInfo.url.match('^(https://www.youtube.com/)')){
        chrome.tabs.executeScript(tabId, {
            file : 'js/content/style/remove_style/remove_grid_search_view.js',
            runAt : "document_start"
        });
    }




    if(tabInfo.status == "complete") {
        if (
            tabInfo.url.match('^(https://www.youtube.com/)$')
            || tabInfo.url.match('^(https://www.youtube.com/[?][^ /]*)$')
        ) {
            //listenWatchCountUpdate(tabInfo.url);
            var aVideo = getAdvertisingVideo({onlyNewest : true});
            if(aVideo) {
                chrome.tabs.sendMessage(
                    tabId, {
                        'title': 'addOurVideoToFrontPage',
                        'body': {aVideo: aVideo}
                    }
                );
            }
        }

        else if(tabInfo.url.match('^(https://www.youtube.com/watch.*[\?&]v=)')){
            //listenWatchCountUpdate(tabInfo.url);
            //var aVideo = getAdvertisingVideo({url : tabInfo.url});

            var data = {aVideo : false};
            //if(aVideo) data.aVideo = aVideo;

            chrome.tabs.sendMessage(
                tabId, {
                    'title': 'addHtmlOnWatchPage',
                    'body': data
                }
            );


            /*if(isAppView()) {
                chrome.tabs.sendMessage(
                    tabId, {
                        'title': 'appViewOn',
                        'body': {
                            openComments : bg_gv_show_comments
                        }
                    }
                );
            }*/
        }
        else if(tabInfo.url.match('^https://www.youtube.com/results[\?](search_query|q)=')){
            chrome.tabs.sendMessage(
                tabId, {
                    'title': 'addSearchViewButton',
                    'body': {}
                }
            );
        }


        if (tabInfo.url.match('^https://www.youtube.com/')) {
            var catsMsg = STORAGE_SINGLETON.getStorageProperty({
                propertyName : 'non_youtube_cats_msg'
            });

            if(catsMsg){
                STORAGE_SINGLETON.removeFromStorage({
                    propertyName : 'non_youtube_cats_msg'
                });

                chrome.tabs.sendMessage(
                    tabId, {
                        'title': 'showCatsMsg',
                        'body': {}
                    }
                );
            }
        }
    }



    if (tabInfo.url.match('^https://www.youtube.com/')) {
        chrome.tabs.sendMessage(
            tabId, {
                'title': 'addAppIcon',
            }
        );
    }
});




function dataURIToBlob(dataURI) {

    let binStr = atob(dataURI.split(',')[1]),
        len = binStr.length,
        arr = new Uint8Array(len),
        mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    for (let i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }

    return new Blob([arr], {
        type: mimeString
    });

}


//page listener
chrome.runtime.onMessage.addListener(function(response, sender) {
    var title = response.title;
    if(response.body) var body = response.body;


    if(title == 'downloadScreenshot' && body) {
        let url = URL.createObjectURL(dataURIToBlob(body.base64));

        chrome.downloads.download({
            url : url,
            filename : 'ScreenShot-VideoID-' + body.video_id + '-TimeS-' + body.time + '.png',
            saveAs:   true
        });
    }
    else if(title === 'downloadGif' && body) {
        let url = URL.createObjectURL(dataURIToBlob(body.base64));

        chrome.downloads.download({
            url : url,
            filename : 'Gif-VideoID-' + body.video_id + '.gif',
            saveAs:   true
        }, downloadId => {
            console.log('downloadId', downloadId);
        });
    }
    else if(title == 'enterToAppView') {
        appViewOn({
            tabId : sender.tab.id,
            videoTime : body.videoTime
        });
    }
    else if(title == 'exitFromAppView') {
        appViewOff({
            tabId : sender.tab.id,
            tabUrl : sender.tab.url,
            videoTime : body.videoTime
        });
    }
    else if(title == 'setSpecialSetting' && body) {
        setSpecialSetting({
            name: body.name, value: body.value
        });
    }
    else if(title == 'searchGridView') {
        setSpecialSetting({
            name: 'searchView', value: 2
        });


        if(sender.tab.url.match('^https://www.youtube.com/results.*(search_query|q)=(#|%23)')){
            chrome.tabs.executeScript(sender.tab.id, {
                file: 'js/content/style/add_style/add_grid_search_view_hash.js',
                runAt: "document_start"
            });
        }
        else{
            chrome.tabs.executeScript(sender.tab.id, {
                file: 'js/content/style/add_style/add_grid_search_view.js',
                runAt: "document_start"
            });
        }
    }
    else if(title == 'searchListView') {
        setSpecialSetting({
            name: 'searchView', value: 1
        });
        chrome.tabs.executeScript(sender.tab.id, {
            file : 'js/content/style/remove_style/remove_grid_search_view.js',
            runAt : "document_start"
        });
    }
    else if(title == 'addChannelToBlackList') {
        addNewBlackChannel({
            channel_id: body.channel_id,
            channel_name: body.channel_name,
            channel_url : body.channel_url
        });
    }
    else if(title == 'removeChannelFromBlackList') {
        removeBlackChannel({
            channel_id: body.channel_id
        });
    }
    else if(title == 'changeComments') {
        bg_gv_show_comments = body.value
    }
    else if(title == 'saveVideoTime') {
        //console.log('saveVideoTime', body);
        saveVideoTime(body)
    }
    else if(title == 'removeOneVideoTime') {
        removeOneVideoTime(body.video_id)
    }
    else if(title == 'addToNoRecommended') {
        STORAGE_SINGLETON.saveToStorage({
            propertyName: 'not_recommend_channels.' + body.channel_id,
            value: body.channel_name
        });
    }
    else if(title == 'offRecommendVideo') {
        setSpecialSetting({
            name: 'recommendation', value: 1
        });
        hideCatsMsg();
    }
    else if(title == 'onRecommendVideo') {
        setSpecialSetting({
            name: 'recommendation', value: 2
        });
        hideCatsMsg();
    }
    else if(title == 'scrollVideoPosition') {
        setSpecialSetting({
            name: 'scrollVideoPosition', value: body.position
        });
    }
    else if(title == 'addNewSign') {
        var signs = STORAGE_SINGLETON.getStorageProperty({
            propertyName: 'signs'
        });

        if(!signs) signs = [];
        signs.push(body.sign);

        console.log("addNewSign");

        STORAGE_SINGLETON.saveToStorage({
            propertyName: 'signs',
            value : signs
        });
    }

    else if(title == 'removeNewSign') {
        var signs = STORAGE_SINGLETON.getStorageProperty({
            propertyName: 'signs'
        });

        if(signs) {
            var index = signs.indexOf(body.sign);

            if(index !== -1) {
                signs.splice(index, 1);
                //console.log("index", index);
                //console.log("signs", signs);

                STORAGE_SINGLETON.saveToStorage({
                    propertyName: 'signs',
                    value: signs
                });
            }
        }
    }
    else if(title == 'removeTmpSign') {
        var removedTmpSigns = STORAGE_SINGLETON.getStorageProperty({
            propertyName: 'removed_tmp_signs'
        });

        if(!removedTmpSigns) removedTmpSigns = [];
        removedTmpSigns.push(body.sign);

        STORAGE_SINGLETON.saveToStorage({
            propertyName: 'removed_tmp_signs',
            value : removedTmpSigns
        });
    }
    else if(title == 'videoTitleAndTags') {
        //var startTime = (new Date()).getTime();
        //var isAdvChannel = false;
        if(body.channel_id) {
            for (var i in C_VALUE_RECOMMENDED_CHANNELS) {
                if (C_VALUE_RECOMMENDED_CHANNELS[i].id === body.channel_id){
                    return false;
                }
            }
        }

        var string = '';
        var aVideo = false;

        if(body.title) string += body.title;
        if(body.tags) string = string + ' ' + body.tags;

        var advVideos = STORAGE_SINGLETON.getStorageProperty({
            propertyName: 'advertising_videos'
        });

        if(advVideos && advVideos.length && string){
            var strCode = FUA_BLOCKER_TEXT_HELPER.getNumbersCodeOfString(
                FUA_BLOCKER_TEXT_HELPER.getVideoIdFromUrl(sender.tab.url)
            );

            var not_recommend_channels = STORAGE_SINGLETON.getStorageProperty({
                propertyName : 'not_recommend_channels'
            });


            if(not_recommend_channels){
                var tmpVideos = [];
                for (var i in advVideos) {
                    if (!not_recommend_channels[advVideos[i].channel_id]){
                        tmpVideos.push(advVideos[i]);
                    }
                }
                advVideos = tmpVideos;
            }


            /*var targetAdvVideo = getVideoIdFromSmallKeywordsArray({
                keywordsString : string
            });*/



            var targetAdvVideo = false;

            if(body.title){
                targetAdvVideo = getVideoIdFromSmallKeywordsArray({
                    keywordsString : body.title
                });
                //console.log("byTitleWords", targetAdvVideo)
            }

            if(!targetAdvVideo && body.tags){
                targetAdvVideo = getVideoIdFromSmallKeywordsArray({
                    keywordsString : body.tags
                });
                //console.log("byTagsWords", targetAdvVideo)
            }



            if(targetAdvVideo){
                //console.log("targetAdvVideo", targetAdvVideo);
                var tv = targetAdvVideo[strCode % targetAdvVideo.length];
                var filtered = advVideos.filter(function(value){
                    return value.id == tv.id
                });

                if(filtered && filtered[0]) aVideo = filtered[0];
            }


            if(!aVideo) {
                aVideo = getNewestAdvVideo(advVideos);
                if(aVideo) aVideo.ran = 2;
            }


            if(!aVideo){
                //console.log("noSuitAdv");
                var index = strCode % advVideos.length;
                if(advVideos[index]) {
                    aVideo = advVideos[index];
                    aVideo.ran = 1;
                }
            }

            if(aVideo) {
                aVideo.watch_position = (strCode % 3) + 1;
                chrome.tabs.sendMessage(
                    sender.tab.id, {
                        'title': 'addAdvVideoToWatchPage',
                        'body': {aVideo: aVideo}
                    }
                );
            }

            //console.log("SpendTime", (new Date()).getTime() - startTime);
        }
    }
    else if(title == 'switchOffOnlySound') {
        setSpecialSetting({
            name: 'onlySound', value: 1
        });

        chrome.tabs.update(sender.tab.id, {
            url : body.updateUrl
        });
    }
    else if(title == 'switchOnOnlySound') {
        setSpecialSetting({
            name: 'onlySound', value: 2
        });

        chrome.tabs.update(sender.tab.id, {
            url : body.updateUrl
        });
    }
});


function listenWatchCountUpdate(url){
    if(bg_g_watch_count_url != url){
        bg_g_watch_count_url = url;
        updateWatchCount();
    }
}