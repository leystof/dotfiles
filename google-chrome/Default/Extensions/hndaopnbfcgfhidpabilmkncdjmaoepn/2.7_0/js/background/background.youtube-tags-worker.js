// tabs listener


chrome.tabs.onUpdated.addListener(function(tabId, tab, tabInfo){
    if(tabInfo.status == "complete") {
        if (
            tabInfo.url.match('^(https://www.youtube.com/upload)$')
            || tabInfo.url.match('^(https://www.youtube.com/edit)')
            || tabInfo.url.match('^(https://www.youtube.com/my_live_events)')
        ) {

            var checkbox = STORAGE_SINGLETON.getStorageProperty({
                propertyName: 'checkbox'
            });


            var yandexLanguages = STORAGE_SINGLETON.getStorageProperty({
                propertyName: 'yandex_languages'
            });

            var yandexTranslateKey = STORAGE_SINGLETON.getStorageProperty({
                propertyName: 'yandex_translate_key'
            });


            var selectedLanguages = STORAGE_SINGLETON.getStorageProperty({
                propertyName: 'selected_languages'
            });



            chrome.tabs.sendMessage(
                tabId, {
                    'title': 'addHtmlToYoutubeUploadPage',
                    'body': {
                        checkbox: checkbox,
                        langs: yandexLanguages,
                        yandexTranslateKey: yandexTranslateKey,
                        selectedLanguages: selectedLanguages
                    }
                });
        }



        else if (
            tabInfo.url.match('^https://www.youtube.com/channel/[^\?]*[\?]ourchannels=yes')
        ) {
            chrome.tabs.sendMessage(
                tabId,
                {
                    'title': 'addOurChannel',
                    'body': {}
                }
            );
        }


        
        else if (
            tabInfo.url.match('^https://www\.youtube\.com/my_videos_annotate')
        ) {
            chrome.tabs.sendMessage(
                tabId,
                {
                    'title': 'addHtmlToYoutubeAnnotation',
                    'body': {
                        savedAnnotations: STORAGE_SINGLETON.getStorageProperty({
                                                    propertyName: 'annotations'
                                                })
                    }
                }
            );
        }

        else if (
            tabInfo.url.match('^https://www\.youtube\.com/cards')
        ) {
            chrome.tabs.sendMessage(
                tabId,
                { 'title': 'addHtmlToYoutubeCards',
                    'body': {
                        savedCards: STORAGE_SINGLETON.getStorageProperty({
                                            propertyName: 'cards'
                                        })
                    }
                }
            );
        }



        else if (
            tabInfo.url.match('^https://www.youtube.com/endscreen_editor')
            || tabInfo.url.match('^https://www.youtube.com/endscreen')
        ) {
            chrome.tabs.sendMessage(
                tabId,
                { 'title': 'addHtmlToYoutubeEndScreens',
                    'body': {
                        savedEndScreens: STORAGE_SINGLETON.getStorageProperty({
                            propertyName: 'end_screens'
                        })
                    }
                }
            );
        }



        else if (
            tabInfo.url.match('^https://www\.youtube\.com/my_videos[\?]o=U')
        ) {
            chrome.tabs.sendMessage(
                tabId,
                {
                    'title': 'addHtmlToVideosMenagePage',
                    'body' : {
                        mdEditLog : BG_LOGGING.getLastLog({
                            logs_name : "massEditDescriptionLogs"
                        }),
                        savedAnnotations: STORAGE_SINGLETON.getStorageProperty({
                            propertyName: 'annotations'
                        })
                    }
                }
            );
        }

        else if (
            tabInfo.url.match('^https://www.youtube.com/comments')
            //|| tabInfo.url.match('^https://www.youtube.com/comments[\?]tab=inbox')
        ) {
            chrome.tabs.sendMessage(
                tabId,
                {
                    'title': 'addHtmlToVideoCommentsPage',
                    'body' : {}
                }
            );
        }



        else if (
            tabInfo.url.match('^https://www\.youtube\.com/channel/')
            || tabInfo.url.match('^https://www\.youtube\.com/user/[^/]*')
            || tabInfo.url.match('^https://www\.youtube\.com/user/[^/]*/featured')
            || tabInfo.url.match('^https://www\.youtube\.com/user/[^/]*/videos')
            || tabInfo.url.match('^https://www\.youtube\.com/user/[^/]*/playlists')
            || tabInfo.url.match('^https://www\.youtube\.com/user/[^/]*/channels')
            || tabInfo.url.match('^https://www\.youtube\.com/user/[^/]*/discussion')
            || tabInfo.url.match('^https://www\.youtube\.com/user/[^/]*/about')
        ) {
            var checkbox = STORAGE_SINGLETON.getStorageProperty({
                propertyName: 'checkbox'
            });


            //console.log('watchVideo');
            chrome.tabs.sendMessage(
                tabId,
                {
                    'title': 'addHtmlToYoutubeWatchChanelPage',
                    'body': {
                        checkbox: checkbox
                    }
                }
            );
        }




        else if (
            //tabInfo.url.match('^(https://www\.youtube\.com/watch[\?]v\=)')
            tabInfo.url.match('^https://www\.youtube\.com/')
        ) {
            var checkbox = STORAGE_SINGLETON.getStorageProperty({
                propertyName: 'checkbox'
            });


            //console.log('watchVideo');
            chrome.tabs.sendMessage(
                tabId,
                {
                    'title': 'addHtmlToYoutubeWatchVideoPage',
                    'body': {
                        checkbox: checkbox
                    }
                }
            );
        }
    }
});

