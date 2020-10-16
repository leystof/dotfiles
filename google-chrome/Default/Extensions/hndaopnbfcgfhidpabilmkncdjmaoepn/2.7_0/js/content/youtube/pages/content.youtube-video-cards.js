chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;


    /*******/
    if (title == 'addHtmlToYoutubeCards') {
        if($('div#fua-test-id').length < 1) {
            chrome.runtime.sendMessage({'title': 'get10VideosCard'});
            $('html').append('<div id="fua-test-id"><div>');

            $('html').append(
                '<div class="fua-plugin-youtube-tool-tip">' +
                    '<div class="yt-uix-tooltip-tip-content">' +
                        C_TEXT_TOOLTIP_SAVE_IN_PATTERN +
                    '</div>' +
                    '<div style="width: 1px; margin: 0px auto 0px;">' +
                        '<img style="position: absolute; margin-left: -4px;" src="'+ IMAGE_TRIANGLE_URL + '"/>' +
                    '</div>' +
                '</div>'
            );

            $('div.add-card-container').after(
                '<div style="margin-top: 10px;">' +
                    '<div style="border: 2px solid orange; width: 375px;" id="'+ ID_OUR_ANNOTATION_COPY_BOX +'">' +
                        '<div>' +
                            '<div style="float: right;">' +
                                '<div id="'+ C_ANNOTATION.idCloseCopyAnnotationsBlock +'">' +
                                    '&times;' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<input id="'+ ID_OUR_ANNOTATION_VIDEO_SEARCH_INPUT +'" type="text" placeholder="'+ C_SEARCH_ANNOTATION_PLACEHOLDER +'"/>' +
                        '<div style="max-height: 550px;" id="'+ ID_OUR_ANNOTATION_VIDEO_SEARCH_RESULT_BOX +'">' +
                        '</div>' +
                    '</div>' +
                '</div>'
            );

            $('#' + C_ANNOTATION.idCloseCopyAnnotationsBlock).click(function(){
                $('#' + ID_OUR_ANNOTATION_COPY_BOX).hide();
            });

            addSaveIcon();

            document.addEventListener('click', function (event) {
                if (event.button === 0) {
                    if (
                        event.srcElement.className.match('annotator-save')
                        || $(event.srcElement).parent('.annotator-save').length > 0
                        || event.srcElement.className.match('annotator-delete')
                        || $(event.srcElement).parent('.annotator-delete').length > 0
                        || event.srcElement.className.match('yt-uix-button-icon-annotation-delete')
                    ) {
                        console.log('saveClick');
                        addSaveIcon();
                    }
                }
            });


            insertSavedCards(body.savedCards);

            $('#cards-editor-add-card').click(function(){
                $('#' + C_ANNOTATION.idSavedAnnotationsBlock).hide();
                $('#' + ID_OUR_ANNOTATION_COPY_BOX).hide();

                setTimeout(function() {
                    if($('div.fua-plagin-youtube-card-menu-item').length < 1) {
                        $('div.yt-uix-clickcard-card-content').prepend(
                            '<div class="annotator-clickcard-item clearfix fua-plagin-youtube-card-menu-item"> ' +
                                '<div class="annotator-clickcard-left" tabindex="5"> ' +
                                    '<div class="annotator-clickcard-title">' +
                                        C_TEXT_COPY_CARDS_FROM_TITLE + ' ' +
                                    '</div> ' +
                                    '<div class="annotator-clickcard-subtitle">' +
                                        C_TEXT_COPY_CARDS_FROM_DESCRIPTION + ' ' +
                                    '</div> ' +
                                '</div> ' +
                                '<div class="annotator-clickcard-right"> ' +
                                    '<button id="'+ C_CARDS.idCopyMenuItemButton +'" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default annotator-create-button yt-uix-clickcard-close fua-plugin-youtube-check-is-our-channel-in-favorites" type="button">' +
                                        '<span class="yt-uix-button-content">' +
                                            C_TEXT_WORD_COPY +
                                        '</span>' +
                                    '</button>' +
                                '</div> ' +
                            '</div>'
                        );

                        $('#' + C_CARDS.idCopyMenuItemButton).click(function(){
                            $('#' + ID_OUR_ANNOTATION_COPY_BOX).show();
                        });

                        insertSavedCards(body.savedCards);

                        $('div.yt-uix-clickcard-card-content div.annotator-clickcard-item')
                            .css('padding-bottom', 10)
                            .css('padding-top', 10);
                    }
                }, 1);
            });


            $('#' + ID_OUR_ANNOTATION_VIDEO_SEARCH_INPUT).keypress(function (e) {
                if (e.which == 13) askActionByInputValue($(this).val(), 'getCards');
            });

            FUA_YT_GV.xsrf_token = FUA_GET_VALUE.getXsrfToken($('body').html());
            FUA_YT_GV.video_id = FUA_GET_VALUE.getVideoIdFromUrl(window.location.href);

            chrome.runtime.sendMessage({
                'title': 'getChannelData',
                'body': {'video_id': FUA_YT_GV.video_id}
            });

            updateVideoDuration();
            checkIsOurChannelInFavorites();
        }
    }


    /*******/
    if (title == 'insertCards') {
        $('#' + ID_OUR_ANNOTATION_VIDEO_SEARCH_RESULT_BOX).html(null);
        var videos = body.videos;
        FUA_YT_CARDS_EDIT.copyPatterns = {};

        var nothingFind = true;
        for (var i in videos) {
            if (videos[i] && videos[i].annotations){
                nothingFind = false;
                break;
            }
        }

        if(nothingFind){
            $('#' + ID_OUR_ANNOTATION_VIDEO_SEARCH_RESULT_BOX)
                .html(C_TEXT_FOUND_NOTHING);
        }
        else {
            var addOrangeBorder = true;

            for (var i in videos) {
                var annotationsString = '';
                if (videos[i] && videos[i].id != FUA_YT_GV.video_id && videos[i].annotations) {
                    var annotations = videos[i].annotations;

                    for (var j in annotations) {
                        FUA_YT_CARDS_EDIT.copyPatterns[j] = annotations[j];

                        if (annotations[j].text || annotations[j].link) {
                            if(annotations[j].text) var text = annotations[j].text;
                            else var text = annotations[j].link;

                            annotationsString +=
                                '<div>' +
                                    '<input ' +
                                        'title="' + text + '" ' +
                                        'type="checkbox" ' +
                                        'class="' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX + '" ' +
                                        'annotation-id="' + j + '" ' +
                                    '/>' +
                                    '<div style="display: inline-block; height: 14px;">' +
                                        '<div style="display: inline-block;">' +
                                            '<div style="width: 200px;" class="fua-plagin-youtube-three-dots">' +
                                                '(' + annotations[j].style + ') ' + text +
                                            '</div>' +
                                        '</div>' +
                                        '<div style="display: inline-block; margin-left: 50px;">' +
                                            '<div style="overflow: hidden;">' +
                                                getTimeStringFromMillisecond(annotations[j].timeFrom)
                                                    .replace(new RegExp('\.[0-9]*$', 'i'), '') +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>'
                        }
                    }

                    var style = '';
                    if(addOrangeBorder) {
                        style = 'border-top: 2px solid orange';
                        addOrangeBorder = false;
                    }

                    $('#' + ID_OUR_ANNOTATION_VIDEO_SEARCH_RESULT_BOX).append(
                        '<div style="'+ style +'" class="' + CLASS_OUR_ANNOTATION_ITEM + '">' +
                            '<div class="' + CLASS_OUR_ANNOTATION_ITEM_TITLE + '">' +
                                '<span style="display: inline-block; width: 335px;" class="fua-plagin-youtube-three-dots">' +
                                    videos[i].title +
                                '</span>' +
                                '<span class="fua-plugin-youtube-arrow-block"></span>' +
                            '</div>' +
                            '<div class="' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATIONS + '">' +
                                '<div style="padding: 10px 0px 10px 20px">' +
                                    annotationsString +
                                '</div>' +
                                '<div style="text-align: center; padding: 15px; font-size: smaller; border-top: 1px solid #555;">' +
                                    '<div>' +
                                        C_TEXT_INSERT_COUNT_TIME +
                                    '</div>' +
                                    '<div>' +
                                        '<span class="' + CLASS_OUR_ADD_ANNOTATIONS_TO_START + '">' +
                                            C_TEXT_FROM_START +
                                        '</span>' +
                                        ' '+ C_TEXT_WORD_OR +' ' +
                                         '<span class="' + CLASS_OUR_ADD_ANNOTATIONS_TO_END + '">' +
                                            C_TEXT_FROM_END +
                                        '</span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    );
                }
            }




            $('.' + CLASS_OUR_ANNOTATION_ITEM_TITLE).click(function(){
                var item = $(this).closest('.' + CLASS_OUR_ANNOTATION_ITEM);
                item.find('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATIONS).toggle();
                if($(this).hasClass('fua-plugin-youtube-annotation-item-title-visited')){
                    $(this).removeClass('fua-plugin-youtube-annotation-item-title-visited');
                }
                else $(this).addClass('fua-plugin-youtube-annotation-item-title-visited');
            });


            $('#' + ID_OUR_ANNOTATION_VIDEO_SEARCH_RESULT_BOX + ' .' + CLASS_OUR_ADD_ANNOTATIONS_TO_START).click(function () {
                var item = $(this).closest('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATIONS);
                insertCards({
                    cards : getCheckboxCards( item.find('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX)),
                    cardsObject : FUA_YT_CARDS_EDIT.copyPatterns,
                    callback : function(){
                        location.reload();
                        console.log('start cards Inserted');
                    }
                });
            });

            $('#' + ID_OUR_ANNOTATION_VIDEO_SEARCH_RESULT_BOX + ' .' + CLASS_OUR_ADD_ANNOTATIONS_TO_END).click(function () {
                var item = $(this).closest('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATIONS);
                insertCards({
                    cards : getCheckboxCards( item.find('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX)),
                    cardsObject : FUA_YT_CARDS_EDIT.copyPatterns,
                    fromWhere : 'end',
                    callback : function(){
                        location.reload();
                        console.log('end cards Inserted');
                    }
                });
            });
        }

    }


    /**********/
    if (title == 'insertSavedCards') {
        insertSavedCards(body.savedCards);
    }
});


function insertCards(options){
    var cardIds = options.cards;
    if(!cardIds || !cardIds.length) return;


    FUA_MW.addLoadingWindow({
        target : 'update_card_loading',
        callback : function () {}
    });


    var callback = options.callback;
    var index = 0;
    if(options.index) index = options.index;
    var fromWhere = 'start';
    if(options.fromWhere) fromWhere = options.fromWhere;

    var blobs = {};
    if(options.blobs) blobs = options.blobs;



    var cardId = cardIds[index];
    var card = options.cardsObject[cardId].data;
    //console.log("cardsObject", options.cardsObject);
    var cardVideoDuration = options.cardsObject[cardId].videoDuration;

    if(card.card_type == 'video') {
        var video_item_id = card.url.match('v=([^\&]*)');
        video_item_id = video_item_id[1];
    }

    if(card.card_type == 'playlist') {
        var video_item_id = card.url.match('list=([^\&]*)');
        video_item_id = video_item_id[1];
        card.card_type = 'video';
    }


    if(card.card_type == 'simple') card.card_type = 'associated';

    var data = new FormData();


    data.append('type', card.card_type);

    console.log('card', card);
    var start_ms = card.start_ms;
    if(fromWhere && fromWhere == 'end') {
        start_ms =  FUA_YT_GV.video_duration - (cardVideoDuration - card.start_ms);
    }
    if(start_ms > FUA_YT_GV.video_duration) start_ms = FUA_YT_GV.video_duration;
    else if(start_ms < 0) start_ms = 0;

    data.append('start_ms', start_ms);

    if(card.card_type != 'poll' && card.card_type != 'video') data.append('teaser_text', card.teaser_text);
    data.append('custom_message', card.custom_message);
    data.append('title', card.title);
    //data.append('image_url', card.image_url);

    if(card.card_type == 'video') data.append('video_item_id', video_item_id);
    if(card.card_type == 'collaborator') data.append('channel_url', card.url);
    if(card.card_type.match('simple|merch|fundraising|associated')) {
        let correctUrl = card.url;
        if(card.url.match('^/redirect')){
            let match = card.url.match('[\\?&]q=([^&]+)');
            if(match) correctUrl = decodeURIComponent(match[1]);
        }
        data.append('target_url', correctUrl);
    }

    data.append('show_warnings', true);
    if(card.card_type != 'poll') data.append('key', cardId);
    data.append('action_create_' + card.card_type, 1);

    if(card.card_type == 'poll'){
        for(var i in card.choices){
            data.append('choices', card.choices[i].desc);
        }
    }

    data.append('session_token', FUA_YT_GV.xsrf_token);
    //data.append('imagefile', card.image_url);

    if(card.image_url && blobs[card.image_url]){
        data.append('imagefile', blobs[card.image_url]);
        sendAjax();
    }
    else if(card.image_url) {
        FUA_YOUTUBE_FILE_HELPER.getBlobFromUrl({
            url: card.image_url,
            callback: function (blob) {
                blobs[card.image_url] = blob;
                data.append('imagefile', blob);
                sendAjax();
            }
        });
    }
    else sendAjax();

    function sendAjax() {
        $.ajax({
            type: 'POST',
            url: 'https://www.youtube.com/cards_ajax?v=' + FUA_YT_GV.video_id,
            processData: false,
            contentType: false,
            data: data
        }).done(function(res){
            if(card.card_type.match('simple|merch|fundraising|associated')){
                var val = res.match('<textarea class="response">(.*)</textarea>')[1];
                var json = $.parseJSON(val);
                console.log('json', json);
                if(json.errors || json.feature_templates) {
                    var card_type = card.card_type;
                    if(card_type == 'associated') {
                        options.cardsObject[cardId].data.card_type = 'fundraising';
                    }
                    else if(card_type == 'fundraising') {
                        options.cardsObject[cardId].data.card_type = 'merch';
                    }

                    if(card_type.match('fundraising|associated')) {
                        insertCards({
                            cards: cardIds,
                            cardsObject : options.cardsObject,
                            callback: callback,
                            index: index,
                            fromWhere: fromWhere,
                            blobs : blobs
                        });
                        return false;
                    }
                    else{
                        options.cardsObject[cardId].data.card_type = 'simple';
                    }
                }
                else{
                    options.cardsObject[cardId].data.card_type = 'simple';
                }
            }


            if(cardIds[index + 1]){
                insertCards({
                    cards : cardIds,
                    cardsObject : options.cardsObject,
                    callback : callback,
                    index : index + 1,
                    fromWhere: fromWhere,
                    blobs : blobs
                });
            }
            else callback();
        });
    }
}

//getCheckboxAnnotationInformation
function getCheckboxCards(checkboxes) {
    var cards = [];
    checkboxes.each(function () {
        if ($(this).prop('checked')) cards.push($(this).attr('annotation-id'));
    });

    return cards;
}


function addSaveIcon(time){
    //console.log('addSaveIcon');
    if(!time) var time = 0;
    //setTimeout(function () {
        $('div.annotator-list div.annotator-list-item').each(function(){
            if($(this).find('.fua-plugin-youtube-save-card-icon').length < 1){


                var card_id = $(this).attr('data-item-key');
                var videoID_and_cardsID = FUA_YT_GV.video_id + '%%%' + card_id;

                var save_icon = IMAGE_SAVE_URL;
                var save_icon_class = "fua-plugin-youtube-save-card-icon";
                //console.log('savedCards', FUA_YT_CARDS_EDIT.ourPatterns);
                if(FUA_YT_CARDS_EDIT.ourPatterns[videoID_and_cardsID]){
                    save_icon = IMAGE_SAVE_GREEN_URL;
                    save_icon_class +=  " fua-plugin-youtube-saved-yet-card-icon";
                }

                $(this).find('div.annotator-list-item-edit').before(
                    '<img class="'+ save_icon_class +'" src="' + save_icon + '">'
                    //'<div id="yt-uix-tooltip7" class="yt-uix-tooltip-tip yt-uix-tooltip-tip-reverse yt-uix-tooltip-tip-visible" style="left: 250px; top: 639.784px;"><div class="yt-uix-tooltip-tip-body" style="left: -70px;"><div aria-hidden="true" class="yt-uix-tooltip-tip-content" id="yt-uix-tooltip7-content">Каналы: ‪AvrilLavigneVEVO‬</div></div><div class="yt-uix-tooltip-tip-arrow"></div></div>'
                );

                $(this).find('img.fua-plugin-youtube-save-card-icon').click(function(){
                    if(!$(this).hasClass('fua-plugin-youtube-saved-yet-card-icon')) {
                        var item = $(this).closest('div.annotator-list-item');
                        var card_id = item.attr('data-item-key');
                        $(this).addClass('fua-plugin-youtube-saved-yet-card-icon');
                        $(this).attr('src', IMAGE_SAVE_GREEN_URL);
                        chrome.runtime.sendMessage({
                            'title': 'saveCard',
                            'body': {
                                'annotation_id': card_id,
                                'video_id': FUA_YT_GV.video_id,
                                'video_duration': FUA_YT_GV.video_duration,
                                'channel_id' : FUA_GET_VALUE.getExternalChannelId(),
                                'channel_name' : $("span.yt-user-name ").html()
                            }
                        });
                    }
                });

                $(this).find('img.fua-plugin-youtube-save-card-icon').hover(
                    function(e){
                        if(!$(this).hasClass('fua-plugin-youtube-saved-yet-card-icon')) {
                            var toolTip = $('div.fua-plugin-youtube-tool-tip');
                            toolTip.css('left', $(this).offset().left);
                            toolTip.css('top', $(this).offset().top);
                            toolTip.css('margin-top', '-37px');
                            toolTip.show();
                            toolTip.css('margin-left', (toolTip.outerWidth() - $(this).outerWidth()) / 2 * (-1));
                            toolTip.css('visibility', 'visible');

                            console.log(toolTip.outerWidth());
                            console.log($(this).outerWidth());
                        }
                    },
                    function(e){
                        var toolTip = $('div.fua-plugin-youtube-tool-tip');
                        toolTip.hide();
                    }
                );
            }
        });
    //}, 1000);
    if(time < 5000){
        setTimeout(function(){
            addSaveIcon(time + 500);
        }, 500);
    }
}


function insertSavedCards(sAnnotation){
    $('#' + C_ANNOTATION.idSavedAnnotationsBlock).remove();
    $('#' + C_CARDS.idSavedMenuItemButton).closest('.fua-plagin-youtube-card-menu-item').remove();
    var saveAnnotations = sAnnotation;
    FUA_YT_CARDS_EDIT.ourPatterns = sAnnotation;

    var isSavedAnnotations = false;
    if(saveAnnotations){
        for(var i in saveAnnotations){
            isSavedAnnotations = true;
            break;
        }
    }

    if(isSavedAnnotations) {
        setTimeout(function() {
            if($('div.fua-plagin-youtube-card-menu-item').length < 2) {
                $('div.yt-uix-clickcard-card-content').prepend(
                    '<div class="annotator-clickcard-item clearfix fua-plagin-youtube-card-menu-item" style="padding-bottom: 10px; padding-top: 10px;"> ' +
                        '<div class="annotator-clickcard-left" tabindex="6"> ' +
                            '<div class="annotator-clickcard-title">' +
                                C_TEXT_COMPLETED_CARDS_PATTERNS_TITLE +
                            '</div> ' +
                            '<div class="annotator-clickcard-subtitle">' +
                                C_TEXT_COMPLETED_CARDS_PATTERNS_DESCRIPTION +
                            '</div> ' +
                        '</div> ' +
                        '<div class="annotator-clickcard-right"> ' +
                            '<button id="'+ C_CARDS.idSavedMenuItemButton +'" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default annotator-create-button yt-uix-clickcard-close fua-plugin-youtube-check-is-our-channel-in-favorites" type="button">' +
                                '<span class="yt-uix-button-content">' +
                                    C_TEXT_WORD_ADD +
                                '</span>' +
                            '</button>' +
                        '</div> ' +
                    '</div>'
                );

                $('#' + C_CARDS.idSavedMenuItemButton).click(function(){
                    $('#' + C_ANNOTATION.idSavedAnnotationsBlock).show();
                });
            }
        }, 2);

        var annotationsString = FUA_YT_CARDS_EDIT.createHtmlAnnotationsList(saveAnnotations);

        $('div.add-card-container').after(
            '<div id="'+ C_ANNOTATION.idSavedAnnotationsBlock +'">' +
                '<div>' +
                    '<div style="float: right;">' +
                        '<div id="'+ C_ANNOTATION.idCloseSavedAnnotationsBlock +'">' +
                            '&times;' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div style="padding: 10px 20px 10px;">' +
                    annotationsString +
                '</div>' +
                '<div class="fua-plagin-youtube-annotation-item-footer" style="border-top: 2px solid orange;">' +
                    '<div>' +
                        C_TEXT_INSERT_COUNT_TIME +
                    '</div>' +
                    '<div>' +
                        '<span class="' + CLASS_OUR_ADD_ANNOTATIONS_TO_START + '">' +
                            C_TEXT_FROM_START +
                        '</span>' +
                        ' '+ C_TEXT_WORD_OR +' ' +
                        '<span class="' + CLASS_OUR_ADD_ANNOTATIONS_TO_END + '">' +
                            C_TEXT_FROM_END +
                        '</span>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );


        $('#' + C_ANNOTATION.idCloseSavedAnnotationsBlock).click(function(){
            $('#' + C_ANNOTATION.idSavedAnnotationsBlock).hide();
        });

        $('.fua-plagin-youtube-remove-saved-annotation').click(function(){
            var annotationItem = $(this).closest('.fua-plagin-youtube-annotation-item');
            var annotation_id = annotationItem
                .find('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX)
                .attr('annotation-id');

            delete FUA_YT_CARDS_EDIT.ourPatterns[annotation_id];
            chrome.runtime.sendMessage({
                'title': 'removeCards',
                'body': {'annotation_id': annotation_id}
            });


            $('div.annotator-list div.annotator-list-item').each(function() {
                var tmpArr = annotation_id.split('%%%');
                if (
                    FUA_YT_GV.video_id == tmpArr[0]
                    && $(this).attr('data-item-key') == tmpArr[1]
                ) {
                    var saveImg = $(this).find('img.fua-plugin-youtube-save-card-icon');
                    saveImg.attr('src', IMAGE_SAVE_URL);
                    saveImg.removeClass("fua-plugin-youtube-saved-yet-card-icon")
                }
            });

            annotationItem.remove();


            if(
                $('#' + C_ANNOTATION.idSavedAnnotationsBlock)
                    .find('.fua-plagin-youtube-annotation-item').length < 1
            ){
                $('#' + C_ANNOTATION.idSavedAnnotationsBlock).remove();
                $('#' + C_CARDS.idSavedMenuItemButton).closest('.fua-plagin-youtube-card-menu-item').remove();
            }
        });

        $('#' + C_ANNOTATION.idSavedAnnotationsBlock +  ' .' + CLASS_OUR_ADD_ANNOTATIONS_TO_START).click(function () {
            var item = $(this).closest('#' + C_ANNOTATION.idSavedAnnotationsBlock);

            insertCards({
                cards : getCheckboxCards(item.find('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX)),
                cardsObject : FUA_YT_CARDS_EDIT.ourPatterns,
                callback : function(){
                    location.reload();
                    console.log('Cards Inserted');
                }
            });
        });


        $('#' + C_ANNOTATION.idSavedAnnotationsBlock + ' .' + CLASS_OUR_ADD_ANNOTATIONS_TO_END).click(function () {
            var item = $(this).closest('#' + C_ANNOTATION.idSavedAnnotationsBlock);
            insertCards({
                cards : getCheckboxCards(item.find('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX)),
                cardsObject : FUA_YT_CARDS_EDIT.ourPatterns,
                callback : function(){
                    location.reload();
                    console.log('Cards Inserted');
                },
                fromWhere : 'end'
            });
        });
    }
}



function updateVideoDuration(count = 0){
    const element = $('div.timeline-ruler div.section div.rulabel:last');
    if(element.length){
        let currentDuration = element.html().trim().split(':');
        if (currentDuration.length < 3) currentDuration.unshift(0);
        currentDuration.push(0);
        currentDuration = getMillisecondFromArray(currentDuration);
        FUA_YT_GV.video_duration = currentDuration;
    }
    else if(count < 7){
        setTimeout(() => {
            count++;
            updateVideoDuration(count);
        }, 1000);
    }
}