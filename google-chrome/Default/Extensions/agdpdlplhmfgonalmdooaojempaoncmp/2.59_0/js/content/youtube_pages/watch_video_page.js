var gv_scroll_recommended_videos = false;
var gv_open_comments = 1;

chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;

    /*******/
    if (title == 'addHtmlOnWatchPage') {
        var current_url = window.location.href;

        if(FUA_BLOCKER_GV.current_url != current_url){
            if (document.getElementsByClassName('fua_scrolled_video_player').length) {
                document.getElementsByClassName('fua_scrolled_video_player')[0]
                    .classList.remove('fua_scrolled_video_player');
            }
            removeVideoJQueryUI();
        }


        FUA_BLOCKER_GV.current_url = current_url;

        chrome.storage.local.get(['settings', 'video_times'], function(items) {
            var settings = items.settings;


            if(!settings || !settings.bAdvertising || settings.bAdvertising == 2) {
                if(!$('#fua_block_adv_style').length) {
                    $('head').first().append('<style id="fua_block_adv_style">ytd-companion-slot-renderer #companion{display: none}</style>');
                }
            }



            if(!settings || !settings.saveVideoTime || settings.saveVideoTime == 2) {
                saveVideoTime();
                var video_id = getVideoIdFromVideoUrl(current_url);
                var video_time = false;
                if (items.video_times && items.video_times[video_id]) {
                    video_time = items.video_times[video_id].video_time;
                    var video_duration = items.video_times[video_id].video_duration;

                    changeVideoTime({
                        video_time: video_time,
                        url: current_url,
                        video_duration : video_duration
                    });
                }
            }


            if(settings && settings.recommendation && settings.recommendation == 2) {
                if(
                    FUA_BLOCKER_GV.a_video
                    && current_url === FUA_BLOCKER_GV.a_video_target_url
                ){
                    FUA_BLOCKER_ADV.addOurVideoToVideoWatchPage();
                }
                else if(!FUA_BLOCKER_ADV.isGetAdvData){
                    FUA_BLOCKER_ADV.getAdvData();
                }
            }


            addGiftIcon(settings);
            addScreenShotIcon(settings);
            addAppIconToVideo(settings);

            if(!FUA_BLOCKER_GV.watch_interval){
                blockedAnnotations();
                FUA_BLOCKER_GV.watch_interval = setInterval(function(){
                    if(!window.location.href.match("youtube.com/watch")){
                        clearInterval(FUA_BLOCKER_GV.watch_interval);
                        FUA_BLOCKER_GV.watch_interval = false;
                    } else blockedAnnotations();
                }, 1000);
            }
        });
    }


    /*******/
    if (title == 'appNoEnabled') {
        alert('Включите приложение - "' + body.appName + '"')
    }


    /*******/
    if (title == 'addAdvVideoToWatchPage') {
        FUA_BLOCKER_GV.a_video = body.aVideo;
        FUA_BLOCKER_GV.a_video_target_url = window.location.href;
        FUA_BLOCKER_ADV.addOurVideoToVideoWatchPage();
    }


    /*******/
    if (title == 'appViewOn') {
        FUA_BLOCKER_DESIGN.addOnMarker();

        var options = {};
        if(body.videoTime) options.videoTime = body.videoTime;
        if(body.openComments) options.openComments = body.openComments;

        FUA_BLOCKER_DESIGN.changeRecommendedVideosView();
        FUA_BLOCKER_DESIGN.addEmbedVideo(options);
    }

    /*******/
    if (title == 'setDefaultScrollVideoPosition') {
        FUA_BLOCKER_GV.video_sp = false;
        if (document.getElementsByClassName('fua_scrolled_video_player').length){
            FUA_BLOCKER_HTML_ELEMENTS.getPlayerBlock().attr("style", null);
        }
    }


    /*******/
    if (title == 'onlySound') {
        function makeSetAudioURL(videoElement, url) {
            function setAudioURL() {
                if (videoElement.src  != url) {
                    if($('.ytp-next-button').attr('aria-disabled') === 'false') {
                        $(videoElement).show();
                        videoElement.pause();
                        videoElement.src = url;
                        videoElement.currentTime = 0;
                        videoElement.play();
                    }
                    else {
                        $(videoElement).hide();
                    }
                }
            }
            setAudioURL();
            return setAudioURL;
        }

        var url = body.url;
        var videoElements = document.getElementsByTagName('video');

        if(videoElements.length) {
            var videoElement = videoElements[0];
            videoElement.onloadeddata = makeSetAudioURL(videoElement, url);

            if (!$('#fua_blocker_only_sound_id').length) {
                $(videoElement).parent().parent().append(
                    '<div id="fua_blocker_only_sound_id">' +
                        '<div id="fua_blocker_only_sound_msg_id">' +
                            '<div id="fua_blocker_only_sound_msg_cell_id">' +
                                FUA_BLOCKER_TRANSLATION.text.only_sound_text_on_video +
                                '<div id="fua_blocker_only_sound_switch_off_id">' +
                                    FUA_BLOCKER_TRANSLATION.words_combinations.switch_off_regime.toUpperCase() +
                                '</div>' +
                            '<div>' +
                        '</div>' +
                    '</div>'
                );

                $('#fua_blocker_only_sound_switch_off_id').click(function(){
                    chrome.runtime.sendMessage({
                        'title': 'switchOffOnlySound',
                        'body': {
                            updateUrl : window.location.href +
                                            '&time_continue=' +
                                            Math.ceil(videoElement.currentTime)
                        }
                    });
                });
            }
        }
    }
});