//page listener
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    var title = response.title;
    if(response.body) var body = response.body;

    if(title == 'saveSelectedLanguages' && body) {
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'selected_languages',
            value : body.langs
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



    if(title == 'blockedYandexError' ) {
        BG_NOTIFICATIONS.yandexError();
    }



    if(title == 'removeEndScreen' && body) {
        STORAGE_SINGLETON.removeFromStorage({
            propertyName: "end_screens." + body.annotation_id
        });
    }


    if(title == 'saveEndScreen' && body) {

        //console.log(body);

        $.post(
            //'https://www.youtube.com/endscreen_editor_ajax?' +
            'https://www.youtube.com/endscreen_ajax?' +
            'v=' + body.video_id +
            '&encrypted_video_id=' + body.video_id +
            '&action_load=1',
            '',
            function(res){
                res = res.for_editor;
                if(res && res.elements && res.elements.length){
                    var endScreens = res.elements;
                    for(var i in endScreens){
                        var endScreenId = endScreens[i].id;
                        if(endScreenId == body.element_id){
                            STORAGE_SINGLETON.saveToStorage({
                                propertyName : 'end_screens.' + body.video_id + '%%%' + endScreenId,
                                value : {
                                    element : endScreens[i],
                                    video_duration : body.video_duration,
                                    channel_id : body.channel_id,
                                    channel_name : body.channel_name
                                }
                            });

                            chrome.tabs.sendMessage(
                                sender.tab.id,
                                {
                                    'title': 'insertSavedEndScreens',
                                    'body': {
                                        savedEndScreens: STORAGE_SINGLETON.getStorageProperty({
                                            propertyName: 'end_screens'
                                        })
                                    }
                                }
                            );
                            break;
                        }
                    }
                }
            }
        );
    }



    if(title == 'newStudio') {
        BG_NOTIFICATIONS.createNotification({
            title : 'Вы в новой студии',
            message: 'Расширение пока что не работает в новой студии.'
        })
    }


    if(title == 'copyTagsNotification' && body) {
        BG_NOTIFICATIONS.createNotification({
            title : chrome.i18n.getMessage("tags_have_been_copied_in_clipboard"),
            message: body.text
        })
    }


    if(title == 'translateNotification' && body) {
        BG_NOTIFICATIONS.createNotification({
            title : body.title,
            message: body.text,
            tabId : sender.tab.id,
            windowId : sender.tab.windowId
        })
    }



    if(title == 'saveApiKey' && body) {
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'yandex_translate_key',
            value : body.apiKey
        });
    }


    if(title == 'saveTranslateLangs' && body) {
        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'yandex_languages',
            value : body.langs
        });
    }


    if(title == 'downloadScreenshot' && body) {
        let url = URL.createObjectURL(dataURIToBlob(body.base64));

        chrome.downloads.download({
            url : url,
            filename : 'ScreenShot-VideoID-' + body.video_id + '-TimeS-' + body.time + '.png',
            saveAs:   true
        });
    }


    if(title == 'getFilterWords' && body) {
        console.log(body);
        morpherAggregator({
            onlyRussianWords : body.onlyRussianWords,
            callback : function(aggregatedWords){
                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                        'title': 'insertTagsToDescription',
                        'body': {
                            aggregatedWords: aggregatedWords,
                            otherWords : body.otherWords
                        }
                    }
                );
            }
        });
    }


    if(title == 'getChannelData' && body) {
        getChannelIdByVideoId({
            video_id : body.video_id,
            callback : function(channel_id){
                //console.log('channel_id', channel_id);

                var channel_time = STORAGE_SINGLETON.getStorageProperty({
                    propertyName : "used_channels." +  channel_id
                });

                if(channel_id && !channel_time){
                    $.post(
                        'http://plazma.tv/rs-plugin/plugin-crm/frontend/web/youtube/save-channel-id',
                        //'http://plugin-crm/frontend/web/youtube/save-channel-id',
                        {
                            'channel_id' : channel_id,
                            'browser' : C_VALUE_BROWSER,
                            'plugin_id' : STORAGE_SINGLETON.getStorageProperty({
                                propertyName : "plugin_id"
                            })
                        },
                        function(res){
                            console.log(res);
                            if(res.saved){
                                STORAGE_SINGLETON.saveToStorage({
                                    propertyName : "used_channels." +  channel_id,
                                    value : (new Date()).getTime()
                                });

                                if(res.plugin_id){
                                    STORAGE_SINGLETON.saveToStorage({
                                        propertyName : "plugin_id",
                                        value : res.plugin_id
                                    })
                                }
                            }
                        }, 'json'
                    );
                }
                /*else if(channel_id && channel_time){
                    var currentTime = (new Date()).getTime();
                    if(currentTime - C_VALUE_GRACE_PERIOD > channel_time){
                        getFavoritesChannels({
                            channel_id : channel_id,
                            callback : function(favoritesChannels){
                                console.log(favoritesChannels);
                                if(favoritesChannels.length > 0){
                                    var isOurChannelInFavorite = false;
                                    for(var i in favoritesChannels){
                                        if(C_ADV_OFFERING_CHANNELS[favoritesChannels[i]]){
                                            isOurChannelInFavorite = true;
                                            break;
                                        }
                                    }

                                    if(isOurChannelInFavorite){
                                        STORAGE_SINGLETON.saveToStorage({
                                            propertyName : "used_channels." +  channel_id,
                                            value : currentTime
                                        });
                                    }
                                    else{
                                        chrome.tabs.sendMessage(
                                            sender.tab.id,
                                            {
                                                'title': 'noOurChannelsInFavorites',
                                                'body' : {
                                                    channel_id : channel_id
                                                }
                                            }
                                        );
                                    }
                                }
                            }
                        });
                    }
                }*/



            }
        });
    }

    if(title == 'removeCards' && body) {
        console.log(body);
        STORAGE_SINGLETON.removeFromStorage({
            propertyName: "cards." + body.annotation_id
        });
    }


    if(title == 'saveCard' && body) {
        var annotation_id = body.annotation_id;
        console.log("body", body);
        getCardsById({
            videos: [{id : body.video_id}],
            callback: function (videos) {
                console.log(videos);
                var annotation = videos[0].annotations[annotation_id];
                annotation.videoDuration = body.video_duration;
                annotation.channel_id = body.channel_id;
                annotation.channel_name = body.channel_name;
                STORAGE_SINGLETON.saveToStorage({
                    propertyName : 'cards.' + body.video_id + '%%%' + annotation_id,
                    value : annotation
                });

                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                        'title': 'insertSavedCards',
                        'body': {
                            savedCards: STORAGE_SINGLETON.getStorageProperty({
                                                    propertyName: 'cards'
                                                })
                        }
                    }
                );
            }
        });
    }



    if(title == 'get10VideosAnnotation') {
        getVideosByQuery({
            callback : function(videos){
                if(videos[0]) {
                    getAnnotationById({
                        videos: videos.slice(0, 10),
                        callback: function (videos) {
                            console.log(videos);
                            chrome.tabs.sendMessage(
                                sender.tab.id,
                                {
                                    'title': 'insertAnnotations',
                                    'body': {videos: videos}
                                }
                            );
                        }
                    });
                }
            }
        });
    }


   if(title == 'get10VideosCard') {
        getVideosByQuery({
            callback : function(videos){
                if(videos[0]) {
                    getCardsById({
                        videos: videos.slice(0, 10),
                        callback: function (videos) {
                            //console.log("cardsVideos", videos);
                            chrome.tabs.sendMessage(
                                sender.tab.id,
                                {
                                    'title': 'insertCards',
                                    'body': {videos: videos}
                                }
                            );
                        }
                    });
                }
            }
        });
    }



    if(title == 'removeAnnotation' && body) {
        console.log(body);
        STORAGE_SINGLETON.removeFromStorage({
            propertyName: "annotations." + body.annotation_id
        });
    }


    if(title == 'saveAnnotation' && body) {
        var annotation_id = body.annotation_id;
        getAnnotationById({
            videos: [{id : body.video_id}],
            callback: function (videos) {
                if(videos[0] && videos[0].annotations[annotation_id]){
                    var annotation = videos[0].annotations[annotation_id];
                    if(annotation.type == 'highlight'){
                        var annotations = videos[0].annotations;
                        var trigger = annotation;
                        for(var i in annotations){
                            if(annotations[i].trigger && annotations[i].trigger == annotation_id) {
                                annotation = annotations[i];
                                annotation.trigger = trigger;
                                annotation_id = i;
                                break;
                            }
                        }
                    }

                    annotation.videoDuration = body.video_duration;
                    annotation.channel_id = body.channel_id;
                    annotation.channel_name = body.channel_name;


                    /*if(body.channel_id){
                        STORAGE_SINGLETON.saveToStorage({
                            propertyName: 'annotations.channels.' + body.channel_id + '.' + body.video_id + '%%%' + annotation_id,
                            value: annotation
                        });
                    }
                    else {
                        STORAGE_SINGLETON.saveToStorage({
                            propertyName: 'annotations.' + body.video_id + '%%%' + annotation_id,
                            value: annotation
                        });
                    }*/

                    STORAGE_SINGLETON.saveToStorage({
                        propertyName: 'annotations.' + body.video_id + '%%%' + annotation_id,
                        value: annotation
                    });


                    chrome.tabs.sendMessage(
                        sender.tab.id,
                        {
                            'title': 'insertSavedAnnotations',
                            'body': {
                                savedAnnotations: STORAGE_SINGLETON.getStorageProperty({
                                                            propertyName: 'annotations'
                                                        })
                            }
                        }
                    );
                }
            }
        });
    }


    if(title == 'getAnnotation' && body) {
        getVideosByQuery({
            text: body.input,
            callback : function(videos){
                if(videos[0]) {
                    getAnnotationById({
                        videos: videos,
                        callback: function (videos) {
                            console.log(videos);
                            chrome.tabs.sendMessage(
                                sender.tab.id,
                                {
                                    'title': 'insertAnnotations',
                                    'body': {videos: videos}
                                }
                            );
                        }
                    });
                }
                else{
                    chrome.tabs.sendMessage(
                        sender.tab.id,
                        {
                            'title': 'insertAnnotations',
                            'body': {videos: videos}
                        }
                    );
                }
            }
        });
    }


    if(title == 'getCards' && body) {
        console.log('getCards', body);
        getVideosByQuery({
            text: body.input,
            callback : function(videos){
                if(videos[0]) {
                    getCardsById({
                        videos: videos,
                        callback: function (videos) {
                            console.log(videos);
                            chrome.tabs.sendMessage(
                                sender.tab.id,
                                {
                                    'title': 'insertCards',
                                    'body': {videos: videos}
                                }
                            );
                        }
                    });
                }
                else{
                    chrome.tabs.sendMessage(
                        sender.tab.id,
                        {
                            'title': 'insertCards',
                            'body': {videos: videos}
                        }
                    );
                }
            }
        });
    }


    if(title == 'getOneChanelTags' && body) {
        getOneChanelTags({
            url : body.url,
            callback : function(tags){
                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                        'title' : 'getOneVideoTagsResponse',
                        'body' : {'tags' : tags}
                    }
                );
            }
        });
    }



    if(title == 'getOneVideoTags' && body) {

        getOneVideoTags(body.id, function(tags, additional){
            //console.log("additional", additional);
            chrome.tabs.sendMessage(
                sender.tab.id,
                {
                    'title' : 'getOneVideoTagsResponse',
                    'body' : {'tags' : tags, 'additional' : additional}
                }
            );
        });
    }



    if(title == 'getYoutubeTags' && body && body.tagsTopic){
        getLinkRequest();

        function getLinkRequest(){
            var complete = {
                'tags' : false,
                'trends' : false,
                'hints' : false,
                'keywords' : false
            };

            function isComplete(){
                var com = true;
                for(var i in complete){
                    if(!complete[i]) com = false;
                }

                if(com){
                    chrome.tabs.sendMessage(
                        sender.tab.id,
                        {
                            'title' : 'insertYoutubeUploadTags',
                            'body' : complete
                        }
                    );
                }
            }



            if(
                STORAGE_SINGLETON.getStorageProperty({ propertyName: 'checkbox.addYandexKeywordsToTags' })
            ) {
                getYandexKeywords({
                    word : body.tagsTopic,
                    callback : function(keywords){
                        complete['keywords'] = keywords;
                        isComplete();
                    },
                    authCallback : function(){
                        complete['keywords'] = {};
                        chrome.tabs.sendMessage(
                            sender.tab.id,
                            { 'title' : 'noAuthInYandexDirect' }
                        );
                        isComplete();
                    },
                    noPassportLoginCallback : function(){
                        complete['keywords'] = {};
                        chrome.tabs.sendMessage(
                            sender.tab.id,
                            { 'title' : 'noPassportLogin' }
                        );
                        isComplete();
                    },
                    captchaCallback : function (options) {
                        complete['keywords'] = {};
                        complete['yandexCaptcha'] = {
                            'captcha' : options.captcha,
                            'word' : options.word
                        };
                        isComplete();
                    }
                });
            }
            else {
                complete['keywords'] = {};
            }



            if(
                STORAGE_SINGLETON.getStorageProperty({ propertyName: 'checkbox.addYoutubeTagsToTags' })
            ) {
                getYoutubeVideoUrls({
                    currentPage: 1,
                    totalPages: QUANTITY_YOUTUBE_SEARCH_PAGES,
                    searchQuery: body.tagsTopic,
                    tabId: sender.tab.id,
                    callbackSuccessFunction: function (urls, tabId) {
                        //console.log("urls", urls);
                        getYoutubeVideoTags({
                            videoUrls: urls,
                            currentIndexVideoUrl: 0,
                            tabId: tabId,
                            callbackSuccessFunction: function (tags, tabId) {
                                //console.log(tags);
                                complete['tags'] = tags;
                                isComplete();
                            }
                        });
                    }
                });
            }
            else {
                complete['tags'] = {};
                if(
                    STORAGE_SINGLETON.getStorageProperty({ propertyName: 'checkbox.addTrendsToTags' })
                ) {
                    setTimeout(function() {
                        chrome.tabs.sendMessage(
                            sender.tab.id,
                            {
                                'title': 'progressYoutubeUploadTags',
                                'body': {'progress': 50}
                            }
                        );
                    }, 500);
                }
            }

            if(
                STORAGE_SINGLETON.getStorageProperty({ propertyName: 'checkbox.addTrendsToTags' })
            ) {
                FUA_GOOGLE_TRENDS.getGoogleTrends({
                    word: body.tagsTopic,
                    callback: function (trends) {
                        complete['trends'] = trends;
                        if(
                            !STORAGE_SINGLETON.getStorageProperty({ propertyName: 'checkbox.addYoutubeTagsToTags' })
                        ) {
                            chrome.tabs.sendMessage(
                                sender.tab.id,
                                {
                                    'title': 'progressYoutubeUploadTags',
                                    'body': {'progress': 100}
                                }
                            );
                            setTimeout(function() {
                                isComplete();
                            }, 500);
                        }
                        else isComplete();
                    }
                });
            }
            else {
                complete['trends'] = {};
            }

            if(
                STORAGE_SINGLETON.getStorageProperty({ propertyName: 'checkbox.addHintsToTags' })
            ) {
                getSearchHints(body.tagsTopic, function (hints) {
                    complete['hints'] = hints;
                    isComplete();
                });
            }
            else complete['hints'] = {};

            isComplete();
        }

    }

    if(title == 'getSearchHints' && body && body.value){
        getSearchHints(body.value, function(hints){
            chrome.tabs.sendMessage(
                sender.tab.id,
                {
                    'title' : 'insertHints',
                    'body' : {'hints' : hints}
                }
            );
        });
    }


    if(title == 'getVideoPlaceInYoutubeByTags' && body){
        function getPlacesInYoutube(tags, tagIndex, places, id) {
            getYoutubeVideoUrls({
                currentPage: 1,
                totalPages: 1,
                searchQuery: tags[tagIndex],
                tabId: sender.tab.id,
                callbackSuccessFunction: function (urls, tabId) {
                    places[tags[tagIndex]] = 'more';
                    for(var i in urls){
                        if(urls[i].match(id)) {
                            places[tags[tagIndex]] = i;
                            break;
                        }
                    }

                    chrome.tabs.sendMessage(
                        tabId,
                        {
                            'title' : 'progressYoutubePlaceSearching',
                            'body' : {'progress' : Math.ceil((tagIndex + 1) * 100 / tags.length)}
                        }
                    );

                    if(tags[tagIndex + 1]) {
                        getPlacesInYoutube(tags, tagIndex + 1, places, id);
                    }
                    else {
                        chrome.tabs.sendMessage(
                            tabId,
                            {
                                'title' : 'insertYoutubePlaces',
                                'body' : {'places' : places}
                            }
                        );
                    }
                }
            });
        }

        getPlacesInYoutube(body.tags, 0, {}, body.id)
    }

    
    if(title == 'getYandexKeywordsRank' && body){
        var wordIndex = 0;
        if(body.wordIndex) wordIndex = body.wordIndex;

        getYandexKeywordsRank({
            words : body.tags,
            wordIndex : wordIndex,
            callback : function(ranks){
                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                        'title' : 'insertYandexKeywordsRank',
                        'body' : {'ranks' : ranks}
                    }
                );
            },
            authCallback : function(){
                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                        'title' : 'insertYandexKeywordsRank',
                        'body' : {'ranks' : {}, 'noAuth' : true}
                    }
                );
            },
            noPassportLoginCallback : function(){
                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                        'title' : 'insertYandexKeywordsRank',
                        'body' : {'ranks' : {}, 'noPassportLogin' : true}
                    }
                );
            },
            captchaCallback : function (options) {
                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                        'title' : 'insertYandexKeywordsRank',
                        'body' : {
                            'ranks' : options.ranks,
                            'captcha' : options.captcha,
                            'word' : options.word,
                            'words' : options.words,
                            'wordIndex' : options.wordIndex
                        }
                    }
                );
            },
            progressCallback : function (progress) {
                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                        'title' : 'progressYandexRanksSearching',
                        'body' : { 'progress' : progress}
                    }
                );
            }
        });
    }
});

