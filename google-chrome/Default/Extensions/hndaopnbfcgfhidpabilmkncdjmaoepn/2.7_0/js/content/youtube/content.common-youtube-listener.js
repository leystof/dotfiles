chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;


    /*******/
    if (title == 'insertYoutubePlaces') {
        insertYoutubePlaceLabels({
            places : body.places,
            tagObjects : getYoutubeTagObjects(),
            callback : function(){
                $('#' + ID_OUR_SEARCH_PLACE_PROGRESS).hide();
                $('#' + ID_OUR_VIDEO_YOUTUBE_PLACE_CIRCLE_LOAD).hide();

                $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE).show();
                $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE).parent().show();

                $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE)
                    .closest('.fua-plugin-youtube-video-show-text-line')
                    .css('margin-top', 11);

                $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE_BOX).show();

            }
        });
    }



    /*******/
    if (title == 'insertYandexKeywordsRank') {
        $('#' + ID_OUR_TAGS_INFORM_BLOCK).html(null);

        insertYandexVolumeLabels({
            ranks : body.ranks,
            tagObjects : getYoutubeTagObjects()
        });

        if(body.captcha){
            insertCaptcha({
                captcha : body.captcha,
                word : body.word.toLowerCase(),
                targetAction : 'getRanks',
                additional : {
                    words: body.words,
                    wordIndex: body.wordIndex
                }
            });
        }
        else if(body.noAuth){
            noAuthInYandexDirect();
            $('#' + ID_OUR_VIDEO_YOUTUBE_PLACE_CIRCLE_LOAD).hide();

            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).parent().show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD)
                .closest('.fua-plugin-youtube-video-show-text-line')
                .css('margin-top', 11);
        }
        else if(body.noPassportLogin){
            noPassportLogin();
            $('#' + ID_OUR_VIDEO_YOUTUBE_PLACE_CIRCLE_LOAD).hide();

            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).parent().show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD)
                .closest('.fua-plugin-youtube-video-show-text-line')
                .css('margin-top', 11);
        }
        else{
            $('#' + ID_OUR_YANDEX_RANKS_CIRCLE_LOAD).hide();

            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).parent().show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD)
                .closest('.fua-plugin-youtube-video-show-text-line')
                .css('margin-top', 11);
        }
    }



    /*******/
    if (title == 'noAuthInYandexDirect') { noAuthInYandexDirect(); }



    /*******/
    if (title == 'noPassportLogin') { noPassportLogin(); }


    /*******/
    if (title == 'verifyYandexCaptchaResponse') {
        if(body.verify) {
            $('#' + ID_OUR_TAGS_INFORM_BLOCK).html(
                C_TEXT_CAPTCHA_VERIFY_SUCCESS
            );

            if(body.targetAction == 'getRanks'){
                var ranks = {};
                ranks[body.word] = body.additional.rank;

                insertYandexVolumeLabels({
                    ranks : ranks,
                    tagObjects : getYoutubeTagObjects()
                });

                if(body.additional.words[body.additional.wordIndex + 1]){
                    //console.log("vYes");
                    chrome.runtime.sendMessage({
                        'title': 'getYandexKeywordsRank',
                        'body': {'tags': body.additional.words, 'wordIndex' : body.additional.wordIndex + 1}
                    });
                }
                else {
                    $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).show();
                    //console.log("vNo");
                    if($("#" + FUA_YT_YANDEX_KW.id.horizontal_block).length){
                        $("#" + FUA_YT_YANDEX_KW.id.h_progress_bar).remove();
                        $("#" + FUA_YT_YANDEX_KW.id.control_panel).show();
                    }
                }
            }
            else if(body.targetAction == 'getKeywords'){
                $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).show();
            }
        }
        else {
            insertCaptcha({
                captcha : body.captcha,
                word : body.word,
                targetAction : body.targetAction,
                additional : body.additional
            });
        }
    }


    /*******/
    if (title == 'progressYoutubePlaceSearching') {
        if($('#' + ID_OUR_SEARCH_PLACE_PROGRESS_PERCENTAGE).length > 0){
            $('#' + ID_OUR_SEARCH_PLACE_PROGRESS_PERCENTAGE)
                .html(body.progress + '%');

            $('#' + ID_OUR_SEARCH_PLACE_PROGRESS_LINE_INNER).animate({
                marginLeft: (body.progress - 100) + '%'
            }, 200);
        }
        else if($(SELECTORS_OUR_YOUTUBE_PLACE_CIRCLE_LOAD).length > 0){
            $(SELECTORS_OUR_YOUTUBE_PLACE_CIRCLE_LOAD).data('percent', body.progress);
            updateCircleProgress(
                $(SELECTORS_OUR_YOUTUBE_PLACE_CIRCLE_LOAD)
            );
        }
    }

    /*******/
    if (title == 'progressYandexRanksSearching') {
        if($(SELECTORS_OUR_YANDEX_KEYWORDS_CIRCLE_LOAD).length > 0){
            $(SELECTORS_OUR_YANDEX_KEYWORDS_CIRCLE_LOAD).data('percent', body.progress);
            updateCircleProgress(
                $(SELECTORS_OUR_YANDEX_KEYWORDS_CIRCLE_LOAD)
            );
        }
        else if($("#" + FUA_YT_YANDEX_KW.id.horizontal_block).length){
            $("#" + FUA_YT_YANDEX_KW.id.control_panel).hide();
            FUA_YT_PROGRESS_BAR.createProgressBar({
                progress_id : FUA_YT_YANDEX_KW.id.h_progress_bar,
                target_element : document.getElementById(FUA_YT_YANDEX_KW.id.horizontal_block)
            });

            FUA_YT_PROGRESS_BAR.updateProgressBar({
                progress_id : FUA_YT_YANDEX_KW.id.h_progress_bar,
                percentages : body.progress,
                finalCallback : function(){
                    $("#" + FUA_YT_YANDEX_KW.id.h_progress_bar).remove();
                    $("#" + FUA_YT_YANDEX_KW.id.control_panel).show();
                }
            })
        }
    }


    /*******/
    if (title == 'noOurChannelsInFavorites') {
        gv_content_is_our_channel_in_favorites = false;
        gv_content_channel_id = body.channel_id;
        /*location.replace(
            "https://www.youtube.com/channel/"+ body.channel_id +
            "?ourchannels=yes&previous_page=" + window.location.href
        );*/
    }

});