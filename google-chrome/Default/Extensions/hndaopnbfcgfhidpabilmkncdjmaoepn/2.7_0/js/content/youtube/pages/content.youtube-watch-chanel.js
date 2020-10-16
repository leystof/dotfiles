chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;


    /*******/
    if (
        title == 'addHtmlToYoutubeWatchChanelPage'
    ) {
        setTimeout(function() {
            console.log('addHtmlToYoutubeWatchChanelPage');

            if (
                ($('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON).length < 1
                && $('#' + ID_OUR_VIDEO_TAGS_PANEL).length < 1)
                || $('#' + ID_OUR_VIDEO_TAGS_PANEL).attr("url") != window.location.href
            ) {
                $('#' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON).remove();
                $('#' + ID_OUR_VIDEO_TAGS_PANEL).remove();

                var buttonLine = $('ul#channel-navigation-menu');
                if(buttonLine.length) {
                    buttonLine.find('li:nth-last-child(2)').after(
                        '<li>' +
                            '<button id="' + ID_OUR_SHOW_VIDEO_TAGS_BUTTON + '" class="yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup action-panel-trigger yt-uix-tooltip">' +
                                '<span style="display: inline-block; margin-right: 5px; font-size: 15px; font-weight: bold;">#</span>' +
                                '<span style="display: inline-block; margin-top: -5px;" class="yt-uix-button-content"></span>' +
                            '</button>' +
                        '</li>'
                    );
                }
                else{
                    $('yt-formatted-string#subscriber-count').after(
                        $('<div>', {id : ID_OUR_SHOW_VIDEO_TAGS_BUTTON, class : "yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup action-panel-trigger yt-uix-tooltip"}).append(
                            $('<span>', {style : "display: inline-block; margin-right: 5px; font-size: 15px; font-weight: bold;"}).text('#')
                        ).append(
                            $('<span>', {style : "display: inline-block; margin-top: -5px; font-size: 15px;", class : "yt-uix-button-content"})
                        )
                    )
                }

                
                var tagsPanelHtmlString =
                    '<div url="' + window.location.href + '" id="' + ID_OUR_VIDEO_TAGS_PANEL + '" class="yt-card yt-card-has-padding">' +
                        '<div>' +
                            '<strong style="margin-right: 10px;">' +
                                C_TEXT_THIS_CHANNEL_TAGS_CATEGORY_TITLE +
                            '</strong>' +
                            '<button id="' + ID_OUR_VIDEO_COPY_TAGS_BUTTON + '" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                                C_TEXT_COPY_TAGS_BUTTON +
                            '</button>' +
                            '<div id="' + ID_OUR_VIDEO_TAGS_PANEL_CLOSE + '" style="cursor: pointer; float: right; font-weight: bold;">&times;</div>' +
                        '</div>' +
                        '<div id="' + ID_OUR_VIDEO_TAGS_BOX + '" style="margin-top: 10px;"></div>' +
                        '<div style="margin-top: 10px; min-height: 40px;">' +
                            '<div class="fua-plugin-youtube-video-show-text-line" style="margin-left: 0px;">' +
                                '<strong>' +
                                    C_TEXT_RANKS_IN_YANDEX_KEYWORDS  +
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

                        '<div id="' + ID_OUR_TAGS_INFORM_BLOCK + '" style="margin-left: 270px; margin-top: 15px;"></div>' +
                    '</div>';


                var watchHeader = $('div.branded-page-v2-top-row');
                if(!watchHeader.length){
                    $('ytd-browse[page-subtype="channels"] > ytd-two-column-browse-results-renderer > ytd-section-list-renderer#primary').first().prepend(tagsPanelHtmlString)
                }
                else watchHeader.after(tagsPanelHtmlString);


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

                

                //if ($('meta[itemprop="channelId"]').attr('content')) {
                    chrome.runtime.sendMessage({
                        'title': 'getOneChanelTags',
                        'body': {
                            //'id': $('meta[itemprop="channelId"]').attr('content')
                            url : window.location.href
                        }
                    });
                //}



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

                        if(
                            $('button.action-panel-trigger-share:first').hasClass('yt-uix-button-toggled')
                        ){
                            $('button.action-panel-trigger-share:first').trigger('click');
                        }
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
            }
        }, 1500);
    }


    if (title == 'getOneVideoTagsResponse') {
        $('#' + ID_OUR_VIDEO_TAGS_BOX).html(null);
        for(var i in body.tags){
            $('#' + ID_OUR_VIDEO_TAGS_BOX).append(
                '<span class="fua-plugin-youtube-watch-video-tags fua-plugin-youtube-tag">' +
                    '<span>' + body.tags[i] + '</span>' +
                '</span>'
            );
        }
        selectTagsByClick();
    }
});