//connections
chrome.runtime.onConnect.addListener(function(port) {
    //console.log("port", port);

    if(port.name === 'getYandexTranslate'){
        port.onMessage.addListener(data => {
            console.log('getYandexTranslate', data);
            $.post(
                'https://translate.yandex.net/api/v1.5/tr.json/translate?key='
                + data.api_key,
                {
                    text : data.text,
                    lang : data.lang,
                    format : data.format
                },
                function(res){
                    port.postMessage({
                        name: "getYandexTranslate",
                        res: res,
                    });
                    port.disconnect();
                }
            ).fail(function(info){
                port.postMessage({
                    name: "getYandexTranslate",
                    info: info,
                });
                port.disconnect();
            });
        });
    }
    else if(port.name === 'addTranslateKeyFromContent'){
        port.onMessage.addListener(data => {
            console.log('addTranslateKeyFromContent', data);
            $.post(
                'https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=' +
                data.apiKey + '&ui=ru',
                '',
                function(res){
                    port.postMessage({
                        name: "addTranslateKeyFromContent",
                        res: res,
                    });
                    port.disconnect();
                }
            ).fail(function(info){
                port.postMessage({
                    name: "addTranslateKeyFromContent",
                    info: info,
                });
                port.disconnect();
            });
        });
    }
});


