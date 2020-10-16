var FUA_MD_EDIT = (function(){

    function Fua_mass_description_edit(){
        this.prefix = 'fua_youtube_';
        this.id = {
            'left_div' : 'fua_youtube_md_edit_left_div_id',
            'right_div' : 'fua_youtube_md_edit_right_div_id',
            'select_mode' : 'fua_youtube_md_edit_select_mod_id',
            'regexp_input' : 'fua_youtube_md_edit_regexp_input_id',
            'text_area' : 'fua_youtube_md_edit_text_area_id',
            'info' : 'fua_youtube_md_edit_info_id',
            'additional_block' : this.prefix + 'md_additional_block_id',
            'progress_bar' : this.prefix + 'md_progress_bar_id',
            'edit_btn' : 'fua_youtube_md_edit_btn_edit_id',
            'pause_btn' : 'fua_youtube_md_edit_btn_pause_id',
            'continue_btn' : 'fua_youtube_md_edit_btn_continue_id',
            'log_btn' : this.prefix + 'md_edit_btn_log_id',
            'recover_log_btn' : this.prefix + 'md_recover_log_btn_id',
            'title_checkbox' : this.prefix + 'md_title_checkbox_id',
            'description_checkbox' : this.prefix + 'md_description_checkbox_id',
            'keywords_checkbox' : this.prefix + 'md_keywords_checkbox_id'
        };
        this.class = {
            'field_for_edit' : this.prefix + 'md_field_for_edit'
        };
        this.select_mode_options = {
            'start' : chrome.i18n.getMessage("insert_into_beginning"),
            'end' : chrome.i18n.getMessage("insert_into_end"),
            'all' : chrome.i18n.getMessage("replace_all"),
            'regexp' : chrome.i18n.getMessage("regular_expression_or_text")
        };

        this.editProcess = false;
        this.pause = false;
        this.logs_name = "massEditDescriptionLogs";
    }


    Fua_mass_description_edit.prototype.updateProgressBar = function(options){
        FUA_YT_PROGRESS_BAR.createProgressBar({
            progress_id : FUA_MD_EDIT.id.progress_bar,
            target_element : document.getElementById(FUA_MD_EDIT.id.additional_block)
        });

        FUA_YT_PROGRESS_BAR.updateProgressBar({
            progress_id : FUA_MD_EDIT.id.progress_bar,
            percentages : options.percentages
        });
    };


    Fua_mass_description_edit.prototype.continueEditDescription = function(){
        if(FUA_MD_EDIT.editProcess) {
            FUA_MD_EDIT.editDescription(FUA_MD_EDIT.editProcess);
        }
    };


    Fua_mass_description_edit.prototype.startEdit = function(options){
        document.getElementById(FUA_MD_EDIT.id.edit_btn)
            .classList.add(FUA_MW.class.disable);

        $("#" + FUA_MD_EDIT.id.pause_btn).show();
        FUA_MW.addToInfo({
            'text' : chrome.i18n.getMessage("updating_has_started") + ' ' + options.videos_array.length + ' '+ chrome.i18n.getMessage("word_video") +'...',
            'class' : FUA_MW.class.success_info_line,
            'info' : document.getElementById(FUA_MD_EDIT.id.info)
        });

        var data = {
            text: options.text,
            mod: document.getElementById(FUA_MD_EDIT.id.select_mode).value,
            videos_array: options.videos_array,
            metaTarget : options.metaTarget
        };

        if (data.mod=== 'regexp') {
            data.regexp
                = document.getElementById(FUA_MD_EDIT.id.regexp_input).value;
        }

        //var channel_id = $("html").html().match('channel_external_id":"([^"]+)');
        //console.log("channel_id", channel_id);


        $.get(
            'https://www.youtube.com/',
            function (res) {
                var channel_id = res.match('"creator_channel_id","value":"([^"]+)"');

                if(channel_id && channel_id[1]){
                    data.channel_id = channel_id[1];
                    data.log_id = (new Date()).getTime();
                    data.logs_name = FUA_MD_EDIT.logs_name;
                    FUA_YT_LOGGING.addStartData(data);

                    FUA_MD_EDIT.editDescription(data);
                    FUA_MD_EDIT.updateProgressBar({
                        percentages: 0
                    });
                }
                else{
                    FUA_MW.addToInfo({
                        'text' : chrome.i18n.getMessage("id_of_current_channel_has_not_been_found") + '!',
                        'class' : FUA_MW.class.error_info_line,
                        'info' : document.getElementById(FUA_MD_EDIT.id.info)
                    });
                }
            }
        );
    };


    Fua_mass_description_edit.prototype.prepareToEdit = function(options){
        var editBtn = document.getElementById(FUA_MD_EDIT.id.edit_btn);
        var checkboxSelectedAll = $("input.vm-video-select-all").prop('checked');
        //console.log("checkboxSelectedAll", checkboxSelectedAll);

        /*options.videos_array = [];
        var allVideoCheckboxes = true;
        $('#vm-video-list-container input.video-checkbox').each(function(){
            if($(this).prop('checked')) options.videos_array.push($(this).val());
            else allVideoCheckboxes = false;
        });*/

        var checkedVideos = FUA_GET_VALUE.getCheckedVideosInManager();
        options.videos_array = checkedVideos.videos_array;

        //console.log("allVideoCheckboxes", allVideoCheckboxes);

        var allVideoText =
            !$("#vm-bulk-actions-selection").hasClass("hid")
            && $("#vm-bulk-actions-selection-message").html().match(chrome.i18n.getMessage("all_your_videos_selected") + ".");

        //console.log("allVideoText", allVideoText);

        if (
            checkboxSelectedAll
            && checkedVideos.allVideoCheckboxes
            && allVideoText
        ) {
            var continueEdit = confirm(chrome.i18n.getMessage("all_video_beta_version_warning"));

            if (continueEdit) {
                editBtn.classList.add(FUA_MW.class.disable);
                FUA_MW.addToInfo({
                    'text' : chrome.i18n.getMessage("collecting_of_all_your_videos_is_continuing") + '...',
                    'class' : FUA_MW.class.success_info_line,
                    'info' : document.getElementById(FUA_MD_EDIT.id.info)
                });
                FUA_GET_VALUE.getAllYourChannelVideos({
                    successCallback: function (videos_array) {
                        if (videos_array.length) {
                            options.videos_array = videos_array;
                            FUA_MD_EDIT.startEdit(options);
                        }
                        else{
                            editBtn.classList.remove(FUA_MW.class.disable);
                            FUA_MW.addToInfo({
                                'text' : chrome.i18n.getMessage("videos_have_not_been_found"),
                                'class' : FUA_MW.class.error_info_line,
                                'info' : document.getElementById(FUA_MD_EDIT.id.info)
                            });
                            CONTENT_SYNCHRONIZATION.removeActionMark({
                                action : "massEditDescription"
                            });
                        }
                    }
                });
            }
        }
        else if (options.videos_array.length) {
            FUA_MD_EDIT.startEdit(options);
        }
        else if (!options.videos_array.length) {
            FUA_MW.addToInfo({
                'text' : chrome.i18n.getMessage("videos_have_not_been_selected") + '.',
                'class' : FUA_MW.class.error_info_line,
                'info' : document.getElementById(FUA_MD_EDIT.id.info)
            });
        }
    };


    Fua_mass_description_edit.prototype.clickByEditButton = function(){
        var editBtn = document.getElementById(FUA_MD_EDIT.id.edit_btn);
        var textArea = document.getElementById(FUA_MD_EDIT.id.text_area);
        /*var metaTarget = {
            title : $("#" + FUA_MD_EDIT.id.title_checkbox).prop("checked"),
            description : $("#" + FUA_MD_EDIT.id.description_checkbox).prop("checked"),
            keywords : $("#" + FUA_MD_EDIT.id.keywords_checkbox).prop("checked")
        };*/


        var metaTarget = {};
        var targetField = $('input[name="'+ FUA_MD_EDIT.class.field_for_edit +'"]' + ':checked').val();
        if(targetField) metaTarget[targetField] = true;

        if(editBtn.classList.contains(FUA_MW.class.disable)) return false;
        else if(!metaTarget.title && !metaTarget.description && !metaTarget.keywords){
            FUA_MW.addToInfo({
                'text' : chrome.i18n.getMessage("choose_what_you_want_to_changes"),
                'class' : FUA_MW.class.error_info_line,
                'info' : document.getElementById(FUA_MD_EDIT.id.info)
            });
            return false;
        }

        $("#" + FUA_MD_EDIT.id.pause_btn).hide();
        $("#" + FUA_MD_EDIT.id.continue_btn).hide();
        FUA_MD_EDIT.pause = false;
        FUA_MD_EDIT.editProcess = false;

        CONTENT_SYNCHRONIZATION.removeActionMark({
            action : "massEditDescription"
        });


        var mod = document.getElementById(FUA_MD_EDIT.id.select_mode).value;
        var regexp = document.getElementById(FUA_MD_EDIT.id.regexp_input).value;

        if(
            (textArea.value && mod !== "regexp")
            || (mod === "regexp" && regexp)
        ) {

            var regexpConfirm = true;
            if(
                mod === "regexp"
                && regexp
                && regexp.search(new RegExp('([^\\\\]|^)[\.\*\+\?\]|\\\\[snw]', 'i')) != -1
            ){
                regexpConfirm = confirm(chrome.i18n.getMessage("regular_expression_characters_warning"));
            }


            if(regexpConfirm) {
                CONTENT_SYNCHRONIZATION.addActionMark({
                    action: "massEditDescription",
                    entireOption: {
                        text: textArea.value,
                        metaTarget: metaTarget
                    }
                });
            }
        }
        else if( mod !== "regexp" && !textArea.value){
            FUA_MW.addToInfo({
                'text' : chrome.i18n.getMessage("text_for_adding_does_not_exist") + '.',
                'class' : FUA_MW.class.error_info_line,
                'info' : document.getElementById(FUA_MD_EDIT.id.info)
            });
        }
        else if( mod === "regexp" && !regexp){
            FUA_MW.addToInfo({
                'text' : chrome.i18n.getMessage("regular_expression_for_replacing_does_not_exist"),
                'class' : FUA_MW.class.error_info_line,
                'info' : document.getElementById(FUA_MD_EDIT.id.info)
            });
        }
    };

    Fua_mass_description_edit.prototype.clickByRecoverLogButton = function(options){
        var recoverBtn = document.getElementById(FUA_MD_EDIT.id.recover_log_btn);
        if(recoverBtn.classList.contains(FUA_MW.class.disable)) return false;


        CONTENT_SYNCHRONIZATION.removeActionMark({
            action : "massEditDescription"
        });

        CONTENT_SYNCHRONIZATION.addActionMark({
            action : "massEditDescription",
            entireOption : {
                logsRecover : true,
                log : options.log
            }
        });
    };


    Fua_mass_description_edit.prototype.createRecoverMetaData= function(options){
        var metaData = {};
        var isChanged = false;
        for(var i in options.previousMetaData){
            if(options.previousMetaData[i] !== options.currentMetaData[i]){
                metaData[i] = options.previousMetaData[i];
                isChanged = true;
                if(i == "keywords") metaData[i] = this.prepareTagsToSave(metaData[i]);
            }
        }

        if(!isChanged) return false;
        //console.log("metaData", metaData);
        return metaData;
    };


    Fua_mass_description_edit.prototype.recoverLog = function(options){
        document.getElementById(FUA_MD_EDIT.id.recover_log_btn).classList.add(FUA_MW.class.disable);

        function nextStep(options){
            options.index++;
            FUA_MD_EDIT.recoverLog(options);
        }

        if(!options.elapsedTime) options.elapsedTime = 0;
        if(!options.index) options.index = 0;
        if(!options.edited_videos) options.edited_videos = [];

        if(!options.videos_array){
            options.videos_array = [];
            for(var i in options.log.parsed){
                if(options.log.parsed[i].success) {
                    options.videos_array.push(options.log.parsed[i]);
                }
            }
        }

        if(options.videos_array[options.index]){
            var log_item = options.videos_array[options.index];
            var video_id = log_item.video_id;
            var startTime = (new Date()).getTime();

            $.get('https://www.youtube.com/edit?video_id=' + video_id, '',
                function(res){
                    //var text = log_item.text_before;
                    var currentTitle = log_item.video_title;
                    var previousMetaData = log_item.previous_meta_data;


                    var html = $($.parseHTML(res));
                    //var currentText = html.find('.video-settings-description').val();
                    var currentMetaData = {
                        title : html.find('.video-settings-title').val(),
                        description : html.find('.video-settings-description').val(),
                        keywords : FUA_MD_EDIT.parseTagString(html.find('.video-settings-tags').val())
                    };


                    var metaData = FUA_MD_EDIT.createRecoverMetaData({
                        currentMetaData : currentMetaData,
                        previousMetaData : previousMetaData
                    });


                    if(!metaData){
                        var endTime = (new Date()).getTime();
                        options.edited_videos.push(video_id);
                        FUA_MW.addToInfo({
                            'text' : chrome.i18n.getMessage("word_video") + ' "' + currentTitle + '" (' + video_id + ') '+ chrome.i18n.getMessage("has_been_updated_during") +' ' + ((endTime - startTime) / 1000).toFixed(2) + ' ' + chrome.i18n.getMessage("word_seconds"),
                            'class' : FUA_MW.class.success_info_line,
                            'info' : document.getElementById(FUA_MD_EDIT.id.info)
                        });
                        options.elapsedTime += ((endTime - startTime) / 1000);
                        FUA_MD_EDIT.updateProgressBar({
                            percentages : (options.index + 1) / options.videos_array.length * 100
                        });
                        nextStep(options);
                        return false;
                    }

                    /*var data =
                        'description=' + encodeURIComponent(text) +
                        '&modified_fields=description' +
                        '&video_id=' + video_id +
                        '&session_token=' + FUA_GET_VALUE.getXsrfToken(res);*/


                    var data = FUA_MD_EDIT.createSaveDataString({
                        metaData : metaData,
                        video_id : video_id,
                        res : res
                    });


                    $.post(
                        'https://www.youtube.com/metadata_ajax?action_edit_video=1',
                        data,
                        function(res){
                            console.log('mdeResponse', res);
                            var endTime = (new Date()).getTime();
                            if(res && res.metadata_errors && !res.metadata_errors.length){
                                options.edited_videos.push(video_id);
                                FUA_MW.addToInfo({
                                    'text' : chrome.i18n.getMessage("word_video") + ' "' + currentTitle + '" (' + video_id + ') '+ chrome.i18n.getMessage("has_been_updated_during") +' ' + ((endTime - startTime) / 1000).toFixed(2) + ' '+ chrome.i18n.getMessage("word_seconds"),
                                    'class' : FUA_MW.class.success_info_line,
                                    'info' : document.getElementById(FUA_MD_EDIT.id.info)
                                });
                            }
                            else if(res && res.metadata_errors && res.metadata_errors.length){
                                for(var i in res.metadata_errors){
                                    if(res.metadata_errors[i].message){
                                        var error = res.metadata_errors[i].message.error || res.metadata_errors[i].message;
                                        var field = res.metadata_errors[i].field || '';
                                        FUA_MW.addToInfo({
                                            'text' : chrome.i18n.getMessage("word_video") + ' "' + currentTitle + '" (' + video_id + '). '+ chrome.i18n.getMessage("saving_error") +': ' + error + ' ('+ field +')',
                                            'class' : FUA_MW.class.error_info_line,
                                            'info' : document.getElementById(FUA_MD_EDIT.id.info)
                                        });
                                    }
                                }
                            }
                            else{
                                FUA_MW.addToInfo({
                                    'text' : chrome.i18n.getMessage("word_video") + ' "' + currentTitle + '" (' + video_id + '). '+ chrome.i18n.getMessage("unknown_saving_error") + +'!',
                                    'class' : FUA_MW.class.error_info_line,
                                    'info' : document.getElementById(FUA_MD_EDIT.id.info)
                                });
                            }

                            options.elapsedTime += ((endTime - startTime) / 1000);
                            FUA_MD_EDIT.updateProgressBar({
                                percentages : (options.index + 1) / options.videos_array.length * 100
                            });

                            nextStep(options);
                        }
                    ).fail(function(info){
                        FUA_YT_LOGGING.addLogItem(FUA_YT_LOGGING.addLogItemErrorInfo({
                            logData : logData,
                            error_type : "unknownError"
                        }));

                        FUA_MW.addToInfo({
                            'text' : chrome.i18n.getMessage("could_not_connect_to_server") + ' ' +  chrome.i18n.getMessage("to_save_updated_meta_data") + ' ' + video_id,
                            'class' : FUA_MW.class.error_info_line,
                            'info' : document.getElementById(FUA_MD_EDIT.id.info)
                        });
                        nextStep(options);
                    });
                }
            ).fail(function(info){
                FUA_MW.addToInfo({
                    'text' : chrome.i18n.getMessage("could_not_connect_to_server") + ' '+ chrome.i18n.getMessage("to_get_the_information_about_the_video") +' ' + video_id,
                    'class' : FUA_MW.class.error_info_line,
                    'info' : document.getElementById(FUA_MD_EDIT.id.info)
                });
                nextStep(options);
            });
        }
        else {
            console.log('mdFinish', options.edited_videos);
            FUA_MW.addToInfo({
                'text' : chrome.i18n.getMessage("meta_data_has_been_recovered_for") + ' ' +
                options.edited_videos.length + '/' +
                options.videos_array.length +
                ' '+ chrome.i18n.getMessage("word_video").toLowerCase() +'. ('+ options.elapsedTime.toFixed(2) +' '+ chrome.i18n.getMessage("word_seconds") +')',
                'class' : FUA_MW.class.finish_info_line,
                'info' : document.getElementById(FUA_MD_EDIT.id.info)
            });

            document.getElementById(FUA_MD_EDIT.id.recover_log_btn)
                .classList.remove(FUA_MW.class.disable);

            CONTENT_SYNCHRONIZATION.removeActionMark({
                action : "massEditDescription"
            });
        }
    };


    Fua_mass_description_edit.prototype.parseTagString = function(tagString){
        var tmp = tagString
            .replace(new RegExp("&quot;", "gi"), '"')
            .replace(new RegExp('" ', "gi"), '", ')
            .replace(new RegExp(' "', "gi"), ', "')
            .replace(new RegExp(',,', "gi"), ',')
            .split(", ");


        for(var i in tmp){
            if(!tmp[i].match('"')) tmp[i] = tmp[i].replace(new RegExp(' ', "gi"), ', ');
            else tmp[i] = tmp[i].replace(new RegExp('"', "gi"), "");
        }

        return tmp.join(',');
    };


    Fua_mass_description_edit.prototype.prepareTagsToSave = function(tagString){
        console.log("tagString", tagString);
        var tmp = tagString.split(",");

        for(var i in tmp){
            tmp[i] = tmp[i].trim().replace(new RegExp('[ ]+', "g"), " ");
            if(tmp[i].match("[ ]")) tmp[i] = '"' + tmp[i] + '"';
        }

        //console.log("tmp", tmp);

        return tmp.join(' ');
    };



    Fua_mass_description_edit.prototype.changeMetaData = function(options){
        var metaTarget = options.metaTarget;
        var mod = options.mod;
        var currentMetaData = options.currentMetaData;
        var newMetaData = {};
        var isMetaChanges = false;

        for(var i in currentMetaData){
            if(!metaTarget[i]) continue;

            var text = options.text;
            var regexp = options.regexp;
            var c = "";
            if(i == "keywords"){
                if(regexp) regexp = regexp.replace(new RegExp(",", "g"), "");
                text = text.replace(new RegExp('"|^[,]+|,]+$', "g"), "").trim();
                c = ","
            }

            if(mod === 'all') newMetaData[i] = text;
            else if(mod === 'start') newMetaData[i] = text + c + currentMetaData[i];
            else if(mod === 'end') newMetaData[i] = currentMetaData[i] + c + text;
            else if(mod === 'regexp' && regexp) {
                if(currentMetaData[i].match(new RegExp(regexp))){
                    if(i == "keywords") text = text.replace(new RegExp(",", "g"), "");
                    newMetaData[i] =
                        currentMetaData[i].replace(new RegExp(regexp, 'g'), text);
                }
            }

            if(i == "keywords" && newMetaData[i]) newMetaData[i] = this.prepareTagsToSave(newMetaData[i]);
            if(newMetaData[i]) isMetaChanges = true;
        }

        if(isMetaChanges) return newMetaData;
        else return false;
    };


    Fua_mass_description_edit.prototype.createSaveDataString = function(options){
        var valuesString = "";
        var modifiedFieldString = "";
        for(var i in options.metaData){
            if(valuesString) valuesString += "&";
            valuesString += i + "=" + encodeURIComponent(options.metaData[i]);

            if(modifiedFieldString) modifiedFieldString += ",";
            modifiedFieldString += i;
        }

        return valuesString + '&modified_fields=' + modifiedFieldString +
        '&video_id=' + options.video_id +
        '&session_token=' + FUA_GET_VALUE.getXsrfToken(options.res);
    };


    Fua_mass_description_edit.prototype.editDescription = function(options){
        if(!options.videos_array.length) return false;
        if(!options.text && options.mod !== 'regexp') return false;
        if(!options.elapsedTime) options.elapsedTime = 0;
        if(!options.index) options.index = 0;
        if(!options.edited_videos) options.edited_videos = [];

        function nextStep(options){
            options.index++;
            FUA_MD_EDIT.editProcess = options;
            if(!FUA_MD_EDIT.pause) FUA_MD_EDIT.editDescription(options);
            else{
                FUA_MW.addToInfo({
                    'text' : chrome.i18n.getMessage("updating_of_meta_data_has_been_stopped"),
                    'class' : FUA_MW.class.success_info_line,
                    'info' : document.getElementById(FUA_MD_EDIT.id.info)
                });
                $("#" + FUA_MD_EDIT.id.continue_btn).show();
                document.getElementById(FUA_MD_EDIT.id.edit_btn)
                    .classList.remove(FUA_MW.class.disable);
            }
        }

        if(options.videos_array[options.index]){
            var video_id = options.videos_array[options.index];
            var startTime = (new Date()).getTime();


            var logData = {
                logs_name : options.logs_name,
                log_id : options.log_id,
                log_item : {
                    index: options.index,
                    video_id : video_id,
                }
            };


            $.get('https://www.youtube.com/edit?video_id=' + video_id, '',
                function(res){

                    //console.log("res", res);

                    var html = $($.parseHTML(res));
                    var currentMetaData = {
                        title : html.find('.video-settings-title').val(),
                        description : html.find('.video-settings-description').val(),
                        keywords : FUA_MD_EDIT.parseTagString(html.find('.video-settings-tags').val())
                    };


                    logData.log_item.video_title = currentMetaData.title;


                    /*var currentTitle = html.find('.video-settings-title').val();
                    var currentText = html.find('.video-settings-description').val();

                    logData.log_item.video_title = currentTitle;
                    logData.log_item.text_before = currentText;

                    if(options.mod === 'all') text = options.text;
                    else{
                        if(options.mod === 'start')  text = options.text + currentText;
                        else if(options.mod === 'end') text = currentText + options.text;
                        else if(options.mod === 'regexp' && options.regexp) {
                            if(!currentText.match(new RegExp(options.regexp))){
                                var endTime = (new Date()).getTime();
                                FUA_MW.addToInfo({
                                    'text' : 'Видео "' + currentTitle + '" (' + video_id + ') не обновлено (Не найдено совпадений) ' + ((endTime - startTime) / 1000).toFixed(2) + ' секунд',
                                    'class' : FUA_MW.class.error_info_line,
                                    'info' : document.getElementById(FUA_MD_EDIT.id.info)
                                });

                                FUA_YT_LOGGING.addLogItem(FUA_YT_LOGGING.addLogItemErrorInfo({
                                    logData : logData,
                                    error_type : "noMatchesInText"
                                }));

                                options.elapsedTime += ((endTime - startTime) / 1000);
                                FUA_MD_EDIT.updateProgressBar({
                                    percentages : (options.index + 1) / options.videos_array.length * 100
                                });
                                nextStep(options);
                                return false;
                            }

                            text = currentText
                                .replace(new RegExp(options.regexp, 'g'), options.text);
                        }
                        else {
                            nextStep(options);
                            return false;
                        }

                    }

                    logData.log_item.text_after = text;*/

                    console.log("currentMetaData", currentMetaData);

                    var newMetaData = FUA_MD_EDIT.changeMetaData({
                        metaTarget : options.metaTarget,
                        currentMetaData : currentMetaData,
                        mod : options.mod,
                        text : options.text,
                        regexp : options.regexp
                    });


                    //console.log("newMetaData", newMetaData);
                   // return false;




                    if(!newMetaData){
                        var endTime = (new Date()).getTime();
                        FUA_MW.addToInfo({
                            'text' : chrome.i18n.getMessage("word_video") + ' "' + currentMetaData.title + '" (' + video_id + ') '+ chrome.i18n.getMessage("has_not_been_updated") +' ('+ chrome.i18n.getMessage("no_changes") +') ' + ((endTime - startTime) / 1000).toFixed(2) + ' ' + chrome.i18n.getMessage("word_seconds"),
                            'class' : FUA_MW.class.error_info_line,
                            'info' : document.getElementById(FUA_MD_EDIT.id.info)
                        });

                        FUA_YT_LOGGING.addLogItem(FUA_YT_LOGGING.addLogItemErrorInfo({
                            logData : logData,
                            error_type : "noChangesMake"
                        }));

                        options.elapsedTime += ((endTime - startTime) / 1000);
                        FUA_MD_EDIT.updateProgressBar({
                            percentages : (options.index + 1) / options.videos_array.length * 100
                        });
                        logData.log_item.new_meta_data = {};
                        nextStep(options);
                        return false;
                    }


                    logData.log_item.new_meta_data = newMetaData;
                    logData.log_item.previous_meta_data = {};
                    for(var i in newMetaData){
                        logData.log_item.previous_meta_data[i] = currentMetaData[i];
                    }


                    var data = FUA_MD_EDIT.createSaveDataString({
                        metaData : newMetaData,
                        video_id : video_id,
                        res : res
                    });

                    $.post(
                        'https://www.youtube.com/metadata_ajax?action_edit_video=1',
                        data,
                        function(res){
                            console.log('mdeResponse', res);
                            var endTime = (new Date()).getTime();
                            if(res && res.metadata_errors && !res.metadata_errors.length){
                                options.edited_videos.push(video_id);
                                FUA_MW.addToInfo({
                                    'text' : chrome.i18n.getMessage("word_video") + ' "' + currentMetaData.title + '" (' + video_id + ') '+ chrome.i18n.getMessage("has_been_updated_during")  +' ' + ((endTime - startTime) / 1000).toFixed(2) + ' ' + chrome.i18n.getMessage("word_seconds"),
                                    'class' : FUA_MW.class.success_info_line,
                                    'info' : document.getElementById(FUA_MD_EDIT.id.info)
                                });

                                logData.log_item.success = true;
                                FUA_YT_LOGGING.addLogItem(logData);
                            }
                            else if(res && res.metadata_errors && res.metadata_errors.length){
                                for(var i in res.metadata_errors){
                                    if(res.metadata_errors[i].message){
                                        var error = res.metadata_errors[i].message.error || res.metadata_errors[i].message;
                                        var field = res.metadata_errors[i].field || '';
                                        FUA_MW.addToInfo({
                                            'text' : chrome.i18n.getMessage("word_video") + ' "' + currentMetaData.title + '" (' + video_id + '). '+ chrome.i18n.getMessage("saving_error")  +': ' + error + ' ('+ field +')',
                                            'class' : FUA_MW.class.error_info_line,
                                            'info' : document.getElementById(FUA_MD_EDIT.id.info)
                                        });
                                    }

                                    FUA_YT_LOGGING.addLogItem(FUA_YT_LOGGING.addLogItemErrorInfo({
                                        logData : logData,
                                        error_type : "saveDataUnCorrect"
                                    }));
                                }
                            }
                            else{
                                FUA_YT_LOGGING.addLogItem(FUA_YT_LOGGING.addLogItemErrorInfo({
                                    logData : logData,
                                    error_type : "unknownError"
                                }));

                                FUA_MW.addToInfo({
                                    'text' : chrome.i18n.getMessage("word_video") + ' "' + currentMetaData.title + '" (' + video_id + '). '+ chrome.i18n.getMessage("unknown_saving_error")  +'!',
                                    'class' : FUA_MW.class.error_info_line,
                                    'info' : document.getElementById(FUA_MD_EDIT.id.info)
                                });
                            }

                            options.elapsedTime += ((endTime - startTime) / 1000);
                            FUA_MD_EDIT.updateProgressBar({
                                percentages : (options.index + 1) / options.videos_array.length * 100
                            });

                            nextStep(options);
                        }
                    ).fail(function(info){
                            FUA_YT_LOGGING.addLogItem(FUA_YT_LOGGING.addLogItemErrorInfo({
                                logData : logData,
                                error_type : "unknownError"
                            }));

                            FUA_MW.addToInfo({
                                'text' : chrome.i18n.getMessage("could_not_connect_to_server") + ' '+ chrome.i18n.getMessage("to_save_updated_meta_data") +' ' + video_id,
                                'class' : FUA_MW.class.error_info_line,
                                'info' : document.getElementById(FUA_MD_EDIT.id.info)
                            });
                            nextStep(options);
                        });
                }
            ).fail(function(info){
                FUA_YT_LOGGING.addLogItem(FUA_YT_LOGGING.addLogItemErrorInfo({
                    logData : logData,
                    error_type : "noDataFromServer"
                }));

                FUA_MW.addToInfo({
                    'text' : chrome.i18n.getMessage("could_not_connect_to_server") + ' ' + chrome.i18n.getMessage("to_get_the_information_about_the_video") + video_id,
                    'class' : FUA_MW.class.error_info_line,
                    'info' : document.getElementById(FUA_MD_EDIT.id.info)
                });
                nextStep(options);
            });
        }
        else {
            console.log('mdFinish', options.edited_videos);


            var finishData = {
                logs_name : options.logs_name,
                log_id : options.log_id,
                finish_data : {
                    parsed_count : options.videos_array.length,
                    edited_count : options.edited_videos.length
                }
            };
            FUA_YT_LOGGING.addFinishData(finishData);

            FUA_MW.addToInfo({
                'text' : chrome.i18n.getMessage("meta_data_has_been_updated_for") + ' ' +
                    options.edited_videos.length + '/' +
                    options.videos_array.length +
                    ' '+ chrome.i18n.getMessage("word_video").toLowerCase() +'. ('+ options.elapsedTime.toFixed(2) +' '+ chrome.i18n.getMessage("word_seconds") +')',
                'class' : FUA_MW.class.finish_info_line,
                'info' : document.getElementById(FUA_MD_EDIT.id.info)
            });

            document.getElementById(FUA_MD_EDIT.id.edit_btn)
                .classList.remove(FUA_MW.class.disable);

            $("#" + FUA_MD_EDIT.id.pause_btn).hide();
            $("#" + FUA_MD_EDIT.id.continue_btn).hide();

            CONTENT_SYNCHRONIZATION.removeActionMark({
                action : "massEditDescription"
            });
        }
    };


    // create instance
    return new Fua_mass_description_edit();
})();