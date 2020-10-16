var FUA_ANNOTATION_EDIT = (function(){

    function Annotation_edit(){
        this.ourPatterns = false;
        this.copyPatterns = false;
        this.prefix = 'fua_youtube_';
        this.id = {
            'first_button' : this.prefix + 'mass_annotation_first_btn_id',
            'left_div' : this.prefix + 'mass_annotation_left_div_id',
            'right_div' : this.prefix + 'mass_annotation_right_div_id',

            'add_radio_mod_box' : this.prefix + 'mass_annotation_add_radio_mod_box_id',
            'pattern_box' : this.prefix + 'mass_annotation_pattern_box_id',
            'info' : this.prefix + 'mass_annotation_info_id',

            'additional_block' : this.prefix + 'mass_annotation_additional_block_id',
            'progress_bar' : this.prefix + 'mass_annotation_progress_bar_id',

            'buttons_div' : this.prefix + 'mass_annotation_buttons_div_id',
            'btn_execute' : this.prefix + 'mass_annotation_btn_execute_id',

        };
        this.class = {
            'radio_mod' : this.prefix + 'mass_annotation_radio_mod',
            'pattern_item' : this.prefix + 'mass_annotation_pattern_item',
            'pattern_checkbox' : this.prefix + 'mass_annotation_pattern_checkbox',
            'radio_add_mod' : this.prefix + 'mass_annotation_radio_add_mod'
        };
    }


    Annotation_edit.prototype.insertAnnotationsForOneVideo = function(options){
        var data = {
            video_id : FUA_YT_GV.video_id,
            auth_token : FUA_YT_GV.annotation_auth_token,
            checkedPatterns : FUA_ANNOTATION_EDIT
                .getCheckedPatternsId(options.item.find('.' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX)),
            currentDuration : FUA_YT_GV.video_duration,
            successCallback : function(){
                location.reload();
            },
            failCallback : function(error){}
        };
        if(options.fromWhere) data.fromWhere = options.fromWhere;
        if(options.copyPatterns) data.copyPatterns = true;
        FUA_ANNOTATION_EDIT.insertPatterns(data);
    };


    Annotation_edit.prototype.getCheckedPatternsId = function(checkboxes){
        var patternIds = [];
        checkboxes.each(function () {
            if ($(this).prop('checked')) {
                patternIds.push($(this).attr('annotation-id'));
            }
        });
        return patternIds;
    };


    Annotation_edit.prototype.updateProgressBar = function(options){
        FUA_YT_PROGRESS_BAR.createProgressBar({
            progress_id : FUA_ANNOTATION_EDIT.id.progress_bar,
            target_element : document.getElementById(FUA_ANNOTATION_EDIT.id.additional_block)
        });

        FUA_YT_PROGRESS_BAR.updateProgressBar({
            progress_id : FUA_ANNOTATION_EDIT.id.progress_bar,
            percentages : options.percentages
        });
    };


    Annotation_edit.prototype.getAuthToken = function(string){
        var authToken = string.match('auth_token":"([^"]*)');
        if(authToken && authToken[1]) return authToken[1].trim();
        return false;
    };

    Annotation_edit.prototype.getVideoDuration = function(string){
        var videoDuration = string.match('videoDurationMs":([^,]*)');
        if(videoDuration && videoDuration[1]) return parseInt(videoDuration[1]);
        return false;
    };

    Annotation_edit.prototype.getAVideoTitle = function(string){
        var videoTitle = string.match('VIDEO_TITLE\': \'([^\']*)');
        if(videoTitle && videoTitle[1]) return videoTitle[1];
        return false;
    };


    Annotation_edit.prototype.wrapAnnotationsForUpdate = function(options){
        return'<document>' +
            '<requestHeader video_id="' + options.video_id + '"/>' +
            '<authenticationHeader auth_token="' + options.auth_token + '" video_id="' + options.video_id + '" />' +
            '<updatedItems>' + options.annotationString + '</updatedItems>' +
        '</document>';
    };

    Annotation_edit.prototype.wrapAnnotationsForPublish = function(options){
        return'<document>' +
            '<requestHeader video_id="' + options.video_id + '"/>' +
            '<authenticationHeader auth_token="' + options.auth_token + '" video_id="' + options.video_id + '" />' +
        '</document>';
    };


    Annotation_edit.prototype.insertPatterns = function(options){
        var patternObjects = FUA_ANNOTATION_EDIT.ourPatterns;
        if(options.copyPatterns) patternObjects = FUA_ANNOTATION_EDIT.copyPatterns;

        console.log("patternObjects", patternObjects);

        var checkedPatterns = options.checkedPatterns;
        var currentDuration = options.currentDuration;

        if(checkedPatterns.length > 0) {
            options.annotationString = '';
            var annotations = {};
            for (var i in checkedPatterns) {
                var pattern = patternObjects[checkedPatterns[i]];


                annotations[checkedPatterns[i].split("%%%")[1]] = pattern;

                var timeFrom = pattern.timeFrom;
                var timeTo = pattern.timeTo;
                if(timeFrom == "never") timeFrom = pattern.trigger.timeFrom;
                if(timeTo == "never") timeTo = pattern.trigger.timeTo;
                var annotationLong = timeTo - timeFrom;

                if(currentDuration < annotationLong){
                    timeFrom = 0;
                    timeTo = currentDuration;
                }
                else if(
                    (!options.fromWhere || options.fromWhere != 'end')
                    && currentDuration < timeTo
                ){
                    timeFrom = currentDuration - annotationLong;
                    timeTo = currentDuration;
                }
                else if(options.fromWhere && options.fromWhere == 'end'){
                    timeTo = currentDuration - (pattern.videoDuration - timeTo);
                    if(
                        timeTo < 0
                        || timeTo < annotationLong
                    ){
                        timeFrom = 0;
                        timeTo = annotationLong;
                    }
                    else timeFrom = timeTo - annotationLong;
                }

                //console.log("timeFrom", timeFrom);
                //console.log("timeTo", timeTo);


                timeFrom = Math.floor(timeFrom / 1000);
                timeTo = Math.floor(timeTo / 1000);


                var xml = '';
                if(pattern.trigger) xml = $($.parseXML(pattern.trigger.xml));
                else xml = $($.parseXML(pattern.xml));

                xml.find('annotation rectRegion:first').attr('t', timeFrom);
                xml.find('annotation rectRegion:last').attr('t', timeTo);
                xml.find('annotation anchoredRegion:first').attr('t', timeFrom);
                xml.find('annotation anchoredRegion:last').attr('t', timeTo);

                if(pattern.trigger) options.annotationString += pattern.xml;
                options.annotationString += xml.find('annotation')[0].outerHTML;
            }


            $.get(
                'https://www.youtube.com/annotations_auth/read2?video_id=' + options.video_id,
                '',
                function(res){
                    for(var i in annotations){
                        var ann = $(res).find("annotation#" + i);
                        if(ann.length){
                            options.failCallback({
                                type : "sameIdDifferentTextError",
                                inVideo : ann.find("TEXT").first().html(),
                                inPattern : annotations[i].text,
                                annotation_id : i
                            });
                            return false;
                        }
                    }


                    $.post(
                        'https://www.youtube.com/annotations_auth/update2',
                        FUA_ANNOTATION_EDIT.wrapAnnotationsForUpdate(options),
                        function(res){
                            console.log("updateRes", res);
                            if(res.match("<MESSAGE>OK.</MESSAGE>")) {
                                $.post(
                                    'https://www.youtube.com/annotations_auth/publish2',
                                    FUA_ANNOTATION_EDIT.wrapAnnotationsForPublish(options),
                                    function (res) {
                                        console.log("publishRes", res);
                                        if(res.match("<MESSAGE>OK.</MESSAGE>")){
                                            options.successCallback();
                                        }
                                        else {
                                            options.failCallback({
                                                type : "publishResponseError"
                                            });
                                        }
                                    }
                                ).fail(function(info){
                                        options.failCallback({
                                            type : "publishServerError"
                                        });
                                    });
                            }
                            else{
                                options.failCallback({
                                    type : "updateResponseError"
                                });
                            }
                        }
                    ).fail(function(info){
                        options.failCallback({
                            type : "updateServerError"
                        });
                    });


                },
                'xml'
            ).fail(function(info){
                options.failCallback({
                    type : "getAnnotationsServerError"
                });
            });




        }
    };


    Annotation_edit.prototype.massAddAnnotations = function(options){
        if(!options.index) options.index = 0;
        if(!options.edited_videos) options.edited_videos = [];
        if(!options.elapsedTime) options.elapsedTime = 0;

        FUA_ANNOTATION_EDIT.updateProgressBar({
            percentages : options.index / options.videos_array.length * 100
        });

        function nextStep(options){
            options.index++;
            FUA_ANNOTATION_EDIT.massAddAnnotations(options);
        }

        var startTime = (new Date()).getTime();

        if(options.videos_array[options.index]){

            var video_id = options.videos_array[options.index];

            $.get(
                "https://www.youtube.com/my_videos_annotate?v=" + video_id,
                "",
                function (res) {
                    var currentTitle = FUA_ANNOTATION_EDIT.getAVideoTitle(res);

                    FUA_ANNOTATION_EDIT.insertPatterns({
                        video_id : video_id,
                        auth_token : FUA_ANNOTATION_EDIT.getAuthToken(res),
                        checkedPatterns : options.checkedPatterns,
                        currentDuration : FUA_ANNOTATION_EDIT.getVideoDuration(res),
                        fromWhere : options.fromWhere,
                        successCallback : function(){
                            var endTime = (new Date()).getTime();
                            console.log("successCallback");
                            options.edited_videos.push(video_id);

                            FUA_MW.addToInfo({
                                'text' : chrome.i18n.getMessage("annotation_successful_added_for") + ' "' + currentTitle + '" (' + video_id + ') за ' + ((endTime - startTime) / 1000).toFixed(2) + ' ' + chrome.i18n.getMessage("word_seconds"),
                                'class' : FUA_MW.class.success_info_line,
                                'info' : document.getElementById(FUA_ANNOTATION_EDIT.id.info)
                            });

                            options.elapsedTime += ((endTime - startTime) / 1000);

                            nextStep(options);
                        },
                        failCallback : function(error){
                            var endTime = (new Date()).getTime();
                            var t = error.type;
                            var errorText = chrome.i18n.getMessage("for_video") + ' "' + currentTitle + '" (' + video_id + '), '+ chrome.i18n.getMessage("error_occurred").toLowerCase() +' ';
                            if(t == "updateServerError"){
                                errorText += chrome.i18n.getMessage("when_attempting_to_connect_to_the_server") + '  '+ chrome.i18n.getMessage("to_add_annotations") +  '.';
                            }
                            else if(t == "updateResponseError"){
                                errorText += chrome.i18n.getMessage("while_adding_of_annotations") +'.';
                            }
                            else  if(t == "publishServerError"){
                                errorText += chrome.i18n.getMessage("when_attempting_to_connect_to_the_server") + '  '+ chrome.i18n.getMessage("to_public_the_added_annotations") +  '.';
                            }
                            else  if(t == "publishResponseError"){
                                errorText += chrome.i18n.getMessage("while_publishing_the_added_annotations") +'.';
                            }
                            else  if(t == "getAnnotationsServerError"){
                                errorText += chrome.i18n.getMessage("while_attempting_to_get_the_information_about_annotations_from_server");
                            }
                            else  if(t == "sameIdDifferentTextError"){
                                errorText += chrome.i18n.getMessage("because_video_includes_annotation_which_has_id") + ' - ' + error.annotation_id +
                                //', но текст в шаблоне удаления ('+ error.inPattern +') ' +
                                ' '+ chrome.i18n.getMessage("and_text") +' "'+ error.inVideo +'"';
                            }


                            errorText += ' (' + ((endTime - startTime) / 1000).toFixed(2) + ' '+ chrome.i18n.getMessage("word_seconds") +')';


                            FUA_MW.addToInfo({
                                'text' : errorText,
                                'class' : FUA_MW.class.error_info_line,
                                'info' : document.getElementById(FUA_ANNOTATION_EDIT.id.info)
                            });


                            options.elapsedTime += ((endTime - startTime) / 1000);
                            nextStep(options);
                        }
                    });
                }
            ).fail(function(info){
                    var endTime = (new Date()).getTime();
                    FUA_MW.addToInfo({
                        'text' : chrome.i18n.getMessage("for_video") + ' ' + video_id + ', ' + chrome.i18n.getMessage("error_occurred").toLowerCase() + ' ' + chrome.i18n.getMessage("while_attempting_to_get_the_information_about_the_video") ,
                        'class' : FUA_MW.class.error_info_line,
                        'info' : document.getElementById(FUA_ANNOTATION_EDIT.id.info)
                    });
                    options.elapsedTime += ((endTime - startTime) / 1000);
                    nextStep(options);
            });
        }
        else{
            $('#' + FUA_ANNOTATION_EDIT.id.btn_execute)
                .removeClass(FUA_MW.class.disable);

            FUA_MW.addToInfo({
                'text' : chrome.i18n.getMessage("annotation_has_been_added_and_published_for") + ' ' +
                options.edited_videos.length + '/' +
                options.videos_array.length +
                ' '+ chrome.i18n.getMessage("word_video").toLowerCase() +'. ('+ options.elapsedTime.toFixed(2) +' '+ chrome.i18n.getMessage("word_seconds") +')',
                'class' : FUA_MW.class.finish_info_line,
                'info' : document.getElementById(FUA_ANNOTATION_EDIT.id.info)
            });
            console.log("edited_videos", options.edited_videos);

        }
    };



    Annotation_edit.prototype.sortPatternsByChannels = function(){
        var patternsByChannels = {};
        var patterns =  FUA_ANNOTATION_EDIT.ourPatterns;
        if(patterns){
            for(var i in patterns){

                var channel_id = patterns[i].channel_id;
                if(channel_id){
                    if(!patternsByChannels[channel_id]) patternsByChannels[channel_id] = {
                        name : patterns[i].channel_name,
                        patterns : {}
                    };
                    patternsByChannels[channel_id].patterns[i] = patterns[i];
                }
                else {
                    if(!patternsByChannels.noChannel) patternsByChannels.noChannel = {
                        name : chrome.i18n.getMessage("channel_not_determined"),
                        patterns : {}
                    };
                    patternsByChannels.noChannel.patterns[i] = patterns[i];
                }
            }
        }

        return patternsByChannels;
    };



    Annotation_edit.prototype.createHtmlAnnotationsList = function(saveAnnotations){
        var annotationsChannelsStrings = {};
        var noChannelString = '';

        for (var j in saveAnnotations) {
            if(saveAnnotations[j].text) var text = saveAnnotations[j].text;
            else if(saveAnnotations[j].link) var text = saveAnnotations[j].link;
            else var text = j.split('%%%')[1];

            var trigger = '';
            var timeFrom = saveAnnotations[j].timeFrom;
            var timeTo = saveAnnotations[j].timeTo;
            if (saveAnnotations[j].trigger) {
                timeFrom = saveAnnotations[j].trigger.timeFrom;
                timeTo = saveAnnotations[j].trigger.timeTo;
            }


            var strAnnotation =
                '<div class="fua-plagin-youtube-annotation-item">' +
                    '<input ' +
                        'title="' + text + '" ' +
                        'type="checkbox" ' +
                        'class="' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX + '" ' +
                        'annotation-id="' + j + '" ' +
                    '/>' +
                    '<div style="display: inline-block;">' +
                        '<div style="display: inline-block; width: 175px; height: 14px;" class="fua-plagin-youtube-three-dots">' +
                            text +
                        '</div>' +
                        '<div style="display: inline-block;">' +
                            '<div class="fua-plagin-youtube-remove-saved-annotation">' +
                                '&times;' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            var cId = saveAnnotations[j].channel_id;
            if(cId){
                if(!annotationsChannelsStrings[cId]) {
                    annotationsChannelsStrings[cId] = { str : "", name :  saveAnnotations[j].channel_name};
                }
                annotationsChannelsStrings[cId].str += strAnnotation;
            }
            else noChannelString += strAnnotation;
        }

        var annotationString = '';
        for(var i in annotationsChannelsStrings){
            var tmpObj = annotationsChannelsStrings[i];
            annotationString += '<div style="font-weight: bold;">'+ tmpObj.name +':</div>' + tmpObj.str;
        }


        if(noChannelString) {
            annotationString += '<div style="font-weight: bold;">'+ chrome.i18n.getMessage("channel_not_determined") +':</div>' + noChannelString;
        }


        return annotationString;
    };



    Annotation_edit.prototype.wrapAnnotationsForDelete = function(options){
        return'<document>' +
        '<requestHeader video_id="' + options.video_id + '"/>' +
        '<authenticationHeader auth_token="' + options.auth_token + '" video_id="' + options.video_id + '" />' +
        '<deletedItems>' + options.annotationString + '</deletedItems>' +
        '</document>';
    };



    Annotation_edit.prototype.deletePatterns = function(options){
        var patternObjects = FUA_ANNOTATION_EDIT.ourPatterns;
        if(options.copyPatterns) patternObjects = FUA_ANNOTATION_EDIT.copyPatterns;
        var checkedPatterns = options.checkedPatterns;

        if(checkedPatterns.length > 0) {
            var annotations = {};
            options.annotationString = '';
            for (var i in checkedPatterns) {

                var id = checkedPatterns[i].split("%%%")[1];
                var pattern = patternObjects[checkedPatterns[i]];
                annotations[id] = pattern;
                if(pattern.trigger){
                    options.annotationString += '<deletedItem id="'+ id +'" author=""/>';
                    id = pattern.trigger.xml.match('id="([^"]+)')[1];
                }
                console.log("annotation_id", id);
                options.annotationString += '<deletedItem id="'+ id +'" author=""/>';
            }


            $.get(
                'https://www.youtube.com/annotations_auth/read2?video_id=' + options.video_id,
                '',
                function(res){
                    var allowAction = false;
                    for(var i in annotations){
                        var ann = $(res).find("annotation#" + i);
                        if(ann.length){
                            allowAction = true;
                            if(ann.find("TEXT").first().html() != annotations[i].text){
                                options.failCallback({
                                    type : "sameIdDifferentTextError",
                                    inVideo : ann.find("TEXT").first().html(),
                                    inPattern : annotations[i].text,
                                    annotation_id : i
                                });
                                return false;
                            }
                        }
                    }

                    if(!allowAction){
                        options.failCallback({
                            type : "noTargetAnnotationsError",
                        });
                        return false;
                    }

                    $.post(
                        'https://www.youtube.com/annotations_auth/update2',
                        FUA_ANNOTATION_EDIT.wrapAnnotationsForDelete(options),
                        function(res){
                            console.log("updateRes", res);
                            if(res.match("<MESSAGE>OK.</MESSAGE>")) {
                                $.post(
                                    'https://www.youtube.com/annotations_auth/publish2',
                                    FUA_ANNOTATION_EDIT.wrapAnnotationsForPublish(options),
                                    function (res) {
                                        console.log("publishRes", res);
                                        if(res.match("<MESSAGE>OK.</MESSAGE>")){
                                            options.successCallback();
                                        }
                                        else {
                                            options.failCallback({
                                                type : "publishResponseError"
                                            });
                                        }
                                    }
                                ).fail(function(info){
                                        options.failCallback({
                                            type : "publishServerError"
                                        });
                                    });
                            }
                            else{
                                options.failCallback({
                                    type : "updateResponseError"
                                });
                            }
                        }
                    ).fail(function(info){
                        console.log("updateFail", info);
                        options.failCallback({
                            type : "updateServerError"
                        });
                    });
                },
                'xml'
            ).fail(function(info){
                options.failCallback({
                    type : "getAnnotationsServerError"
                });
            });

        }
    };



    Annotation_edit.prototype.massDeleteAnnotations = function(options){
        if(!options.index) options.index = 0;
        if(!options.edited_videos) options.edited_videos = [];
        if(!options.elapsedTime) options.elapsedTime = 0;

        FUA_ANNOTATION_EDIT.updateProgressBar({
            percentages : options.index / options.videos_array.length * 100
        });

        function nextStep(options){
            options.index++;
            FUA_ANNOTATION_EDIT.massDeleteAnnotations(options);
        }

        var startTime = (new Date()).getTime();

        if(options.videos_array[options.index]){

            var video_id = options.videos_array[options.index];

            $.get(
                "https://www.youtube.com/my_videos_annotate?v=" + video_id,
                "",
                function (res) {
                    var currentTitle = FUA_ANNOTATION_EDIT.getAVideoTitle(res);

                    FUA_ANNOTATION_EDIT.deletePatterns({
                        video_id : video_id,
                        auth_token : FUA_ANNOTATION_EDIT.getAuthToken(res),
                        checkedPatterns : options.checkedPatterns,
                        successCallback : function(){
                            var endTime = (new Date()).getTime();
                            console.log("successCallback");
                            options.edited_videos.push(video_id);

                            FUA_MW.addToInfo({
                                'text' : chrome.i18n.getMessage("annotation_has_been_deleted_for") + ' "' + currentTitle + '" (' + video_id + ') '+ chrome.i18n.getMessage("word_during") +' ' + ((endTime - startTime) / 1000).toFixed(2) + ' ' + chrome.i18n.getMessage("word_seconds"),
                                'class' : FUA_MW.class.success_info_line,
                                'info' : document.getElementById(FUA_ANNOTATION_EDIT.id.info)
                            });

                            options.elapsedTime += ((endTime - startTime) / 1000);

                            nextStep(options);
                        },
                        failCallback : function(error){
                            var endTime = (new Date()).getTime();
                            var t = error.type;
                            var errorText = chrome.i18n.getMessage("for_video") +' "' + currentTitle + '" (' + video_id + '), '+ chrome.i18n.getMessage("error_occurred").toLowerCase() +' ';
                            if(t == "updateServerError"){
                                errorText += chrome.i18n.getMessage("when_attempting_to_connect_to_the_server") + ' '+ chrome.i18n.getMessage("to_delete_the_annotations") +'.';
                            }
                            else if(t == "updateResponseError"){
                                errorText += chrome.i18n.getMessage("while_deleting_the_annotations") + '.';
                            }
                            else  if(t == "publishServerError"){
                                errorText += chrome.i18n.getMessage("when_attempting_to_connect_to_the_server") + ' ' + chrome.i18n.getMessage("to_update_the_list_of_the_published_annotations") +'.';
                            }
                            else  if(t == "publishResponseError"){
                                errorText += chrome.i18n.getMessage("while_updating_the_list_of_the_published_annotations") + '.';
                            }
                            else  if(t == "getAnnotationsServerError"){
                                errorText += chrome.i18n.getMessage("while_attempting_to_get_the_information_about_annotations_from_server");
                            }
                            else  if(t == "noTargetAnnotationsError"){
                                errorText += chrome.i18n.getMessage("because_this_video_does_not_include_the_pointed_annotations");
                            }
                            else  if(t == "sameIdDifferentTextError"){
                                errorText += chrome.i18n.getMessage("because_video_includes_annotation_which_has_id") +  ' - ' + error.annotation_id +
                                ', '+ chrome.i18n.getMessage("but_text_of_deleting_pattern") +' ('+ error.inPattern +') ' +
                                chrome.i18n.getMessage("is_different_from_text_of_annotation_with_same_id_in_video") + ' ('+ error.inVideo +')';
                            }

                            errorText += ' (' + ((endTime - startTime) / 1000).toFixed(2) + ' '+ chrome.i18n.getMessage("word_seconds") +')';

                            FUA_MW.addToInfo({
                                'text' : errorText,
                                'class' : FUA_MW.class.error_info_line,
                                'info' : document.getElementById(FUA_ANNOTATION_EDIT.id.info)
                            });

                            options.elapsedTime += ((endTime - startTime) / 1000);
                            nextStep(options);
                        }
                    });
                }
            ).fail(function(info){
                    var endTime = (new Date()).getTime();
                    FUA_MW.addToInfo({
                        'text' : chrome.i18n.getMessage("for_video") + ' ' + video_id + ', ' + chrome.i18n.getMessage("error_occurred").toLowerCase() + ' ' + chrome.i18n.getMessage("while_attempting_to_get_the_information_about_the_video") ,
                        'class' : FUA_MW.class.error_info_line,
                        'info' : document.getElementById(FUA_ANNOTATION_EDIT.id.info)
                    });
                    options.elapsedTime += ((endTime - startTime) / 1000);
                    nextStep(options);
                });
        }
        else{
            $('#' + FUA_ANNOTATION_EDIT.id.btn_execute)
                .removeClass(FUA_MW.class.disable);

            FUA_MW.addToInfo({
                'text' : chrome.i18n.getMessage("annotations_has_been_deleted_for") + ' ' +
                options.edited_videos.length + '/' +
                options.videos_array.length +
                ' '+ chrome.i18n.getMessage("word_video") +'. ('+ options.elapsedTime.toFixed(2) +' '+ chrome.i18n.getMessage("word_seconds") +')',
                'class' : FUA_MW.class.finish_info_line,
                'info' : document.getElementById(FUA_ANNOTATION_EDIT.id.info)
            });
            console.log("edited_videos", options.edited_videos);

        }
    };


    return new Annotation_edit();
})();