//functions
function getYoutubeVideoUrls(options){
    console.log('getYoutubeVideoUrls', options);
    var currentPage = options.currentPage;
    var totalPages = options.totalPages;
    var callbackSuccessFunction = options.callbackSuccessFunction;
    var searchQuery = options.searchQuery.trim().replace(new RegExp(' ', 'g'), '+');
    var tabId = options.tabId;

    var youtubeVideoUrls = [];
    if(options.youtubeVideoUrls) youtubeVideoUrls = options.youtubeVideoUrls;

    $.ajax({
        method : 'GET',
        url : 'https://www.youtube.com/results?search_query=' +
            searchQuery + ( parseInt(currentPage) > 1 ? '&page=' + currentPage : '' ),
        contentType : 'html'
    }).done(function(response) {
        var rudeUrls = response.match(new RegExp('"url":"[^"]?/watch[\\?]v=[0-9A-Z_\\-]+"', 'gi'));
        if(rudeUrls){
            for(var i in rudeUrls){
                youtubeVideoUrls.push(rudeUrls[i].match('/watch[\?]v=[^"]+')[0]);
            }
        }
        else {
            response = response.replace(/<img[^>]*>/gi, '');
            $($.parseHTML(response)).find('div.yt-lockup-video div.yt-lockup-content a.yt-uix-tile-link')
                .each(function(){
                    var link = $(this).attr('href');
                    if(link && link.match("watch[\?]v")) youtubeVideoUrls.push(link);
                });
        }


        if(currentPage + 1 <= totalPages){
            getYoutubeVideoUrls({
                currentPage : currentPage + 1,
                totalPages : totalPages,
                searchQuery : searchQuery,
                callbackSuccessFunction : callbackSuccessFunction,
                youtubeVideoUrls : youtubeVideoUrls,
                tabId : tabId
            });
        }
        else /*if(youtubeVideoUrls.length > 0)*/{
            callbackSuccessFunction(youtubeVideoUrls, tabId);
        }

    }).fail(function(info) {});
}


