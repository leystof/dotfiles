chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;

    /*******/
    if (
        title == 'addHtmlToYoutubeUploadPage'
        && $('div.video-settings-tag-chips-container').length > 0
    ) {

        addOurEditHtml();

        function addOurEditHtml(){
            //console.log("addOurEditHtml");
            //console.log('before-start', document.getElementsByClassName("yt-uix-form-input-non-empty").length);
            if(
                !document.getElementById("start-upload-button-single")
                || document.getElementsByClassName("yt-uix-form-input-non-empty").length
            ) {
                if (
                    $('#' + ID_OUR_PANEL_AFTER_YOUTUBE_TAGS).length < 1
                    && $('#' + ID_OUR_SEARCH_TAGS_PANEL).length < 1
                    && $('#' + ID_OUR_PANEL_AFTER_TITLE).length < 1
                    && $('#' + ID_OUR_PANEL_AFTER_DESCRIPTION).length < 1
                ) {
                    //addOurHtmlForEditVideo();
                    setTimeout(function(){
                        //console.log('just-start', document.getElementsByClassName("yt-uix-form-input-non-empty").length);
                        addOurHtmlForEditVideo();
                    }, 500);
                }
            }
            else{
                setTimeout(function(){addOurEditHtml();}, 500);
            }
        }

        function addOurHtmlForEditVideo(){
            FUA_YT_TR.translation_languages = body.langs;
            FUA_YT_TR.api_key = body.yandexTranslateKey || FUA_YT_TR.standard_api_key;
            FUA_YT_TR.selectedLanguages = body.selectedLanguages;

            FUA_YT_GV.video_id = FUA_GET_VALUE.getVideoIdFromUrl(window.location.href);
            FUA_YT_GV.xsrf_token = FUA_GET_VALUE.getXsrfToken($('body').html());

            if(FUA_YT_GV.video_id) {
                chrome.runtime.sendMessage({
                    'title': 'getChannelData',
                    'body': {'video_id': FUA_YT_GV.video_id}
                });


                var videoIframe = $('#vm-video-player iframe').contents();
                var videoSettingsButton = videoIframe.find('div.ytp-right-controls button.ytp-settings-button');


                if (!videoIframe.find('#fua-screenshot-id').length) {
                    videoSettingsButton.before(
                        '<span style="display: inline-block; text-align: center;" id="fua-screenshot-id" class="ytp-button">' +
                        '<img style="margin-top: 9px;" src="' + IMAGE_SCREENSHOT + '">' +
                        '</span>'
                    );

                    videoIframe.find('#fua-screenshot-id').click(function () {
                        chrome.runtime.sendMessage({
                            'title': 'downloadScreenshot',
                            'body': {
                                'base64': getScreenShot(videoIframe.find('video')[0]),
                                'video_id': FUA_YT_GV.video_id,
                                'time': Math.floor(videoIframe.find('video')[0].currentTime)
                            }
                        });
                    });
                }


                if(!videoIframe.find('#' + ID_OUR_VIDEO_TIME_CODE_ICON).length) {
                    videoSettingsButton.before(
                        '<span style="display: inline-block; text-align: center;" id="' + ID_OUR_VIDEO_TIME_CODE_ICON + '" class="ytp-button">' +
                        '<div style="display: inline-block; line-height: normal; background-color: black; margin-top: -38px; position: absolute; padding: 6px;">' +
                        C_TEXT_ADD_TIME_CODE +
                        '</div>' +
                        '<img style="margin-top: 8px;" src="' + IMAGE_TIMER_URL + '">' +
                        '</span>'
                    );


                    var timeCodeButton = videoIframe.find('#' + ID_OUR_VIDEO_TIME_CODE_ICON);
                    timeCodeButton.find('div:first').hide();


                    timeCodeButton.click(function () {
                        var descriptionTextarea =
                            $('.metadata-two-column .basic-info-form-input .video-settings-description:first');
                        var timeVideoCode = videoIframe
                            .find("#player .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls .ytp-time-display .ytp-time-current:first");

                        if (videoIframe.find('.html5-video-player').hasClass('playing-mode')) {
                            videoIframe.find('.ytp-play-button').trigger('click');
                            videoIframe.find('.ytp-play-button').trigger('click');
                        }

                        var codeValue = timeVideoCode.html();
                        var textValue = $(descriptionTextarea).val();
                        var textLength = textValue.length;

                        if (textLength < 1) $(descriptionTextarea).val(codeValue + ' - ');
                        else {
                            $(descriptionTextarea).val(textValue + '\n' + codeValue + ' - ');
                        }
                        descriptionTextarea[0].scrollTop = descriptionTextarea[0].scrollHeight - 20;
                        descriptionTextarea[0].selectionEnd = $(descriptionTextarea).val().length;
                        $(descriptionTextarea).trigger('focus');
                        FUA_YT_EDIT_VIDEO.renderLeftValueCharactersDescription();
                    });


                    timeCodeButton.mouseover(function () {
                        //console.log($(this).find('div:first').outerWidth());
                        $(this).find('div:first').css('margin-left', (36 - $(this).find('div:first').outerWidth()) / 2);
                        $(this).find('div:first').show();
                    });

                    timeCodeButton.mouseleave(function () {
                        $(this).find('div:first').hide();
                    });
                }
            }



            $(FUA_YT_EDIT_TAGS_WORKER.selector.tag_box)
                .addClass(FUA_YT_EDIT_TAGS_WORKER.class.tag_box);

            var fieldSetSecond = $('div.basic-info-tab:first fieldset:nth-child(2)');
            fieldSetSecond.addClass('fua-plugin-youtube-second-fieldset');

            $('#' + ID_OUR_PANEL_AFTER_YOUTUBE_TAGS).remove();
            $('#' + ID_OUR_SEARCH_TAGS_PANEL).remove();
            $('#' + ID_OUR_PANEL_AFTER_TITLE).remove();
            $('#' + ID_OUR_PANEL_AFTER_DESCRIPTION).remove();

            var htmlAfterTitle =
                '<div id="' + ID_OUR_PANEL_AFTER_TITLE + '">' +
                    '<div class="fua-plugin-youtube-text-after-youtube-tags" style="background-color: #F8F8F8; margin-top: 5px; width: 405px;">' +
                        C_TEXT_WORD_LEFT +
                        '<span id="' + ID_OUR_TITLE_LENGTH + '"></span> ' +
                        C_TEXT_WORD_SYMBOLS +
                        '<span class="'+ FUA_YT_SIGNS.class.open_button +'" data_selector="input.video-settings-title">☺</span>' +

                        '<div style="float: right" id="'+ FUA_YT_TAGS_RATIONS.id.title_tags_ration +'">' +
                            'tagRation:  <span class="'+ FUA_YT_TAGS_RATIONS.class.tags_ration_count +'"></span>' +
                        '</div>' +
                    '</div>' +
                '</div>';


            var htmlAfterDescription =
                '<div id="' + ID_OUR_PANEL_AFTER_DESCRIPTION + '">' +
                    '<div class="fua-plugin-youtube-text-after-youtube-tags" style="background-color: #F8F8F8; margin-top: 5px; width: 405px;">' +
                        C_TEXT_WORD_LEFT +
                        '<span id="' + ID_OUR_DESCRIPTION_LENGTH + '"></span> ' +
                        C_TEXT_WORD_SYMBOLS +
                        '<span class="'+ FUA_YT_SIGNS.class.open_button +'" data_selector="textarea.video-settings-description">☺</span>' +

                        '<span style="float: right;" id="add-tags-to-description-block-id">' +
                            C_TEXT_WORD_ADD + ' ' +
                            '<span id="add-tags-to-description-id" class="fua-plugin-youtube-like-link">' +
                                '#' + C_TEXT_WORD_TAGS +
                            '</span>' +
                            ' '+ C_TEXT_WORD_OR +' ' +
                            '<span id="add-double-tags-to-description-id" class="fua-plugin-youtube-like-link">' +
                                '#' + C_TEXT_WORD_DOUBLE_TAGS +
                            '</span>' +
                        '</span>' +
                        '<div id="'+ FUA_YT_TAGS_RATIONS.id.description_tags_ration +'">' +
                            'tagRation:  <span class="'+ FUA_YT_TAGS_RATIONS.class.tags_ration_count +'"></span>' +
                        '</div>' +
                    '</div>' +
                '</div>';



            var htmlPlaceInYoutubeSearchHtml = '<div class="fua-plugin-youtube-text-after-youtube-tags" style="background-color: #E2EED8; margin-top: 5px;">' +
                '<div id="' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE_BOX + '">' +
                C_TEXT_PLACE_IN_YOUTUBE_SEARCH +
                '<span id="' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE + '" class="fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                C_TEXT_WORD_SHOW +
                '</span>' +
                '</div>' +
                '<div id="' + ID_OUR_SEARCH_PLACE_PROGRESS + '" style="clear: both;">' +
                '<div id="' + ID_OUR_SEARCH_PLACE_PROGRESS_PERCENTAGE + '" style="width: 395px;">' +
                '0%' +
                '</div>' +
                '<div id="' + ID_OUR_SEARCH_PLACE_PROGRESS_LINE + '">' +
                '<div id="' + ID_OUR_SEARCH_PLACE_PROGRESS_LINE_INNER + '">' +
                '<div class="fua-plugin-youtube-search-progress-line-parts" style="background-color: orange;">' +
                '</div>' +
                '<div class="fua-plugin-youtube-search-progress-line-parts">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            if(!FUA_YT_GV.video_id) htmlPlaceInYoutubeSearchHtml = "";


            var htmlAfterTagsBlock =
                '<div id="' + ID_OUR_PANEL_AFTER_YOUTUBE_TAGS + '">' +
                    '<div class="fua-plugin-youtube-text-after-youtube-tags" style="background-color: #F8F8F8;">' +
                        C_TEXT_WORD_LEFT +
                        '<span id="' + ID_OUR_TOTAL_TAGS_LENGTH + '">' +
                            FUA_YT_EDIT_TAGS_WORKER.countTagsLeftCharacters() +
                        '</span> ' +
                        C_TEXT_WORD_SYMBOLS +
                        '<span id="' + ID_OUR_TAG_UPLOAD_CLEAR_BUTTON + '" class="fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                            C_TEXT_WORD_CLEAR + ' ' + C_TEXT_WORD_TAGS +
                        '</span>' +
                    '</div>' +

                    htmlPlaceInYoutubeSearchHtml +

                    '<div id="'+ FUA_YT_YANDEX_KW.id.horizontal_block +'" class="fua-plugin-youtube-text-after-youtube-tags" style="background-color: #FDFBCA; margin-top: 5px;">' +
                        '<div id="'+ FUA_YT_YANDEX_KW.id.control_panel +'">' +
                            C_TEXT_RANKS_IN_YANDEX_KEYWORDS +
                            '<span id="' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD + '" class="fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                                C_TEXT_WORD_SHOW +
                            '</span>' +
                        '</div>' +
                    '</div>' +

                    '<div id="'+ FUA_YT_COPY_META_DATA.id.horizontal_block +'" class="fua-plugin-youtube-text-after-youtube-tags" style="background-color: #FDFBCA; margin-top: 5px;">' +
                        '<div id="'+ FUA_YT_COPY_META_DATA.id.control_panel +'">' +
                            '<input type="text" id="'+  FUA_YT_COPY_META_DATA.id.url_input +'" placeholder="Video URL">' +
                            '<select id="'+ FUA_YT_COPY_META_DATA.id.select_language +'"></select>' +
                            '<span id="' + FUA_YT_COPY_META_DATA.id.copy_button + '" class="fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                                chrome.i18n.getMessage("word_copy") +
                            '</span>' +
                        '</div>' +
                    '</div>' +


                    '<div id="' + ID_OUR_TAGS_INFORM_BLOCK + '">' +
                    '</div>' +
                '</div>';


            var htmlBlockInputAndAddButton =
                '<div id="' + ID_OUR_SEARCH_TAGS_PANEL + '">' +
                    '<div>' +
                        '<input id="' + ID_OUR_TAG_UPLOAD_INPUT + '" type="text" placeholder="'+ C_TEXT_SEARCH_TAGS_INPUT_PLACEHOLDER +'">' +
                        '<div id="' + ID_OUR_TAG_UPLOAD_ADD_BUTTON + '" class="yt-uix-button yt-uix-button-size-default yt-uix-tooltip yt-uix-button-primary fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                            '<span class="yt-uix-button-content">' +
                                C_TEXT_WORD_SEARCH +
                            '</span>' +
                        '</div>' +
                    '<div id="' + ID_OUR_SEARCH_HINTS_BOX + '"></div>' +
                '</div>' +

                '<div>' +
                    '<div style="display: inline-block">' +
                        '<div style="display: table-cell; vertical-align: middle;">' +
                            '<input style="margin-right: 5px;" type="checkbox" name="' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX + '">' +
                        '</div>' +
                        '<div style="display: table-cell">' +
                            '<label style="margin-right: 5px;" for="' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX + '">' +
                                C_TEXT_WORD_HINTS +
                            '</label>' +
                        '</div>' +
                    '</div>' +

                    '<div style="display: inline-block">' +
                        '<div style="display: table-cell; vertical-align: middle;">' +
                            '<input style="margin-right: 5px;" type="checkbox" name="' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX + '">' +
                        '</div>' +
                        '<div style="display: table-cell">' +
                            '<label style="margin-right: 5px;" for="' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX + '">' +
                                C_TEXT_GOOGLE_TRENDS +
                            '</label>' +
                        '</div>' +
                    '</div>' +

                    '<div style="display: inline-block">' +
                        '<div style="display: table-cell; vertical-align: middle;">' +
                            '<input  style="margin-right: 5px;" type="checkbox" name="' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX + '">' +
                        '</div>' +
                        '<div style="display: table-cell;">' +
                            '<label style="margin-right: 5px;" for="' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX + '">' +
                                C_TEXT_WORD_YOUTUBE + ' ' + C_TEXT_WORD_TAGS +
                            '</label>' +
                        '</div>' +
                    '</div>' +

                    '<div style="display: inline-block">' +
                        '<div style="display: table-cell; vertical-align: middle;">' +
                            '<input  style="margin-right: 5px;" type="checkbox" name="' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX + '">' +
                        '</div>' +
                        '<div style="display: table-cell;">' +
                            '<label style="margin-right: 5px;" for="' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX + '">' +
                                'Yandex Keywords' +
                            '</label>' +
                        '</div>' +
                    '</div>' +

                '</div>' +

                '<div id="' + ID_OUR_SEARCH_PROGRESS + '" style="clear: both;">' +
                    '<div id="' + ID_OUR_SEARCH_PROGRESS_PERCENTAGE + '" style="width: 50%;">0%</div>' +
                        '<div id="' + ID_OUR_SEARCH_PROGRESS_LINE + '">' +
                            '<div id="' + ID_OUR_SEARCH_PROGRESS_LINE_INNER + '">' +
                                '<div class="fua-plugin-youtube-search-progress-line-parts" style="background-color: orange;">' +
                                '</div>' +
                                '<div class="fua-plugin-youtube-search-progress-line-parts">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div id="' + ID_OUR_NOT_ADDED_TAGS_BOX + '" style="clear: both">' +
                    '</div>' +
                '</div>';


            FUA_YT_EDIT_TAGS_WORKER.addTagLengthLabels();

            $(FUA_YT_EDIT_TAGS_WORKER.selector.tag_box).after(htmlAfterTagsBlock);
            fieldSetSecond.append(htmlBlockInputAndAddButton);
            FUA_YT_EDIT_TAGS_WORKER.renderLeftTagsCharactersCount();

            // copy tag button
            setTimeout(function() {
                if(!$('#' + FUA_YT_COPY_EDIT_TAGS.id.copy_tags_button).length) {
                    FUA_YT_COPY_EDIT_TAGS.addHtmlCopyButton({
                        callback: function (htmlButton) {
                            $(FUA_YT_EDIT_TAGS_WORKER.selector.tag_box).after(htmlButton);
                        }
                    });
                }
            }, 500);



            // work with title input
            var titleInput = $('.video-settings-title:first');
            titleInput.after(htmlAfterTitle);

            FUA_YT_EDIT_VIDEO.renderLeftValueCharactersTitle();
            titleInput[0].oninput = function () {
                FUA_YT_EDIT_VIDEO.renderLeftValueCharactersTitle();
            };


            // search tags
            function getTopicTags() {
                var tagsTopic = $('#' + ID_OUR_TAG_UPLOAD_INPUT).val();
                var enterButton = $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON);
                if (
                    tagsTopic
                    && !enterButton.hasClass('fua-plugin-youtube-disable-button')
                    && !enterButton.hasClass(CLASS_OUR_NO_CHECKBOX_BUTTON)
                ) {
                    enterButton.addClass('fua-plugin-youtube-disable-button');
                    $('#' + ID_OUR_SEARCH_HINTS_BOX).hide();
                    chrome.runtime.sendMessage({
                        'title': 'getYoutubeTags',
                        'body': {'tagsTopic': tagsTopic}
                    });
                    $('#' + ID_OUR_SEARCH_PROGRESS_PERCENTAGE).html('0%');
                    $('#' + ID_OUR_SEARCH_PROGRESS_LINE_INNER).css('margin-left', '-100%');
                    $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).hide();
                    $('#' + ID_OUR_SEARCH_PROGRESS).show();
                }
            }


            $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON).click(function () {
                getTopicTags();
            });

            $('#' + ID_OUR_TAG_UPLOAD_INPUT).keypress(function (e) {
                if (e.which == 13) getTopicTags();
            });


            // clear all tags
            $('#' + ID_OUR_TAG_UPLOAD_CLEAR_BUTTON).click(function () {
                FUA_YT_EDIT_TAGS_WORKER.clearAllTags();
            });

            $(SELECTORS_YOUTUBE_TAGS_BOX).click(function () {
                FUA_YT_EDIT_TAGS_WORKER.renderLeftTagsCharactersCount();
            });
            $(SELECTORS_YOUTUBE_TAGS_BOX).keyup(function () {
                FUA_YT_EDIT_TAGS_WORKER.renderLeftTagsCharactersCount();
            });

            $(SELECTORS_YOUTUBE_ADD_TAG_INPUT).focus(function () {
                FUA_YT_EDIT_TAGS_WORKER.renderLeftTagsCharactersCount();
            });


            // work with hints
            var searchInput =
                document.getElementById(ID_OUR_TAG_UPLOAD_INPUT);

            searchInput.oninput = getHintsForSearchTag;


            // work with description
            var descriptionTextarea =
                $('.metadata-two-column .basic-info-form-input .video-settings-description:first');

            descriptionTextarea.after(htmlAfterDescription);
            FUA_YT_EDIT_VIDEO.renderLeftValueCharactersDescription();
            FUA_YT_EDIT_TAGS_WORKER.renderLeftTagsCharactersCount();

            descriptionTextarea[0].oninput = FUA_YT_EDIT_VIDEO.renderLeftValueCharactersDescription;

            descriptionTextarea.off('dblclick');
            descriptionTextarea.on('dblclick', function(){
                if(
                    $('#vm-video-player iframe').contents().find('.ytp-thumbnail-overlay').css('display') == 'none'
                    || $('#vm-video-player iframe').contents().find('.ytp-cued-thumbnail-overlay').css('display') == 'none'
                ){
                    addTimeCode(true);
                }
            });


            document.addEventListener('mousedown', function (event) {
                if (event.button == 2) {
                    if (
                        event.srcElement.className.match('video-settings-description')
                        && event.srcElement.className.match('yt-uix-form-input-textarea')
                    ) {
                        //console.log(event.srcElement.selectionEnd);
                        chrome.runtime.sendMessage({
                            'title': 'createContextMenuAddVideoTimeCode'
                        });
                    }
                    else {
                        chrome.runtime.sendMessage({
                            'title': 'removeContextMenuAddVideoTimeCode'
                        });
                    }
                }
                else {
                    if (
                        event.srcElement.id != ID_OUR_TAG_UPLOAD_INPUT
                        && event.srcElement.id != ID_OUR_SEARCH_HINTS_BOX
                        && $(event.srcElement).closest('#' + ID_OUR_SEARCH_HINTS_BOX).length < 1
                    ) {
                        $('#' + ID_OUR_SEARCH_HINTS_BOX).html(null);
                        $('#' + ID_OUR_SEARCH_HINTS_BOX).hide();
                        $('#' + ID_OUR_SEARCH_TAGS_PANEL)
                            .css('min-height', $('#' + ID_OUR_SEARCH_HINTS_BOX).css('height'));
                    }
                }
            });



            $('#add-double-tags-to-description-id').click(function(){
                var doubleTags = getTagsForAddingToDescription();
                //console.log('doubleTags', doubleTags);
                var doubleTagsString = '';
                for(var i in doubleTags){
                    var tmpTags = doubleTags[i].split(' ');
                    var tagString = '#';
                    for(var j in tmpTags){
                        tagString += capitalizeFirstLetter(tmpTags[j])
                    }
                    if(doubleTagsString) doubleTagsString += ' ';
                    doubleTagsString += tagString;
                }

                addToDescriptionEnd(doubleTagsString);
            });



            $('#add-tags-to-description-id').click(function(){
                var tags = getTagsForAddingToDescription();
                var onlyRussianWords = {};
                var otherWords = {};
                console.log('tags', tags);
                for(var i in tags){
                    var tmpTags = tags[i].split(' ');
                    for(var j in tmpTags){
                        var tag = tmpTags[j].toLowerCase();
                        if(tag.match('[^а-я]')) otherWords[tag] = true;
                        else if(!tag.match('^(и|да|не|только|но|также|тоже|ни|как|так|или|либо|то|же|зато|же|а|без|близ|в|во|до|за|из|к|ко|кроме|на|над|о|об|обо|от|под|подо|при|с|со|у)$')){
                            onlyRussianWords[tag] = true;
                        }
                    }
                }


                chrome.runtime.sendMessage({
                    'title': 'getFilterWords',
                    'body': {
                        'otherWords': otherWords,
                        'onlyRussianWords' : onlyRussianWords
                    }
                });

                //console.log('otherWords', otherWords);
                //console.log('onlyRussianWords', onlyRussianWords);
            });



            // place in youtube search
            if(FUA_YT_GV.video_id) {
                getYoutubePlaces({
                    tagsSelector: FUA_YT_EDIT_TAGS_WORKER.selector.added_tags,
                    videoId: FUA_YT_GV.video_id,
                    callback: function () {
                        $('#' + ID_OUR_SEARCH_PLACE_PROGRESS_PERCENTAGE).html('0%');
                        $('#' + ID_OUR_SEARCH_PLACE_PROGRESS_LINE_INNER).css('margin-left', '-100%');
                        $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE_BOX).hide();
                        $('#' + ID_OUR_SEARCH_PLACE_PROGRESS).show();
                    }
                });
            }



            //work with yandex keywords
            getYandexVolumeForTags({
                tagsSelector: FUA_YT_EDIT_TAGS_WORKER.selector.added_tags
            });


            // work with checkboxes
            $('#' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX)
                .prop('checked', body.checkbox.addHintsToTags);

            $('#' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX).change(function () {
                chrome.runtime.sendMessage({
                    'title': 'checkboxAddHintsToTags',
                    'body': {'checked': $(this).prop('checked')}
                });
                checkAllSearchCheckBox();
            });

            $('#' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX)
                .prop('checked', body.checkbox.addTrendsToTags);

            $('#' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX).change(function () {
                chrome.runtime.sendMessage({
                    'title': 'checkboxAddTrendsToTags',
                    'body': {'checked': $(this).prop('checked')}
                });
                checkAllSearchCheckBox();
            });

            $('#' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX)
                .prop('checked', body.checkbox.addYoutubeTagsToTags);

            $('#' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX).change(function () {
                chrome.runtime.sendMessage({
                    'title': 'checkboxAddYoutubeTagsToTags',
                    'body': {'checked': $(this).prop('checked')}
                });
                checkAllSearchCheckBox();
            });

            $('#' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX)
                .prop('checked', body.checkbox.addYandexKeywordsToTags);

            $('#' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX).change(function () {
                chrome.runtime.sendMessage({
                    'title': 'checkboxAddYandexKeywordsToTags',
                    'body': {'checked': $(this).prop('checked')}
                });
                checkAllSearchCheckBox();
            });

            checkAllSearchCheckBox();

            // check access to video
            function checkVideoAccess(){
                var tmpElement = $('#fua-plugin-youtube-show_place_in_youtube_box')
                    .parent();

                if(
                    $('select.metadata-privacy-input').val() == 'unlisted'
                    || $('select.metadata-privacy-input').val() == 'private'
                ){
                    tmpElement.hide();
                }
                else tmpElement.show();
            }


            checkVideoAccess();
            $('select.metadata-privacy-input').change(function(){
                checkVideoAccess();
            });


            //check is our channel in favorites
            checkIsOurChannelInFavorites();

            //Auto Translate
            FUA_YT_TR.addHtmlTranslateButton();

            // tags ration
            FUA_YT_TAGS_RATIONS.addListenerToTagsRationLabel({
                id : FUA_YT_TAGS_RATIONS.id.title_tags_ration
            });

            FUA_YT_TAGS_RATIONS.addListenerToTagsRationLabel({
                id : FUA_YT_TAGS_RATIONS.id.description_tags_ration
            });

            // copy meta data
            $('#' + FUA_YT_COPY_META_DATA.id.copy_button).click(function(){
                FUA_YT_COPY_META_DATA.clickByCopyButton();
            });

            FUA_YT_COPY_META_DATA.addLanguageSelectOptions();

            // signs
            FUA_YT_SIGNS.clickByOpenButton();


            if(window.location.href.search(new RegExp('#[/]*fua_auto_translate')) != -1) {
                history.pushState(null, null, window.location.href.replace(new RegExp('#[/]*fua_auto_translate'), ''));
                $('li.tab-header[data-tab-id="translations"]').click();
            }
        }
    }


    /*******/
    if (
        title == 'insertYoutubeUploadTags'
        && $('div.video-settings-tag-chips-container').length > 0
    ) {

        if(body.yandexCaptcha){
            var yandexCaptcha = body.yandexCaptcha;
            delete body.yandexCaptcha;
            insertCaptcha({
                captcha : yandexCaptcha.captcha,
                word : yandexCaptcha.word,
                targetAction : 'getKeywords',
                additional : body
            });
        }
        else {
            $(FUA_YT_EDIT_TAGS_WORKER.selector.added_tags).each(function () {
                var tmpTag = $(this).find('span:first').html().toLowerCase();
                delete body.tags[tmpTag];
                delete body.hints[tmpTag];
                delete body.trends[tmpTag];
                delete body.keywords[tmpTag];
            });


            var groupedTags = {
                'Youtube': body.tags,
                'Hints': body.hints,
                'Trends': body.trends
            };

            groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE] = body.keywords;

            var aggregatedTags = [];


            for (var i in groupedTags) {
                for (var j in groupedTags[i]) {
                    var aggregatedNames = '';
                    var tmpObject = {};
                    var count = 0;
                    for (var k in groupedTags) {
                        if (k != i && groupedTags[k][j]) {
                            if (!aggregatedNames) {
                                aggregatedNames += i;
                                aggregatedNames += ' & ';

                                tmpObject[i] = groupedTags[i][j];
                                delete groupedTags[i][j];

                                count++;
                            }
                            else aggregatedNames += ' & ';

                            aggregatedNames += k;
                            tmpObject[k] = groupedTags[k][j];
                            delete groupedTags[k][j];

                            count++;
                        }
                    }
                    if (aggregatedNames) {
                        if (!aggregatedTags[count]) aggregatedTags[count] = {};
                        if (!aggregatedTags[count][aggregatedNames]) {
                            aggregatedTags[count][aggregatedNames] = {};
                        }
                        aggregatedTags[count][aggregatedNames][j] = tmpObject;
                    }
                }
            }

            delete groupedTags['Youtube'];

            var arrayUniqueTags = [];
            for (var i in body.tags) {
                arrayUniqueTags.push(i);
            }

            var sortedTags = {};
            var aggregatedSortedTags = {};

            for (var i in body.tags) {
                if (!sortedTags[i]) {
                    var tmpNameArr = i.split(' ');
                    var tmpNameArrLength = tmpNameArr.length;
                    var maxWord = '';
                    for (var j in tmpNameArr) {
                        if (maxWord.length <= tmpNameArr[j].length) {
                            maxWord = tmpNameArr[j];
                        }
                    }

                    var sovpadeniya = {};

                    for (var j in arrayUniqueTags) {
                        if (
                            arrayUniqueTags[j].search(createRegexpEndingRuWord(maxWord)) != -1
                            && arrayUniqueTags[j].split(' ').length == tmpNameArrLength
                        ) {
                            var allGood = true;
                            for (var k in tmpNameArr) {
                                if (
                                    arrayUniqueTags[j].search(createRegexpEndingRuWord(tmpNameArr[k])) == -1
                                ) {
                                    allGood = false;
                                }
                            }
                            if (allGood) {
                                sovpadeniya[arrayUniqueTags[j]] = body.tags[arrayUniqueTags[j]];
                                sortedTags[arrayUniqueTags[j]] = true;
                                delete arrayUniqueTags[j];
                            }
                        }
                    }

                    var maxRateTagQ = 0;
                    var maxRateTagN = '';
                    for (var j in sovpadeniya) {
                        if (maxRateTagQ <= sovpadeniya[j]) {
                            maxRateTagN = j;
                            maxRateTagQ = sovpadeniya[j];
                        }
                    }

                    aggregatedSortedTags[maxRateTagN] = sovpadeniya;
                }
            }


            var sortedTagsRanks = [];
            sortedTags = {};
            for (var i in aggregatedSortedTags) {
                var rank = 0;
                for (var j in aggregatedSortedTags[i]) {
                    rank = rank + aggregatedSortedTags[i][j]
                }

                if (rank > 0) {
                    if (!sortedTags[rank]) {
                        sortedTags[rank] = {};
                        sortedTagsRanks.push(rank);
                    }
                    sortedTags[rank][i] = aggregatedSortedTags[i];
                }
            }

            sortedTagsRanks = sortedTagsRanks.sort(function (f, s) {
                if (f == s) return 0;
                if (f > s) return -1;
                else return 1;
            });

            insertYoutubeUploadTags({
                sortedTags: sortedTags,
                sortedTagsRanks: sortedTagsRanks,
                groupedTags: groupedTags,
                aggregatedTags: aggregatedTags
            });
        }
    }


    /*******/
    if (title == 'progressYoutubeUploadTags') {
        $('#' + ID_OUR_SEARCH_PROGRESS_PERCENTAGE)
            .html(body.progress + '%');

        $('#' + ID_OUR_SEARCH_PROGRESS_LINE_INNER).animate({
            marginLeft: (body.progress - 100) + '%'
        }, 200);
    }


    /*******/
    if (title == 'insertHints') {
        var hints = [];

        for(var i in body.hints){
            var tmp = [i, body.hints[i]];
            hints.push(tmp)
        }


        hints = hints.sort(function(f, s){
            if (f[1].length == s[1].length) return 0;
            if (f[1].length > s[1].length) return -1;
            else return 1;
        });

        var box = $('#' + ID_OUR_SEARCH_HINTS_BOX);
        box.html(null);
        for(var i in hints){
            box.append(
                '<div class="'+ CLASS_OUR_SEARCH_HINT +'">' +
                    '<span style="color: #666; margin-right: 10px; font-weight: bold;">'+
                        hints[i][0] +
                    '</span>' +
                    '<span>('+
                        hints[i][1].join(', ')
                    +')</span>' +
                '</div>'
            );
        }



        if(
            !$('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON).hasClass('fua-plugin-youtube-disable-button')
        ) {
            $('#' + ID_OUR_SEARCH_HINTS_BOX).show();

            $('#' + ID_OUR_SEARCH_TAGS_PANEL)
                .css('min-height', $('#' + ID_OUR_SEARCH_HINTS_BOX).css('height'));

            $('.' + CLASS_OUR_SEARCH_HINT).click(function () {
                $('#' + ID_OUR_TAG_UPLOAD_INPUT).val($(this).find('span:first').html());
                getHintsForSearchTag();
                $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON).trigger('click');
            });
        }
    }


    /*******/
    if (title == 'addVideoTimeCode') {
        addTimeCode();
    }


    /*******/
    if (title == 'insertTagsToDescription') {
        var tagsString = '';
        for(var i in body.aggregatedWords.one){
            if(tagsString) tagsString += ' ';
            tagsString += '#' + i;
        }
        for(var i in body.aggregatedWords.multiple){
            if(tagsString) tagsString += ' ';
            tagsString += '#' + i;
        }
        for(var i in body.aggregatedWords.noMorpher){
            if(tagsString) tagsString += ' ';
            tagsString += '#' + i;
        }
        for(var i in body.otherWords){
            if(tagsString) tagsString += ' ';
            tagsString += '#' + i;
        }

        addToDescriptionEnd(tagsString)
    }
});

