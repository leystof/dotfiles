function getYoutubeTagObjects(){
    if($(FUA_YT_EDIT_TAGS_WORKER.selector.added_tags).length > 0){
        return $(FUA_YT_EDIT_TAGS_WORKER.selector.added_tags);
    }
    else if($(SELECTORS_YOUTUBE_WATCH_VIDEO_TAGS).length > 0){
        return $(SELECTORS_YOUTUBE_WATCH_VIDEO_TAGS);
    }
    return null;
}


function getYoutubePlaces(options){
    var tagsSelector = options.tagsSelector;
    var videoId =options.videoId;
    var callback = options.callback;

    $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE).click(function(){
        var currentTags = [];
        $(tagsSelector).each(function() {
            if(
                $(this).find('.fua-plugin-youtube-tag-place-in-youtube-label').length < 1
            ) {
                currentTags.push($(this).find('span:first').html());
            }
        });

        if(currentTags.length > 0) {
            chrome.runtime.sendMessage({
                'title': 'getVideoPlaceInYoutubeByTags',
                'body': {'id': videoId, 'tags': currentTags}
            });

            $(this).hide();
            if(callback) callback($(this));
        }
    });
}


function insertYoutubePlaceLabels(options){
    var places = options.places;
    var tagObjects = options.tagObjects;
    var callback = options.callback;

    if(tagObjects) {
        tagObjects.each(function () {
            if (
                $(this).find('.fua-plugin-youtube-tag-place-in-youtube-label').length < 1
                && places[$(this).find('span:first').html()]
            ) {
                var text = places[$(this).find('span:first').html()];
                if (text == 'more') text = '20+';
                else text++;

                var style = '';
                if (text !== '20+' && parseInt(text) < 21){
                    style = 'style="background-color: #009900; color: #ffffff;"';
                }

                $(this).prepend(
                    '<div ' + style + ' class="fua-plugin-youtube-tag-place-in-youtube-label">' +
                        text +
                    '<div>'
                )
            }
        });
    }

    callback();
}


function getYandexVolumeForTags(options){
    var tagsSelector = options.tagsSelector;
    var callback = options.callback;

    $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).click(function(){
        var currentTags = [];
        $(tagsSelector).each(function() {
            if($(this).find('.'+CLASS_OUR_TAG_YANDEX_RANK_LABEL).length < 1) {
                currentTags.push($(this).find('span:first').html());
            }
        });

        if($('div.fua-plugin-youtube-no-added-tag').length > 0){
            $('div.fua-plugin-youtube-no-added-tag').each(function(){
                if($(this).find('.fua-plugin-youtube-yandex-keywords-label-not-added-tag').length < 1){
                    currentTags.push($(this).find('.fua-plugin-youtube-no-added-tag-text').html());
                }
            });
        }

        console.log(currentTags);

        if(currentTags.length > 0) {
            chrome.runtime.sendMessage({
                'title': 'getYandexKeywordsRank',
                'body': {'tags': currentTags}
            });
            $(this).hide();
            if(callback) callback($(this));
        }
    });
}


function insertYandexVolumeLabels(options){
    var ranks = options.ranks;
    var tagObjects = options.tagObjects;
    if(tagObjects) {
        tagObjects.each(function () {
            var tag = $(this).find('span:first').html().toLowerCase();
            if (
                $(this).find('.' + CLASS_OUR_TAG_YANDEX_RANK_LABEL).length < 1
                && (ranks[tag] || ranks[tag] == '0')
            ) {
                var style = '';
                if (parseInt(ranks[tag]) > 100000) {
                    style = 'style="background-color: #FFFF66; color: #000000;"';
                }

                $(this).find('span:first').after(
                    '<div style="display: inline-block;">' +
                        '<div ' + style + ' class="' + CLASS_OUR_TAG_YANDEX_RANK_LABEL + '">' +
                            numberWithDelimiters(ranks[tag], '`') +
                        '</div>' +
                        '<div style="visibility: hidden; padding: 0px 2px 0px; font-size: 8px; margin-left: 5px; min-width: 16px;">' +
                            numberWithDelimiters(ranks[tag], '`') +
                        '</div>' +
                    '</div>'
                )
            }
        });
    }

    if($('div.fua-plugin-youtube-no-added-tag').length > 0){
        $('div.fua-plugin-youtube-no-added-tag').each(function(){
            var tag = $(this).find('.fua-plugin-youtube-no-added-tag-text').html().toLowerCase();
            if(
                $(this).find('.fua-plugin-youtube-yandex-keywords-label-not-added-tag').length < 1
                && (ranks[tag] || ranks[tag] == '0')
            ){
                $(this).find('.fua-plugin-youtube-no-added-tag-text').after(
                    '<span class="fua-plugin-youtube-yandex-keywords-label-not-added-tag">' +
                        numberWithDelimiters(ranks[tag], '`')  +
                    '</span>'
                );
            }
        });
    }
}


