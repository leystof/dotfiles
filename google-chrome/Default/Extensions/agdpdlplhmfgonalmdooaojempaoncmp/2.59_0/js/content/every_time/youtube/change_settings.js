chrome.storage.local.get(['settings', 'channels_black_list'], function(items){
    var auto_play = '1';
    var black_channels = '1';
    var blocked_black_videos = '1';
    var wheel_volume = '1';

    if(items.channels_black_list){
        document.documentElement.dataset.channels_black_list =
            JSON.stringify(items.channels_black_list);
    }

    if(items.settings){
        var settings = items.settings;
        var video_quality = 'auto';
        if(
            settings.bAutoplay
            && settings.bAutoplay == 2
            && !window.location.href.match('https://www.youtube.com/tv#/')
        ) {
            auto_play = '0';
        }
        if(settings.defaultVideoQuality) video_quality = settings.defaultVideoQuality;
        if(!settings.blackChannels || settings.blackChannels == 2) black_channels = '2';
        if(settings.blockedBlackVideos && settings.blockedBlackVideos == 2) blocked_black_videos = '2';
        if(!settings.volumeWheel || settings.volumeWheel == 2) wheel_volume = '2';


        if(settings.hideWatchedVideo && settings.hideWatchedVideo == 2) {
            if(window.location.href.match('^https://www.youtube.com/feed/subscriptions')){
                hideWatchedVideos();
            }
        }
    }
    else{
        black_channels = '2';
        wheel_volume = '2';
    }

    if(document.getElementById("fua_blocker_every_time_script_id")){
        var ourScript = document.getElementById("fua_blocker_every_time_script_id");
        ourScript.setAttribute("auto_play", auto_play);
        ourScript.setAttribute("video_quality", video_quality);
        ourScript.setAttribute("black_channels", black_channels);
        ourScript.setAttribute("blocked_black_videos", blocked_black_videos);
        ourScript.setAttribute("wheel_volume", wheel_volume);
        if(settings.blockedVideoMsg) ourScript.setAttribute("blocked_video_msg", settings.blockedVideoMsg);
        if(settings.blockedVideoTags) ourScript.setAttribute("blocked_video_tags", settings.blockedVideoTags);
    }
});


function hideWatchedVideos(time){
    if(!time) var time = 0;
    if(
        document.querySelector('.watched-badge')
        || document.querySelector('div#overlays > ytd-thumbnail-overlay-playback-status-renderer')
    ){
        var elements = document.getElementsByClassName('watched-badge');
        for(var i = 0; i < elements.length; i++){
            var element = elements[i].closest('.yt-shelf-grid-item');
            if(element) element.classList.add('fua_blocker_invisible');
            else {
                element = elements[i].closest('.expanded-shelf-content-item-wrapper');
                if(element) element.classList.add('fua_blocker_invisible');
            }
        }

        elements = document.getElementsByTagName('ytd-thumbnail-overlay-playback-status-renderer');
        console.log('elements', elements.length);
        for(var i = 0; i < elements.length; i++){
            var element = elements[i].closest('ytd-grid-video-renderer');
            if(element) element.classList.add('fua_blocker_invisible');
            else {
                element = elements[i].closest('ytd-expanded-shelf-contents-renderer');
                if(!element) continue;
                element = element.closest('ytd-item-section-renderer');
                if(element) element.classList.add('fua_blocker_invisible');
            }
        }

    }

    else if(time < 2000){
        setTimeout(function(){
            time = time + 10;
            hideWatchedVideos(time);
        }, 10);
    }
}