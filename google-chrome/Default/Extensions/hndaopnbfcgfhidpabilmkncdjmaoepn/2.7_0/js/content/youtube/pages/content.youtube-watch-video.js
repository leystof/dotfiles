chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;


    /*******/
    if (
        title == 'addHtmlToYoutubeWatchVideoPage'
    ) {
        setTimeout(function() {
            //console.log('NotYet');

            var tmpVideoId =  getVideoIdFromVideoUrl(window.location.href);

            if (
                ($('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON).length < 1
                && $('#' + ID_OUR_VIDEO_TAGS_PANEL).length < 1)
                || FUA_YT_GV.video_id !== tmpVideoId
            ) {
                $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON).remove();
                $('#' + ID_OUR_VIDEO_TAGS_PANEL).remove();
                FUA_YT_GV.video_id = tmpVideoId;
                FUA_YT_GV.comments_token = false;
                FUA_YT_GV.new_comments_token = false;

                if(!$('#fua-screenshot-id').length){
                    $('.html5-video-player').find('button.ytp-settings-button').before(
                        '<span style="display: inline-block; text-align: center;" id="fua-screenshot-id" class="ytp-button">' +
                            '<img class="icon_on_video_bar" src="'+ IMAGE_SCREENSHOT +'">' +
                        '</span>'
                    );

                    $('#fua-screenshot-id').click(function(){
                        chrome.runtime.sendMessage({
                            'title': 'downloadScreenshot',
                            'body': {
                                'base64' : getScreenShot($('video')[0]),
                                'video_id' : getVideoIdFromVideoUrl(window.location.href),
                                'time' : Math.floor($('video')[0].currentTime)
                            }
                        });

                        /*var a = $("<a>")
                            .attr("href", getScreenShot($('video')[0]))
                            .attr("download", 'CleverScreenShot-' + getVideoIdFromVideoUrl(window.location.href) + '-time-' + Math.floor($('video')[0].currentTime) + '.png')
                            .appendTo("body");
                        a[0].click();
                        a.remove();*/
                    });
                }



                var targetButton, buttonLine = $('div#watch8-action-buttons');
                if(!buttonLine.length) {
                    targetButton = $('ytd-video-primary-info-renderer div#top-level-buttons ytd-toggle-button-renderer:last');
                    if(targetButton.length){
                        targetButton.after(
                            $('<div>', {style : "min-width: 100px;", class : "fua_dark_theme style-scope ytd-menu-renderer x-scope ytd-toggle-button-renderer-0 force-icon-button style-text", id : ID_OUR_SHOW_VIDEO_TAGS_BUTTON}).append(
                                $('<span>', {style : "display: inline-block; margin-right: 5px; font-weight: bold;"}).text('#')
                            ).append(
                                $('<span>', {style : "display: inline-block;", class : "yt-uix-button-content"})
                            )
                        );
                    }
                }
                else {
                    targetButton = buttonLine.find('button.action-panel-trigger-share');
                    targetButton.after(
                        '<button id="' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON + '" class="fua_dark_theme yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup action-panel-trigger yt-uix-tooltip">' +
                            '<span style="display: inline-block; margin-right: 5px; font-size: 15px; font-weight: bold;">#</span>' +
                            '<span style="display: inline-block; margin-top: -5px;" class="yt-uix-button-content"></span>' +
                        '</button>'
                    );
                }



                var watchHeader = $('div#watch-header');
                if(!watchHeader.length){
                    watchHeader = $('div#info > div#info-contents');
                }

                watchHeader.after(
                    '<div url="' + window.location.href + '" id="' + ID_OUR_VIDEO_TAGS_PANEL + '" class="yt-card yt-card-has-padding" style="margin-top: 15px;">' +

                        '<div>' +
                            '<strong style="margin-right: 10px;" class="fua_dark_theme">' +
                                C_TEXT_THIS_VIDEO_TAGS_CATEGORY_TITLE +
                            '</strong>' +
                            '<button id="' + ID_OUR_VIDEO_COPY_TAGS_BUTTON + '" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                                C_TEXT_COPY_TAGS_BUTTON +
                            '</button>' +
                            '<div id="' + ID_OUR_VIDEO_TAGS_PANEL_CLOSE + '" style="cursor: pointer; float: right; font-weight: bold;" class="fua_dark_theme">&times;</div>' +
                        '</div>' +
                        '<div id="' + ID_OUR_VIDEO_TAGS_BOX + '" style="margin-top: 10px;"></div>' +
                        '<div style="margin-top: 10px; min-height: 40px;">' +
                            '<div class="fua_dark_theme fua-plugin-youtube-video-show-text-line">' +
                                '<strong>' +
                                    C_TEXT_PLACE_IN_YOUTUBE_SEARCH +
                                '</strong>' +
                                '<span style="display: inline-block; padding: 5px 3px 5px; background-color: #E2EED8;">' +
                                    '<span style="margin: 0px; float: none;" id="' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE + '">' +
                                        C_TEXT_WORD_SHOW +
                                    '</span>' +
                                '</span>' +
                            '</div>' +

                            '<div id="'+ ID_OUR_VIDEO_YOUTUBE_PLACE_CIRCLE_LOAD +'">' +
                                '<div class="fua-circle-load-progress-pie-chart" data-percent="0">' +
                                    '<div class="fua-circle-load-ppc-progress">' +
                                        '<div class="fua-circle-load-ppc-progress-fill"></div>' +
                                    '</div>' +
                                    '<div class="fua-circle-load-ppc-percents">' +
                                        '<div class="fua-circle-load-pcc-percents-wrapper">' +
                                            '<span>%</span>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +


                            '<div class="fua_dark_theme fua-plugin-youtube-video-show-text-line" style="margin-left: 270px;">' +
                                '<strong>' +
                                    C_TEXT_RANKS_IN_YANDEX_KEYWORDS +
                                '</strong>' +
                                '<span style="display: inline-block; padding: 5px 3px 5px; background-color: #FDFBCA;">' +
                                    '<span style="margin: 0px; float: none;" id="' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD + '">' +
                                        C_TEXT_WORD_SHOW +
                                    '</span>' +
                                '</span>' +
                            '</div>' +


                            '<div id="'+ ID_OUR_YANDEX_RANKS_CIRCLE_LOAD +'">' +
                                '<div class="fua-circle-load-progress-pie-chart" data-percent="0">' +
                                    '<div class="fua-circle-load-ppc-progress">' +
                                        '<div class="fua-circle-load-ppc-progress-fill"></div>' +
                                    '</div>' +
                                    '<div class="fua-circle-load-ppc-percents">' +
                                        '<div class="fua-circle-load-pcc-percents-wrapper">' +
                                            '<span>%</span>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +


                        '</div>' +


                        '<div style="margin-top: 20px">' +
                            //'<div id="'+ FUA_YT_SOCIAL.id.facebook_shares_item +'" class="'+ FUA_YT_SOCIAL.class.social_item  +'">FB (shares) <span class="'+ FUA_YT_SOCIAL.class.social_count +'">0</span></div>' +
                            //'<div id="'+ FUA_YT_SOCIAL.id.facebook_likes_item +'" class="'+ FUA_YT_SOCIAL.class.social_item  +'">FB (likes) <span class="'+ FUA_YT_SOCIAL.class.social_count +'">0</span></div>' +
                            //'<div id="'+ FUA_YT_SOCIAL.id.facebook_comments_item +'" class="'+ FUA_YT_SOCIAL.class.social_item  +'">FB (comments) <span class="'+ FUA_YT_SOCIAL.class.social_count +'">0</span></div>' +
                            '<a id="'+ FUA_YT_SOCIAL.id.facebook_item +'" class="fua_dark_theme '+ FUA_YT_SOCIAL.class.social_item  +'" target="_blank">' +
                                    'FB ' +
                                    //'shares/likes/comments ' +
                                    '<span class="'+ FUA_YT_SOCIAL.class.social_count +'">0</span>' +
                            '</a>' +
                            '<a id="'+ FUA_YT_SOCIAL.id.vk_item +'" class="fua_dark_theme '+ FUA_YT_SOCIAL.class.social_item  +'" target="_blank">VK <span class="'+ FUA_YT_SOCIAL.class.social_count +'">0</span></a>' +
                            '<a id="'+ FUA_YT_SOCIAL.id.ok_item +'" class="fua_dark_theme '+ FUA_YT_SOCIAL.class.social_item  +'" target="_blank">OK <span class="'+ FUA_YT_SOCIAL.class.social_count +'">0</span></a>' +
                            //'<a id="'+ FUA_YT_SOCIAL.id.google_plus_item +'" class="'+ FUA_YT_SOCIAL.class.social_item  +'" target="_blank">G+ <span class="'+ FUA_YT_SOCIAL.class.social_count +'">0</span></a>' +
                            '<a id="'+ FUA_YT_SOCIAL.id.pinterest_item +'" class="fua_dark_theme '+ FUA_YT_SOCIAL.class.social_item  +'" target="_blank">Pin <span class="'+ FUA_YT_SOCIAL.class.social_count +'">0</span></a>' +
                            '<a id="'+ FUA_YT_SOCIAL.id.linkedin_item +'" class="fua_dark_theme '+ FUA_YT_SOCIAL.class.social_item  +'" target="_blank">In <span class="'+ FUA_YT_SOCIAL.class.social_count +'">0</span></a>' +
                            '<a id="'+ FUA_YT_SOCIAL.id.tumblr_item +'" class="fua_dark_theme '+ FUA_YT_SOCIAL.class.social_item  +'" target="_blank">Tumblr <span class="'+ FUA_YT_SOCIAL.class.social_count +'">0</span></a>' +

                            '<span class="fua_dark_theme '+ FUA_YT_SOCIAL.class.social_item  +'">' +
                                '<strong style="margin-right: 10px;" class="fua_dark_theme">' +
                                    'Links: ' +
                                '</strong>' +
                                '<a id="'+ FUA_YT_SOCIAL.id.google_search_links +'" target="_blank" class="fua_dark_theme">' +
                                    '<span id="'+ FUA_YT_SOCIAL.id.google_search_links_show +'">' +
                                        chrome.i18n.getMessage("word_show").toLowerCase() +
                                    '</span>' +
                                '</a>' +
                            '</span>' +


                            '<span class="'+ FUA_YT_SOCIAL.class.social_item  +'">' +
                                '<strong style="margin-right: 10px;" class="fua_dark_theme">' +
                                    'Embed srcs: ' +
                                '</strong>' +
                                '<a id="'+ FUA_YT_SOCIAL.id.google_search_embed +'" target="_blank">' +
                                    '<span id="'+ FUA_YT_SOCIAL.id.google_search_embed_show +'" class="fua_dark_theme">' +
                                        chrome.i18n.getMessage("word_show").toLowerCase() +
                                    '</span>' +
                                '</a>' +
                            '</span>' +
                        '</div>' +

                        /*'<div style="margin-top: 10px">' +
                            '<strong style="margin-right: 10px; color: #333333 !important;">' +
                                'MCN: ' +
                            '</strong>' +
                            '<span id="fua_youtube_mcn_id"></span>' +
                        '</div>' +*/

                        '<div style="margin-top: 20px">' +
                            '<strong style="margin-right: 10px;" class="fua_dark_theme">' +
                                chrome.i18n.getMessage("check_list") + ':' +
                            '</strong>' +
                            '<div id="fua_youtube_check_list_block">' +
                            '</div>' +
                        '</div>' +

                        '<div id="' + ID_OUR_TAGS_INFORM_BLOCK + '" style="margin-left: 270px; margin-top: 15px;"></div>' +
                    '</div>'
                );



                const checkListBox = $('#fua_youtube_check_list_block');


                $('#' + FUA_YT_SOCIAL.id.google_search_links_show).click(function(){
                    $(this).hide();
                    $(this).parent().append("<i>...</i>");
                    FUA_YT_SOCIAL.getGoogleSearchLinks({
                        query : getVideoIdFromVideoUrl(window.location.href),
                        successCallback : function(data){
                            $("#" + FUA_YT_SOCIAL.id.google_search_links).html(data.count);
                            if(data.url) $("#" + FUA_YT_SOCIAL.id.google_search_links).attr("href", data.url);
                        },
                        failCallback : function(data){
                            $('#' + FUA_YT_SOCIAL.id.google_search_links_show).html(chrome.i18n.getMessage("word_repeat")).show()
                                .parent().find("i").remove();
                            window.open(data.url);
                        }
                    });
                });


                $('#' + FUA_YT_SOCIAL.id.google_search_embed_show).click(function(){
                    $(this).hide();
                    $(this).parent().append("<i>...</i>");
                    FUA_YT_SOCIAL.getGoogleSearchLinks({
                        query : "embed/" + getVideoIdFromVideoUrl(window.location.href),
                        successCallback : function(data){
                            $("#" + FUA_YT_SOCIAL.id.google_search_embed).html(data.count);
                            if(data.url) $("#" + FUA_YT_SOCIAL.id.google_search_embed).attr("href", data.url);
                        },
                        failCallback : function(data){
                            $('#' + FUA_YT_SOCIAL.id.google_search_embed_show).html(chrome.i18n.getMessage("word_repeat")).show()
                                .parent().find("i").remove();
                            window.open(data.url);
                        }
                    });
                });




                FUA_YT_SOCIAL.getFacebookShares({
                    url : window.location.href,
                    successCallback : function(data){
                        /*$("#" + FUA_YT_SOCIAL.id.facebook_shares_item + " ." + FUA_YT_SOCIAL.class.social_count).html(data.shares);
                        $("#" + FUA_YT_SOCIAL.id.facebook_likes_item + " ." + FUA_YT_SOCIAL.class.social_count).html(data.likes);
                        $("#" + FUA_YT_SOCIAL.id.facebook_comments_item + " ." + FUA_YT_SOCIAL.class.social_count).html(data.comments);*/
                        $("#" + FUA_YT_SOCIAL.id.facebook_item + " ." + FUA_YT_SOCIAL.class.social_count).html(data.total);
                        $("#" + FUA_YT_SOCIAL.id.facebook_item)/*.attr("title",
                            "shares - " + data.shares +
                            ", likes - " + data.likes +
                            ", comments - " + data.comments
                        )*/.attr("href",
                            "https://www.facebook.com/search/top/?init=quick&q=" + getVideoIdFromVideoUrl(window.location.href)
                        ).css("display", "inline-block");
                    }
                });


                FUA_YT_SOCIAL.getVkShares({
                    url : window.location.href,
                    successCallback : function(count){
                        $("#" + FUA_YT_SOCIAL.id.vk_item + " ." + FUA_YT_SOCIAL.class.social_count).html(count);
                        $("#" + FUA_YT_SOCIAL.id.vk_item).attr("href",
                            "https://new.vk.com/search?c%5Bq%5D="+ getVideoIdFromVideoUrl(window.location.href) +"&c%5Bsection%5D=auto"
                        ).css("display", "inline-block");
                    }
                });


                FUA_YT_SOCIAL.getOkShares({
                    url : window.location.href,
                    successCallback : function(count){
                        $("#" + FUA_YT_SOCIAL.id.ok_item + " ." + FUA_YT_SOCIAL.class.social_count).html(count);
                        $("#" + FUA_YT_SOCIAL.id.ok_item).css("display", "inline-block");
                    }
                });


                /*FUA_YT_SOCIAL.getGooglePlusShares({
                    url : window.location.href,
                    successCallback : function(count){
                        $("#" + FUA_YT_SOCIAL.id.google_plus_item + " ." + FUA_YT_SOCIAL.class.social_count).html(count);
                        $("#" + FUA_YT_SOCIAL.id.google_plus_item).attr("href",
                            "https://plus.google.com/s/"+ getVideoIdFromVideoUrl(window.location.href) +"/top"
                        ).css("display", "inline-block");
                    }
                });*/

                FUA_YT_SOCIAL.getPinterestShares({
                    url : window.location.href,
                    successCallback : function(count){
                        $("#" + FUA_YT_SOCIAL.id.pinterest_item + " ." + FUA_YT_SOCIAL.class.social_count).html(count);
                        $("#" + FUA_YT_SOCIAL.id.pinterest_item).attr("href",
                            "https://ru.pinterest.com/search/pins/?q=" + getVideoIdFromVideoUrl(window.location.href)
                        ).css("display", "inline-block");
                    }
                });

                FUA_YT_SOCIAL.getLinkedinShares({
                    url : window.location.href,
                    successCallback : function(count){
                        $("#" + FUA_YT_SOCIAL.id.linkedin_item + " ." + FUA_YT_SOCIAL.class.social_count).html(count);
                        /*$("#" + FUA_YT_SOCIAL.id.linkedin_item).attr("href",
                            "https://www.linkedin.com/vsearch/f?type=all&keywords=" + getVideoIdFromVideoUrl(window.location.href)
                        ).css("display", "inline-block");*/
                    }
                });

                FUA_YT_SOCIAL.getTumblrShares({
                    url : window.location.href,
                    successCallback : function(count){
                        $("#" + FUA_YT_SOCIAL.id.tumblr_item + " ." + FUA_YT_SOCIAL.class.social_count).html(count);
                        /*$("#" + FUA_YT_SOCIAL.id.tumblr_item).attr("href",
                            "https://www.tumblr.com/search/" + getVideoIdFromVideoUrl(window.location.href)
                        ).css("display", "inline-block");*/
                    }
                });

                /*FUA_YT_SOCIAL.getGoogleSearchLinks({
                    query : getVideoIdFromVideoUrl(window.location.href),
                    successCallback : function(data){
                        $("#" + FUA_YT_SOCIAL.id.google_search_links).attr("href", data.url).html(data.count);
                    }
                });

                FUA_YT_SOCIAL.getGoogleSearchLinks({
                    query : "embed/" + getVideoIdFromVideoUrl(window.location.href),
                    successCallback : function(data){
                        $("#" + FUA_YT_SOCIAL.id.google_search_embed).attr("href", data.url).html(data.count);
                    }
                });*/



                updateCircleProgress(
                    $(SELECTORS_OUR_YOUTUBE_PLACE_CIRCLE_LOAD)
                );

                updateCircleProgress(
                    $(SELECTORS_OUR_YANDEX_KEYWORDS_CIRCLE_LOAD)
                );


                if (body.checkbox.showTagsPanel) {
                    $('#' + ID_OUR_VIDEO_TAGS_PANEL).show();
                    $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON)
                        .find('span.yt-uix-button-content').html(C_TEXT_HIDE_TAGS);
                }
                else{
                    $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON)
                        .addClass(CLASS_OUR_HIDE_SOMETHING);
                    $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON)
                        .find('span.yt-uix-button-content').html(C_TEXT_SHOW_TAGS);


                    $('#' + ID_OUR_VIDEO_TAGS_PANEL).hide();
                }


                FUA_YT_GV.comments_token = false;

                /*if (FUA_YT_GV.video_id) {
                    chrome.runtime.sendMessage({
                        'title': 'getOneVideoTags',
                        'body': { 'id': FUA_YT_GV.video_id}
                    });
                }*/


                $('button.action-panel-trigger-share:first').click(function(){
                    if(
                        $('#' + ID_OUR_VIDEO_TAGS_PANEL).css('display') == 'block'
                    ){
                        $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON).trigger('click');
                    }
                });

                $('ul#action-panel-overflow-menu').children('li').click(function(){
                    if(
                        $('#' + ID_OUR_VIDEO_TAGS_PANEL).css('display') == 'block'
                    ){
                        $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON).trigger('click');
                    }
                });


                $('#' + ID_OUR_VIDEO_TAGS_PANEL_CLOSE).click(function () {
                    $('#' + ID_OUR_VIDEO_TAGS_PANEL).hide();
                    $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON)
                        .addClass(CLASS_OUR_HIDE_SOMETHING);

                    $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON)
                        .find('span.yt-uix-button-content').html(C_TEXT_SHOW_TAGS);

                    chrome.runtime.sendMessage({
                        'title': 'checkboxShowTagsPanel',
                        'body': {'checked': false}
                    });
                });

                $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON).click(function () {
                    if($(this).hasClass(CLASS_OUR_HIDE_SOMETHING)) {
                        $('#' + ID_OUR_VIDEO_TAGS_PANEL).show();
                        $(this).removeClass(CLASS_OUR_HIDE_SOMETHING);

                        $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON)
                            .find('span.yt-uix-button-content').html(C_TEXT_HIDE_TAGS);

                        chrome.runtime.sendMessage({
                            'title': 'checkboxShowTagsPanel',
                            'body': {'checked': true}
                        });

                        /*if(
                            $('button.action-panel-trigger-share:first').hasClass('yt-uix-button-toggled')
                        ){
                            $('button.action-panel-trigger-share:first').trigger('click');
                        }*/

                        $('div#watch-action-panels').css('display', 'none');

                    }
                    else{
                        $('#' + ID_OUR_VIDEO_TAGS_PANEL).hide();
                        $(this).addClass(CLASS_OUR_HIDE_SOMETHING);

                        $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON)
                            .find('span.yt-uix-button-content').html(C_TEXT_SHOW_TAGS);

                        chrome.runtime.sendMessage({
                            'title': 'checkboxShowTagsPanel',
                            'body': {'checked': false}
                        });
                    }
                });

                $('#' + ID_OUR_VIDEO_COPY_TAGS_BUTTON).click(function () {
                    var selectedClass = 'fua-plugin-youtube-watch-video-tags-selected';
                    var copyString = '';
                    $(SELECTORS_YOUTUBE_WATCH_VIDEO_TAGS).each(function () {
                        if($('.' + selectedClass).length > 0){
                            if($(this).hasClass(selectedClass)){
                                if (copyString) copyString += ', ';
                                copyString += $(this).find('span:first').html();
                            }
                        }
                        else {
                            if (copyString) copyString += ', ';
                            copyString += $(this).find('span:first').html();
                        }
                    });

                    if (copyString) {
                        copyToClipboard(copyString);
                        if($(this).hasClass('fua-plugin-copied')){
                            changeCopyButtonText();
                            setTimeout(function(){
                                $('#' + ID_OUR_VIDEO_COPY_TAGS_BUTTON)
                                    .html(C_TEXT_COPIED_TAGS_BUTTON);
                            }, 300);
                        }
                        else{
                            $(this).addClass('fua-plugin-copied');
                            $('#' + ID_OUR_VIDEO_COPY_TAGS_BUTTON)
                                .html(C_TEXT_COPIED_TAGS_BUTTON);
                        }
                    }
                });


                // place in youtube search
                getYoutubePlaces({
                    tagsSelector: SELECTORS_YOUTUBE_WATCH_VIDEO_TAGS,
                    videoId: FUA_YT_GV.video_id,
                    callback : function(btnObj){
                        btnObj.parent().hide();
                        $(SELECTORS_OUR_YOUTUBE_PLACE_CIRCLE_LOAD)
                            .data('percent', 0);

                        $('#' + ID_OUR_VIDEO_YOUTUBE_PLACE_CIRCLE_LOAD).show();
                        btnObj.closest('.fua-plugin-youtube-video-show-text-line')
                            .css('margin-top', 17);
                    }
                });

                //work with yandex keywords
                getYandexVolumeForTags({
                    tagsSelector: SELECTORS_YOUTUBE_WATCH_VIDEO_TAGS,
                    callback : function(btnObj){
                        btnObj.parent().hide();
                        $(SELECTORS_OUR_YANDEX_KEYWORDS_CIRCLE_LOAD)
                            .data('percent', 0);

                        $('#' + ID_OUR_YANDEX_RANKS_CIRCLE_LOAD).show();
                        btnObj.closest('.fua-plugin-youtube-video-show-text-line')
                            .css('margin-top', 17);
                    }
                });


                //engagement rate
                if($('#fua_engagement_rate_box_id').length)
                    $('#fua_engagement_rate_box_id').remove();


                var engagementRateTarget = $("#watch7-user-header");
                if(!engagementRateTarget.length){
                    engagementRateTarget = $('div#info > div#info-contents > ytd-video-primary-info-renderer > div#container');
                }


                //console.log('engagementRateTarget', engagementRateTarget.length);

                engagementRateTarget.prepend(
                    '<div id="fua_engagement_rate_box_id" class="fua_dark_theme" style="display: table-row; float: right">' +
                        '<div style="display: table-cell; vertical-align: middle; padding-right: 20px;">' +
                            chrome.i18n.getMessage("engagement_rate") +
                        '</div>' +

                        '<div style="display: table-cell">' +
                            '<div>по охвату <span style="font-weight: bold; font-size: 12px;" id="'+ FUA_YT_ANALYTICS.id.er_by_coverage +'">...</span></div>' +
                            '<div>по базе <span style="font-weight: bold; font-size: 12px;" id="'+ FUA_YT_ANALYTICS.id.er_by_base +'">...</span></div>' +
                        '</div>' +
                    '</div>'
                );





                $.get('https://twitter.com/search?q=https://www.youtube.com/watch?v=' + FUA_YT_GV.video_id).done(res => {
                    const html = $($.parseHTML(res));
                    let c = html.find('div.js-tweet-text-container').length > 0;
                    let t = chrome.i18n.getMessage("shared_on") + ' Twitter';
                    if(!c) t = chrome.i18n.getMessage("no_shared_on") + ' Twitter';
                    addChecklistLabel(t, c);
                });


                $.get('https://www.facebook.com/v3.0/plugins/like.php?action=like&domain=www.youtube.com&href=https://www.youtube.com/watch?v=' + FUA_YT_GV.video_id).done(res => {
                    const html = $($.parseHTML(res));
                    let c = !(
                        !html.find('span#u_0_3').length
                        || !html.find('span#u_0_3').text().trim()
                            .match(new RegExp('(^|[ ]+)(Одній[ ]+|одному[ ]+|one[ ]+|[0-9]+)', 'i'))
                    );
                    let t = chrome.i18n.getMessage("shared_on") + ' Facebook';
                    if(!c) t = chrome.i18n.getMessage("no_shared_on") + ' Facebook';
                    addChecklistLabel(t, c);
                });



                $.get('https://vk.com/search?c%5Bq%5D='+ FUA_YT_GV.video_id +'&c%5Bsection%5D=auto').done(res => {
                    const html = $($.parseHTML(res));
                    let c = !(html.find('#quick_login_form').length > 0);
                    let t = chrome.i18n.getMessage("shared_on") + ' VK';
                    if(!c) t = chrome.i18n.getMessage("no_authorized_in") + ' VK';
                    else {
                        c = html.find('div.post_info').length > 0;
                        if(!c) t = chrome.i18n.getMessage("no_shared_on") + ' VK';
                    }
                    addChecklistLabel(t, c);
                });




                getImageMeta('https://i.ytimg.com/vi/'+ FUA_YT_GV.video_id +'/maxresdefault.jpg').then(img => {
                    if(img && img.naturalHeight === 90) {
                        return  getImageMeta('https://i.ytimg.com/vi/'+ FUA_YT_GV.video_id +'/sddefault.jpg');
                    }
                    return img;
                }).then(img => {
                    if(img && img.naturalHeight === 90) {
                        return  getImageMeta('https://i.ytimg.com/vi/'+ FUA_YT_GV.video_id +'/hqdefault.jpg');
                    }
                    return img;
                }).then(img => {
                    if(img){
                        let c = img.naturalHeight >= 720;
                        let t = chrome.i18n.getMessage("thumbnail_size") + ' - '+ img.naturalHeight +'px';
                        addChecklistLabel(t, c);
                    }
                });


                getVideoPageInfo(FUA_YT_GV.video_id).then(result => {
                    let checkList = [];
                    FUA_YT_GV.new_comments_token = result.ctoken;
                    //FUA_YT_GV.external_subscribers = result.subscribers;

                    //console.log('result', result);

                    $('#' + ID_OUR_VIDEO_TAGS_BOX).html(null);
                    for(let i in result.tags){
                        $('#' + ID_OUR_VIDEO_TAGS_BOX).append(
                            '<span class="fua-plugin-youtube-watch-video-tags fua-plugin-youtube-tag fua_dark_theme">' +
                                '<span>' + result.tags[i] + '</span>' +
                            '</span>'
                        );
                    }
                    selectTagsByClick();



                    let c = (result.title.length >= 20 && result.title.length <= 60);
                    let t = chrome.i18n.getMessage("word_title");
                    if(result.title.length < 20){
                        t += ' '+ chrome.i18n.getMessage("is_shorter_than") +' 20 ' +  chrome.i18n.getMessage("word_symbols");
                    }
                    else  if(result.title.length > 60){
                        t += ' '+ chrome.i18n.getMessage("is_longer_than") +' 60 ' +  chrome.i18n.getMessage("word_symbols");
                    }
                    checkList.push({t: t, c: c });


                    c = (result.description && result.description.length >= 300);
                    t = chrome.i18n.getMessage("word_description");
                    if(!result.description) t = chrome.i18n.getMessage("description_not_exists");
                    else if(result.description.length < 300){
                        t += ' '+ chrome.i18n.getMessage("is_shorter_than") +' 300 ' +  chrome.i18n.getMessage("word_symbols");
                    }
                    checkList.push({t: t, c: c });


                    c = (result.tags.length > 0 && result.tags.join('').length >= 200);
                    t = chrome.i18n.getMessage("word_tags");
                    if(!result.tags.length) t = chrome.i18n.getMessage("tags_not_exist");
                    else if(result.tags.join('').length < 200){
                        t += ' '+ chrome.i18n.getMessage("is_shorter_than") +' 200 ' +  chrome.i18n.getMessage("word_symbols");
                    }
                    checkList.push({t: t, c: c });


                    if(result.tags.length > 0) {
                        const titleTagsCount = getTagsCuntInText(result.title, result.tags);
                        const descriptionTagsCount = getTagsCuntInText(result.description, result.tags);

                        t = chrome.i18n.getMessage("tags_in_title") + ' - ' + titleTagsCount;
                        c = !!titleTagsCount;
                        checkList.push({t: t, c: c});


                        t = chrome.i18n.getMessage("tags_in_description") + ' - ' + descriptionTagsCount;
                        c = !!descriptionTagsCount;
                        checkList.push({t: t, c: c});
                    }


                    let hashTags = result.description.match(new RegExp('(^|[\\s,]+)#[0-9\\wа-я]+', 'gi'));
                    c = (hashTags && hashTags.length > 0);
                    t = chrome.i18n.getMessage("hash_tags_in_description") + ' - ' + (c ? hashTags.length : 0);
                    checkList.push({t: t, c: c });


                    c = result.public;
                    t = c ? chrome.i18n.getMessage("word_public") : chrome.i18n.getMessage("word_private");
                    checkList.push({t: t, c: c });


                    c = !!result.captions;
                    t = c ? chrome.i18n.getMessage("word_captions") : chrome.i18n.getMessage("captions_not_exist");
                    checkList.push({t: t, c: c });


                    getCards(FUA_YT_GV.video_id, result.session_token).then(cards => {
                        c = cards.length > 0;
                        t = c ? chrome.i18n.getMessage("word_cards") : chrome.i18n.getMessage("cards_not_exist");
                        addChecklistLabel(t, c);
                    });


                    getEndScreens(FUA_YT_GV.video_id, result.session_token).then(endScreens => {
                        c = (endScreens && endScreens.elements.length > 0);
                        t = c ? chrome.i18n.getMessage("word_endscreens") : chrome.i18n.getMessage("endscreens_not_exist");
                        addChecklistLabel(t, c);
                    });


                    let topComments = null;
                    let newStudioResult = null;

                    if(result.youOwner){
                        topComments = getNewStudioCommentsPageInfo(FUA_YT_GV.video_id)
                            .then(result => {
                                newStudioResult = result;


                                getNewStudioVideoPlayLists(
                                    FUA_YT_GV.video_id,
                                    newStudioResult.apiKey,
                                    newStudioResult.clientName,
                                    newStudioResult.delegatedId,
                                    newStudioResult.channelId
                                ).then(playListInfo => {
                                    c = (playListInfo.playListsCount  > 0);
                                    t = c ? chrome.i18n.getMessage("added_in_playlists") + ' - ' + playListInfo.playListsCount: chrome.i18n.getMessage("no_added_in_playlist");
                                    addChecklistLabel(t, c);
                                });


                                getNewStudioVideoInfo(
                                    FUA_YT_GV.video_id,
                                    newStudioResult.apiKey,
                                    newStudioResult.clientName,
                                    newStudioResult.delegatedId
                                ).then(videoInfo => {
                                    c = videoInfo.monetization;
                                    t = c ? chrome.i18n.getMessage("word_monetization") : chrome.i18n.getMessage("monetization_switched_off");
                                    addChecklistLabel(t, c);
                                });



                                return getNewStudioComments(
                                    FUA_YT_GV.video_id,
                                    newStudioResult.apiKey,
                                    newStudioResult.clientName,
                                    newStudioResult.delegatedId
                                );
                            });
                    }
                    else {
                        topComments = getComments(
                            result.session_token,
                            result.identityToken,
                            result.ctoken,
                            result.itct
                        );
                    }



                    checkList.reverse().map(i => {addChecklistLabel(i.t, i.c, true);});


                    topComments.then(commentsInfo => {
                        //console.log('commentsInfo', commentsInfo);

                        let likes = result.likes;
                        let dislikes = result.dislikes;
                        let views = result.views;
                        let subscribers = result.subscribers;
                        let comments = commentsInfo.count;


                        let by_coverage =
                            Math.ceil((parseInt(likes) + parseInt(dislikes) + parseInt(comments)) / parseInt(views) * 100);
                        let by_base =
                            Math.ceil((parseInt(likes) + parseInt(dislikes) + parseInt(comments)) / parseInt(subscribers) * 100);

                        $("#" + FUA_YT_ANALYTICS.id.er_by_coverage)
                            .css('color', (by_coverage >= 10 ? 'green' : 'red'))
                            .html(by_coverage + "%");
                        $("#" + FUA_YT_ANALYTICS.id.er_by_base)
                            .css('color', (by_base >= 2 ? 'green' : 'red'))
                            .html(by_base + "%");


                        let c = commentsInfo.pinned;
                        let t = chrome.i18n.getMessage("pinned_comment");
                        if(!c) t = chrome.i18n.getMessage("pinned_comment_not_exists");
                        else {
                            c = commentsInfo.owner;
                            if(!c) t = chrome.i18n.getMessage("pinned_comment_not_belongs_to_channel_owner");
                        }
                        addChecklistLabel(t, c);


                        if(commentsInfo.pinned){
                            c = commentsInfo.pinnedLink;
                            t = c ? chrome.i18n.getMessage("pinned_comment_consists_link") : chrome.i18n.getMessage("pinned_comment_not_consists_link");
                            addChecklistLabel(t, c);
                        }


                        if(commentsInfo.comments.length > 19){
                            if(commentsInfo.noOwnerComments.length) {
                                c = commentsInfo.hearts > 0;
                                t =  commentsInfo.hearts + ' ❤ ' +  chrome.i18n.getMessage("word_from") +' ' + commentsInfo.noOwnerComments.length + ' ' + chrome.i18n.getMessage("most_popular_comments");
                                addChecklistLabel(t, c);


                                if(result.youOwner) {
                                    c = commentsInfo.replyCount > 0;
                                    t = chrome.i18n.getMessage("replies_of_the_video_author_to_most_popular_comments") + " - " + commentsInfo.replyCount + " "+ chrome.i18n.getMessage("word_from") + " " + commentsInfo.noOwnerComments.length;
                                    addChecklistLabel(t, c);
                                }
                            }



                            /*let newComments = null;
                            if(result.youOwner){
                                newComments = getNewStudioComments(
                                    FUA_YT_GV.video_id,
                                    newStudioResult.apiKey,
                                    newStudioResult.clientName,
                                    newStudioResult.delegatedId,
                                    'NEWEST'
                                );
                            }
                            else {
                                newComments = getComments(
                                    result.session_token,
                                    result.identityToken,
                                    commentsInfo.sortCredentials.newest.continuation,
                                    commentsInfo.sortCredentials.newest.clickTrackingParams,
                                    true
                                );
                            }





                            newComments.then(newCommentsInfo => {
                                if(newCommentsInfo.noOwnerComments.length) {
                                    checkList.push({
                                        text: newCommentsInfo.hearts + ' ❤ ' + 'у ' + newCommentsInfo.noOwnerComments.length + ' самых новых комментариев',
                                        class: newCommentsInfo.hearts ? 'fua_youtube_correct_list_item' : 'fua_youtube_wrong_list_item',
                                    });

                                    if(result.youOwner) {
                                        checkList.push({
                                            text: "Ответов автора видео на самые новые комментарии - " + newCommentsInfo.replyCount + " из " + newCommentsInfo.noOwnerComments.length,
                                            class: newCommentsInfo.replyCount ? 'fua_youtube_correct_list_item' : 'fua_youtube_wrong_list_item',
                                        });
                                    }
                                }

                                checkList.map(item => {
                                    checkListBox.append('<spam class="'+ item.class +'">'+ item.text +'</spam>')
                                });
                            });*/
                        }
                        else {
                            if(commentsInfo.noOwnerComments.length) {
                                c = commentsInfo.hearts > 0;
                                t =  commentsInfo.hearts + ' ❤ ' +  chrome.i18n.getMessage("word_from") +' ' + commentsInfo.noOwnerComments.length + ' ' + chrome.i18n.getMessage("comments");
                                addChecklistLabel(t, c);


                                if(result.youOwner) {
                                    c = commentsInfo.replyCount > 0;
                                    t =  chrome.i18n.getMessage("replies_of_the_video_author_to_comments") + " - " + commentsInfo.replyCount + " "+ chrome.i18n.getMessage("word_from") + " " + commentsInfo.noOwnerComments.length;
                                    addChecklistLabel(t, c);
                                }
                            }
                        }


                    });
                });

                FUA_YT_ANALYTICS.commentUserSubscribers();
            }
        }, 1500);
    }
});


function addChecklistLabel(text, correct = true, prepend = false) {
    const checkListBox = $('#fua_youtube_check_list_block');
    const html = '<spam class="'+ (correct ? 'fua_youtube_correct_list_item' : 'fua_youtube_wrong_list_item') +'">'+ text +'</spam>';
    if(prepend) checkListBox.prepend(html);
    else checkListBox.append(html);
}