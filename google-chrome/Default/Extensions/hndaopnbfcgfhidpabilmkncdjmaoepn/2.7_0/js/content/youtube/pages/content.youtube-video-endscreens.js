chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;


    /*******/
    if (title == 'addHtmlToYoutubeEndScreens') {
        if($('div#fua-test-id').length < 1) {
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



            var elementsList = document.getElementById('elements-list');
            var observer = new MutationObserver(function(mutations) {
                addEndScreenSaveIcon();
            });
            observer.observe(elementsList, { childList: true,});

            insertSavedEndScreens(body.savedEndScreens);

            $('#endscreen-editor-add-element').click(function(){
                $('#' + C_ANNOTATION.idSavedAnnotationsBlock).hide();
                $('#' + ID_OUR_ANNOTATION_COPY_BOX).hide();

                setTimeout(function() {
                    if($('div.fua-plagin-youtube-card-menu-item').length < 1) {

                        insertSavedEndScreens(body.savedEndScreens);

                        $('div.yt-uix-clickcard-card-content div.annotator-clickcard-item')
                            .css('padding-bottom', 10)
                            .css('padding-top', 10);
                    }
                }, 1);
            });

            FUA_YT_GV.xsrf_token = FUA_GET_VALUE.getXsrfToken($('body').html());
            FUA_YT_GV.video_id = FUA_GET_VALUE.getVideoIdFromUrl(window.location.href);

            chrome.runtime.sendMessage({
                'title': 'getChannelData',
                'body': {'video_id': FUA_YT_GV.video_id}
            });

            setTimeout(function() {
                var currentDuration =
                    $('div.timeline-ruler div.section div.rulabel:last').html().trim().split(':');
                if (currentDuration.length < 3) currentDuration.unshift(0);
                currentDuration.push(0);
                currentDuration = getMillisecondFromArray(currentDuration);
                FUA_YT_GV.video_duration = currentDuration;
            }, 1000);


            checkIsOurChannelInFavorites();
        }
    }


    if (title == 'insertSavedEndScreens') {
        insertSavedEndScreens(body.savedEndScreens);
    }
});


function insertEndScreens(options){
    var ids = options.endScreens;
    var savedEndScreens = options.savedEndScreens;
    //console.log('endScreens', endScreens);
    //console.log('savedEndScreens', savedEndScreens);

    $.post(
        //'https://www.youtube.com/endscreen_editor_ajax?' +
        'https://www.youtube.com/endscreen_ajax?' +
        'v=' + FUA_YT_GV.video_id +
        '&encrypted_video_id=' + FUA_YT_GV.video_id +
        '&action_load=1',
        '',
        function(res){
            res = res.for_editor;
            if(res && res.elements){
                for(var i in ids){
                    var id = ids[i];
                    var element = savedEndScreens[id].element;
                    var videoDuration = savedEndScreens[id].video_duration;


                    //console.log("savedEndScreens", savedEndScreens[id]);


                    var endGap = videoDuration - element.endMs ;
                    var endScreenDuration = element.endMs - element.startMs;
                    //console.log('currentDuration', FUA_YT_GV.video_duration);
                    element.endMs = FUA_YT_GV.video_duration - endGap - 5;
                    element.startMs = element.endMs - endScreenDuration + 10;
                    //savedEndScreens[id].video_duration = FUA_YT_GV.video_duration;

                    //element.left = 0.022807017;
                    element.top = element.top - 0.005;
                    if(element.left < 0.025) element.left = 0.025;
                    if(element.top < 0.14) element.top = 0.14;


                    if(
                        element.width < 0.33
                        && (element.type == "VIDEO" || element.type == "PLAYLIST")
                    ) {
                        element.width = 0.33;
                    }
                    var outRight = 1 - element.width - 0.025 - element.left;
                    if(outRight < 0) element.left = element.left + outRight - 0.0001;

                    //console.log("element", element);

                    res.elements.push(element);
                }


                /*top
                0.1308411211
                0.1308411211

                left
                0.022807017
                0.0157988425
                (0.3469069898)

                width
                0.322807014
                0.3275478482
                (0.322807014)

                aspectRatio
                1.777777791
                1.777777791*/


                res.action_save = 1;
                res.v = FUA_YT_GV.video_id;
                res.encrypted_video_id = FUA_YT_GV.video_id;
                res.session_token = FUA_YT_GV.xsrf_token;

                setTimeout(function() {
                    $.ajax({
                        type: 'POST',
                        //url: 'https://www.youtube.com/endscreen_editor_ajax?v=' + video_id,
                        url: 'https://www.youtube.com/endscreen_ajax?v='  + FUA_YT_GV.video_id,
                        processData: false,
                        contentType: 'application/json',
                        data: JSON.stringify(res)
                    }).done(function (res) {
                        console.log('savedTest', res);
                        if(res && res.errors && res.errors.length){
                            $('#fua_end_screen_msg_id').html(null);
                            for(var i in res.errors){
                                $('#fua_end_screen_msg_id').append('<div style="color: #ff0000; font-weight: bold;">' + res.errors[i] + '</div>');
                            }
                        }
                        else location.reload();
                    });
                }, 100);
            }
        }
    );
}