function insertYoutubeUploadTags(options){
    var sortedTags = options.sortedTags;
    var sortedTagsRanks = options.sortedTagsRanks;
    var groupedTags = options.groupedTags;
    var aggregatedTags = options.aggregatedTags;


    $('#' + ID_OUR_SEARCH_PROGRESS).hide();
    $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).html(null);


    insertSortedTags({sortedTags : sortedTags, prepend : true});
    for(var i in aggregatedTags){
        for(var j in aggregatedTags[i]){
            if(j.match(C_TEXT_YANDEX_KEYWORDS_TITLE)){
                var tmpArray = [];
                for(var k in aggregatedTags[i][j]) {
                    tmpArray.push({
                        text : k,
                        volume : parseInt(aggregatedTags[i][j][k][C_TEXT_YANDEX_KEYWORDS_TITLE][C_TEXT_YENDEX_KEYWORD_VOLUME]),
                        yandex_label : aggregatedTags[i][j][k][C_TEXT_YANDEX_KEYWORDS_TITLE][C_TEXT_YENDEX_KEYWORD_VOLUME],
                        title_label : aggregatedTags[i][j][k]
                    });
                }

                tmpArray.sort(function (a, b) {
                    if (a.volume < b.volume) return 1;
                    if (a.volume > b.volume) return -1;
                    return 0;
                });

                aggregatedTags[i][j] = tmpArray;
            }
        }


        insertSortedTags({sortedTags : aggregatedTags[i], prepend : true});
    }

    var yandexArray = [];
    for(var i in groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE]){
        yandexArray.push({
            text : i,
            volume : parseInt(groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE][i][C_TEXT_YENDEX_KEYWORD_VOLUME]),
            yandex_label : groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE][i][C_TEXT_YENDEX_KEYWORD_VOLUME],
            title_label : groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE][i]
        });
    }

    yandexArray.sort(function (a, b) {
        if (a.volume < b.volume) return 1;
        if (a.volume > b.volume) return -1;
        return 0;
    });


    var tmpData = {
        sortedTags : {},
        prepend : true,
        'afterMatch' : C_TEXT_YANDEX_KEYWORDS_TITLE
    };
    tmpData.sortedTags[C_TEXT_YANDEX_KEYWORDS_TITLE] = yandexArray;
    insertSortedTags(tmpData);

    delete groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE];
    insertSortedTags({sortedTags : groupedTags});


    function insertSortedTags(options) {

        sortedTags =  options.sortedTags;
        prepend = options.prepend;
        dataName = options.dataName;

        for (var i in sortedTags) {
            var htmlRankTags = '';

            for (var j in sortedTags[i]) {
                var titleText = '';

                var title_label = sortedTags[i][j];
                if(sortedTags[i][j]['title_label']) title_label = sortedTags[i][j]['title_label'];


                for (var k in title_label) {
                    if (
                        typeof title_label[k] === 'string'
                        || typeof title_label[k] === 'number'
                    ) {
                        titleText += k + ' (' + title_label[k] + '); ';
                    }
                    else {
                        titleText += k + ' (';
                        var tmpM = '';
                        for (var m in title_label[k]) {
                            if (tmpM) tmpM += ', ';
                            tmpM += m + ' - ' + title_label[k][m];
                        }
                        titleText += tmpM + '); ';
                    }
                }

                var nString = '';
                if(sortedTags[i][j]['yandex_label']){
                    nString =
                        '<span class="fua-plugin-youtube-yandex-keywords-label-not-added-tag">' +
                            numberWithDelimiters(sortedTags[i][j]['yandex_label']) +
                        '</span>';
                }


                var text = j;
                if(sortedTags[i][j]['text']) text = sortedTags[i][j]['text'];

                htmlRankTags +=
                    '<div class="fua-plugin-youtube-no-added-tag">' +
                        '<span class="fua-plugin-youtube-no-added-tag-text" title="' + titleText + '">' +
                            text +
                        '</span>' +
                        nString +
                        '<span class="fua-plugin-youtube-no-added-tag-disable">' +
                            '&times;' +
                        '</span>' +
                        '<span class="fua-plugin-youtube-no-added-tag-enable">' +
                            '&#8629;' +
                        '</span>' +
                    '</div>';
            }


            if (htmlRankTags) {
                var tmpHtml =
                    '<div class="fua-plugin-youtube-no-added-tags-rank">' +
                        '<div class="fua-plugin-youtube-no-added-tags-rank-title">' +
                            C_TEXT_TAGS_POPULARITY +' ' + i + ' - ' +
                            '<span class="fua-plugin-youtube-no-added-tags-rank-add-all">' +
                                C_TEXT_WORD_ADD + ' ' + C_TEXT_WORD_ALL +
                            '</span>' +
                        '</div>' +
                        '<div class="fua-plugin-youtube-no-added-tags-rank-box">' +
                            htmlRankTags +
                        '</div>' +
                    '</div>';

                var afterThis = false;
                if(options.afterMatch){
                    $('div.fua-plugin-youtube-no-added-tags-rank').each(function(){
                        var tmpTitle = $(this).find('.fua-plugin-youtube-no-added-tags-rank-title').html();
                        if(tmpTitle.match(options.afterMatch)) afterThis = $(this);
                    });
                }

                if(afterThis) afterThis.after(tmpHtml)
                else if(prepend) $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).prepend(tmpHtml);
                else $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).append(tmpHtml);
            }
        }
    }


    $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).show();

    $('#' + ID_OUR_NOT_ADDED_TAGS_BOX)
        .find('.fua-plugin-youtube-no-added-tag-text').click(function(){
            var tag = $(this).closest('.fua-plugin-youtube-no-added-tag');
            if(!tag.hasClass('fua-plugin-youtube-no-added-tag-not-active')) {
                FUA_YT_EDIT_TAGS_WORKER.addOneTag($(this).html());
                var rankTagsBlock =
                    tag.closest('.fua-plugin-youtube-no-added-tags-rank-box');
                tag.remove();
                if(rankTagsBlock.find('.fua-plugin-youtube-no-added-tag').length < 1){
                    rankTagsBlock
                        .closest('.fua-plugin-youtube-no-added-tags-rank').remove();
                }
                setTimeout(function(){
                    FUA_YT_EDIT_TAGS_WORKER.renderLeftTagsCharactersCount();
                }, 5);
            }
        });

    $('#' + ID_OUR_NOT_ADDED_TAGS_BOX)
        .find('.fua-plugin-youtube-no-added-tag-disable').click(function(event){
            event.stopPropagation();
            var tag = $(this).closest('.fua-plugin-youtube-no-added-tag');
            tag.addClass('fua-plugin-youtube-no-added-tag-not-active');
            $(this).hide();
            tag.find('.fua-plugin-youtube-no-added-tag-enable').show();
        });


    $('.fua-plugin-youtube-no-added-tag').click(function(){
        if($(this).hasClass('fua-plugin-youtube-no-added-tag-not-active')) {
            $(this).removeClass('fua-plugin-youtube-no-added-tag-not-active');
            $(this).find('.fua-plugin-youtube-no-added-tag-enable').hide();
            $(this).find('.fua-plugin-youtube-no-added-tag-disable').show();
        }
    });


    $('#' + ID_OUR_NOT_ADDED_TAGS_BOX)
        .find('.fua-plugin-youtube-no-added-tags-rank-add-all').click(function(){
            var rank = $(this).closest('.fua-plugin-youtube-no-added-tags-rank');
            var rankTagsBlock =
                rank.find('.fua-plugin-youtube-no-added-tags-rank-box');

            var tagsArray = [];
            rankTagsBlock
                .find('.fua-plugin-youtube-no-added-tag').each(function(){
                    if(!$(this).hasClass('fua-plugin-youtube-no-added-tag-not-active')) {
                        tagsArray.push(
                            $(this).find('.fua-plugin-youtube-no-added-tag-text').html()
                        );
                        $(this).remove();
                    }
                });

            if(rankTagsBlock.find('.fua-plugin-youtube-no-added-tag').length < 1){
                rank.remove();
            }

            FUA_YT_EDIT_TAGS_WORKER.addGroupTags(tagsArray, 0);
        });

    $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON)
        .removeClass('fua-plugin-youtube-disable-button');
}


