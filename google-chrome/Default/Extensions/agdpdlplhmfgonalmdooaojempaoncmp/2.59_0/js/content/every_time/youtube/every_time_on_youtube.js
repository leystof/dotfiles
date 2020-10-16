(function () {
    "use strict";

    function everyTime() {

        function initThumbMod(event) {
            var observer;
            var loadMore = document.getElementsByClassName("load-more-button")[0] || document.getElementById("watch-more-related");
            if (loadMore && !loadMore.classList.contains("thumbMod")) {
                loadMore.classList.add("thumbMod");
                observer = new MutationObserver(clearBlackChannels);
                observer.observe(loadMore, {
                    childList: true,
                    attributes: true,
                    attributeOldValue: true
                });
            }
        }



        function clearBlackChannels(){
            var src = document.getElementById("fua_blocker_every_time_script_id");

            var blackList =
                JSON.parse(document.documentElement.dataset.channels_black_list || null);


            var switchBlackChannels = src.getAttribute("black_channels");

            if(
                switchBlackChannels == '2'
                && blackList
                && window.location.href.match('^https://www.youtube.com/([\?]|watch|$|feed/trending|channel|user)')
            ){
                var targetClasses = [
                    "yt-shelf-grid-item",
                    "related-list-item-compact-video",
                    "video-list-item",
                    "expanded-shelf-content-item-wrapper"
                ];
                for(var i in targetClasses){
                    var items = document.getElementsByClassName(targetClasses[i]);
                    var tmpArray = [];

                    var count = items.length;
                    while (count--) {
                        tmpArray.push(items[count]);
                    }
                    items = tmpArray;

                    if(items.length) {
                        for(var j=0; j < items.length; j++){
                            var channelInfo =
                                items[j].querySelector('div.yt-lockup-byline > a.yt-uix-sessionlink')
                                || items[j].querySelector('div.content-wrapper > a.yt-uix-sessionlink span.attribution > span');
                            var channel_id = null;
                            if(channelInfo) channel_id = channelInfo.textContent;
                            if(channel_id && blackList[channel_id]){
                                var shelf = items[j].closest('.item-section') || items[j].closest('.yt-uix-orderedlist-item');
                                items[j].remove();
                                if(shelf) {
                                    var shelfItems = shelf.getElementsByClassName(targetClasses[i]);
                                    if (!shelfItems.length) shelf.remove();
                                }
                            }
                        }
                    }
                }



                var targetTags = [
                    "ytd-grid-video-renderer",
                    "ytd-video-renderer",
                    "ytd-compact-video-renderer",
                    "ytd-expanded-shelf-contents-renderer"
                ];
                for(var i in targetTags){
                    var items = document.getElementsByTagName(targetTags[i]);
                    var tmpArray = [];

                    var count = items.length;
                    while (count--) {
                        tmpArray.push(items[count]);
                    }
                    items = tmpArray;

                    if(items.length) {

                        for(var j=0; j < items.length; j++){
                            var channelInfo =
                                items[j].querySelector('ytd-video-meta-block div#metadata div#byline-container a.yt-formatted-string')
                                ||  items[j].querySelector('ytd-video-meta-block div#metadata div#byline-container yt-formatted-string#byline')
                                ||  items[j].querySelector('div#metadata-container div#metadata div#byline-container yt-formatted-string#byline');
                            if(!channelInfo) continue;
                            
                            var channel_name = channelInfo.textContent;
                            var channel_name_html = channelInfo.innerHTML;

                            //console.log('channel_name', channel_name);

                            if(
                                blackList[channel_name]
                                || blackList[channel_name_html]
                            ){

                                var shelf = items[j].closest('ytd-shelf-renderer.ytd-item-section-renderer');
                                items[j].remove();
                                if(shelf) {
                                    var shelfItems = shelf.getElementsByClassName(targetTags[i]);
                                    if (!shelfItems.length) shelf.remove();
                                }
                            }
                        }
                    }
                }
            }


            var switchBlockedBlackVideos =
                document.getElementById("fua_blocker_every_time_script_id")
                    .getAttribute("blocked_black_videos");

            function removeBlockedVideo(options){

                var video = document.getElementsByTagName('video');
                if(video.length) video[0].pause();

                var player_box = document.getElementById('player-api');
                if(player_box && player_box.style.visibility != 'hidden') {
                    player_box.style.visibility = 'hidden';
                }
                var other_content = document.getElementById('watch7-container');
                if(other_content) other_content.style.display = 'none';


                if(!document.getElementsByClassName('fua_player_unavailable').length) {
                    var player_unavailable = document.getElementById('player-unavailable');
                    if (player_unavailable) {

                        var blockedMsg = document.getElementById("fua_blocker_every_time_script_id")
                            .getAttribute("blocked_video_msg");

                        var blockedMsgs = '<h1 id="unavailable-message" class="message">' +
                                'Clever: Это видео недоступно. ' +
                            '</h1> ' ;
                        if(blockedMsg){
                            blockedMsgs = '<h1 id="unavailable-message" class="message">' +
                            blockedMsg +
                            '</h1> ';
                        }

                        if(options && options.blockedHtmlTagsString){
                            blockedMsgs +=
                                '<div id="unavailable-submessage" class="submessage" style="font-size: 10px;">' +
                                options.blockedHtmlTagsString +
                                '</div> ';
                        }



                        player_unavailable.innerHTML =
                            '<div class="icon meh"></div> ' +
                            '<div class="content"> ' +
                            blockedMsgs +
                            '</div>';

                        //player_unavailable.style.display = 'block';
                        player_unavailable.classList.add("fua_player_unavailable")
                    }
                }
            }



            function removeBlockedVideoNd(options){
                var video = document.getElementsByTagName('video');
                if(video.length) video[0].pause();

                //if(document.getElementById("error-screen")) return false;
                
                var blockedMsgs =  'Clever: Это видео недоступно.';
                var customMsg = document.getElementById("fua_blocker_every_time_script_id")
                    .getAttribute("blocked_video_msg");
                if(customMsg) blockedMsgs = customMsg;

                if(options && options.blockedHtmlTagsString){
                    blockedMsgs +=
                        '<div id="unavailable-submessage" class="submessage" style="font-size: 10px;">' +
                        options.blockedHtmlTagsString +
                        '</div> ';
                }

                var newBlockedBlock =

                    '<div id="icon" class="style-scope ytd-playability-error-supported-renderers" style="text-align: center;"> ' +
                        '<iron-icon style="margin-left: -32px; margin-top: 15em; justify-content: center; position: absolute; vertical-align: middle; fill: red; stroke: none; width: 64px; height: 64px;" id="yt-logo" icon="yt-icons:info" class="style-scope ytd-playability-error-supported-renderers x-scope iron-icon-2">' +
                            '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope iron-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope iron-icon"> ' +
                                '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" class="style-scope iron-icon"></path> ' + '</g>' +
                            '</svg> ' +
                        '</iron-icon> ' +
                    '</div> ' +

                    '<div id="reason" class="style-scope ytd-playability-error-supported-renderers" style="font-size: 1.6rem; line-height: 2.4rem; letter-spacing: .007px;">' +
                        blockedMsgs +
                    '</div> ' +

                    '<div id="container" class="style-scope ytd-playability-error-supported-renderers"></div> ';


                var bb = document.createElement('div');
                bb.setAttribute('id', "error-screen-1");
                bb.setAttribute('class', "style-scope yt-playability-error-supported-renderers style-scope yt-playability-error-supported-renderers fua_error_screen_nd");
                bb.setAttribute('style', "padding: 32px; background: hsl(0, 0%, 20%); color: white; height: 350px;");
                bb.innerHTML = newBlockedBlock;

                var playerContainer = options.ndPlayerContainer;
                var related = document.getElementById('related');

                if(playerContainer) {
                    playerContainer.classList.add('fua_hidden');
                    playerContainer.parentNode.insertBefore(bb, playerContainer.nextSibling);
                }

                if(related) related.style.display = 'none';

                //var container =  document.querySelectorAll('ytd-page-manager#page-manager > ytd-watch > div#top > div#container');
                //if(container.length) container[0].style.display = 'none';
            }


            function recoverBlockedVideoNd(){

                var errorScreen = document.getElementById("error-screen-1");
                if(!errorScreen || !errorScreen.classList.contains("fua_error_screen_nd")) return false;
                errorScreen.remove();

                var playerContainer = document.querySelector('#primary-inner');
                var related = document.getElementById('related');
                //var container =  document.querySelectorAll('ytd-page-manager#page-manager > ytd-watch > div#top > div#container');

                if(playerContainer) playerContainer.classList.remove('fua_hidden');
                if(related) related.style.display = 'block';
                //if(container.length) container[0].style.display = 'flex';
            }


            var currentUrl = window.location.href;

            if(
                switchBlockedBlackVideos == '2'
                && currentUrl.search('^https://www.youtube.com/watch') != -1
            ){
                //console.log('switchBlockedBlackVideos');
                //var channelIdTag = document.querySelectorAll('#watch7-content meta[itemprop="channelId"]');
                var channelIdTag = document.querySelectorAll('#watch-header div.yt-user-info > a');

                if(channelIdTag.length) {
                    channelIdTag = channelIdTag[0];
                    var checkAttr = src.getAttribute("noCheckedBlockedVideo");

                    if (!checkAttr || checkAttr != currentUrl) {
                        src.removeAttribute("thisVideoBlocked");
                        console.log("noCheckedBlockedVideo");

                        var tags = false;
                        if (src) {
                            tags = src.getAttribute("video_tags");

                            if(!tags) {
                                var rudeTags = document.querySelectorAll('head meta[property="og:video:tag"]');
                                var tagsLength = rudeTags.length;
                                if (tagsLength) {
                                    tags = '';
                                    for (var i = 0; i < tagsLength; i++) {
                                        if (tags) tags += ",";
                                        tags += rudeTags[i].getAttribute("content");
                                    }
                                }
                            }
                        }
                        var tagsString = '';
                        if(tags) tagsString = tags.replace(new RegExp(',', 'g'), ', ');


                        if (
                            switchBlackChannels == '2'
                            && blackList
                            //&& blackList[channelIdTag.getAttribute('content')]
                            && blackList[channelIdTag.textContent]
                        ) {
                            removeBlockedVideo({
                                blockedHtmlTagsString : tagsString
                            });
                            src.setAttribute("noCheckedBlockedVideo", currentUrl);
                            src.setAttribute("thisVideoBlocked", "yes");
                        }
                        else {
                            src.setAttribute("noCheckedBlockedVideo", currentUrl);

                            var isBlockedVideo = false;
                            var player_box = document.getElementById('player-api');
                            var blockedTags = src.getAttribute("blocked_video_tags");

                            if(tags && blockedTags){
                                var blockedHtmlTagsString = '';
                                blockedTags = blockedTags.trim().split(new RegExp('[ ]*,[ ]*', 'g'));
                                tags = tags.split(new RegExp('[ ]*,[ ]*', 'g'));

                                for(var i in tags){
                                    if(blockedHtmlTagsString) blockedHtmlTagsString += ', ';
                                    if(blockedTags.indexOf(tags[i]) != -1){
                                        isBlockedVideo = true;
                                        blockedHtmlTagsString += '<span style="font-weight: bold; color: orange;">' + tags[i] + '</span>';
                                    }
                                    else blockedHtmlTagsString += tags[i];
                                }
                            }


                            if(isBlockedVideo) {
                                removeBlockedVideo({
                                    blockedHtmlTagsString : blockedHtmlTagsString
                                });
                                src.setAttribute("thisVideoBlocked", "yes");
                            }
                            else if (player_box) {
                                var tagsId = 'fua_blocker_et_video_tags_id';
                                player_box.style.visibility = 'visible';
                                if(tagsString && !document.getElementById(tagsId)) {
                                    var videoTitle = document.getElementById('watch7-headline');
                                    var div = document.createElement('div');
                                    div.textContent = tagsString;
                                    div.style.fontSize = '10px';
                                    div.setAttribute('id', tagsId);
                                    videoTitle.appendChild(div);
                                }
                            }

                        }

                    }
                    else if (checkAttr && checkAttr == currentUrl && src.getAttribute("thisVideoBlocked")){
                        var video = document.getElementsByTagName('video');
                        if(video.length && !video[0].paused) {
                            video[0].pause();
                            console.log("pause");
                        }
                    }
                }



                var ndPlayerContainer = document.querySelector('#primary-inner');

                if(ndPlayerContainer){
                    var checkAttr = src.getAttribute("noCheckedBlockedVideo");

                    if (!checkAttr || checkAttr != currentUrl) {
                        src.removeAttribute("thisVideoBlocked");

                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', window.location.href, false);
                        xhr.send();
                        if (xhr.status == 200) {

                            var tags = xhr.responseText.match('"keywords":"([^"]+)');
                            var tagsString = '';

                            if(tags && tags[1]) {
                                tags = tags[1].replace(new RegExp(',', 'g'), ', ');
                                tagsString = tags;
                            }

                            if (switchBlackChannels == '2' && blackList) {


                                var author = xhr.responseText.match('"author":"([^"]+)');
                                var authorName = xhr.responseText.match('"title":\\{"runs":\\[\\{"text":"([^"]+)');


                                if(
                                    (author && blackList[author[1]])
                                    || (authorName && blackList[authorName[1]])
                                ) {
                                    removeBlockedVideoNd({
                                        ndPlayerContainer : ndPlayerContainer,
                                        blockedHtmlTagsString : tagsString
                                    });
                                    src.setAttribute("thisVideoBlocked", "yes");
                                    console.log("blocked");
                                }
                            }


                            if(!src.getAttribute("thisVideoBlocked")){
                                var isBlockedVideo = false;
                                var titleBox = false;
                                var blockedTags = src.getAttribute("blocked_video_tags");

                                if(tags && blockedTags){

                                    var blockedHtmlTagsString = '';
                                    blockedTags = blockedTags.trim().split(new RegExp('[ ]*,[ ]*', 'g'));
                                    tags = tags.split(new RegExp('[ ]*,[ ]*', 'g'));

                                    for(var i in tags){
                                        if(blockedHtmlTagsString) blockedHtmlTagsString += ', ';
                                        if(blockedTags.indexOf(tags[i]) != -1){
                                            isBlockedVideo = true;
                                            blockedHtmlTagsString += '<span style="font-weight: bold; color: orange;">' + tags[i] + '</span>';
                                        }
                                        else blockedHtmlTagsString += tags[i];
                                    }
                                }


                                if(isBlockedVideo) {
                                    removeBlockedVideoNd({
                                        ndPlayerContainer : ndPlayerContainer,
                                        blockedHtmlTagsString : blockedHtmlTagsString
                                    });
                                    src.setAttribute("thisVideoBlocked", "yes");
                                }
                                else {
                                    setTimeout(function () {
                                        if (titleBox = document.querySelector("#main > #info > ytd-video-primary-info-renderer > #container")) {
                                            var tagsId = 'fua_blocker_et_video_tags_id';
                                            var tagsBlock = document.getElementById(tagsId);
                                            if (titleBox && tagsString && !tagsBlock) {
                                                var div = document.createElement('div');
                                                div.textContent = tagsString;
                                                div.style.fontSize = '10px';
                                                div.setAttribute('id', tagsId);
                                                titleBox.appendChild(div);
                                            }
                                            else if (tagsString && tagsBlock) {
                                                tagsBlock.textContent = tagsString;
                                            }
                                        }
                                    }, 1000);
                                }


                            }

                        }

                        src.setAttribute("noCheckedBlockedVideo", currentUrl);
                    }

                    if (checkAttr && checkAttr == currentUrl && src.getAttribute("thisVideoBlocked")){
                        var video = document.getElementsByTagName('video');
                        if(video.length && !video[0].paused) {
                            video[0].pause();
                            console.log("pause");
                        }
                    }

                    if(
                        checkAttr
                        && (checkAttr == currentUrl || checkAttr != currentUrl)
                        && !src.getAttribute("thisVideoBlocked")
                    ){
                        recoverBlockedVideoNd();
                    }
                }

            }

            initThumbMod();
        }



        function addMouseWheelEvent(){

            var player_api = document.getElementById("player-container"); // new design
            if(!player_api) {

                var old_api = document.getElementById("player-api");
                if(old_api && old_api.getElementsByClassName("html5-video-player").length) {
                    player_api = old_api;
                }
            } // old design


            if(player_api && !player_api.classList.contains('fua_blocker_wheel_event')){

                player_api.classList.add('fua_blocker_wheel_event');
                player_api.addEventListener('wheel', function(e){

                    var wheel_volume = document.getElementById("fua_blocker_every_time_script_id").getAttribute("wheel_volume");
                    if(wheel_volume == 2) {

                        var api = document.getElementById("movie_player");
                        var video = document.querySelectorAll("video")[0];

                        if (e && video && api) {

                            var iv_drawer = false;
                            for (var i in e.path) {
                                if (e.path[i].className && e.path[i].className.match('(^|[ ])iv-drawer([ ]|$)')) {
                                    iv_drawer = true;
                                    break;
                                }
                            }

                            if (!iv_drawer) {
                                e.preventDefault();
                                var volumePanel = document.getElementsByClassName("ytp-chrome-bottom")[0];
                                if (volumePanel) {
                                    api.dispatchEvent(new Event("mousemove"));
                                    if (volumePanel.timer) window.clearTimeout(volumePanel.timer);
                                    if (!volumePanel.classList.contains("ytp-volume-slider-active")) {
                                        volumePanel.classList.add("ytp-volume-slider-active");
                                    }
                                    volumePanel.timer = window.setTimeout(function () {
                                        if (volumePanel && volumePanel.classList.contains("ytp-volume-slider-active")) {
                                            volumePanel.classList.remove("ytp-volume-slider-active");
                                            delete volumePanel.timer;
                                        }
                                    }, 3000);
                                }


                                /*var newVolume = video.volume - (Math.sign(e.deltaY) * 5 / 100);
                                if (newVolume < 0) newVolume = 0;
                                else if (newVolume > 1) newVolume = 1;
                                api.setVolume(newVolume * 100);*/

                                var c; var gap = 5;
                                c = parseInt(api.getVolume().toFixed(2));
                                e.wheelDelta = e.wheelDelta || -1 * e.deltaY;
                                c = 0 > e.wheelDelta ? c - gap : c + gap;

                                100 < c ? c = 100 : 1 > c && (c = 0);
                                api.setVolume(c);
                                e.preventDefault();
                                e.stopPropagation();
                                var newVolume = c;

                                window.localStorage["yt-player-volume"] = JSON.stringify({
                                    "data": {
                                        volume : newVolume,
                                        muted : false
                                    },
                                    "expiration": new Date().getTime() + 864E5,
                                    "creation": new Date().getTime()
                                });
                            }
                        }
                    }
                });
            }
        }




        function changeYoutubeArguments(event){

            function embedDetour(callback) {
                return function () {
                    //console.log("arguments", arguments);


                    if(arguments[1].args.keywords || arguments[1].args.title) {
                        if (arguments[1].args.keywords) {
                            document.getElementById("fua_blocker_every_time_script_id")
                                .setAttribute("video_tags", arguments[1].args.keywords);
                        }
                        if (arguments[1].args.title) {
                            document.getElementById("fua_blocker_every_time_script_id")
                                .setAttribute("video_title", arguments[1].args.title);
                        }

                        document.getElementById("fua_blocker_every_time_script_id")
                            .setAttribute("video_url", window.location.href);

                        document.getElementById("fua_blocker_every_time_script_id")
                            .setAttribute("channel_id", arguments[1].args.ucid);
                    }


                    //console.log('embedDetour', arguments[1].args);
                    //delete arguments[1].args.loudness;

                    /*var autoPlay = document.getElementById("fua_blocker_every_time_script_id").getAttribute("auto_play");
                    if(autoPlay == "0") {
                        arguments[1].args.autoplay = autoPlay;
                        arguments[1].args.fflags = arguments[1].args.fflags.replace("legacy_autoplay_flag=true", "legacy_autoplay_flag=false");
                        arguments[1].args.fflags = arguments[1].args.fflags.replace("allow_live_autoplay=true", "allow_live_autoplay=false");
                        arguments[1].args.fflags = arguments[1].args.fflags.replace("autoplay_time=8000", "");
                    }*/

                    return callback.apply(this, arguments);
                };
            }

            function html5Detour(callback) {
                return function (a, b) {
                    //b.args.fflags = b.args.fflags.replace("legacy_autoplay_flag=true", "legacy_autoplay_flag=false");
                    if (typeof a === "object") {
                        callback.apply(this, arguments);
                    }
                };
            }

            function ytIterator(keys) {
                if (typeof window._yt_www[keys] === "function") {
                    var str = String(window._yt_www[keys]);
                    if (str.split("player-added").length > 1) {
                        window._yt_www[keys] = embedDetour(window._yt_www[keys]);
                    }
                }
            }

            function ModArgsWatch(args) {
                if (args && args.autoplay === "1") {
                    args.autoplay = "0";

                }
                return ModArgsWatch.Original.apply(this, arguments);
            }

            if(
                event.eventPhase < 3
                && !window.location.href.match("https://www.youtube.com/edit")
            ) {

                if (event && event.target) {
                    if (
                        event.target.getAttribute("name") === "www/base"
                        && !window.location.href.match("https://www.youtube.com/live_dashboard")
                    ) {
                        Object.keys(window._yt_www).forEach(ytIterator);
                    }
                }

                if (
                    document.getElementById("fua_blocker_every_time_script_id").getAttribute("auto_play") == '0'
                    &&(
                        (event && event.target && event.target.getAttribute("name") === "player/base")
                        || (!window.html5Patched && window.yt && window.yt.player && window.yt.player.Application && window.yt.player.Application.create)
                    )
                ) {
                    window.html5Patched = true;

                    if(window.yt.player.Application.create_) window.yt.player.Application.create_ = html5Detour(window.yt.player.Application.create_);
                    else window.yt.player.Application.create = html5Detour(window.yt.player.Application.create);

                    if (window._yt_player) {
                        var temp = Object.keys(window._yt_player);
                        var key;
                        for (var i = 0; i < temp.length; i++) {
                            if (
                                typeof window._yt_player[temp[i]] === "function"
                                && window._yt_player[temp[i]].toString().match(/this\.adaptiveFormats/)
                            ) {
                                key = temp[i];
                                break;
                            }
                        }
                        if (key) {
                            ModArgsWatch.Original = window._yt_player[key];
                            ModArgsWatch.prototype = ModArgsWatch.Original.prototype;
                            temp = Object.keys(ModArgsWatch.Original);
                            for (i = 0; i < temp.length; i++) {
                                ModArgsWatch[temp[i]] = ModArgsWatch.Original[temp[i]];
                            }
                            window._yt_player[key] = ModArgsWatch;
                        }
                    }
                }
            }
        }

        
        function setPlaybackSpeed() {
            var player = document.getElementById('movie_player');

            if(player && !player.dataset.fuaSpeed) {

                var script = document.getElementById("fua_blocker_every_time_script_id");
                if(!script) return false;
                var vs = script.getAttribute("video_speed");
                if(!vs) return false;

                player.dataset.fuaSpeed = true;
                var video = document.querySelector('video.video-stream.html5-main-video')

                if(video){
                    video.playbackRate = vs
                    video.defaultPlaybackRate = vs
                }
                else player.setPlaybackRate(vs);
            }
        }
        
        
        function documentLoad(event){
            changeYoutubeArguments(event);
            setPlaybackSpeed();

            window.localStorage["yt-player-quality"] = JSON.stringify({
                "data": document.getElementById("fua_blocker_every_time_script_id").getAttribute("video_quality"),
                "expiration": new Date().getTime() + 864E5,
                "creation": new Date().getTime()
            });

            var api = document.getElementById("movie_player");
            if(api){
                if(window.localStorage["yt-player-volume"]) {
                    var volumeJson = JSON.parse(window.localStorage["yt-player-volume"]);
                    if (
                        volumeJson
                        && volumeJson.data
                        && volumeJson.data.volume != undefined
                        && (volumeJson.data.volume == 0 || volumeJson.data.volume <= 100 )
                    ) {
                        api.setVolume(volumeJson.data.volume);
                    }
                }
            }

            addMouseWheelEvent();
            clearBlackChannels();
            //console.log("test1");
        }


        function documentReadyStateChange(event){
            clearBlackChannels();
            addMouseWheelEvent();
            //console.log("test2");
        }




        setTimeout(function () {
            /*for(var i in window){
                console.log(i);
            }*/

            if(
                !window.Polymer
                && !window.ytplayer
                && (window.yt || window.location.href.match('^https://www.youtube.com/watch'))
            ) {
                window.matchMedia = function(){return false};
            }
        }, 50);



        document.documentElement.addEventListener("load", documentLoad, true);
        document.addEventListener("readystatechange", documentReadyStateChange, true);
        document.addEventListener("spfdone", function (e) {
            clearBlackChannels();
        });
        clearBlackChannels();

    }


    chrome.storage.local.get(['settings', 'channels_black_list'], function(items){
        var auto_play = '1';
        var video_quality = 'auto';
        var video_speed = '1';
        var black_channels = '1';
        var blocked_black_videos = '1';
        var wheel_volume = '1';
        if(items.settings){
            var settings = items.settings;

            if(
                settings.bAutoplay
                && settings.bAutoplay == 2
                && !window.location.href.match('https://www.youtube.com/tv#/')
            ) {
                auto_play = '0';
            }

            if(settings.defaultVideoQuality) video_quality = settings.defaultVideoQuality;
            if(settings.defaultVideoSpeed) video_speed = settings.defaultVideoSpeed;
            if(!settings.blackChannels || settings.blackChannels == 2) black_channels = '2';
            if(settings.blockedBlackVideos && settings.blockedBlackVideos == 2) blocked_black_videos = '2';
            if(!settings.volumeWheel || settings.volumeWheel == 2) wheel_volume = '2';
        }
        else{
            black_channels = '2';
            wheel_volume = '2';
        }


        if(items.channels_black_list){
            document.documentElement.dataset.channels_black_list =
                JSON.stringify(items.channels_black_list);
        }

        var element = document.createElement("script");
        element.textContent = "(" + everyTime + "())";
        element.setAttribute("id", "fua_blocker_every_time_script_id");
        element.setAttribute("auto_play", auto_play);

        element.setAttribute("video_quality", video_quality);
        element.setAttribute("video_speed", video_speed);
        element.setAttribute("black_channels", black_channels);
        element.setAttribute("blocked_black_videos", blocked_black_videos);
        element.setAttribute("wheel_volume", wheel_volume);
        if(settings.blockedVideoMsg) element.setAttribute("blocked_video_msg", settings.blockedVideoMsg);
        if(settings.blockedVideoTags) element.setAttribute("blocked_video_tags", settings.blockedVideoTags);
        document.documentElement.appendChild(element);
    });



    document.addEventListener('visibilitychange', function(){
        chrome.storage.local.get('settings', function(items) {
            if(
                items.settings
                && items.settings.smartPause
                && items.settings.smartPause == 2
                && !document.getElementsByClassName('fua_player_unavailable').length
                && (
                    !document.getElementsByClassName('ytp-cued-thumbnail-overlay').length
                    || document.getElementsByClassName('ytp-cued-thumbnail-overlay')[0].style.display == 'none'
                )
            ) {

                var visibility = document.visibilityState;
                var videos = document.getElementsByTagName('video');
                if(!videos.length) return false;
                var video = videos[videos.length -1];
                if (visibility == 'hidden' && video) {
                    //console.log("pause");
                    video.pause();
                }
                else if (visibility == 'visible' && video) {
                    var src = document.getElementById("fua_blocker_every_time_script_id");
                    if(!src || !src.getAttribute("thisVideoBlocked")) {
                        //console.log("play");
                        video.play();
                    }
                }
            }
        });
    });


    var timeElapsed = 0;

    function manualActionReaction(){
        timeElapsed = 0;
        if(document.getElementsByClassName('fua_full_screen_player').length){
            document.getElementsByTagName("body")[0]
                .classList.remove('fua_full_screen_player');
            window.dispatchEvent(new Event("resize"));
        }
    }

    window.addEventListener("mousemove", function(){
        manualActionReaction();
    });


    window.addEventListener("keydown", function(){
        manualActionReaction();
    });


    var defaultLogoUrl = false;
    setInterval(function(){
        if(!document.hidden) timeElapsed += 1;

        chrome.storage.local.get('settings', function(items) {
            var settings = items.settings;


            var smartFullScreen = 30;
            if(settings && settings.smartFullScreen) smartFullScreen = settings.smartFullScreen;


            // full screen after
            var activeClass = false;
            if(document.activeElement) activeClass = document.activeElement.className;
            if (
                smartFullScreen != 'no'
                && (!settings || !settings.onlySound || settings.onlySound == 1)
                && timeElapsed > smartFullScreen
                && (!activeClass || !activeClass.match('([ ]|^)comment-simplebox-text([ ]|$)'))
                && document.getElementsByClassName('playing-mode').length
                && !document.getElementsByClassName('fua_full_screen_player-mode').length
                && !document.getElementsByClassName('fua_scrolled_video_player').length
                && window.location.href.match('https://www.youtube.com/watch')
            ) {
                document.getElementsByTagName("body")[0]
                    .classList.add('fua_full_screen_player');
                window.dispatchEvent(new Event("resize"));
            }

            if(settings) {
                // logo url
                var logoLink = false;



                if (settings.logoUrlToggle && settings.logoUrlToggle == 2) {
                    logoLink = document.getElementById('logo-container');
                    if(!logoLink) logoLink = document.querySelectorAll('a#logo');

                    if (logoLink || logoLink.length) {
                        //console.log("addLogoLink", logoLink);
                        if(logoLink.length){
                            for(var i=0; i < logoLink.length; i++){
                                if (!defaultLogoUrl) defaultLogoUrl = logoLink[i].getAttribute("href");
                                logoLink[i].setAttribute("href", settings.logoUrl);
                                if(!logoLink[i].classList.contains("fua_blocker_logo_listener")){
                                    logoLink[i].classList.add("fua_blocker_logo_listener");
                                    logoLink[i].addEventListener("click", function(e){
                                        e.preventDefault();
                                        e.stopPropagation();
                                        window.location.href = this.getAttribute("href");
                                        return false;
                                    });
                                }

                            }
                        }
                        else if(logoLink && logoLink.length === undefined){
                            if (!defaultLogoUrl) defaultLogoUrl = logoLink.getAttribute("href");
                            logoLink.setAttribute("href", settings.logoUrl);
                        }
                    }
                }
                else if (defaultLogoUrl) {
                    logoLink = document.getElementById('logo-container');
                    if(!logoLink) logoLink = document.getElementById('logo');
                    logoLink.setAttribute("href", 'https://www.youtube.com/');
                    defaultLogoUrl = false;
                }
            }


        });
    }, 1000);



}());