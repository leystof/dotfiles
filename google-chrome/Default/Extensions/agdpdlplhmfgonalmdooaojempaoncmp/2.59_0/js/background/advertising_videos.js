var advRegex1 = new RegExp("^([а-я]+)(а|е|ы|и|ая|ый|ые|ие|ое|ой|ей|ом|им|их|ий|ский|ские|ского)$");
var advMinWordLength = 3;



function updateWatchCount(){
    var watchCount = STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'watch_count'
    });

    if(!watchCount || watchCount > C_VALUE_MAX_WATCH_COUNT) {
        watchCount = 1;
        updateAdvertisingVideos();
    }
    else watchCount++;

    //console.log('watchCount', watchCount);

    STORAGE_SINGLETON.saveToStorage({
        propertyName : 'watch_count',
        value : watchCount
    });
}


function getWordsFromString(string){
    return string.replace(new RegExp("[^a-zа-я0-9\-_ ]+", "gi"), " ").split(new RegExp("[ ]+"));
}



function getVideoIdFromSmallKeywordsArray(options){
    var advWords = STORAGE_SINGLETON.getStorageProperty({
        propertyName: 'advertising_videos_keywords',
    });

    if(advWords) {
        var words = getWordsFromString(options.keywordsString);
        //console.log("words", words);
        if (words.length) {
            var suitKeywords = {};
            var suitVideo = {};

            //console.log("advWords", advWords);

            for(var i in words){
                if(words[i].length > advMinWordLength){
                    var word = words[i].toLowerCase()
                        .replace(advRegex1, "$1");
                    if(!suitKeywords[word]){
                        //console.log("word", word);
                        suitKeywords[word] = true;
                        if(advWords[word]){
                            for(var j in advWords[word]){
                                var v = advWords[word][j];
                                if(suitVideo[v]) suitVideo[v].push(word);
                                else suitVideo[v] = [word];
                            }
                        }
                    }
                }
            }


            //console.log("suitKeywords", suitKeywords);
            //console.log("suitVideo", suitVideo);

            var targetAdvVideo = false;
            for(var i in suitVideo){
                if(
                    !targetAdvVideo
                    || (targetAdvVideo && suitVideo[i].length > targetAdvVideo[0].words.length)
                ){
                    targetAdvVideo = [{ id : i, words : suitVideo[i]}]
                }
                else if(targetAdvVideo && suitVideo[i].length === targetAdvVideo[0].words.length){
                    targetAdvVideo.push({ id : i, words : suitVideo[i]});
                }
            }

            return targetAdvVideo;
        }
    }

    return false;
}



function updateAdvertisingVideos(){
    var upTime = STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'update_adv_video_time'
    });

    if(
        !upTime
        || upTime + C_VALUE_HOUR_LIMIT * 3 < (new Date()).getTime()
        //|| true
    ) {

        //var startTime = (new Date()).getTime();
        updateAdvVideos({
            callback: function (adv_videos) {
                //console.log("adv_videos", adv_videos);
                if (adv_videos && adv_videos.length) {
                    var advKeyWords = {};
                    for(var i in adv_videos){
                        var words = getWordsFromString(adv_videos[i].title);
                        for(var j in words){
                            if(words[j].length > advMinWordLength) {
                                var word = words[j].toLowerCase()
                                    .replace(advRegex1, "$1");
                                if (!advKeyWords[word]) advKeyWords[word] = [];

                                if(advKeyWords[word].indexOf(adv_videos[i].id) === -1){
                                    advKeyWords[word].push(adv_videos[i].id);
                                }
                            }
                        }
                    }

                    //console.log(advKeyWords, adv_videos);

                    //console.log("advKeyWords", advKeyWords);
                    STORAGE_SINGLETON.saveToStorage({
                        propertyName: 'advertising_videos_keywords',
                        value: advKeyWords
                    });

                    STORAGE_SINGLETON.saveToStorage({
                        propertyName: 'advertising_videos',
                        value: adv_videos
                    });

                    STORAGE_SINGLETON.saveToStorage({
                        propertyName: 'update_adv_video_time',
                        value: (new Date()).getTime()
                    });

                    //console.log("SpendTime", (new Date()).getTime() - startTime);
                }
            }
        });
    }
}