function createRegexpEndingRuWord(word){
    var scl = {
        scl1 : {
            start : '[бвгджзйклмнпрстфхцчшщь][аяыиеую]|ой|ёй|ей',
            variants : {
                'ой|ёй|ей' : 2,
                '[бвгджзйклмнпрстфхцчшщь][аяыиеую]' : 1
            },
            final : '([аяыиеую]|ой|ёй|ей)'
        },
        scl2 : {
            start : '[а-я][бвгджзйклмнпрстфхцчшщ]|[бвгджзйклмнпрстфхцчшщи][оеаяуюь]|ом|ем|ём',
            variants : {
                'ом|ем|ём' : 2,
                '[а-я][бвгджзклмнпрстфхцчшщ]' : 0,
                '[бвгджзйклмнпрстфхцчшщи][оеаяуюь]' : 1,
                '[ауоыиэяюёе][оеаяуюй]' : 1
            },
            final : '([оеаяуюь]{0,1}|ом|ем|ём)'
        },
        scl3 : {
            start : '[бвгджзйклмнпрстфхцчшщ][иь]|ью',
            variants : {
                'ью' : 2,
                '[бвгджзйклмнпрстфхцчшщ][иь]' : 1
            },
            final : '([иь]|ью)'
        }
    };

    var regexpString = '';
    var wLength = word.length;


    if(wLength < 3) return '(^|[ ])(' + word + ')([ ]|$)';

    var wLast2Letters = word.slice(wLength - 2);
    for(var i in scl){
        if(wLast2Letters.search(scl[i].start) != -1){
            //console.log(i);
            var endingSliceIndex = 0;
            for(var j in scl[i].variants){
                if(wLast2Letters.search(j) != -1) endingSliceIndex = scl[i].variants[j];
            }
            var partRegexp =
                '(' + word.slice(0, wLength - endingSliceIndex) + scl[i].final + ')';
            //console.log(partRegexp);
            if(regexpString) regexpString += '|';
            regexpString += partRegexp;
        }
    }

    if(regexpString) return '(^|[ ])(' + regexpString + ')([ ]|$)';
    else return '(^|[ ])(' + word + ')([ ]|$)';
}