function insertCaptcha(options){
    $('#' + ID_OUR_TAGS_INFORM_BLOCK).html(
        '<div><img style="width: 230px;" id="'+ ID_OUR_YANDEX_CAPTCHA_IMG +'" src="'+ options.captcha +'"></div>' +
        '<div id="'+ ID_OUR_YANDEX_CAPTCHA_RELOAD +'">' +
            '<img style="height: 10px" src="'+ IMAGE_RELOAD_URL +'"/>' +
            '<span style="margin-left: 5px;">' +
                C_TEXT_RELOAD_CAPTCHA +
            '</span>' +
        '</div>' +
        '<input id="'+ ID_OUR_YANDEX_CAPTCHA_INPUT +'" type="text" targetAction="'+ options.targetAction +'" lastWord="'+ options.word +'">' +
        '<div id="'+ ID_OUR_YANDEX_CAPTCHA_SUBMIT +'" class="yt-uix-button yt-uix-button-size-default yt-uix-tooltip yt-uix-button-primary fua_blogger_button">' +
            'Ok' +
        '</div>'
    );

    var currentBottom =  window.innerHeight + window.scrollY;
    var targetTop =  $('#' + ID_OUR_YANDEX_CAPTCHA_IMG).offset().top;

    if(currentBottom < targetTop + 130){
        $('html, body').animate({
            scrollTop:  targetTop + 130 -  window.innerHeight
        }, 200);
    }

    $('#' + ID_OUR_YANDEX_CAPTCHA_SUBMIT).click(function(){
        var captchaCode =
            $('#' + ID_OUR_YANDEX_CAPTCHA_INPUT).val().trim();

        if(captchaCode) {
            var tmp = $('#' + ID_OUR_YANDEX_CAPTCHA_IMG).attr('src');
            tmp = tmp.match('key=(.*)$');

            var additional = {};
            if(options.additional) additional = options.additional;

            chrome.runtime.sendMessage({
                'title': 'verifyYandexCaptcha',
                'body': {
                    'captchaId': tmp[1],
                    'captchaCode': captchaCode.toUpperCase(),
                    'word' : $('#' + ID_OUR_YANDEX_CAPTCHA_INPUT).attr('lastWord'),
                    'additional' : additional,
                    'targetAction' : $('#' + ID_OUR_YANDEX_CAPTCHA_INPUT).attr('targetAction')
                }
            });

            $('#' + ID_OUR_TAGS_INFORM_BLOCK).html(C_TEXT_CONTINUA_VERIFY_CAPTCHA);
        }
    });

    $('#' + ID_OUR_YANDEX_CAPTCHA_RELOAD).click(function(){
        var tmp = $('#' + ID_OUR_YANDEX_CAPTCHA_IMG).attr('src');
        tmp = tmp.match('key=(.*)$');

        var additional = {};
        if(options.additional) additional = options.additional;

        chrome.runtime.sendMessage({
            'title': 'verifyYandexCaptcha',
            'body': {
                'captchaId': tmp[1],
                'captchaCode': '1',
                'word' : $('#' + ID_OUR_YANDEX_CAPTCHA_INPUT).attr('lastWord'),
                'additional' : additional,
                'targetAction' : $('#' + ID_OUR_YANDEX_CAPTCHA_INPUT).attr('targetAction')
            }
        });

        $('#' + ID_OUR_TAGS_INFORM_BLOCK).html(C_TEXT_CONTINUA_RELOADING_CAPTCHA);
    });
}