function getNewestAdvVideo(videos){
    var newestVideo = false;

    var lastVideos = false;
    for (var i in videos) {
        if (
            videos[i].time_ago
            && videos[i].time_ago.match("hour|годи|час|минут|хвилин|minutes")
        ){
            if(videos[i].time_ago.match("hour|годи|час")){
                if(!lastVideos) lastVideos = {};
                if(!lastVideos.hours) lastVideos.hours = [];
                lastVideos.hours.push(videos[i]);
            }
            else if(videos[i].time_ago.match("минут|хвилин|minutes")){
                if(!lastVideos) lastVideos = {};
                if(!lastVideos.minutes) lastVideos.minutes = [];
                lastVideos.minutes.push(videos[i]);
            }
        }
    }


    //console.log("lastVideos", lastVideos);
    if(lastVideos){

        if(lastVideos.minutes){
            newestVideo =
                lastVideos.minutes[Math.floor(Math.random() * lastVideos.minutes.length)];
        }
        else if(lastVideos.hours){
            var tmpVideos = [];
            for(var i in lastVideos.hours){
                var current = 23;
                if(tmpVideos.length) current = parseInt(tmpVideos[0].time_ago);

                if(current > parseInt(lastVideos.hours[i].time_ago)){
                    tmpVideos = [lastVideos.hours[i]];
                }
                else if(current === parseInt(lastVideos.hours[i].time_ago)){
                    tmpVideos.push(lastVideos.hours[i]);
                }
            }

            if(tmpVideos.length){
                newestVideo =
                    tmpVideos[Math.floor(Math.random() * tmpVideos.length)];
            }
        }
    }


    return newestVideo;
}





function getAdvertisingVideo(options){
    var url = options.url;
    var videos = STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'advertising_videos'
    });


    var not_recommend_channels = STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'not_recommend_channels'
    });



    if(url) {
        var savedPositions = STORAGE_SINGLETON.getStorageProperty({
            propertyName: 'advertising_videos_positions'
        });


        var id = url.match('v=([^&]*)')[1];
        if(savedPositions && id){
            for(var i in savedPositions){
                if(
                    savedPositions[i]
                    && savedPositions[i].watch_id
                    && savedPositions[i].watch_id == id
                ) {
                    var positionData = savedPositions[i];
                }
            }
        }
    }


    if(not_recommend_channels){
        if(positionData && not_recommend_channels[positionData.channel_id]){
            positionData = false;
        }

        if(videos) {
            var tmpVideos = [];
            for (var i in videos) {
                if (!not_recommend_channels[videos[i].channel_id]){
                    tmpVideos.push(videos[i]);
                }
            }
            videos = tmpVideos;
        }
    }



    if(positionData) return positionData;

    if(!videos || videos.length < 1) return false;

    var newestVideo = false;
    if(options.onlyNewest) {
        newestVideo = getNewestAdvVideo(videos);
    }

    if(newestVideo){
        newestVideo.watch_position = randomString(1, '123');
        //console.log("newestVideo", newestVideo);
        return newestVideo;
    }

    var index = Math.floor(Math.random() * videos.length);

    if(!positionData && id){
        videos[index].watch_id = id;
        videos[index].watch_position = randomString(1, '123');
        if(savedPositions) {
            if(savedPositions.length > 4) savedPositions.shift();
            savedPositions.push(videos[index]);
        }
        else savedPositions = [videos[index]];
        STORAGE_SINGLETON.saveToStorage({
            propertyName: 'advertising_videos_positions',
            value : savedPositions
        });
    }

    return videos[index];
}



