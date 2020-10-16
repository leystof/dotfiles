function setSettingViaCheckbox(options){
    if(options.id.match('input')){
        $('#' + options.id)[0].addEventListener("input", function(){
            chrome.extension.getBackgroundPage().setSpecialSetting({
                name: options.name, value: $(this).val().trim()
            });
        });
    }
    else {
        $('#' + options.id).change(function () {
            if ($(this).attr('id').match('select')) {
                chrome.extension.getBackgroundPage().setSpecialSetting({
                    name: options.name, value: $(this).val()
                });
            }
            else {
                if ($(this).prop('checked')) {
                    chrome.extension.getBackgroundPage().setSpecialSetting({
                        name: options.name, value: 2
                    });
                }
                else {
                    chrome.extension.getBackgroundPage().setSpecialSetting({
                        name: options.name, value: 1
                    });
                }
            }
        });
    }
}


function setSettingViaCheckboxLoop(array){
    for(var i in array){
        setSettingViaCheckbox({id : array[i].id, name : array[i].name});
    }
}


function localizationText(){

    function settingsCheckboxLocalization(items){
        for(var i in items){
            var targetClass = 'checkbox_label_text';
            if(items[i].id.match('select')) targetClass = 'select_title_text';
            $('#' + items[i].id).closest('div.row').find('.' + targetClass).first()
                .html(items[i].text);
        }
    }


    settingsCheckboxLocalization([
        {id : 'checkbox-annotations-blocked-toggle-id', text : C_TEXT_CHECKBOX_SETTINGS_ANNOTATIONS_BLOCKED_TOGGLE},
        {id : 'checkbox-advertising-blocked-toggle-id', text : C_TEXT_CHECKBOX_SETTINGS_ADVERTISING_BLOCKED_TOGGLE},
        {id : 'checkbox-autoplay-blocked-toggle-id', text : C_TEXT_SETTINGS_CHECKBOX_AUTOPLAY_BLOCKED_TOGGLE},
        {id : 'checkbox-smartpause-toggle-id', text : C_TEXT_SETTINGS_CHECKBOX_SMARTPAUSE_TOGGLE},
        {id : 'checkbox-smartscroll-toggle-id', text : C_TEXT_SETTINGS_CHECKBOX_SMARTSCROLL_TOGGLE},
        {id : 'checkbox-wheel-mouse-volume-toggle-id', text : C_TEXT_SETTINGS_CHECKBOX_WHEEL_VOLUME_TOGGLE},
        {id : 'checkbox-design-toggle-id', text : C_TEXT_SETTINGS_CHECKBOX_DESIGN_TOGGLE},
        {id : 'checkbox-open-new-window-id', text : C_TEXT_SETTINGS_CHECKBOX_OPEN_NEW_WINDOW},
        {id : 'checkbox-screenshot-toggle-id', text : C_TEXT_SETTINGS_CHECKBOX_SCREENSHOT_TOGGLE},
        {id : 'checkbox-gridsearch-toggle-id', text : C_TEXT_SETTINGS_CHECKBOX_GRIDSEARCH_TOGGLE},
        {id : 'checkbox-blackchannels-toggle-id', text : C_TEXT_SETTINGS_CHECKBOX_BLACKCHANNELS_TOGGLE},
        {id : 'checkbox-blocked-blackchannels-video-id', text : C_TEXT_SETTINGS_CHECKBOX_BLOCKED_BLACKCHANNELS_VIDEO},
        {id : 'checkbox-save-time-toggle-id', text : C_TEXT_SETTINGS_CHECKBOX_SAVE_TIME_TOGGLE},
        {id : 'checkbox-recommendation-toggle-id', text : C_TEXT_SETTINGS_CHECKBOX_RECOMMENDATION_TOGGLE},
        {id : 'select-videoquality-id', text : C_TEXT_SETTINGS_SELECT_VIDEOQUALITY},
        {id : 'select-speed-id', text : chrome.i18n.getMessage("settings_select_videospeed")},
    ]);


    $('#panel_title_text').html(C_WORD_SETTINGS);
    $('.developed_by').html(C_TEXT_DEVELOPED_BY);
    $('#show_black_channels_id').html(C_WORD_SHOW);
    $('.what_text').html(C_WORD_DETAILS);
    $('#input-logourl-id').attr('placeholder', C_WORD_SUBSCRIPTION);
    $('#blocked_video_msg_input_id').attr('placeholder', chrome.i18n.getMessage("blocked_msg_placeholder"));
    $('#blocked_video_tags_id').attr('placeholder', chrome.i18n.getMessage("add_blocked_video_tags"));
    $('#set_default_scroll_video_position_id').html(chrome.i18n.getMessage("default_settings"));
    $('#blocked_video_msg_label_id').html(chrome.i18n.getMessage("blocked_video_msg_label"));
    $('#blocked_video_tags_label_id').html(chrome.i18n.getMessage("blocked_video_tags_label_id"));


    $('#select-smart-fullscreen-id').find('option').first().html(C_WORD_NO)
        .siblings().append(' ' + C_WORD_SECONDS);

    $('div#reproduction_tab_id div.title span.fua_translate_text')
        .html(FUA_BLOCKER_TRANSLATION.words.playback);

    $('#dropdown_button_blocked_annotation_id .dropdown_title')
        .html(FUA_BLOCKER_TRANSLATION.words.settings);

    $('#checkbox-blocked-only-annotations-id').siblings(".checkbox_label_text")
        .html(FUA_BLOCKER_TRANSLATION.words_combinations.no_annotations);

    $('#checkbox-blocked-only-cards-id').siblings(".checkbox_label_text")
        .html(FUA_BLOCKER_TRANSLATION.words_combinations.no_cards);

    $('#checkbox-logo-only-sound-toggle-id').siblings(".checkbox_label_text")
        .html(
            FUA_BLOCKER_TEXT.brand.settings_logo +
            " - " +
            FUA_BLOCKER_TRANSLATION.words_combinations.only_sound.toLowerCase()
        );

    $('#checkbox-subtitles-translate-toggle-id').siblings(".checkbox_label_text")
        .html(FUA_BLOCKER_TRANSLATION.words_combinations.autotranslation_subtitle);

    $('div#export_tab_id div.title span.fua_translate_text')
        .html(FUA_BLOCKER_TRANSLATION.words.export);

    $('#checkbox-gif-toggle-id').siblings(".checkbox_label_text")
        .html(FUA_BLOCKER_TRANSLATION.words_combinations.add_button + " GIF");

    $('div#design_tab_id div.title span.fua_translate_text')
        .html(FUA_BLOCKER_TRANSLATION.words.design);

    $('div#subscriptions_tab_id div.title span.fua_translate_text')
        .html(FUA_BLOCKER_TRANSLATION.words_combinations.channels_management);

    $('#fua_personal_link span.fua_translate_text')
        .html(FUA_BLOCKER_TRANSLATION.text.popup_adv_text);
}



function setLogoUrl(title, value){
    $('#dropdown_logourl_button_id').attr('value', value).attr('title', value)
        .find('.dropdown_title').html(title);

    chrome.extension.getBackgroundPage().setSpecialSetting({
        name: 'logoUrl', value: value
    });
}


function hideLogoUrlInput(){
    if($('#input-logourl-id').val().trim() === '') {
        $('.select_input_label_item').show().siblings().hide();
    }
}