function noAuthInYandexDirect(){
    console.log('noAuthInYandexDirect');
    $('#fua-plugin-youtube_yandex_ranks_circle_load').hide();
    var newWindowWidth = 700;
    var newWindowHeight = 700;
    var newWindow = window.open(
        "https://passport.yandex.ru/auth?origin=direct&retpath=https://direct.yandex.ru/",
        chrome.i18n.getMessage("authorization_in_yandex_direct"),
        "left="+ (screen.width - newWindowWidth) / 2 +
        ",top="+ (screen.height - newWindowHeight) / 2 +
        ",width="+ newWindowWidth +"" +
        ",height=" + newWindowHeight
    );
}

function noPassportLogin(){
    console.log('noPassportLogin');
    $('#fua-plugin-youtube_yandex_ranks_circle_load').hide();
    var newWindowWidth = 700;
    var newWindowHeight = 700;
    var newWindow = window.open(
        "https://passport.yandex.ru/passport?create_login=1&mode=postregistration&create_password=1",
        chrome.i18n.getMessage("word_registration"),
        "left="+ (screen.width - newWindowWidth) / 2 +
        ",top="+ (screen.height - newWindowHeight) / 2 +
        ",width="+ newWindowWidth +"" +
        ",height=" + newWindowHeight
    );
}


function getVideoIdFormUrl(string){
    var url = string.trim();
    if(url.match('[ ]')) return false;
    if(!url.match('(http|https)://.*youtube.*/.*')) return false;

    var video_id = url.match('v=([^\?\#]*)');
    if(video_id) return video_id[1];
    else return false;
}


function askActionByInputValue(value, title){
    var newValue = getVideoIdFormUrl(value);
    if(newValue) value = newValue;

    if(value) {
        chrome.runtime.sendMessage({
            'title': title,
            'body': {'input': value}
        });
    }
}


function changeCopyButtonText(){
    var selectedClass = 'fua-plugin-youtube-watch-video-tags-selected';
    if($('.' + selectedClass).length > 0){
        $('#' + ID_OUR_VIDEO_COPY_TAGS_BUTTON).html(C_TEXT_COPY_SELECTED_TAGS_BUTTON);
    }
    else $('#' + ID_OUR_VIDEO_COPY_TAGS_BUTTON).html(C_TEXT_COPY_TAGS_BUTTON);
}


function selectTagsByClick(){
    $('span.fua-plugin-youtube-watch-video-tags').click(function(){
        var selectedClass = 'fua-plugin-youtube-watch-video-tags-selected';
        if($(this).hasClass(selectedClass)) {
            $(this).removeClass(selectedClass);
        }
        else $(this).addClass(selectedClass);
        changeCopyButtonText();
    });
}


function checkIsOurChannelInFavorites(){
    /*$('.fua-plugin-youtube-check-is-our-channel-in-favorites').click(function(){
        if(!gv_content_is_our_channel_in_favorites && gv_content_channel_id){
            location.replace(
                "https://www.youtube.com/channel/"+ gv_content_channel_id +
                "?ourchannels=yes&previous_page=" + window.location.href
            );
        }
    });*/

    document.addEventListener('click', function (event) {
        if (event.button == 0) {
            //console.log('check', event.srcElement.className);
            //console.log('length', $(event.srcElement).closest('.fua-plugin-youtube-check-is-our-channel-in-favorites').length);
            if (
                event.srcElement.className.match('fua-plugin-youtube-check-is-our-channel-in-favorites')
                || $(event.srcElement).closest('.fua-plugin-youtube-check-is-our-channel-in-favorites').length > 0
            ) {
                if(!gv_content_is_our_channel_in_favorites && gv_content_channel_id){
                    location.replace(
                        "https://www.youtube.com/channel/"+ gv_content_channel_id +
                        "?ourchannels=yes&previous_page=" + window.location.href
                    );
                }
            }
        }
    });
}