function getAdditionalOneChannelAdvVideos(options){
    function nextStep(options){
        if(options.pageCount > 0) getAdditionalOneChannelAdvVideos(options);
        else options.callback(options.adv_videos);
    }

    options.pageCount--;

    $.get("https://www.youtube.com" + options.url, "",
        function(resp){
            //console.log("additional", resp);
            if(resp && resp.content_html){
                res = "<div>"+ resp.content_html +"</div>";

                res = res.replace(/onload=";__ytRIL\(this\)"/gi, '');

                var html = document.createElement('html');
                html.innerHTML = res;
                html = $(html);

                html.find(".channels-content-item").each(function(){
                    var video_data = {
                        channel_id : options.channel_id,
                        channel_title : options.channel_title,
                        id : $(this).find("div:first").attr("data-context-item-id"),
                        title : $(this).find(".yt-lockup-content a.yt-uix-tile-link").attr("title"),
                        duration_2 : $(this).find(".video-time span").html(),
                        medium_img : $(this).find(".yt-thumb-default img").attr("src"),
                        time_ago : $(this).find(".yt-lockup-meta-info li").last().text()
                    };

                    options.adv_videos.push(video_data);
                });

                //console.log("adv_videos", options.adv_videos);

                if(resp.load_more_widget_html){
                    html.html(resp.load_more_widget_html);
                    options.url = html.find("button.browse-items-load-more-button").attr("data-uix-load-more-href");
                    nextStep(options);
                }
                else options.callback(options.adv_videos);

            }
        }
    ).fail(function(info){
        options.callback(options.adv_videos);
    });
}



function getOneChannelAdvVideos(options){
    $.get(
        "https://www.youtube.com/channel/"+ options.channel_id +"/videos",
        "",
        function(res){
            var newDesignMatch = res.match(new RegExp('window\\["ytInitialData"\\] = (\{.*\}\]\}\}\});'));
            if(newDesignMatch){
                json = $.parseJSON(newDesignMatch[1]);
                //console.log('json', json);
                items = json.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].gridRenderer.items;

                for(var i in items){
                    var item = items[i].gridVideoRenderer;

                    //console.log('item', item);

                    var duration = false;
                    for(var j in item.thumbnailOverlays){
                        var element = item.thumbnailOverlays[j].thumbnailOverlayTimeStatusRenderer;
                        if(element) duration = element.text.simpleText;
                    }


                    var video_data = {
                        channel_id: options.channel_id,
                        channel_title: json.metadata.channelMetadataRenderer.title,
                        id: item.videoId,
                        title: item.title.simpleText,
                        duration_2: duration,
                        medium_img: item.thumbnail.thumbnails[0].url,
                        time_ago: item.publishedTimeText.simpleText
                    };

                    //console.log(video_data);
                    options.adv_videos.push(video_data);
                }

                options.callback(options.adv_videos);
            }
            else {
                res = res.replace(/onload=";__ytRIL\(this\)"/gi, '');

                var html = document.createElement('html');
                html.innerHTML = res;
                html = $(html);

                var channel_title = html.find("meta[name='title']").attr("content");
                html.find("#browse-items-primary .channels-content-item").each(function () {
                    var video_data = {
                        channel_id: options.channel_id,
                        channel_title: channel_title,
                        id: $(this).find("div:first").attr("data-context-item-id"),
                        title: $(this).find(".yt-lockup-content a.yt-uix-tile-link").attr("title"),
                        duration_2: $(this).find(".video-time span").html(),
                        medium_img: $(this).find(".yt-thumb-default img").attr("src"),
                        time_ago: $(this).find(".yt-lockup-meta-info li").last().text()
                    };

                    options.adv_videos.push(video_data);
                });

                if (html.find("button.browse-items-load-more-button").length) {
                    getAdditionalOneChannelAdvVideos({
                        url: html.find("button.browse-items-load-more-button").attr("data-uix-load-more-href"),
                        channel_id: options.channel_id,
                        channel_title: channel_title,
                        adv_videos: options.adv_videos,
                        pageCount: 2,
                        callback: function (adv_videos) {
                            options.callback(adv_videos);
                        }
                    });
                }
                else {
                    options.callback(options.adv_videos);
                }
            }
        }
    ).fail(function(info){
        options.callback(options.adv_videos);
    });
}


function updateAdvVideos(options){
    var channels = C_VALUE_RECOMMENDED_CHANNELS;
    if(!options.adv_videos) options.adv_videos = [];
    if(!options.index) options.index = 0;
    if(!channels[options.index]) options.callback(options.adv_videos);
    else{
        getOneChannelAdvVideos({
            channel_id : channels[options.index].id,
            adv_videos : options.adv_videos,
            callback : function(adv_videos){
                updateAdvVideos({
                    adv_videos : adv_videos,
                    index : ++options.index,
                    callback : options.callback
                });
            }
        });
    }
}

/*updateAdvVideos({
    callback : function(adv_videos){
        console.log("adv_videos", adv_videos);
    }
});*/