function fromTagToInput(){
    var lastTag = $(SELECTORS_YOUTUBE_TAGS_BOX).find('span.yt-chip:last');
    if(!lastTag.hasClass('fua-plugin-youtube-tag')){
        FUA_YT_EDIT_TAGS_WORKER.addOneTagClickListener({
            tag : lastTag
        });
    }
}


function getHintsForSearchTag(){
    var searchInput = $('#'+ ID_OUR_TAG_UPLOAD_INPUT);
    var searchInputVal = searchInput.val().trim();
    if(
        searchInputVal
        //&& $('#' + ID_OUR_SEARCH_HINTS_CHECKBOX).prop('checked')
        && searchInputVal.replace(new RegExp('[^0-9a-zа-я]*', 'gi'), '').length > 2
    ){
        chrome.runtime.sendMessage({
            'title' : 'getSearchHints',
            'body': {'value' : searchInputVal}
        });
    }
    else {
        $('#' + ID_OUR_SEARCH_HINTS_BOX).hide();
        $('#' + ID_OUR_SEARCH_HINTS_BOX).html(null);
        $('#' + ID_OUR_SEARCH_TAGS_PANEL)
            .css('min-height', $('#' + ID_OUR_SEARCH_HINTS_BOX).css('height'));
    }
};


var addTimeCode = function (dbclick){
    var descriptionTextarea =
        $('.metadata-two-column .basic-info-form-input .video-settings-description:first');
    var videoIframe =   $('#vm-video-player iframe').contents();
    var timeVideoCode = videoIframe
        .find("#player .ytp-chrome-bottom .ytp-chrome-controls .ytp-left-controls .ytp-time-display .ytp-time-current:first");


    if(videoIframe.find('.html5-video-player').hasClass('playing-mode')) {
        videoIframe.find('.ytp-play-button').trigger('click');
        videoIframe.find('.ytp-play-button').trigger('click');
    }

    var codeValue = timeVideoCode.html();

    var textValue = $(descriptionTextarea).val();
    var textLength = textValue.length;
    var selectionPoint = descriptionTextarea[0].selectionStart;
    var firstPart = textValue.slice(0, selectionPoint);
    var lastPart = textValue.slice(selectionPoint);

    //console.log('textValue', textValue);
    //console.log('match', textValue.match('\n'));

    if(textLength < 1) $(descriptionTextarea).val(codeValue + ' - ');

    else if(firstPart.trim().length < 1){
        $(descriptionTextarea).val(firstPart + codeValue + ' - ' + lastPart);
    }

    /*else if(firstPart.match('\n[ ]*$') || (lastPart.match('^[ ]*\n') || lastPart.trim().length < 1)){
        $(descriptionTextarea).val(firstPart + codeValue + ' - ' + lastPart);
    }*/

    else if(firstPart.match('\n[ ]*$')){
        $(descriptionTextarea).val(firstPart + codeValue + ' - ' + lastPart);
    }

    else if(lastPart.trim().length > 0){
        //$(descriptionTextarea).val(firstPart + ' ' + codeValue + ' -\n' + lastPart);
        $(descriptionTextarea).val(firstPart + '\n'  + codeValue + ' - ' + lastPart);
    }
    else {
        //$(descriptionTextarea).val(firstPart + ' ' + codeValue + ' - ' + lastPart);
        $(descriptionTextarea).val(firstPart + '\n'  + codeValue + ' - ' + lastPart);
    }

    descriptionTextarea[0].selectionEnd = selectionPoint + 7;

    FUA_YT_EDIT_VIDEO.renderLeftValueCharactersDescription();
};


