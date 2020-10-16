chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;


    /*******/
    if (title == 'addHtmlToYoutubeAnnotation') {
        if($('div#fua-test-id').length < 1) {

            chrome.runtime.sendMessage({'title': 'get10VideosAnnotation'});
            $('html').append('<div id="fua-test-id"><div>');

            $('div#annotator-add-div').after(
                '<div>' +
                    '<div style="border: 2px solid orange; width: 277px; position: relative;" id="'+ ID_OUR_ANNOTATION_COPY_BOX +'">' +
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


            $('div.annotation-details-container').append(
                '<div id="'+ C_ANNOTATION.idSaveAnnotationButton +'">' +
                    C_TEXT_SAVE_ANNOTATION +
                '</div>'
            );


            $('#' + C_ANNOTATION.idSaveAnnotationButton).on('click', function(){
                if(!$(this).hasClass('fua-plagin-youtube-save-annotation-button-blocked')) {
                    $(this).addClass('fua-plagin-youtube-save-annotation-button-blocked');
                    var annotationItem = $('div.timeline-stack-track').children('div.selected');
                    document.getElementById("annotator-button-save").dispatchEvent(new Event("click"));
                    setTimeout(function () {
                        document.getElementById("annotator-button-publish").dispatchEvent(new Event("click"));
                        setTimeout(function () {
                            chrome.runtime.sendMessage({
                                'title': 'saveAnnotation',
                                'body': {
                                    'annotation_id': annotationItem.attr('data-item-id'),
                                    'video_id': FUA_YT_GV.video_id,
                                    'video_duration': FUA_YT_GV.video_duration,
                                    'channel_id' : FUA_GET_VALUE.getExternalChannelId(),
                                    'channel_name' : $("span.yt-user-name ").html()
                                }
                            });
                        }, 500);
                    }, 1500);
                }
            });


            function isSelectedAnnotationSaved(){
                setTimeout(function() {
                    var annotation_id = $('div.timeline-stack-track')
                        .children('div.selected').attr('data-item-id');
                    if(FUA_ANNOTATION_EDIT.ourPatterns[FUA_YT_GV.video_id +'%%%'+annotation_id]){
                        $('#' + C_ANNOTATION.idSaveAnnotationButton)
                            .addClass('fua-plagin-youtube-save-annotation-button-blocked');
                    }
                    else{
                        $('#' + C_ANNOTATION.idSaveAnnotationButton)
                            .removeClass('fua-plagin-youtube-save-annotation-button-blocked');
                    }
                }, 10);
            }


            setTimeout(function() {
                $('#annotator-select-menu table').click(function(){
                    isSelectedAnnotationSaved();
                });
                $('div.timeline-stack-track').click(function () {
                    isSelectedAnnotationSaved();
                    hideCustomAnnotationBlocks();
                    showAnnotationEditBlock()
                });
            }, 2000);

            $('button.annotator-select').click(function(){
                hideCustomAnnotationBlocks();
                showAnnotationEditBlock();
            });

            var menuItemCount = 0;
            $('ul#annotator-add-menu li.yt-uix-button-menu-item').each(function(){
                menuItemCount++;
                if(menuItemCount < 6){
                    $(this).click(function(){
                        hideCustomAnnotationBlocks();
                    });
                }
            });


            /*$('#' + ID_OUR_ANNOTATION_COPY_BUTTON).click(function(){
                $('#' + ID_OUR_ANNOTATION_COPY_BOX).toggle();
                if($(this).hasClass('yt-uix-button-active')) $(this).removeClass('yt-uix-button-active');
                else $(this).addClass('yt-uix-button-active');
            });*/



            $('#' + ID_OUR_ANNOTATION_VIDEO_SEARCH_INPUT).keypress(function (e) {
                if (e.which == 13) {
                    askActionByInputValue($(this).val(), 'getAnnotation');
                }
            });

            FUA_YT_GV.annotation_auth_token =
                FUA_ANNOTATION_EDIT.getAuthToken($('html').html());

            FUA_YT_GV.video_id =
                FUA_GET_VALUE.getVideoIdFromUrl(window.location.href);

            chrome.runtime.sendMessage({
                'title': 'getChannelData',
                'body': {'video_id':  FUA_YT_GV.video_id}
            });

            FUA_YT_GV.video_duration =
                FUA_ANNOTATION_EDIT.getVideoDuration($('html').html());

            insertSavedAnnotation(body.savedAnnotations);

            $('ul#annotator-add-menu').append(
                '<li id="'+ C_ANNOTATION.idCopyMenuItem +'" class="yt-uix-button-menu-item fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                    '<img alt="" src="'+ IMAGE_COPY_URL +'" class="yt-uix-button-menu-item-icon-annotation-label">' +
                    '<span style="margin-left: 9px;">' +
                        C_TEXT_COPY_ANNOTATION_FROM +
                    '</span>' +
                '</li>'
            );

            $('#' + C_ANNOTATION.idCopyMenuItem).click(function(){
                $('#' + 'annotator-button-add').trigger('click');
                $('#' + C_ANNOTATION.idSavedAnnotationsBlock).hide();
                hideAnnotationEditBlock();
                $('#' + ID_OUR_ANNOTATION_COPY_BOX).show();
            });

            $('#' + C_ANNOTATION.idCloseCopyAnnotationsBlock).click(function(){
                $('#' + ID_OUR_ANNOTATION_COPY_BOX).hide();
            });

            checkIsOurChannelInFavorites();
        }
    }


    /*******/
    if (title == 'insertSavedAnnotations') {
        insertSavedAnnotation(body.savedAnnotations);
    }


    /*******/
    if (title == 'insertAnnotations') {
        $('#' + ID_OUR_ANNOTATION_VIDEO_SEARCH_RESULT_BOX).html(null);
        var videos = body.videos;

        FUA_ANNOTATION_EDIT.copyPatterns = {};
        if(videos.length < 1){
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

                        var tmpAnnotationId = videos[i].id + '%%%' + j;

                        FUA_ANNOTATION_EDIT.copyPatterns[tmpAnnotationId] = annotations[j];
                        FUA_ANNOTATION_EDIT.copyPatterns[tmpAnnotationId].videoDuration = videos[i].duration;

                        if (annotations[j].text || annotations[j].link) {
                            if(annotations[j].text) var text = annotations[j].text;
                            else var text = annotations[j].link;

                            var timeFrom = annotations[j].timeFrom;
                            var timeTo = annotations[j].timeTo;
                            if (annotations[j].trigger) {
                                //timeFrom = annotations[annotations[j].trigger].timeFrom;
                                //timeTo = annotations[annotations[j].trigger].timeTo;
                                annotations[j].trigger = annotations[annotations[j].trigger];
                            }

                            annotationsString +=
                                '<div>' +
                                    '<input ' +
                                        'title="' + text + '" ' +
                                        'type="checkbox" ' +
                                        'class="' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX + '" ' +
                                        'annotation-id="' + tmpAnnotationId + '" ' +
                                    '/>' +
                                    '<div style="display: inline-block; width: 210px; height: 14px;" class="fua-plagin-youtube-three-dots">' +
                                        text +
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
                                '<span style="display: inline-block; width: 240px;" class="fua-plagin-youtube-three-dots">' +
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
                FUA_ANNOTATION_EDIT.insertAnnotationsForOneVideo({
                    item : $(this).closest('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATIONS),
                    copyPatterns : true
                });
            });

            $('#' + ID_OUR_ANNOTATION_VIDEO_SEARCH_RESULT_BOX + ' .' + CLASS_OUR_ADD_ANNOTATIONS_TO_END).click(function () {
                FUA_ANNOTATION_EDIT.insertAnnotationsForOneVideo({
                    item : $(this).closest('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATIONS),
                    fromWhere : 'end',
                    copyPatterns : true
                });
            });
        }


        //console.log("FUA_ANNOTATION_EDIT.copyPatterns", FUA_ANNOTATION_EDIT.copyPatterns);
    }

});

