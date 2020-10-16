chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;


    /*******/
    if (
        title == 'addHtmlToVideosMenagePage'
    ) {
        if(!$('#fua_youtube_mass_description_edit_id').length) {
            $('#creator-subheader').append(
                '<div id="fua_youtube_mass_description_edit_id" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                    '<span class="yt-uix-button-content">' +
                        chrome.i18n.getMessage("edit_meta_data") +
                    '</span>' +
                '</div>'
            );

            $('#fua_youtube_mass_description_edit_id').click(function(){
                FUA_MW.createModalWindow({
                    target : 'mass-description-edit',
                    text_title : chrome.i18n.getMessage("edit_meta_data"),
                    left : true,
                    callback : function(){
                        var content = document.getElementById(FUA_MW.id.content);

                        var left_div = document.createElement('div');
                        left_div.setAttribute('id', FUA_MD_EDIT.id.left_div);

                        var select_mod = document.createElement('select');
                        select_mod.setAttribute('id', FUA_MD_EDIT.id.select_mode);
                        for(var i in FUA_MD_EDIT.select_mode_options){
                            var option = document.createElement('option');
                            option.setAttribute('value', i);
                            option.textContent = FUA_MD_EDIT.select_mode_options[i];
                            select_mod.appendChild(option);
                        }

                        var regexp_input = document.createElement('input');
                        regexp_input.setAttribute('id', FUA_MD_EDIT.id.regexp_input);
                        regexp_input.setAttribute('placeholder', chrome.i18n.getMessage("insert_regular_expression"));
                        regexp_input.classList.add(FUA_MW.class.hidden);

                        select_mod.addEventListener('change', function(){
                            if(this.value == 'regexp') {
                                regexp_input.classList.remove(FUA_MW.class.hidden);
                            }
                            else regexp_input.classList.add(FUA_MW.class.hidden);
                        });


                        var text_area = document.createElement('textarea');
                        text_area.setAttribute('id', FUA_MD_EDIT.id.text_area);
                        //text_area.setAttribute('placeholder', 'При добавлении, теги пишутся через запятую (тег1, тег2...)');


                        left_div.appendChild(select_mod);
                        left_div.appendChild(regexp_input);
                        left_div.appendChild(text_area);
                        content.appendChild(left_div);


                        var right_div = document.createElement('div');
                        right_div.setAttribute('id', FUA_MD_EDIT.id.right_div);

                        var info = document.createElement('div');
                        info.setAttribute('id', FUA_MD_EDIT.id.info);
                        right_div.appendChild(info);
                        content.appendChild(right_div);


                        var additional_block = document.createElement("div");
                        additional_block.setAttribute("id", FUA_MD_EDIT.id.additional_block);
                        additional_block.style.clear = "both";
                        content.appendChild(additional_block);


                        var button_div = document.createElement('div');
                        button_div.style.clear = 'both';
                        button_div.style.paddingTop = '10px';

                        var edit_button = document.createElement('div');
                        edit_button.setAttribute('id', FUA_MD_EDIT.id.edit_btn);
                        edit_button.textContent = chrome.i18n.getMessage("word_edit");
                        edit_button.addEventListener('click', function(){
                            FUA_MD_EDIT.clickByEditButton();
                        });


                        var pause_button = document.createElement('div');
                        pause_button.setAttribute('id', FUA_MD_EDIT.id.pause_btn);
                        pause_button.textContent = chrome.i18n.getMessage("word_stop");
                        pause_button.addEventListener('click', function() {
                            $("#" + FUA_MD_EDIT.id.pause_btn).hide();
                            FUA_MD_EDIT.pause = true;
                        });


                        var continue_button = document.createElement('div');
                        continue_button.setAttribute('id', FUA_MD_EDIT.id.continue_btn);
                        continue_button.textContent = chrome.i18n.getMessage("word_continue");
                        continue_button.addEventListener('click', function() {
                            $("#" + FUA_MD_EDIT.id.pause_btn).show();
                            $("#" + FUA_MD_EDIT.id.continue_btn).hide();
                            edit_button.classList.add(FUA_MW.class.disable);
                            FUA_MD_EDIT.pause = false;
                            FUA_MW.addToInfo({
                                'text' : chrome.i18n.getMessage("updating_continue"),
                                'class' : FUA_MW.class.success_info_line,
                                'info' : document.getElementById(FUA_MD_EDIT.id.info)
                            });
                            FUA_MD_EDIT.continueEditDescription();
                        });



                        var log_button = document.createElement('div');
                        log_button.setAttribute('id', FUA_MD_EDIT.id.log_btn);
                        log_button.textContent = 'Log';
                        log_button.addEventListener('click', function() {
                            FUA_YT_LOGGING.openTabLog({
                                url : "mass_edit_description_log.html"
                            });
                        });


                        button_div.appendChild(edit_button);
                        button_div.appendChild(pause_button);
                        button_div.appendChild(continue_button);
                        button_div.appendChild(log_button);
                        content.appendChild(button_div);

                        if(body.mdEditLog) $("#" + FUA_MD_EDIT.id.log_btn).show();

                        /*$("#" + FUA_MD_EDIT.id.left_div).prepend(
                            '<div>' +
                                '<label style="margin-right: 10px;">' +
                                    '<input type="checkbox" id="'+ FUA_MD_EDIT.id.title_checkbox +'"/>Название' +
                                '</label>' +
                                '<label style="margin-right: 10px;">' +
                                    '<input type="checkbox" id="'+ FUA_MD_EDIT.id.description_checkbox +'"/>Описание' +
                                '</label>' +
                                '<label>' +
                                    '<input type="checkbox" id="'+ FUA_MD_EDIT.id.keywords_checkbox +'">Теги' +
                                '</label>' +
                            '</div>'
                        );*/


                        $("#" + FUA_MD_EDIT.id.left_div).prepend(
                            '<div>' +
                                '<label style="margin-right: 10px;">' +
                                    '<input type="radio" name="'+FUA_MD_EDIT.class.field_for_edit+'" value="title"/>' +
                                    chrome.i18n.getMessage("word_title") +
                                '</label>' +
                                '<label style="margin-right: 10px;">' +
                                    '<input type="radio" name="'+FUA_MD_EDIT.class.field_for_edit+'" value="description"/>' +
                                    chrome.i18n.getMessage("word_description") +
                                '</label>' +
                                '<label>' +
                                    '<input type="radio" name="'+FUA_MD_EDIT.class.field_for_edit+'" value="keywords">' +
                                    chrome.i18n.getMessage("word_tags") +
                                '</label>' +
                            '</div>'
                        );

                        $('input[name="'+ FUA_MD_EDIT.class.field_for_edit +'"]').change(function(){
                            var targetField = $('input[name="'+ FUA_MD_EDIT.class.field_for_edit +'"]' + ':checked').val();
                            if(targetField === "keywords"){
                                $("#" + FUA_MD_EDIT.id.text_area).attr(
                                    "placeholder", chrome.i18n.getMessage("adding_tags_placeholder")
                                )
                            }
                            else{
                                $("#" + FUA_MD_EDIT.id.text_area).attr(
                                    "placeholder",
                                    chrome.i18n.getMessage("text_for_adding_or_replacing")
                                )
                            }

                        });
                    }
                });
            });
        }


        FUA_ANNOTATION_EDIT.ourPatterns = body.savedAnnotations;

        /*if(!$('#'+ FUA_ANNOTATION_EDIT.id.first_button).length) {
            $('#creator-subheader').append(
                '<div id="'+ FUA_ANNOTATION_EDIT.id.first_button +'" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                    '<span class="yt-uix-button-content">' +
                        chrome.i18n.getMessage("mass_editing_of_annotations") +
                        ' (' +
                            chrome.i18n.getMessage("alpha_version") +
                        ')</span>' +
                '</div>'
            );

            $('#'+ FUA_ANNOTATION_EDIT.id.first_button).click(function(){
                FUA_MW.createModalWindow({
                    target : 'mass-annotation-edit',
                    text_title :  chrome.i18n.getMessage("mass_editing_of_annotations"),
                    left : true,
                    callback : function(){
                        var content = document.getElementById(FUA_MW.id.content);

                        $(content).html(
                            '<div>' +
                                '<input type="radio" class="'+ FUA_ANNOTATION_EDIT.class.radio_mod +'" name="'+ FUA_ANNOTATION_EDIT.class.radio_mod +'" checked="checked" value="add"> ' + chrome.i18n.getMessage("word_add") +
                                '<input type="radio" class="'+ FUA_ANNOTATION_EDIT.class.radio_mod +'" name="'+ FUA_ANNOTATION_EDIT.class.radio_mod +'" disabled="disabled"> ' + chrome.i18n.getMessage("word_replace") +
                                '<input type="radio" class="'+ FUA_ANNOTATION_EDIT.class.radio_mod +'" name="'+ FUA_ANNOTATION_EDIT.class.radio_mod +'" value="delete"> ' + chrome.i18n.getMessage("word_delete") +
                            '</div>' +
                            '<div id="'+ FUA_ANNOTATION_EDIT.id.add_radio_mod_box +'">' +
                                '<input type="radio" class="'+ FUA_ANNOTATION_EDIT.class.radio_add_mod +'" name="'+ FUA_ANNOTATION_EDIT.id.radio_add_mod +'" checked="checked" value="start"> ' +  chrome.i18n.getMessage("form_start_2") +
                                '<input type="radio" class="'+ FUA_ANNOTATION_EDIT.class.radio_add_mod +'" name="'+ FUA_ANNOTATION_EDIT.id.radio_add_mod +'" value="end"> ' +  chrome.i18n.getMessage("from_end") +
                            '</div>' +

                            '<div style="margin-top: 5px; padding-top: 5px; border-top: 1px dashed orange;">' +
                                '<div id="'+ FUA_ANNOTATION_EDIT.id.left_div +'">' +
                                    '<div id="'+ FUA_ANNOTATION_EDIT.id.pattern_box +'"></div>' +
                                '</div>' +
                                '<div id="'+ FUA_ANNOTATION_EDIT.id.right_div +'">' +
                                    '<div id="'+ FUA_ANNOTATION_EDIT.id.info +'"></div>' +
                                '</div>' +
                                '<div style="clear: both"></div>' +
                            '</div>' +

                            '<div id="'+ FUA_ANNOTATION_EDIT.id.additional_block +'"></div>' +
                            '<div id="'+ FUA_ANNOTATION_EDIT.id.buttons_div +'">' +
                                '<button id="'+ FUA_ANNOTATION_EDIT.id.btn_execute +'">' +
                                    chrome.i18n.getMessage("word_execute") +
                                '</button>' +
                            '</div>'

                        );

                        //console.log(FUA_ANNOTATION_EDIT.sortPatternsByChannels());
                        var sortedPatterns = FUA_ANNOTATION_EDIT.sortPatternsByChannels(FUA_ANNOTATION_EDIT.ourPatterns);
                        var patternsBox =  $("#" + FUA_ANNOTATION_EDIT.id.pattern_box);
                        for(var i in sortedPatterns){
                            var channel = sortedPatterns[i];
                            patternsBox.append('<div style="font-weight: bold;">'+ channel.name +':</div>');
                            var patterns = channel.patterns;
                            for(var  j in patterns){
                                patternsBox.append(
                                    '<div class="'+ FUA_ANNOTATION_EDIT.class.pattern_item +'">' +
                                        '<input type="checkbox" class="'+ FUA_ANNOTATION_EDIT.class.pattern_checkbox +'" pattern_id="'+ j +'">' +
                                        '<span>('+ patterns[j].style +') ' + patterns[j].text + '</span>' +
                                    '</div>'
                                );
                            }
                        }

                        $('.' + FUA_ANNOTATION_EDIT.class.radio_mod).change(function(){
                            var modValue = $("." + FUA_ANNOTATION_EDIT.class.radio_mod + ":checked").val();
                            $('#' + FUA_ANNOTATION_EDIT.id.add_radio_mod_box).hide();
                            if(modValue === "add"){
                                $('#' + FUA_ANNOTATION_EDIT.id.add_radio_mod_box).show();
                            }
                        });


                        $('#' + FUA_ANNOTATION_EDIT.id.btn_execute).click(function(){
                            var checkedVideos = FUA_GET_VALUE.getCheckedVideosInManager();
                            var checkedPatterns = [];
                            
                            $("." + FUA_ANNOTATION_EDIT.class.pattern_checkbox).each(function () {
                                if($(this).prop('checked')) {
                                    checkedPatterns.push($(this).attr("pattern_id"));
                                }
                            });

                            if(
                                !$(this).hasClass(FUA_MW.class.disable)
                                && checkedPatterns.length
                                && checkedVideos.videos_array.length
                            ){
                                $(this).addClass(FUA_MW.class.disable);

                                var modValue = $("." + FUA_ANNOTATION_EDIT.class.radio_mod + ":checked").val();

                                if(modValue === "add") {
                                    FUA_ANNOTATION_EDIT.massAddAnnotations({
                                        videos_array: checkedVideos.videos_array,
                                        checkedPatterns: checkedPatterns,
                                        fromWhere: $("." + FUA_ANNOTATION_EDIT.class.radio_add_mod + ":checked").val()
                                    });
                                }
                                else if(modValue === "delete"){
                                    FUA_ANNOTATION_EDIT.massDeleteAnnotations({
                                        videos_array: checkedVideos.videos_array,
                                        checkedPatterns: checkedPatterns,
                                    });
                                }
                            }
                            else if(!$(this).hasClass(FUA_MW.class.disable)) {
                                if (!checkedVideos.videos_array.length) {
                                    FUA_MW.addToInfo({
                                        'text': chrome.i18n.getMessage("not_selected_videos"),
                                        'class': FUA_MW.class.error_info_line,
                                        'info': document.getElementById(FUA_ANNOTATION_EDIT.id.info)
                                    });
                                }
                                else if (!checkedPatterns.length) {
                                    FUA_MW.addToInfo({
                                        'text': chrome.i18n.getMessage("not_selected_pattens"),
                                        'class': FUA_MW.class.error_info_line,
                                        'info': document.getElementById(FUA_ANNOTATION_EDIT.id.info)
                                    });
                                }
                            }
                        });
                    }
                });
            });
        }*/
    }
});