function updateCommentsSize(time){
    if(!time) var time = 0;
    FUA_BLOCKER_DESIGN.updateSizes();
    if(time < 5000) {
        setTimeout(function () {
            time = time + 300;
            updateCommentsSize(time)
        }, 300)
    }
}


function rightBlockToggle(){
    window.dispatchEvent(new Event("resize"));
    chrome.runtime.sendMessage({
        'title': 'changeComments',
        'body': { 'value' : gv_open_comments }
    });
}



function hideRightBlock(){
    gv_open_comments = 1;
    $('#fua_close_comments_id').hide();
    $('.fua_under_video_button').each(function(){
        $(this).show()
            .find('.yt-uix-button-content').html($(this).attr('initial-text'));
    });

    rightBlockToggle();
}


function showRightBlock(tabNumber, iconOnly){
    var buttonId = 'fua_open_comments_id';
    if(tabNumber == 3) buttonId = 'fua_show_description_id';

    $('#fua_close_comments_id').show();
    $('.fua_under_video_button').hide();
    $('#' + buttonId).show().find('.yt-uix-button-content').html(C_WORD_HIDE);


    if(!iconOnly) {
        var clickClass = 'fua_youtube_button_show_comments';
        if (tabNumber == 3) clickClass = 'fua_youtube_button_show_info';
        $('#fua_right_content_toggle_id .' + clickClass).click();
    }

    rightBlockToggle();
}


function changePlaceOfSomePanels(){
    var cloneObject = $('#watch-action-panels');
    $('#action-panel-details').prepend(cloneObject);
    cloneObject = $('#watch-header');
    $('#action-panel-details').prepend(cloneObject);
    cloneObject = $('#watch7-creator-bar');
    if(cloneObject.length) $('#action-panel-details').prepend(cloneObject);
}


function changeCommentsThumbs(){
    $('.comment-action-buttons-renderer-thumb[data-action-type="like"]')
        .not('.fua_new_comment_thumbs').addClass('fua_new_comment_thumbs')
        .html(
            '<img src="'+ IMAGE_LIKE_BUTTON +'" class="fua_thumb">' +
            '<img src="'+ IMAGE_LIKE_BUTTON_CLICKED +'" class="fua_thumb_clicked">'
        );


    $('.comment-action-buttons-renderer-thumb[data-action-type="dislike"]')
        .not('.fua_new_comment_thumbs').addClass('fua_new_comment_thumbs')
        .html(
            '<img src="'+ IMAGE_DISLIKE_BUTTON +'" class="fua_thumb">' +
            '<img src="'+ IMAGE_DISLIKE_BUTTON_CLICKED +'" class="fua_thumb_clicked">'
        );
}



