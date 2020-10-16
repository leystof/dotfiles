function getInstallTime(){
    return STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'install_time'
    });
}

function getSettings(){
    return STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'settings'
    });
}

function getSpecificSetting(settingName){
    var settings = getSettings();
    if(settings && (settings[settingName] || settings[settingName] === 0)){
        return settings[settingName];
    }
    else return false;
}

function setSpecialSetting(options){
    STORAGE_SINGLETON.saveToStorage({
        propertyName : 'settings.' + options.name,
        value : options.value
    });
}


function addNewBlackChannel(options){

    var value = options.channel_name;
    /*if(options.channel_url) {
        value = {
            name : options.channel_name,
            url : options.channel_url
        }
    }*/

    STORAGE_SINGLETON.saveToStorage({
        propertyName : 'channels_black_list%%FUA%%' + options.channel_id,
        value : value,
        propertyNameDelimiter : '%%FUA%%'
    });
}

function getBlackChannels(){
    return STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'channels_black_list'
    });
}


function removeBlackChannel(options){
    STORAGE_SINGLETON.removeFromStorage({
        propertyName : 'channels_black_list%%FUA%%' + decodeURIComponent(options.channel_id),
        propertyNameDelimiter : '%%FUA%%'
    });
}



function saveVideoTime(options){
    STORAGE_SINGLETON.saveToStorage({
        propertyName : 'video_times.' + options.video_id,
        value : {
            video_time : options.video_time,
            date_time :(new Date()).getTime(),
            video_duration : options.video_duration
        }
    });
}


function removeVideoTimes(){
    var videoTimes = STORAGE_SINGLETON.getStorageProperty({
        propertyName : 'video_times'
    });

    if(videoTimes){
        var curTime = (new Date()).getTime();
        var targetTime = curTime - 604800000;

        for(var i in videoTimes){
            if(videoTimes[i].date_time < targetTime){
                STORAGE_SINGLETON.removeFromStorage({
                    propertyName : 'video_times.' + i
                });
            }
        }
    }
}


function removeOneVideoTime(video_id){
    STORAGE_SINGLETON.removeFromStorage({
        propertyName : 'video_times.' + video_id
    });
}



function showCatsMsg(){
    chrome.tabs.query(
        { active : true },
        function(tab){
            //console.log("catTab", tab);
            if(tab && tab.length > 0){

                if(!tab[0].url.match("//www.youtube.com/")){
                    STORAGE_SINGLETON.saveToStorage({
                        propertyName : 'non_youtube_cats_msg',
                        value : true
                    });
                }
                else {
                    STORAGE_SINGLETON.removeFromStorage({
                        propertyName : 'non_youtube_cats_msg'
                    });

                    chrome.tabs.sendMessage(
                        tab[0].id, {
                            'title': 'showCatsMsg',
                            'body': {}
                        }
                    );
                }
            }
        }
    );
}

function hideCatsMsg(){
    STORAGE_SINGLETON.removeFromStorage({
        propertyName : 'non_youtube_cats_msg'
    });

    chrome.tabs.query(
        {},
        function(tab){
            if(tab && tab.length > 0){
                for(var i in tab){
                    chrome.tabs.sendMessage(
                        tab[i].id, {
                            'title': 'hideCatsMsg',
                            'body': {}
                        }
                    );
                }
            }
        }
    );
}


function setDefaultScrollVideoPosition(){
    STORAGE_SINGLETON.removeFromStorage({
        propertyName : 'settings.scrollVideoPosition'
    });

    chrome.tabs.query(
        {},
        function(tab){
            if(tab && tab.length > 0){
                for(var i in tab){
                    chrome.tabs.sendMessage(
                        tab[i].id, {
                            'title': 'setDefaultScrollVideoPosition',
                            'body': {}
                        }
                    );
                }
            }
        }
    );
}


function setDefaultSettings() {
    var settings = getSettings();
    var existSettings = {};
    if(settings){
        for(var i in settings){
            existSettings[i] = true;
        }
    }

    if(!settings || !existSettings['blockedVideoMsg']){
        setSpecialSetting({
            name : "blockedVideoMsg",
            value : "Clever: Это видео недоступно."
        });
    }

    if(!settings || !existSettings['blockedVideoTags']){
        setSpecialSetting({
            name : "blockedVideoTags",
            value : "kids, children, cartoon, baby songs, songs for children, videos for kids, baby, babies, для детей, мульт, мультфильм, фиксик, майнкрафт, сказка, детям"
        });
    }
}