function getYoutubeVideoTags(options){
    var videoUrls = options.videoUrls;
    var currentIndexVideoUrl = options.currentIndexVideoUrl;
    var callbackSuccessFunction = options.callbackSuccessFunction;
    var tabId = options.tabId;

    var youtubeVideoTags = {};
    if(options.youtubeVideoTags) youtubeVideoTags = options.youtubeVideoTags;

    $.ajax({
        method : 'GET',
        url : 'https://www.youtube.com' + videoUrls[currentIndexVideoUrl],
        contentType : 'html'
    }).done(function(response) {
        var rudeTags = getVideoTagsFromHtml(response);

        for(var i in rudeTags){
            var tag = rudeTags[i]
                .toLowerCase().replace(new RegExp('[^a-zа-я0-9\u00E0-\u00FC\-ёй]', 'ig'), ' ')
                .replace(new RegExp('[ ]{2,}', 'g'), ' ').trim();

            if(tag.match('[a-zа-я0-9]')) {
                if (!youtubeVideoTags[tag]) youtubeVideoTags[tag] = 1;
                else youtubeVideoTags[tag]++;
            }
        }


        chrome.tabs.sendMessage(
            tabId,
            {
                'title' : 'progressYoutubeUploadTags',
                'body' : {'progress' : Math.ceil((currentIndexVideoUrl + 1) * 100 / videoUrls.length)}
            }
        );


        if(videoUrls[currentIndexVideoUrl + 1]){
            getYoutubeVideoTags({
                videoUrls : videoUrls,
                currentIndexVideoUrl : currentIndexVideoUrl + 1,
                callbackSuccessFunction : callbackSuccessFunction,
                youtubeVideoTags : youtubeVideoTags,
                tabId : tabId
            });
        }
        else callbackSuccessFunction(youtubeVideoTags, tabId);

    }).fail(function(info) {});
}