function removeVideoJQueryUI(){
    //console.log('removeVideoJQueryUI', window.location.href);
    var playerBlock = FUA_BLOCKER_HTML_ELEMENTS.getPlayerBlock();
    if(playerBlock.resizable("instance")) playerBlock.resizable( "destroy" );
    if(playerBlock.draggable("instance")) playerBlock.draggable("destroy" );

    playerBlock.attr("style", null);
}


function getStyleVideoJQueryUI(){
    var playerBlock = FUA_BLOCKER_HTML_ELEMENTS.getPlayerBlock();
    if(playerBlock.attr("style")) {
        FUA_BLOCKER_GV.video_sp = {
            top: playerBlock.css("top"),
            left: playerBlock.css("left"),
            width: playerBlock.width() + 'px',
            height: playerBlock.height() + 'px'
        };

        //console.log("FUA_BLOCKER_GV.video_sp", FUA_BLOCKER_GV.video_sp);

        chrome.runtime.sendMessage({
            'title': 'scrollVideoPosition',
            'body': { 'position' : FUA_BLOCKER_GV.video_sp }
        });
    }
}


function setStyleVideoJQueryUI(){
    if(FUA_BLOCKER_GV.video_sp){
        //console.log('setStyleVideoJQueryUI', window.location.href);
        var playerBlock = FUA_BLOCKER_HTML_ELEMENTS.getPlayerBlock();
        for(var i in FUA_BLOCKER_GV.video_sp){
            playerBlock.css(i, FUA_BLOCKER_GV.video_sp[i]);
        }
    }
}




function setScrollStyle() {
    chrome.storage.local.get('settings', function (items) {
        if (!items.settings || !items.settings.smartScroll || items.settings.smartScroll == 2) {

            var videoPlayer = document.getElementsByTagName("body")[0]; // new design




            var src = document.getElementById("fua_blocker_every_time_script_id");
            if(src.getAttribute("thisVideoBlocked")){
                videoPlayer.classList.remove('fua_scrolled_video_player');
                return false;
            }

            if(items.settings && items.settings.scrollVideoPosition){
                FUA_BLOCKER_GV.video_sp = items.settings.scrollVideoPosition;
            }


            var detailPanel = document.getElementById('watch-header'); // old design
            if(!detailPanel) detailPanel = document.getElementById('info-contents'); // new design

            var topLine = document.getElementById('masthead-positioner'); // old design
            if(!topLine) topLine = document.getElementById('masthead-container'); // new design

            var detailPanelTop = false;
            if(detailPanel) detailPanelTop =
                detailPanel.getBoundingClientRect().top
                + window.scrollY
                - topLine.offsetHeight - 10;


            var appView = document.getElementById('fua_blocker_app_view_on_id');

            if (!appView && detailPanelTop && window.scrollY > detailPanelTop) {

                var playerBlock = FUA_BLOCKER_HTML_ELEMENTS.getPlayerBlock();

                if(!playerBlock.resizable("instance")) {
                    playerBlock.resizable({
                        handles: "all",
                        resize: function( event, ui ) {
                            getStyleVideoJQueryUI();
                            window.dispatchEvent(new Event("resize"));
                        }
                    });
                }
                if(!playerBlock.draggable("instance")) {
                    playerBlock.draggable({
                        drag: function( event, ui ) {
                            getStyleVideoJQueryUI();
                        }
                    });
                    setStyleVideoJQueryUI();
                }

                //console.log('scroll', window.location.href);

                videoPlayer.classList.add('fua_scrolled_video_player');
                window.dispatchEvent(new Event("resize"));
                return false;
            }
        }

        if (document.getElementsByClassName('fua_scrolled_video_player').length) {
            document.getElementsByClassName('fua_scrolled_video_player')[0]
                .classList.remove('fua_scrolled_video_player');
            removeVideoJQueryUI();
            window.dispatchEvent(new Event("resize"));
        }
    });
}


window.addEventListener("scroll", function(){
    if(window.location.href.search('^https://www.youtube.com/watch') != -1) {
        setScrollStyle();
    }
});