function insertSavedAnnotation(sAnnotation){
    $('#' + C_ANNOTATION.idSavedAnnotationsBlock).remove();
    $('#' + C_ANNOTATION.idShablonMenuItem).remove();
    FUA_ANNOTATION_EDIT.ourPatterns = sAnnotation;
    var saveAnnotations = sAnnotation;

    var isSavedAnnotations = false;
    if(saveAnnotations){
        for(var i in saveAnnotations){
            isSavedAnnotations = true;
            break;
        }
    }

    if(isSavedAnnotations) {
        $('ul#annotator-add-menu').append(
            '<li id="'+ C_ANNOTATION.idShablonMenuItem +'" class="yt-uix-button-menu-item fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                '<img alt="" src="'+ IMAGE_SHABLON_URL +'" class="yt-uix-button-menu-item-icon-annotation-label">' +
                '<span style="margin-left: 9px;">' +
                    C_TEXT_COMPLETING_PATTERN +
                '</span>' +
            '</li>'
        );

        $('#' + C_ANNOTATION.idShablonMenuItem).click(function(){
            $('#' + 'annotator-button-add').trigger('click');
            $('#' + ID_OUR_ANNOTATION_COPY_BOX).hide();
            hideAnnotationEditBlock();
            $('#' + C_ANNOTATION.idSavedAnnotationsBlock).show();
        });


        var annotationsString = FUA_ANNOTATION_EDIT.createHtmlAnnotationsList(saveAnnotations);

        $('#' + 'annotator-button-add').after(
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


        //console.log("FUA_ANNOTATION_EDIT.ourPatterns", FUA_ANNOTATION_EDIT.ourPatterns);


        $('#' + C_ANNOTATION.idCloseSavedAnnotationsBlock).click(function(){
            $('#' + C_ANNOTATION.idSavedAnnotationsBlock).hide();
        });

        $('.fua-plagin-youtube-remove-saved-annotation').click(function(){
            var annotationItem = $(this).closest('.fua-plagin-youtube-annotation-item');
            var annotation_id = annotationItem
                .find('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX)
                .attr('annotation-id');

            delete FUA_ANNOTATION_EDIT.ourPatterns[annotation_id];
            chrome.runtime.sendMessage({
                'title': 'removeAnnotation',
                'body': {'annotation_id': annotation_id}
            });

            annotationItem.remove();

            if(
                $('#' + C_ANNOTATION.idSavedAnnotationsBlock)
                    .find('.fua-plagin-youtube-annotation-item').length < 1
            ){
                $('#' + C_ANNOTATION.idSavedAnnotationsBlock).remove();
                $('#' + C_ANNOTATION.idShablonMenuItem).remove();
            }
        });

        $('#' + C_ANNOTATION.idSavedAnnotationsBlock +  ' .' + CLASS_OUR_ADD_ANNOTATIONS_TO_START).click(function () {
            FUA_ANNOTATION_EDIT.insertAnnotationsForOneVideo({
                item : $(this).closest('#' + C_ANNOTATION.idSavedAnnotationsBlock)
            });
        });


        $('#' + C_ANNOTATION.idSavedAnnotationsBlock + ' .' + CLASS_OUR_ADD_ANNOTATIONS_TO_END).click(function () {
            FUA_ANNOTATION_EDIT.insertAnnotationsForOneVideo({
                item : $(this).closest('#' + C_ANNOTATION.idSavedAnnotationsBlock),
                fromWhere : 'end'
            });
        });
    }
}


function hideAnnotationEditBlock(){
    $('div.annotation-details-container').removeClass('annotation-details-selected');
    //$('div.timeline-stack-track').children('div.selected').removeClass('selected');
}


function showAnnotationEditBlock(){
    if(
        !$('div.annotation-details-container').hasClass('annotation-details-selected')
        && $('div.timeline-stack-track div.selected').length > 0
    ){
        $('div.annotation-details-container').addClass('annotation-details-selected');
    }
}


function hideCustomAnnotationBlocks(){
    $('#' + C_ANNOTATION.idSavedAnnotationsBlock).hide();
    $('#' + ID_OUR_ANNOTATION_COPY_BOX).hide();
}