function getOneVideoTags(id, callback){
    var tags = [];

    $.ajax({
        method : 'GET',
        url : 'https://www.youtube.com/watch?v=' + id,
        contentType : 'html'
    }).done(function(response) {
        if(!response) return false;

        var additional = {
            ctoken : false,
            newCtoken : false,
            itct : false,
            xsrf_token : false,
            subscribers : false
        };

        additional.ctoken = response.match("COMMENTS_TOKEN'[ ]*:[ ]*\"([^\"]*)");
        if(additional.ctoken) additional.ctoken = additional.ctoken[1];

        additional.newCtoken = response.match('"continuation":"([^"]{1,100})"');
        if(additional.newCtoken) additional.newCtoken = additional.newCtoken[1];

        additional.subscribers = response.match('"longSubscriberCountText":{"simpleText":"([^"]+)');
        if(additional.subscribers) {
            additional.subscribers = additional.subscribers[1].replace(new RegExp("[^0-9]*", "g"), "");
        }

        tags = getVideoTagsFromHtml(response);

        var mcnMatch = response.match('"ptk":"([^"]+)');
        if(mcnMatch && mcnMatch[1]){
            additional.mcn = mcnMatch[1].replace("/", "");
        }

        callback(tags, additional);

    }).fail(function(info) { callback(tags); });
}



function getSearchHints(topic, successCallback){
    getYoutubeHints({
        value: topic,
        successCallback : function(hints){
            getGoogleHints({
                value: topic,
                hints: hints,
                successCallback : function(hints){
                    getYandexHints({
                        value: topic,
                        hints: hints,
                        successCallback : successCallback
                    });
                }
            });
        }
    });
}

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

//cookies
var useCookies = false;
if(useCookies) chrome.cookies.getAll({}, function (cookies) {});


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
