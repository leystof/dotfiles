var FUA_BLOCKER_ADV = (function(){

    function Adv_videos(){
        this.isGetAdvData = false;
        this.advChannelRegexp = new RegExp(
            "UCGnmDhNjjf_kVa_gCfQE6yQ" +
            "|UCWulcHbwtGVFehAMY4wnzQA" +
            "|UCbLNXBuAnG1GrMeq9MjRC_w" +
            "|UCuL3C_BndJRJg87qeGjX24g" +
            "|UCQHf1BMtcjIRhn75xXOaPPQ"
        );
    }


    
    
    Adv_videos.prototype.getAdvDataND = function (options) {
        FUA_BLOCKER_ADV.isGetAdvData = true;
        if (!options) options = {};
        if (!options.time) options.time = 0;
        data = {};
        var src = document.getElementById("fua_blocker_every_time_script_id");
        if (src) {
            data.title = $('ytd-video-primary-info-renderer h1.title').text();
            data.tags = '';
            //data.url = src.getAttribute("video_url");
            //data.channel_id = src.getAttribute("channel_id");
        }

        if (
            (data.title || data.tags)
            //&& (data.url && data.url === window.location.href)
        ) {

            chrome.runtime.sendMessage({
                'title': 'videoTitleAndTags',
                'body': data
            });

            FUA_BLOCKER_ADV.isGetAdvData = false;
        }
        else if (options.time < 5000) {
            setTimeout(function () {
                options.time += 200;
                FUA_BLOCKER_ADV.getAdvDataND(options);
            }, 200);
        }
        else{
            FUA_BLOCKER_ADV.isGetAdvData = false;
        }
    };
    



    Adv_videos.prototype.getAdvData = function(options){
        FUA_BLOCKER_ADV.isGetAdvData = true;
        if (!options) options = {};
        if (!options.time) options.time = 0;
        if($('ytd-video-primary-info-renderer').length){
            this.getAdvDataND(options);
            return false;
        }

        data = {};
        var src = document.getElementById("fua_blocker_every_time_script_id");
        if (src) {
            data.title = src.getAttribute("video_title");
            data.tags = src.getAttribute("video_tags");
            data.url = src.getAttribute("video_url");
            data.channel_id = src.getAttribute("channel_id");
        }

        if (
            (data.title || data.tags)
            && (data.url && data.url === window.location.href)
        ) {

            chrome.runtime.sendMessage({
                'title': 'videoTitleAndTags',
                'body': data
            });

            FUA_BLOCKER_ADV.isGetAdvData = false;
        }
        else if (options.time < 5000) {
            setTimeout(function () {
                options.time += 200;
                FUA_BLOCKER_ADV.getAdvData(options);
            }, 200);
        }
        else{
            FUA_BLOCKER_ADV.isGetAdvData = false;
        }

    };


    Adv_videos.prototype.addOurVideoToVideoWatchPage = function(time){
        if(!time) time = 300;
        var aVideo = FUA_BLOCKER_GV.a_video;
        var ourItem = $('.fua-plugin-blocker-our-video');

        if (
            aVideo
            && ourItem.length < 1
            && window.location.href === FUA_BLOCKER_GV.a_video_target_url
        ) {


            var channel_url = '/channel/' + aVideo.channel_id;
            if (aVideo.user) channel_url = '/user/' + aVideo.user;


            var utn = "&utm_source=uclever_chrome_search&utm_medium=addons&utm_term=video" +
                "&utm_campaign=" + getVideoIdFromVideoUrl(window.location.href);


            var duration = aVideo.duration_2 || transformVideoDuration(aVideo.duration);
            var upload_list_id = aVideo.channel_id.replace("UC", "UU");

            var videoHref = '/watch?v=' + aVideo.id + '&list=' + upload_list_id + utn;


            var ran = '';
            if (aVideo.ran) {
                if (aVideo.ran == 1) ran = '...';
                if (aVideo.ran == 2) ran = '*';
            }


            var isAdvChannelsVideo = "";


            if($('ul#watch-related').length) {
                var itemChannel = $("li.video-list-item")
                    .first().find(".g-hovercard").attr("data-ytid");
                if (itemChannel && itemChannel.match(FUA_BLOCKER_ADV.advChannelRegexp)) {
                    isAdvChannelsVideo = "display: none;";
                }


                if (!isAdvChannelsVideo) {
                    var items = $('ul#watch-related').children('li');
                    for (var i = 0; i < items.length; i++) {
                        var item = $(items[i]);
                        itemChannel = item.find(".g-hovercard").attr("data-ytid");
                        if (itemChannel && itemChannel.match(FUA_BLOCKER_ADV.advChannelRegexp)) {
                            if (item.index() > 3) item.insertBefore(items[1]);
                            isAdvChannelsVideo = "display: none;";
                            break;
                        }
                    }
                }


                $('ul#watch-related').children('li:nth-child(' + aVideo.watch_position + ')').after(
                    '<li data-vid="' + aVideo.id + '" style="' + isAdvChannelsVideo + '" class="fua-plugin-blocker-our-video video-list-item related-list-item related-list-item-compact-video"> ' +
                    '<div class="content-wrapper"> ' +
                    '<a href="' + videoHref + '" class="yt-uix-sessionlink  content-link spf-link        spf-link "  title="' + aVideo.title + '" rel="spf-prefetch"> ' +
                    '<span dir="ltr" class="title">' +
                    aVideo.title +
                    '</span> ' +
                    '<span class="accessible-description"> ' +
                    '- Продолжительность: ' + duration + ' ' +
                    '</span> ' +
                    '<span class="stat attribution">' +
                    '<span class="g-hovercard" data-ytid="' + aVideo.channel_id + '" data-name="relmfu">' +
                    aVideo.channel_title +
                    '</span>' +
                    '</span> ' +
                    '<span class="stat view-count">' +
                    //numberWithDelimiters(aVideo.views, '&nbsp') + ' просмотр' + rusViewsEnd(aVideo.views) +
                    C_TEXT_CLEVER_RECOMMENDS + ran +
                    '</span> ' +
                    '</a> ' +
                    '</div> ' +
                    '<div class="thumb-wrapper"> ' +
                    '<a href="'+ videoHref + '" class="yt-uix-sessionlink thumb-link spf-link spf-link" rel="spf-prefetch" tabindex="-1" aria-hidden="true">' +
                    '<span class="yt-uix-simple-thumb-wrap yt-uix-simple-thumb-related" tabindex="0" data-vid="' + aVideo.id + '">' +
                    '<img alt="" width="168" height="94" aria-hidden="true" style="top: 0px" src="' + aVideo.medium_img + '">' +
                    '</span>' +
                    '</a> ' +
                    '<span class="video-time">' + duration + '</span> ' +
                    '<button class="yt-uix-button yt-uix-button-size-small yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup addto-button video-actions spf-nolink hide-until-delayloaded addto-watch-later-button yt-uix-tooltip" type="button" onclick=";return false;" role="button" title="Посмотреть позже" data-video-ids="' + aVideo.id + '">' +
                    '</button> ' +
                    '<span class="thumb-menu dark-overflow-action-menu video-actions"> ' +
                    '<button class="yt-uix-button-reverse flip addto-watch-queue-menu spf-nolink hide-until-delayloaded yt-uix-button yt-uix-button-dark-overflow-action-menu yt-uix-button-size-default yt-uix-button-has-icon no-icon-markup yt-uix-button-empty" type="button" aria-expanded="false" onclick=";return false;" aria-haspopup="true">' +
                    '<span class="yt-uix-button-arrow yt-sprite"></span>' +
                    '<ul class="watch-queue-thumb-menu yt-uix-button-menu yt-uix-button-menu-dark-overflow-action-menu hid">' +
                    '<li role="menuitem" class="overflow-menu-choice addto-watch-queue-menu-choice addto-watch-queue-play-next yt-uix-button-menu-item" data-action="play-next" onclick=";return false;" data-video-ids="' + aVideo.id + '">' +
                    '<span class="addto-watch-queue-menu-text">' +
                    'Следующее' +
                    '</span>' +
                    '</li>' +
                    '<li role="menuitem" class="overflow-menu-choice addto-watch-queue-menu-choice addto-watch-queue-play-now yt-uix-button-menu-item" data-action="play-now" onclick=";return false;" data-video-ids="' + aVideo.id + '">' +
                    '<span class="addto-watch-queue-menu-text">' +
                    'Воспроизвести' +
                    '</span>' +
                    '</li>' +
                    '</ul>' +
                    '</button> ' +
                    '</span> ' +
                    '<button class="yt-uix-button yt-uix-button-size-small yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup addto-button addto-queue-button video-actions spf-nolink hide-until-delayloaded addto-tv-queue-button yt-uix-tooltip" type="button" onclick=";return false;" title="Очередь" data-video-ids="' + aVideo.id + '" data-style="tv-queue">' +
                    '</button>' +
                    '</div> ' +
                    '</li>'
                );
            }
            else if($('ytd-watch-next-secondary-results-renderer').length){
                //console.log('ytd-watch-next-secondary-results-renderer');

                var display = 'flex';
                if(getVideoIdFromVideoUrl(window.location.href) == aVideo.id ){
                    display = 'none';
                }


                $('ytd-watch-next-secondary-results-renderer > div#items').children('.ytd-watch-next-secondary-results-renderer:nth-child(' + aVideo.watch_position + ')').after(
                    '<div data-vid="' + aVideo.id + '" style="padding-bottom: 8px; position: relative; display: '+ display +'; -ms-flex-direction: row; -webkit-flex-direction: row; flex-direction: row;" class="fua-plugin-blocker-our-video style-scope ytd-watch-next-secondary-results-renderer"> ' +
                        '<div id="dismissable" class="style-scope ytd-compact-video-renderer"> ' +
                            '<div style="margin-right: 8px; height: 94px;" class="style-scope ytd-compact-video-renderer fua_app_icon_box"> ' +
                                '<a style="width: 167px; margin: 0px;"  id="thumbnail" class="yt-simple-endpoint inline-block style-scope ytd-thumbnail" tabindex="-1" href="'+ videoHref +'"> ' +
                                    '<div style="display: block; position: absolute; transform: translateY(-50%); top: 47%; left: 0; width: 167px;" class="style-scope ytd-thumbnail no-transition" loaded="" style="background-color: transparent;">' +
                                        '<img id="img" class="style-scope yt-img-shadow" width="168" src="' + aVideo.medium_img + '">' +
                                    '</div> ' +
                                    /*'<div id="mouseover-overlay" class="style-scope ytd-thumbnail">' +
                                        '<ytd-moving-thumbnail-renderer class="style-scope ytd-thumbnail"> ' +
                                            '<img id="thumbnail" class="style-scope ytd-moving-thumbnail-renderer" src=""> ' +
                                            '<yt-icon id="play" icon="play_all" class="style-scope ytd-moving-thumbnail-renderer">' +
                                                '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">' +
                                                    '<g class="style-scope yt-icon"> ' +
                                                        '<path d="M8 5v14l11-7z" class="style-scope yt-icon"></path> ' +
                                                    '</g>' +
                                                '</svg>' +
                                            '</yt-icon> ' +
                                        '</ytd-moving-thumbnail-renderer>' +
                                    '</div> ' +*/
                                    '<div id="overlays" class="style-scope ytd-thumbnail">' +
                                        /*'<ytd-thumbnail-overlay-resume-playback-renderer class="style-scope ytd-thumbnail">' +
                                            '<div id="progress" class="style-scope ytd-thumbnail-overlay-resume-playback-renderer" style="width: 100%;"></div>' +
                                        '</ytd-thumbnail-overlay-resume-playback-renderer>' +*/
                                        '<span style="background-color: hsl(0, 0%, 6.7%); display: inline-block;position: absolute;bottom: 7px;right: 0;margin: 4px;color: hsl(0, 0%, 100%);background-color: hsl(0, 0%, 6.7%);opacity: .8;padding: 2px 4px;border-radius: 2px;letter-spacing: .5px;font-size: 1.2rem;font-weight: 500;line-height: 1.2rem;display: flex;-ms-flex-direction: row;-webkit-flex-direction: row;flex-direction: row;-ms-flex-align: center;-webkit-align-items: center;align-items: center;display: inline-flex;" class="style-scope ytd-thumbnail" overlay-style="DEFAULT">' +
                                            '<span class="style-scope ytd-thumbnail-overlay-time-status-renderer">' +
                                                duration +
                                            '</span>' +
                                        '</span>' +
                                        /*'<ytd-thumbnail-overlay-toggle-button-renderer role="button" tabindex="0" class="style-scope ytd-thumbnail" aria-label="Добавить в плейлист &quot;Посмотреть позже&quot;">' +
                                            '<yt-icon class="style-scope ytd-thumbnail-overlay-toggle-button-renderer">' +
                                                '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">' +
                                                    '<g class="style-scope yt-icon"> ' +
                                                        '<path d="M12 3.67c-4.58 0-8.33 3.75-8.33 8.33s3.75 8.33 8.33 8.33 8.33-3.75 8.33-8.33S16.58 3.67 12 3.67zm3.5 11.83l-4.33-2.67v-5h1.25v4.34l3.75 2.25-.67 1.08z" class="style-scope yt-icon"></path> ' +
                                                    '</g>' +
                                                '</svg>' +
                                            '</yt-icon>' +
                                            '<paper-tooltip id="tooltip" class="style-scope ytd-thumbnail-overlay-toggle-button-renderer" role="tooltip" tabindex="-1"> ' +
                                                '<div id="tooltip" class="hidden style-scope paper-tooltip">' +
                                                    'Добавить в плейлист "Посмотреть позже" ' +
                                                '</div> ' +
                                            '</paper-tooltip>' +
                                        '</ytd-thumbnail-overlay-toggle-button-renderer>' +*/
                                    '</div> ' +
                                '</a> ' +
                            '</div> ' +
                            '<a class="yt-simple-endpoint fade-in-include style-scope ytd-compact-video-renderer" href="'+ videoHref +'"> ' +
                                '<h3 class="style-scope ytd-compact-video-renderer"> ' +
                                    '<ytd-badge-supported-renderer class="style-scope ytd-compact-video-renderer" disable-upgrade="" hidden=""> ' +
                                    '</ytd-badge-supported-renderer> ' +
                                    '<span id="video-title" class="style-scope ytd-compact-video-renderer" aria-label="'+ aVideo.title +'" title="'+ aVideo.title +'">' +
                                        aVideo.title +
                                    '</span> ' +
                                '</h3> ' +
                                '<div class="compact style-scope ytd-compact-video-renderer" no-endpoints=""> ' +
                                    '<div id="metadata" class="style-scope ytd-video-meta-block" > ' +
                                        '<div id="byline-container" class="style-scope ytd-video-meta-block" style="max-height: 200px;"> ' +
                                            '<div id="byline-inner-container" class="style-scope ytd-video-meta-block"> ' +
                                                '<div id="byline" ellipsis-truncate="" class="style-scope ytd-video-meta-block">' +
                                                    aVideo.channel_title +
                                                '</div> ' +
                                            /*'<ytd-badge-supported-renderer class="style-scope ytd-video-meta-block"> ' +
                                                '<div class="badge badge-style-type-verified style-scope ytd-badge-supported-renderer"> ' +
                                                    '<yt-icon class="style-scope ytd-badge-supported-renderer">' +
                                                        '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">' +
                                                            '<g class="style-scope yt-icon"> ' +
                                                                '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M9.92,13.82" class="style-scope yt-icon"></path> ' +
                                                                '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M7.02,10.93" class="style-scope yt-icon"></path> ' +
                                                                '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M4.97,12.98" class="style-scope yt-icon"></path> ' +
                                                                '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M9.92,17.93" class="style-scope yt-icon"></path> ' +
                                                                '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M19.32,8.53" class="style-scope yt-icon"></path> ' +
                                                                '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M17.27,6.47" class="style-scope yt-icon"></path> ' +
                                                                '<g class="style-scope yt-icon"> ' +
                                                                    '<rect x="9.92" y="13.82" fill-rule="evenodd" clip-rule="evenodd" width="0" height="0" class="style-scope yt-icon"></rect> ' +
                                                                    '<path fill-rule="evenodd" clip-rule="evenodd" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10 S17.52,2,12,2z M9.92,17.93l-4.95-4.95l2.05-2.05l2.9,2.9l7.35-7.35l2.05,2.05L9.92,17.93z" class="style-scope yt-icon"></path> ' +
                                                                '</g> ' +
                                                                '<rect fill-rule="evenodd" clip-rule="evenodd" fill="none" width="24" height="24" class="style-scope yt-icon"></rect> ' +
                                                            '</g>' +
                                                        '</svg>' +
                                                    '</yt-icon> ' +
                                                    '<span class="style-scope ytd-badge-supported-renderer"></span> ' +
                                                    '<paper-tooltip role="tooltip" tabindex="-1" class="style-scope ytd-badge-supported-renderer"> ' +
                                                        '<div id="tooltip" class="hidden style-scope paper-tooltip">' +
                                                            'Подтверждено ' +
                                                        '</div> ' +
                                                    '</paper-tooltip>' +
                                                '</div> ' +
                                                '<template is="dom-repeat" id="repeat" as="badge" class="style-scope ytd-badge-supported-renderer"></template> ' +
                                            '</ytd-badge-supported-renderer> ' +*/
                                        '</div> ' +
                                        '<div id="separator" class="style-scope ytd-video-meta-block">•</div> ' +
                                    '</div> ' +
                                    '<div id="metadata-line" class="style-scope ytd-video-meta-block"> ' +
                                        '<span class="style-scope ytd-video-meta-block">' +
                                            C_TEXT_CLEVER_RECOMMENDS + ran  +
                                        '</span>' +
                                        '<template is="dom-repeat" strip-whitespace="" class="style-scope ytd-video-meta-block"></template> ' +
                                    '</div> ' +
                                '</div> ' +
                                '<div id="additional-metadata-line" class="style-scope ytd-video-meta-block"> ' +
                                    '<template is="dom-repeat" strip-whitespace="" class="style-scope ytd-video-meta-block"></template> ' +
                                '</div> ' +
                            '</div> ' +
                            /*'<ytd-standalone-badge-supported-renderer class="style-scope ytd-compact-video-renderer" disable-upgrade="" hidden=""> ' +
                            '</ytd-standalone-badge-supported-renderer> ' +
                            '<ytd-badge-supported-renderer class="style-scope ytd-compact-video-renderer" disable-upgrade="" hidden=""> ' +
                            '</ytd-badge-supported-renderer> ' +*/
                        '</a> ' +
                        /*'<div id="menu" class="style-scope ytd-compact-video-renderer">' +
                            '<ytd-menu-renderer class="style-scope ytd-compact-video-renderer"> ' +
                                '<div id="top-level-buttons" class="style-scope ytd-menu-renderer"></div> ' +
                                    '<button is="paper-icon-button-light" id="button" class="dropdown-trigger style-scope ytd-menu-renderer" aria-label="Меню &quot;Действия&quot;"> ' +
                                        '<yt-icon class="style-scope ytd-menu-renderer">' +
                                            '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">' +
                                                '<g class="style-scope yt-icon"> ' +
                                                    '<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" class="style-scope yt-icon"></path> ' +
                                                '</g>' +
                                            '</svg>' +
                                        '</yt-icon> ' +
                                    '</button> ' +
                                '</ytd-menu-renderer>' +
                            '</div> ' +
                        '</div> ' +*/
                        //'<div id="dismissed" tabindex="0" class="style-scope ytd-compact-video-renderer"></div> ' +
                    '</div>'
                );
            }

        }
        else if(aVideo && ourItem.length){
            var attrId = ourItem.attr("data-vid");


            /*if(!attrId){
                attrId = $('a.yt-uix-sessionlink').attr('href');
                if(attrId) attrId = getVideoIdFromVideoUrl(attrId)

            }*/

            if(
                aVideo.id != attrId
                || (ourItem.index() > 7 && ourItem.parent().children().length > 10)
            ) ourItem.remove();
        }



        if(time < 5000) {
            setTimeout(function () {
                FUA_BLOCKER_ADV.addOurVideoToVideoWatchPage(time + 300)
            }, time);
        }
    };




    Adv_videos.prototype.addOurVideoToFrontPage = function(time){
        if(!time) time = 300;
        var aVideo = FUA_BLOCKER_GV.a_video;
        if (aVideo &&  $('.fua-plugin-blocker-our-video-front').length < 1) {

            var userName = FUA_VALUES.channelNames[aVideo.channel_id];
            var channel_url = '/channel/'+ aVideo.channel_id;
            if(userName) channel_url = '/user/'+ userName;


            var duration = aVideo.duration_2 || transformVideoDuration(aVideo.duration);
            var upload_list_id = aVideo.channel_id.replace("UC", "UU");



            var utn = "&utm_source=uclever_chrome_search&utm_medium=addons&utm_term=home&utm_campaign=all";
            var videoHref = '/watch?v=' + aVideo.id + '&list=' + upload_list_id + utn;

            var shelves = $('div.individual-feed ol.section-list').children('li');
            if(shelves.length) {
                shelves.each(function () {
                    if (
                        $(this).find('span.branded-page-module-title-text').html() == 'Рекомендованные'
                    ) {
                        var count = 0;
                        var duplication = false;
                        $(this).children('ol').find('ul.yt-uix-expander-body').children('li').each(function () {

                            if (
                                count < 11
                                && $(this).find("div").first().attr("data-context-item-id") === aVideo.id
                            ) {
                                duplication = true;
                            }
                            count++;
                        });


                        if (!duplication) {
                            $(this).children('ol').find('ul.yt-uix-expander-body').children('li:nth-child(' + randomString(1, '123') + ')').after(
                                '<li class="yt-shelf-grid-item fua-plugin-blocker-our-video-front">' +
                                '<div class="yt-lockup yt-lockup-grid yt-lockup-video clearfix" data-context-item-id="' + aVideo.id + '">' +
                                '<div class="yt-lockup-dismissable">' +
                                '<div class="yt-lockup-thumbnail contains-addto">' +
                                '<a aria-hidden="true" href="' + videoHref + '" class="yt-uix-sessionlink        spf-link ">' +
                                '<div class="yt-thumb video-thumb">' +
                                '<span class="yt-thumb-simple">  ' +
                                '<img width="196" alt="" src="' + aVideo.medium_img + '" height="110"> ' +
                                '</span>' +
                                '</div>' +
                                '<span class="video-time" aria-hidden="true">' +
                                duration +
                                '</span>' +
                                '</a>  ' +
                                '<span class="thumb-menu dark-overflow-action-menu video-actions"> ' +
                                '<button onclick=";return false;" class="yt-uix-button-reverse flip addto-watch-queue-menu spf-nolink hide-until-delayloaded yt-uix-button yt-uix-button-dark-overflow-action-menu yt-uix-button-size-default yt-uix-button-has-icon no-icon-markup yt-uix-button-empty" aria-haspopup="true" aria-expanded="false" type="button">' +
                                '<span class="yt-uix-button-arrow yt-sprite"></span>' +
                                '<ul class="watch-queue-thumb-menu yt-uix-button-menu yt-uix-button-menu-dark-overflow-action-menu hid">' +
                                '<li role="menuitem" class="overflow-menu-choice addto-watch-queue-menu-choice addto-watch-queue-play-next yt-uix-button-menu-item" data-action="play-next" onclick=";return false;" data-video-ids="' + aVideo.id + '">' +
                                '<span class="addto-watch-queue-menu-text">' +
                                'Следующее' +
                                '</span>' +
                                '</li>' +
                                '<li role="menuitem" class="overflow-menu-choice addto-watch-queue-menu-choice addto-watch-queue-play-now yt-uix-button-menu-item" data-action="play-now" onclick=";return false;" data-video-ids="' + aVideo.id + '">' +
                                '<span class="addto-watch-queue-menu-text">' +
                                'Воспроизвести' +
                                '</span>' +
                                '</li>' +
                                '</ul>' +
                                '</button> ' +
                                '</span> ' +
                                '<button class="yt-uix-button yt-uix-button-size-small yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup addto-button video-actions spf-nolink hide-until-delayloaded addto-watch-later-button-sign-in yt-uix-tooltip" type="button" onclick=";return false;" title="Посмотреть позже" role="button" data-video-ids="' + aVideo.id + '" data-button-menu-id="shared-addto-watch-later-login">' +
                                '<span class="yt-uix-button-arrow yt-sprite"></span>' +
                                '</button> ' +
                                '<button class="yt-uix-button yt-uix-button-size-small yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon no-icon-markup addto-button addto-queue-button video-actions spf-nolink hide-until-delayloaded addto-tv-queue-button yt-uix-tooltip" type="button" onclick=";return false;" title="Очередь" data-video-ids="' + aVideo.id + '" data-style="tv-queue">' +
                                '</button> ' +
                                '</div>' +
                                '<div class="yt-lockup-content">' +
                                '<h3 class="yt-lockup-title ">' +
                                '<a href="' + videoHref + '" class="yt-uix-sessionlink  yt-ui-ellipsis yt-ui-ellipsis-2       spf-link " title="' + aVideo.title + '" dir="ltr">' +
                                aVideo.title +
                                '</a>' +
                                //'<span class="accessible-description" id="description-id-679752"> - Продолжительность: 5:47</span>' +
                                '</h3>' +
                                '<div class="yt-lockup-byline">' +
                                '<a href="' + channel_url + '" class="yt-uix-sessionlink g-hovercard      spf-link " data-ytid="' + aVideo.channel_id + '">' +
                                aVideo.channel_title +
                                '</a>' +
                                '&nbsp;' +
                                //'<span title="Подтверждено" class="yt-uix-tooltip yt-channel-title-icon-verified yt-sprite" data-tooltip-text="Подтверждено" aria-labelledby="yt-uix-tooltip222-arialabel">' +
                                '<span title="Подтверждено" class="yt-uix-tooltip yt-channel-title-icon-verified yt-sprite" data-tooltip-text="Подтверждено">' +
                                '</span>' +
                                '</div>' +
                                '<div class="yt-lockup-meta">' +
                                '<ul class="yt-lockup-meta-info">' +
                                //'<li>'+  numberWithDelimiters(aVideo.views, '&nbsp') + ' просмотр' + rusViewsEnd(aVideo.views) +'</li>' +
                                //'<li>'+ timeAgo(aVideo.published_date) +'</li>' +
                                C_TEXT_CLEVER_RECOMMENDS +
                                '</ul>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</li>'
                            );
                        }
                    }
                });
            }

            shelves = $('ytd-section-list-renderer div.ytd-section-list-renderer ytd-item-section-renderer');
            //console.log('shelves', shelves.length);
            if(shelves.length){
                shelves.each(function () {
                    if (
                        $(this).find('ytd-shelf-renderer div.grid-subheader div#title-container span#title').html() == 'Рекомендованные'
                    ) {
                        //console.log('Рекомендованные');
                        var count = 0;
                        var duplication = false;
                        $(this).find('ytd-grid-video-renderer').each(function () {
                            if (
                                count < 11
                                && $(this).find("a#video-title").attr("href") === '/watch?v=' + aVideo.id
                            ) {
                                duplication = true;
                            }
                            count++;
                        });

                        if(!duplication){
                            $(this).find('div#items').children('ytd-grid-video-renderer:nth-child(' + randomString(1, '123') + ')').after(
                                '<div class="style-scope ytd-grid-renderer fua-plugin-blocker-our-video-front" style="margin-right: 4px; display: inline-block; width: 210px; margin-bottom: 24px;">' +
                                '<div id="dismissable" class="style-scope ytd-grid-video-renderer">' +
                                '<div class="style-scope ytd-grid-video-renderer" style="height: var(--ytd-thumbnail-height);width: 210px;display: inline-block;position: relative;-ms-flex: none;-webkit-flex: none;flex: none;"> ' +
                                '<a id="thumbnail" class="yt-simple-endpoint inline-block style-scope ytd-thumbnail" tabindex="-1" href="'+ videoHref +'"> ' +
                                '<div class="style-scope ytd-thumbnail no-transition" style="background-color: transparent;" loaded="">' +
                                '<img id="img" class="style-scope yt-img-shadow" width="210" src="'+ aVideo.medium_img +'">' +
                                '</div> ' +
                                '<div id="mouseover-overlay" class="style-scope ytd-thumbnail"></div> ' +
                                '<div id="overlays" class="style-scope ytd-thumbnail">' +
                                '<span class="style-scope ytd-thumbnail" overlay-style="DEFAULT" style="background-color: hsl(0, 0%, 6.7%);     display: inline-block;position: absolute;bottom: 0;right: 0;margin: 4px;color: hsl(0, 0%, 100%);background-color: hsl(0, 0%, 6.7%);opacity: .8;padding: 2px 4px;border-radius: 2px;letter-spacing: .5px;font-size: 1.2rem;font-weight: 500;line-height: 1.2rem;display: flex; -ms-flex-direction: row; -webkit-flex-direction: row;flex-direction: row; -ms-flex-align: center; -webkit-align-items: center;align-items: center;display: inline-flex;">' +
                                '<span class="style-scope ytd-thumbnail-overlay-time-status-renderer">' +
                                duration +
                                '</span>' +
                                '</span>' +
                                /*'<ytd-thumbnail-overlay-toggle-button-renderer role="button" tabindex="0" class="style-scope ytd-thumbnail" aria-label="Добавить в плейлист &quot;Посмотреть позже&quot;">' +
                                 '<yt-icon class="style-scope ytd-thumbnail-overlay-toggle-button-renderer">' +
                                 '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">' +
                                 '<g class="style-scope yt-icon"> ' +
                                 '<path d="M12 3.67c-4.58 0-8.33 3.75-8.33 8.33s3.75 8.33 8.33 8.33 8.33-3.75 8.33-8.33S16.58 3.67 12 3.67zm3.5 11.83l-4.33-2.67v-5h1.25v4.34l3.75 2.25-.67 1.08z" class="style-scope yt-icon"></path> ' +
                                 '</g>' +
                                 '</svg>' +
                                 '</yt-icon>' +
                                 '<paper-tooltip id="tooltip" class="style-scope ytd-thumbnail-overlay-toggle-button-renderer" role="tooltip" tabindex="-1"> ' +
                                 '<div id="tooltip" class="hidden style-scope paper-tooltip">' +
                                 'Добавить в плейлист "Посмотреть позже" ' +
                                 '</div> ' +
                                 '</paper-tooltip>' +
                                 '</ytd-thumbnail-overlay-toggle-button-renderer>' +*/
                                '</div> ' +
                                '</a> ' +
                                '</div>' +
                                '<div id="details" class="style-scope ytd-grid-video-renderer">' +
                                '<div id="meta" class="style-scope ytd-grid-video-renderer">' +
                                '<h3 class="style-scope ytd-grid-video-renderer">' +
                                '<ytd-badge-supported-renderer class="style-scope ytd-grid-video-renderer" disable-upgrade="" hidden="">' +
                                '</ytd-badge-supported-renderer>' +
                                '<a id="video-title" class="yt-simple-endpoint style-scope ytd-grid-video-renderer" aria-label="'+ aVideo.title +'" href="'+ videoHref +'" title="'+ aVideo.title +'">' +
                                aVideo.title +
                                '</a>' +
                                '</h3>' +
                                '<div id="metadata-container" class="grid style-scope ytd-grid-video-renderer" meta-block="">' +
                                '<div id="metadata" class="style-scope ytd-grid-video-renderer">' +
                                '<div id="byline-container" class="style-scope ytd-grid-video-renderer">' +
                                '<div id="byline" ellipsis-truncate="" class="style-scope ytd-grid-video-renderer complex-string">' +
                                '<a class="yt-simple-endpoint style-scope yt-formatted-string" href="'+channel_url+'">' +
                                aVideo.channel_title +
                                '</a>' +
                                '</div>' +
                                /*'<ytd-badge-supported-renderer class="style-scope ytd-grid-video-renderer"> ' +
                                 '<div class="badge badge-style-type-verified style-scope ytd-badge-supported-renderer"> ' +
                                 '<yt-icon class="style-scope ytd-badge-supported-renderer">' +
                                 '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">' +
                                 '<g class="style-scope yt-icon"> ' +
                                 '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M9.92,13.82" class="style-scope yt-icon"></path> ' +
                                 '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M7.02,10.93" class="style-scope yt-icon"></path> ' +
                                 '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M4.97,12.98" class="style-scope yt-icon"></path> ' +
                                 '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M9.92,17.93" class="style-scope yt-icon"></path> ' +
                                 '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M19.32,8.53" class="style-scope yt-icon"></path> ' +
                                 '<path fill-rule="evenodd" clip-rule="evenodd" fill="#FFFFFF" d="M17.27,6.47" class="style-scope yt-icon"></path> ' +
                                 '<g class="style-scope yt-icon"> ' +
                                 '<rect x="9.92" y="13.82" fill-rule="evenodd" clip-rule="evenodd" width="0" height="0" class="style-scope yt-icon"></rect> ' +
                                 '<path fill-rule="evenodd" clip-rule="evenodd" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10 S17.52,2,12,2z M9.92,17.93l-4.95-4.95l2.05-2.05l2.9,2.9l7.35-7.35l2.05,2.05L9.92,17.93z" class="style-scope yt-icon"></path> ' +
                                 '</g> ' +
                                 '<rect fill-rule="evenodd" clip-rule="evenodd" fill="none" width="24" height="24" class="style-scope yt-icon"></rect> ' +
                                 '</g>' +
                                 '</svg>' +
                                 '</yt-icon> ' +
                                 '<span class="style-scope ytd-badge-supported-renderer"></span> ' +
                                 '<paper-tooltip role="tooltip" tabindex="-1" class="style-scope ytd-badge-supported-renderer"> ' +
                                 '<div id="tooltip" class="hidden style-scope paper-tooltip">' +
                                 'Подтверждено ' +
                                 '</div> ' +
                                 '</paper-tooltip>' +
                                 '</div> ' +
                                 '<template is="dom-repeat" id="repeat" as="badge" class="style-scope ytd-badge-supported-renderer"></template> ' +
                                 '</ytd-badge-supported-renderer>' +*/
                                '</div>' +
                                '<div id="metadata-line" class="style-scope ytd-grid-video-renderer">' +
                                '<span class="style-scope ytd-grid-video-renderer">' +
                                C_TEXT_CLEVER_RECOMMENDS +
                                '</span>' +
                                '<span class="style-scope ytd-grid-video-renderer">' +
                                aVideo.time_ago +
                                '</span>' +
                                '<template is="dom-repeat" strip-whitespace="" class="style-scope ytd-grid-video-renderer"></template>' +
                                '</div>' +
                                '</div>' +
                                '<div id="additional-metadata-line" class="style-scope ytd-grid-video-renderer">' +
                                '<template is="dom-repeat" strip-whitespace="" class="style-scope ytd-grid-video-renderer"></template>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<ytd-standalone-badge-supported-renderer class="style-scope ytd-grid-video-renderer" disable-upgrade="" hidden=""></ytd-standalone-badge-supported-renderer>' +
                                '<ytd-badge-supported-renderer class="style-scope ytd-grid-video-renderer" disable-upgrade="" hidden=""></ytd-badge-supported-renderer>' +
                                /*'<div id="menu" class="style-scope ytd-grid-video-renderer">' +
                                 '<ytd-menu-renderer class="style-scope ytd-grid-video-renderer"> ' +
                                 '<div id="top-level-buttons" class="style-scope ytd-menu-renderer"></div> ' +
                                 '<button is="paper-icon-button-light" id="button" class="dropdown-trigger style-scope ytd-menu-renderer" aria-label="Меню &quot;Действия&quot;"> ' +
                                 '<yt-icon class="style-scope ytd-menu-renderer">' +
                                 '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">' +
                                 '<g class="style-scope yt-icon"> ' +
                                 '<path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" class="style-scope yt-icon"></path> ' +
                                 '</g>' +
                                 '</svg>' +
                                 '</yt-icon> ' +
                                 '</button> ' +
                                 '</ytd-menu-renderer>' +
                                 '</div>' +*/
                                '</div>' +
                                '<div id="buttons" class="style-scope ytd-grid-video-renderer"></div>' +
                                '</div>' +
                                /*'<div id="dismissed" tabindex="0" class="style-scope ytd-grid-video-renderer">' +
                                 '<div id="dismissed-content" class="style-scope ytd-grid-video-renderer"></div>' +
                                 '</div>' +*/
                                '</div>'
                            );
                        }
                    }
                });
            }
        }
        if(time < 2100) {
            setTimeout(function () {
                FUA_BLOCKER_ADV.addOurVideoToFrontPage(time + 300);
            }, time);
        }
    };
    
    

    return new Adv_videos();
})();