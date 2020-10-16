document.addEventListener('DOMContentLoaded', function() {
    $('#info_page_title_id').html(C_TEXT_INFO_PAGE_TITLE);


    function localizationSettingsDescription(settings){
        for(var i in settings){
            var item = $('#' + settings[i]);
            item.find('.title_sub_block')
                .html(C_TEXT_SETTINGS_DESCRIPTION[settings[i]].title);
            item.find('.text_content_sub_block')
                .html(C_TEXT_SETTINGS_DESCRIPTION[settings[i]].text);
        }
    }

    localizationSettingsDescription([
        'annotations-blocked',
        'advertising-blocked',
        'autoplay-blocked',
        'smartpause-toggle',
        'smartscroll-toggle',
        'wheel-mouse-volume',
        'design-toggle',
        'open-new-window',
        'screenshot-toggle',
        'gridsearch-toggle',
        'smartfullscreen-toggle',
        'videoquality',
        'logourl',
        'blackchannels-toggle',
        'blocked-blackchannels-video',
        'recommendation-toggle',
        'save-time-toggle',
        'subtitles-translate-toggle',
        'only-sound'
    ]);
});