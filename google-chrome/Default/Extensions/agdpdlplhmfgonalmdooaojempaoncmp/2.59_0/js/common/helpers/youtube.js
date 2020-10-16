function getVideoIdFromVideoUrl(url){
    var id = url.match('v=([^\&]*)(&|$)');
    if(id) return id[1];
    return false;
}



function showTooltip(options){
    var toolTip = options.toolTipObject;
    var targetObject = options.targetObject;
    var marginTop = options.marginTop;

    if(options.textAttr){
        toolTip.find('.yt-uix-tooltip-tip-content')
            .html(targetObject.attr(options.textAttr));
    }

    toolTip.css('left', targetObject.offset().left);
    toolTip.css('top', targetObject.offset().top);
    toolTip.css('margin-top', marginTop);

    if(options.toggle) toolTip.toggle();
    else toolTip.show();

    if(!$("body#body").length) toolTip.addClass("app_tooltip_new_design");

    toolTip.css('margin-left', (toolTip.outerWidth() - targetObject.outerWidth()) / 2 * (-1));
    toolTip.css('visibility', 'visible');
}


function hideTooltip(options){
    options.toolTipObject.hide();
}


function addAppMenu(options){
    var mainFrame = options.mainFrame;
    var openButtonId = 'fua-plugin-blocker-open-video-id';
    if(options.openButtonId) openButtonId = options.openButtonId;

    if(!mainFrame.find('#fua_plugin_blocker_app_menu_id').length) {
        var blockHeight = 100;
        var blockWidth = 200;

        mainFrame.find('body').append(
            '<div id="fua_plugin_blocker_app_menu_id" class="ytp-popup" style="font-size: smaller; display: none; z-index: 2147483600; position: absolute !important; width: ' + blockWidth + 'px; height: ' + blockHeight + 'px; ">' +
                '<div class="ytp-panel" style="width: ' + blockWidth + 'px; height: ' + blockHeight + 'px;">' +
                    '<div class="ytp-panel-content" style="height: ' + blockHeight + 'px; color: white !important;">' +
                        '<div class="ytp-menu" role="menu">' +
                            '<div id="item_in_new_window_id" class="ytp-menuitem" role="menuitem" tabindex="0">' +
                                '<div class="ytp-menuitem-label">'+ C_TEXT_TOOLTIP_IN_NEW_WINDOW +'</div>' +
                            '</div>' +
                            /*'<div id="item_in_app_view_id" class="ytp-menuitem" role="menuitem" tabindex="1">' +
                                '<div class="ytp-menuitem-label">'+ C_TEXT_CHANGE_DESIGN +'</div>' +
                            '</div>' +*/
                            '<div id="item_only_sound_id" action_mod="On" class="ytp-menuitem" role="menuitem" tabindex="2">' +
                                '<div class="ytp-menuitem-label"></div>' +
                            '</div>' +
                            /*'<div id="item_no_enabled_items_id" class="ytp-menuitem" role="menuitem" tabindex="2">' +
                                '<div class="ytp-menuitem-label">Нет доступных опций:(</div>' +
                            '</div>' +*/
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        mainFrame.find('#item_in_new_window_id').click(function(){
            var videoTime = 0;
            var video = mainFrame.find('video')[0];
            video.pause();
            videoTime = Math.floor(video.currentTime);

            var recommendedVideos = [];

            $('ul.video-list li.video-list-item').each(function(){
                if(
                    $(this).hasClass('related-list-item-compact-video')
                    && !$(this).hasClass('fua-plugin-blocker-our-video')
                ) {
                    var item = {
                        video_url: $(this).find('div.thumb-wrapper > a').attr('href'),
                        img_src: $(this).find('div.thumb-wrapper > a img').attr('data-thumb'),
                        video_title: $(this).find('div.content-wrapper > a span.title').html(),
                        channel_title: $(this).find('div.content-wrapper > a span.attribution span.g-hovercard').html(),
                        channel_id: $(this).find('div.content-wrapper > a span.attribution span.g-hovercard').attr('data-ytid')
                    };
                    if (!item.img_src) item.img_src = $(this).find('div.thumb-wrapper > a img').attr('src');
                    item.img_src = item.img_src.replace(new RegExp('hqdefault.jpg', ''), 'mqdefault.jpg');
                    recommendedVideos.push(item);
                }
            });


            chrome.runtime.sendMessage({
                'title': 'openAppWindow',
                'body': {
                    'videoTime' : videoTime,
                    'recommendedVideos' : recommendedVideos
                }
            });
        });


        mainFrame.find('#item_in_app_view_id').click(function(){
            if($('#fua_blocker_app_view_on_id').length) {
                $('#fua_blocker_app_view_on_id').remove();
                chrome.runtime.sendMessage({
                    'title': 'exitFromAppView',
                    'body': {
                        videoTime : Math.floor($('video')[0].currentTime)
                    }
                });
            }
            else {
                chrome.runtime.sendMessage({
                    'title': 'enterToAppView',
                    'body': {
                        videoTime : Math.floor(mainFrame.find('video')[0].currentTime)
                    }
                });
            }
        });


        mainFrame.find('#item_only_sound_id').click(function(){
            chrome.runtime.sendMessage({
                'title': 'switch'+ $(this).attr('action_mod') +'OnlySound',
                'body': {
                    updateUrl : window.location.href +
                    '&time_continue=' +
                    Math.ceil($('video')[0].currentTime)
                }
            });
        });


        mainFrame.find('#fua_plugin_blocker_app_menu_id').click(function(){
            $(this).hide();
        });

        mainFrame[0].addEventListener("click", function(event){
            var srcElement = event.srcElement;
            var className = srcElement.className;

            if(!$(srcElement).closest('#' + openButtonId).length){
                mainFrame.find('#fua_plugin_blocker_app_menu_id').hide();
            }
        });
    }

    window.dispatchEvent(new Event("resize"));
}



function getOneVideoTags(id, callback){
    //var tags = [];

    $.ajax({
        method : 'GET',
        url : 'https://www.youtube.com/watch?v=' + id,
        contentType : 'html'
    }).done(function(response) {
        /*var html = document.createElement('html');
        html.innerHTML = response
            .replace(new RegExp('www.youtube-nocookie.com[^\'\"]*', 'g'), '')
            .replace(new RegExp('s.ytimg.com/yts/img[^\'\"]*', 'g'), '');
        html = $(html);

        html.find('head meta[property="og:video:tag"]').each(function(){
            var tag = $(this).attr('content')
                .toLowerCase().replace(new RegExp('[^ a-zа-я0-9\-ії\`\']', 'ig'), ' ')
                .replace(new RegExp('[ ]{2,}', 'g'), ' ').trim();

            if(tag.match('[a-zа-я0-9]')) {
                tags.push(tag);
            }
        });*/

        var tagsString = response.match('"keywords"[ ]*:[ ]*"([^"]+)');
        if(tagsString && tagsString[1]){
            callback(tagsString[1].split(","));
        }




    }).fail(function(info) { callback(tags); });
}



function changeVideoTime(options, timeOut){
    var video = document.getElementsByTagName('video');
    var url = window.location.href;

    var thumbnail = document.querySelector('.ytp-cued-thumbnail-overlay');

    if(
        video.length
        && video[0].getAttribute('current_src') != video[0].getAttribute('src')
        && (!thumbnail || thumbnail.style.display == 'none')
        && options.url == url
        && !url.match('([\?]|&)t=')
        && (!options.video_duration || options.video_duration == video[0].duration)
    ){
        var src = document.getElementById("fua_blocker_every_time_script_id");
        if(options.video_time && (!src || !src.getAttribute("thisVideoBlocked"))){
            if(options.video_time > 10 && $('.ytp-next-button').attr('aria-disabled') === 'false') {
                video[0].currentTime = options.video_time;
            }
        }
        video[0].setAttribute('current_src', video[0].getAttribute('src'));
    }
    else {
        if (!timeOut) timeOut = 0;
        if (timeOut < 10000) {
            timeOut += 100;
            setTimeout(function () {
                changeVideoTime(options, timeOut);
            }, 100);
        }
    }
}


var saveVideoTimeInterval = false;
function saveVideoTime(){
    //console.log('saveVideoTime');
    if(!saveVideoTimeInterval){
        saveVideoTimeInterval = setInterval(function(){
            var video = document.getElementsByTagName('video');
            var video_id = getVideoIdFromVideoUrl(window.location.href);
            if(video_id && video.length){

                var currentTime = video[0].currentTime;
                if(currentTime > 0 && !video[0].paused && !video[0].ended) {
                    var videoDuration = video[0].duration;
                    if(currentTime + 40 > videoDuration){
                        chrome.runtime.sendMessage({
                            'title': 'removeOneVideoTime',
                            'body': { video_id: video_id}
                        });
                    }
                    else {
                        chrome.runtime.sendMessage({
                            'title': 'saveVideoTime',
                            'body': {
                                video_time: currentTime,
                                video_id: video_id,
                                video_duration : videoDuration
                            }
                        });
                    }
                }
            }

        }, 1000);
    }
}



function addAppIconToVideo(settings, time){
    if (
        $('#fua-plugin-blocker-open-video-id').length < 1
        && (
            !settings
            || (
                (!settings.openNewWindow || settings.openNewWindow == 2)
                //|| (!settings.designToggle || settings.designToggle == 2)
                || (!settings.logoOnlySound || settings.logoOnlySound == 2)
            )
        )
    ) {
        addAppMenu({
            mainFrame: $('html'),
            settings : settings
        });

        $('.ytp-settings-button').before(
            '<span style="display: inline-block; text-align: center;" id="fua-plugin-blocker-open-video-id" class="ytp-button">' +
                '<img class="icon_on_video_bar" src="' + IMAGE_IN_NEW_WINDOW + '">' +
            '</span>'
        );

        $('#fua-plugin-blocker-open-video-id').click(function () {

            var thisObject = $(this);
            chrome.storage.local.get(['settings'], function (items) {
                var settings = items.settings;
                var height = 0;

                $("#item_in_new_window_id").hide();
                if (!settings || !settings.openNewWindow || settings.openNewWindow == 2){
                    $("#item_in_new_window_id").show();
                    height += 34;
                }

                $("#item_in_app_view_id").hide();
                if (!settings || !settings.designToggle || settings.designToggle == 2){
                    $("#item_in_app_view_id").show();
                    height += 34;
                }

                var onlySoundItem = $("#item_only_sound_id");
                onlySoundItem.hide();
                if(!settings || !settings.logoOnlySound || settings.logoOnlySound == 2) {
                    onlySoundItem.show();

                    var onlySoundText = FUA_BLOCKER_TRANSLATION.words_combinations.only_sound;

                    var text = FUA_BLOCKER_TRANSLATION.words_combinations.switch_on +
                        ' "'+ onlySoundText +'"';
                    var actionMod = "On";
                    if(settings && settings.onlySound && settings.onlySound == 2){
                        text = FUA_BLOCKER_TRANSLATION.words_combinations.switch_off +
                        ' "'+ onlySoundText +'"';
                        actionMod = "Off";
                    }
                    onlySoundItem.attr("action_mod", actionMod).children().first().html(text);
                    height += 34;
                }


                if(height > 34) {
                    $('#fua_plugin_blocker_app_menu_id').height(height)
                        .children().first().height(height)
                        .children().first().height(height);

                    showTooltip({
                        toolTipObject: $('#fua_plugin_blocker_app_menu_id'),
                        targetObject: thisObject,
                        marginTop: (height * (-1) - 14) + 'px',
                        toggle: true
                    });
                }
                else{
                    if (!settings.openNewWindow || settings.openNewWindow == 2) {
                        $('#item_in_new_window_id').click();
                    }
                    else if (!settings.designToggle || settings.designToggle == 2) {
                        $('#item_in_app_view_id').click();
                    }
                    else if (!settings.logoOnlySound || settings.logoOnlySound == 2) {
                        $("#item_only_sound_id").click();
                    }
                }
            });
        });
    }


    if(!time) time = 0;
    if(time < 5000){
        time = time + 300;
        setTimeout(function(){
            addAppIconToVideo(settings, time);
        }, 300);
    }
}



function addScreenShotIcon(settings, time){
    if(
        !$('#fua-screenshot-id').length
        && (!settings || !settings.screenShot || settings.screenShot == 2)
    ){
        $('.ytp-settings-button').before(
            '<span style="display: inline-block; text-align: center;" id="fua-screenshot-id" class="ytp-button">' +
                '<img class="icon_on_video_bar" src="'+ IMAGE_SCREENSHOT +'">' +
            '</span>'
        );

        $('#fua-screenshot-id').click(function(){
            var preview = $("#fua_blocker_screen_shot_preview_id");
            if(!preview.length) {
                $("body").prepend(
                    '<div id="fua_blocker_screen_shot_preview_bg_id">' +
                        '<div style="display: table-cell; width: 100vw; height: 100vh; vertical-align: middle" id="fua_blocker_screen_shot_preview_bg_cell_id">' +
                            '<div id="fua_blocker_screen_shot_preview_id"></div>' +
                        '</div>' +
                    '</div>'
                );
            }




            setTimeout(function() {
                var base64 = getScreenShot($('video')[0]);

                $("#fua_blocker_screen_shot_preview_id").html(
                    //'<span id="fua_blocker_screen_shot_preview_save_id">Сохранить</span>' +
                    '<img id="fua_blocker_screen_shot_preview_save_id" src="' + chrome.runtime.getURL("img/navigation/screenshot/download.png") + '">' +
                        '<span id="fua_blocker_screen_shot_preview_close_id">' +
                            FUA_BLOCKER_TRANSLATION.words.close +
                        '</span>' +
                    '<img src="' + base64 + '" id="fua_blocker_screen_shot_preview_img_id">'
                );

                $("#fua_blocker_screen_shot_preview_close_id").click(function () {
                    $("#fua_blocker_screen_shot_preview_bg_id").remove();
                });

                $("#fua_blocker_screen_shot_preview_bg_cell_id").click(function (e) {
                    if (e.target === this) {
                        $("#fua_blocker_screen_shot_preview_bg_id").remove();
                    }
                });

                $("#fua_blocker_screen_shot_preview_save_id").click(function () {
                    chrome.runtime.sendMessage({
                        'title': 'downloadScreenshot',
                        'body': {
                            'base64': $("#fua_blocker_screen_shot_preview_img_id").attr("src"),
                            'video_id': getVideoIdFromVideoUrl(window.location.href),
                            'time': Math.floor($('video')[0].currentTime)
                        }
                    });
                });
            }, 10);
        });
    }
    else if(settings && settings.screenShot && settings.screenShot != 2){
        $('#fua-screenshot-id').remove();
    }

    if(!time) time = 0;
    if(time < 5000){
        time = time + 300;
        setTimeout(function(){
            addScreenShotIcon(settings, time);
        }, 300);
    }
}




function addGiftIcon(settings, time){
    if(
        !$('#' + FUA_BLOCKER_GIF.id.gif_icon).length
        && (!settings || !settings.gifButton || settings.gifButton == 2)
    ){
        $('.ytp-settings-button').before(
            '<span style="display: inline-block; text-align: center;" id="'+ FUA_BLOCKER_GIF.id.gif_icon +'" class="ytp-button">' +
                '<img class="icon_on_video_bar '+ FUA_BLOCKER_GIF.class.gif_img +'" src="'+ FUA_BLOCKER_GIF.img.gif +'">' +
            '</span>'
        );

        $('#' + FUA_BLOCKER_GIF.id.gif_icon).click(function(){
            FUA_BLOCKER_GIF.setCollectInterval();
        });
    }
    else if(settings && settings.gifButton && settings.gifButton != 2){
        $('#' + FUA_BLOCKER_GIF.id.gif_icon).remove();
    }

    if(!time) time = 0;
    if(time < 5000){
        time = time + 300;
        setTimeout(function(){
            addGiftIcon(settings, time);
        }, 300);
    }
}




function blockedAnnotations(){
    chrome.storage.local.get('settings', function (items) {
        var settings = items.settings;
        var blockedAnnotations = $("#blocked_annotation_style_id");
        var blockedCards = $("#blocked_cards_style_id");
        if(!settings || !settings.bAnnotation || settings.bAnnotation != 2){
            if(blockedAnnotations.length) blockedAnnotations.remove();
            if(blockedCards.length) blockedCards.remove();
            return false;
        }

        /*if(settings && (settings.bAnnotationFrom || settings.bAnnotationTo)) {
            var video = document.getElementsByTagName('video');
            if (video.length) {
                var currentTime = video[0].currentTime;
                var duration = video[0].duration;


                var currentPr = currentTime/duration * 100;
                if(
                    (settings.bAnnotationFrom && currentPr < settings.bAnnotationFrom)
                    || (settings.bAnnotationTo && currentPr > settings.bAnnotationTo)
                ){
                    //console.log("currentPr", currentPr);
                    if(blockedAnnotations.length) blockedAnnotations.remove();
                    if(blockedCards.length) blockedCards.remove();
                    return false;
                }
            }
        }*/


        if(
            (!settings.bOnlyAnnotation || settings.bOnlyAnnotation == 2)
            || (!settings.bOnlyCards || settings.bOnlyCards == 2)
        ) {
            var video = document.getElementsByTagName('video');
            if (video.length) {
                var currentTime = video[0].currentTime;
                var duration = video[0].duration;

                var currentPr = currentTime / duration * 100;
                var leftSec = duration - currentTime;

                if (
                    (currentPr > 90 && leftSec < 30)
                    || (currentPr > 90 && duration / 10 < 30)
                ) {
                    //console.log("currentPr", currentPr);
                    if (blockedAnnotations.length) blockedAnnotations.remove();
                    if (blockedCards.length) blockedCards.remove();
                    return false;
                }
            }
        }


        //console.log("no");

        if(!settings.bOnlyAnnotation || settings.bOnlyAnnotation == 2){
            if(!blockedAnnotations.length){
                $("head").append(
                    '<style id="blocked_annotation_style_id">' +
                        '.video-annotations, .ytp-ce-element{ display : none !important; }' +
                    '</style>'
                )
            }
        }
        else if(blockedAnnotations.length) blockedAnnotations.remove();


        if(!settings.bOnlyCards || settings.bOnlyCards == 2){
            if(!blockedCards.length){
                $("head").append(
                    '<style id="blocked_cards_style_id">' +
                        '.ytp-cards-button, .iv-drawer{ display : none !important; }' +
                    '</style>'
                )
            }
        }
        else if(blockedCards.length) blockedCards.remove();
    });
}