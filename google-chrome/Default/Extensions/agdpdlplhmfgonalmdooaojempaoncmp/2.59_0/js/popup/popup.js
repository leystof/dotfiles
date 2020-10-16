document.addEventListener('DOMContentLoaded', function() {
    localizationText();


    var settings = chrome.extension.getBackgroundPage().getSettings();

    var installTime = chrome.extension.getBackgroundPage().getInstallTime();
    var timeLimit = chrome.extension.getBackgroundPage().C_VALUE_WEAK_LIMIT;

    if(settings && settings.scrollVideoPosition){
        $("#set_default_scroll_video_position_id").show();
    }


    if(
        installTime && timeLimit
        && (
                installTime == 1
                //|| installTime + 60000 < (new Date()).getTime()
                || installTime + timeLimit < (new Date()).getTime()
                || (settings && settings.recommendation)
            )
    ){
        $('#checkbox-recommendation-toggle-id').closest('.settings_row').show();
    }



    if(settings){
        if(settings.blockedVideoMsg){
            $("#blocked_video_msg_input_id").val(settings.blockedVideoMsg);
        }

        if(settings.blockedVideoTags){
            $("#blocked_video_tags_id").val(settings.blockedVideoTags);
        }


        if(settings.bAnnotation && settings.bAnnotation == 2){
            $('#checkbox-annotations-blocked-toggle-id').prop('checked', true);
        }

        if(!settings.bOnlyAnnotation || settings.bOnlyAnnotation == 2){
            $('#checkbox-blocked-only-annotations-id').prop('checked', true);
        }

        if(!settings.bOnlyCards || settings.bOnlyCards == 2){
            $('#checkbox-blocked-only-cards-id').prop('checked', true);
        }

        if(settings.bAnnotationFrom){
            $('#select-blocked-annotations-from-id').val(settings.bAnnotationFrom);
        }
        else $('#select-blocked-annotations-from-id').val(0);

        if(settings.bAnnotationTo){
            $('#select-blocked-annotations-to-id').val(settings.bAnnotationTo);
        }
        else $('#select-blocked-annotations-to-id').val(100);

        if(!settings.bAdvertising || settings.bAdvertising == 2){
            $('#checkbox-advertising-blocked-toggle-id').prop('checked', true);
        }

        if(settings.bAutoplay && settings.bAutoplay == 2){
            $('#checkbox-autoplay-blocked-toggle-id').prop('checked', true);
        }

        if(settings.smartPause && settings.smartPause == 2){
            $('#checkbox-smartpause-toggle-id').prop('checked', true);
        }

        if(!settings.smartScroll || settings.smartScroll == 2){
            $('#checkbox-smartscroll-toggle-id').prop('checked', true);
        }


        if(!settings.volumeWheel || settings.volumeWheel == 2){
            $('#checkbox-wheel-mouse-volume-toggle-id').prop('checked', true);
        }


        if(!settings.designToggle || settings.designToggle == 2){
            $('#checkbox-design-toggle-id').prop('checked', true);
        }


        if(!settings.openNewWindow || settings.openNewWindow == 2){
            $('#checkbox-open-new-window-id').prop('checked', true);
        }


        if(!settings.screenShot || settings.screenShot == 2){
            $('#checkbox-screenshot-toggle-id').prop('checked', true);
        }

        if(!settings.gifButton || settings.gifButton == 2){
            $('#checkbox-gif-toggle-id').prop('checked', true);
        }

        if(!settings.searchView || settings.searchView == 2){
            $('#checkbox-gridsearch-toggle-id').prop('checked', true);
        }


        if(settings && settings.smartFullScreen){
            $('#select-smart-fullscreen-id').val(settings.smartFullScreen);
        }
        else $('#select-smart-fullscreen-id').val(30);

        if(settings.defaultVideoQuality){
            $('#select-videoquality-id').val(settings.defaultVideoQuality);
        }


        if(settings.defaultVideoSpeed){
            $('#select-speed-id').val(settings.defaultVideoSpeed);
        }
        else $('#select-speed-id').val(1);


        if(settings.logoUrlToggle && settings.logoUrlToggle == 2){
            $('#checkbox-logourl-toggle-id').prop('checked', true);
        }



        if(!settings.blackChannels || settings.blackChannels == 2){
            $('#checkbox-blackchannels-toggle-id').prop('checked', true);
        }

        if(settings.blockedBlackVideos && settings.blockedBlackVideos == 2){
           $('#checkbox-blocked-blackchannels-video-id').prop('checked', true);
        }

        if(!settings.saveVideoTime || settings.saveVideoTime == 2){
            $('#checkbox-save-time-toggle-id').prop('checked', true);
        }

        if(settings.subtitleTranslate && settings.subtitleTranslate == 2){
            $('#checkbox-subtitles-translate-toggle-id').prop('checked', true);
        }

        if(!settings.logoOnlySound || settings.logoOnlySound == 2){
            $('#checkbox-logo-only-sound-toggle-id').prop('checked', true);
        }

        if(settings.recommendation && settings.recommendation == 2){
            $('#checkbox-recommendation-toggle-id').prop('checked', true);
        }

        if(settings.frequencyDeletingHistory){
            $('#select-frequency-deleting-history-id').val(settings.frequencyDeletingHistory);
        }
        else $('#select-frequency-deleting-history-id').val(0);
    }
    else{
        $('#checkbox-blocked-only-annotations-id').prop('checked', true);
        $('#checkbox-blocked-only-cards-id').prop('checked', true);
        $('#select-blocked-annotations-from-id').val(0);
        $('#select-blocked-annotations-to-id').val(100);
        $('#checkbox-advertising-blocked-toggle-id').prop('checked', true);
        $('#checkbox-smartscroll-toggle-id').prop('checked', true);
        $('#checkbox-wheel-mouse-volume-toggle-id').prop('checked', true);
        $('#checkbox-design-toggle-id').prop('checked', true);
        $('#checkbox-open-new-window-id').prop('checked', true);
        $('#checkbox-screenshot-toggle-id').prop('checked', true);
        $('#checkbox-gif-toggle-id').prop('checked', true);
        $('#checkbox-gridsearch-toggle-id').prop('checked', true);
        $('#select-smart-fullscreen-id').val(30);
        $('#select-speed-id').val(1);
        $('#checkbox-blackchannels-toggle-id').prop('checked', true);
        //$('#checkbox-recommendation-toggle-id').prop('checked', true);
        $('#checkbox-logo-only-sound-toggle-id').prop('checked', true);
        $('#checkbox-save-time-toggle-id').prop('checked', true);
        $('#select-frequency-deleting-history-id').val(0);
    }

    setSettingViaCheckboxLoop([
        {id : 'checkbox-annotations-blocked-toggle-id', name : 'bAnnotation'},
        {id : 'checkbox-blocked-only-annotations-id', name : 'bOnlyAnnotation'},
        {id : 'checkbox-blocked-only-cards-id', name : 'bOnlyCards'},
        {id : 'select-blocked-annotations-from-id', name : 'bAnnotationFrom'},
        {id : 'select-blocked-annotations-to-id', name : 'bAnnotationTo'},
        {id : 'checkbox-advertising-blocked-toggle-id', name : 'bAdvertising'},
        {id : 'checkbox-autoplay-blocked-toggle-id', name : 'bAutoplay'},
        {id : 'checkbox-smartpause-toggle-id', name : 'smartPause'},
        {id : 'checkbox-smartscroll-toggle-id', name : 'smartScroll'},
        {id : 'checkbox-wheel-mouse-volume-toggle-id', name : 'volumeWheel'},
        {id : 'checkbox-design-toggle-id', name : 'designToggle'},
        {id : 'checkbox-open-new-window-id', name : 'openNewWindow'},
        {id : 'checkbox-screenshot-toggle-id', name : 'screenShot'},
        {id : 'checkbox-gif-toggle-id', name : 'gifButton'},
        {id : 'checkbox-gridsearch-toggle-id', name : 'searchView'},
        {id : 'select-smart-fullscreen-id', name : 'smartFullScreen'},
        {id : 'select-videoquality-id', name : 'defaultVideoQuality'},
        {id : 'select-speed-id', name : 'defaultVideoSpeed'},
        {id : 'checkbox-logourl-toggle-id', name : 'logoUrlToggle'},
        {id : 'checkbox-blackchannels-toggle-id', name : 'blackChannels'},
        {id : 'checkbox-blocked-blackchannels-video-id', name : 'blockedBlackVideos'},
        {id : 'checkbox-save-time-toggle-id', name : 'saveVideoTime'},
        {id : 'checkbox-subtitles-translate-toggle-id', name : 'subtitleTranslate'},
        {id : 'checkbox-logo-only-sound-toggle-id', name : 'logoOnlySound'},
        {id : 'checkbox-recommendation-toggle-id', name : 'recommendation'},
        {id : 'select-frequency-deleting-history-id', name : 'frequencyDeletingHistory'},
    ]);




    var blackChannels = chrome.extension.getBackgroundPage().getBlackChannels();
    if(blackChannels){
        for(var i in blackChannels){
            $('#black_channels_block_id').append(
                '<div class="black_channel">' +
                    '<span>' +
                        blackChannels[i] +
                    '</span>' +
                    '<span class="delete_from_black_list" channel_id="'+ i +'">' +
                        '<img src="img/navigation/delete_video.png" style="width: 18px;">' +
                    '</span>' +
                '</div>'
            );
        }

        $('.delete_from_black_list').click(function(){
            chrome.extension.getBackgroundPage().removeBlackChannel({
                channel_id : $(this).attr('channel_id')
            });
            $(this).closest('.black_channel').remove();
        });
    }



    for(var i in gv_logo_url_options){
        $('#dropdown_menu_logourl_id .dropdown-menu').append(
            '<li><a href="#" value="'+ i +'" class="dropdown_menu_item">' +
                gv_logo_url_options[i] +
            '</a></li>'
        );
    }


    $('#dropdown_menu_logourl_id .dropdown-menu').append(
        ' <li role="separator" class="divider"></li>' +
        '<li> ' +
            '<a href="#" class="select_input_label_item">'+ C_TEXT_MY_LINK +' www</a> ' +
            '<a href="#" class="select_input_item"> ' +
                '<input id="input-logourl-id" type="text"/> ' +
            '</a> ' +
        '</li>'
    );


    if(settings && settings.logoUrl && settings.logoUrl.trim()){
        var value = settings.logoUrl.trim();
        var title = value;
        if(gv_logo_url_options[value]) title = gv_logo_url_options[value];
        else $('#input-logourl-id').val(value);
        setLogoUrl(title, value);
    }
    else{
        setLogoUrl(gv_logo_url_options[gv_default_logo_url], gv_default_logo_url);
    }

    hideLogoUrlInput();

    startEvent();
});