function checkAllSearchCheckBox(){
    var leastOneActive = false;
    var objectArray = [
        $('#' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX),
        $('#' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX),
        $('#' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX),
        $('#' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX),
    ];

    for(var i in objectArray){
        if(objectArray[i].prop('checked')) leastOneActive = true;
    }

    if(leastOneActive) {
        $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON)
            .removeClass(CLASS_OUR_NO_CHECKBOX_BUTTON);
    }
    else{
        $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON)
            .addClass(CLASS_OUR_NO_CHECKBOX_BUTTON);
    }
}



function getTagsForAddingToDescription(){
    var tags = [];
    $('div.video-settings-tag-chips-container span.yt-chip').each(function(){
        var tagText = $(this).find('span:first').html();
        tagText = tagText.replace(new RegExp('[^0-9a-zа-яёй ]', 'ig'), '').replace(new RegExp('[ ]{2,}', 'ig'), ' ');
        tags.push(tagText);
    });

    return tags;
}

function addToDescriptionEnd(string){
    var descriptionTextarea =
        $('.metadata-two-column .basic-info-form-input .video-settings-description:first');

    var textValue = $(descriptionTextarea).val();
    var textLength = textValue.length;

    if(textLength < 1) $(descriptionTextarea).val(string);
    else if(textValue.match('^[ ]*[\n]*\n$')) {
        $(descriptionTextarea).val(textValue + string);
    }
    else if(textValue.match('\n[ ]*$') || textValue.match('^[ ]*$')) {
        $(descriptionTextarea).val(textValue + '\n' + string);
    }
    else {
        $(descriptionTextarea).val(textValue + '\n\n' + string);
    }

    descriptionTextarea[0].scrollTop = descriptionTextarea[0].scrollHeight - 20;
    descriptionTextarea[0].selectionEnd = $(descriptionTextarea).val().length;
    FUA_YT_EDIT_VIDEO.renderLeftValueCharactersDescription();
}