function getCheckboxEndscreens(checkboxes) {
    var ids = [];
    checkboxes.each(function () {
        if ($(this).prop('checked')) ids.push($(this).attr('annotation-id'));
    });
    return ids;
}


function addEndScreenSaveIcon(){

    $('div.annotator-list div.annotator-list-item').each(function(){
        if($(this).find('.fua-plugin-youtube-save-card-icon').length < 1){


            var element_id = $(this).attr('data-item-id');
            var videoID_and_elementID = FUA_YT_GV.video_id + '%%%' + element_id;

            var save_icon = IMAGE_SAVE_URL;
            var save_icon_class = "fua-plugin-youtube-save-card-icon";

            if(FUA_YT_ENDSCREEN_EDIT.ourPatterns[videoID_and_elementID]){
                save_icon = IMAGE_SAVE_GREEN_URL;
                save_icon_class +=  " fua-plugin-youtube-saved-yet-card-icon";
            }

            $(this).find('div.annotator-list-item-edit').before(
                '<img class="'+ save_icon_class +'" src="' + save_icon + '">'
            );

            $(this).find('img.fua-plugin-youtube-save-card-icon').click(function(){
                console.log('saveEndScreen');
                if(!$(this).hasClass('fua-plugin-youtube-saved-yet-card-icon')) {
                    var item = $(this).closest('div.annotator-list-item');
                    var element_id = item.attr('data-item-id');

                    $(this).addClass('fua-plugin-youtube-saved-yet-card-icon');
                    $(this).attr('src', IMAGE_SAVE_GREEN_URL);
                    document.getElementById("endscreen-editor-save").dispatchEvent(new Event("click"));
                    setTimeout(function() {
                        chrome.runtime.sendMessage({
                            'title': 'saveEndScreen',
                            'body': {
                                'element_id': element_id,
                                'video_id': FUA_YT_GV.video_id,
                                'video_duration': FUA_YT_GV.video_duration,
                                'channel_id' : FUA_GET_VALUE.getExternalChannelId(),
                                'channel_name' : $("span.yt-user-name ").html()
                            }
                        });
                    }, 1500);
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

                        //console.log(toolTip.outerWidth());
                        //console.log($(this).outerWidth());
                    }
                },
                function(e){
                    var toolTip = $('div.fua-plugin-youtube-tool-tip');
                    toolTip.hide();
                }
            );
        }
    });
}


function insertSavedEndScreens(sAnnotation){
    console.log('insertSavedEndScreens', sAnnotation);
    $('#' + C_ANNOTATION.idSavedAnnotationsBlock).remove();
    $('#' + C_CARDS.idSavedMenuItemButton).closest('.fua-plagin-youtube-card-menu-item').remove();
    saveAnnotations = sAnnotation;
    FUA_YT_ENDSCREEN_EDIT.ourPatterns = sAnnotation;

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

        var annotationsString = FUA_YT_ENDSCREEN_EDIT.createHtmlAnnotationsList(saveAnnotations);


        if(!$('#fua_end_screen_msg_id').length) {
            $('div.add-card-container').before(
                '<div id="fua_end_screen_msg_id"></div>'
            );
        }

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
                        '<span class="' + CLASS_OUR_ADD_ANNOTATIONS_TO_START + '">' +
                            chrome.i18n.getMessage("word_insert") +
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

            delete FUA_YT_ENDSCREEN_EDIT.ourPatterns[annotation_id];
            chrome.runtime.sendMessage({
                'title': 'removeEndScreen',
                'body': {'annotation_id': annotation_id}
            });



            $('div.annotator-list div.annotator-list-item').each(function() {
                var tmpArr = annotation_id.split('%%%');
                if (
                    FUA_YT_GV.video_id == tmpArr[0]
                    && $(this).attr('data-item-id') == tmpArr[1]
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
            insertEndScreens({
                endScreens : getCheckboxEndscreens(item.find('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX)),
                savedEndScreens : FUA_YT_ENDSCREEN_EDIT.ourPatterns
            });
        });

        $('div.annotator-list div.annotator-list-item').each(function(){
            var element_id = $(this).attr('data-item-id');
            var videoID_and_elementID = FUA_YT_GV.video_id + '%%%' + element_id;
            if(FUA_YT_ENDSCREEN_EDIT.ourPatterns[videoID_and_elementID]){
                var sb =  $(this).find('img.fua-plugin-youtube-save-card-icon');
                sb.addClass('fua-plugin-youtube-saved-yet-card-icon');
                sb.attr('src', IMAGE_SAVE_GREEN_URL);
            }
        });
    }
}