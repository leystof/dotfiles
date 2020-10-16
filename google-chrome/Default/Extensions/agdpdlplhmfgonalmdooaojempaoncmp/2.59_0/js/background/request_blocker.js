var tabUrls = {

};



var blockedUrls = [
    "https://ad.doubleclick.net/",
    "https://pagead2.googlesyndication.com/pagead/",
    "https://static.doubleclick.net/",
    "https://googleads.g.doubleclick.net/pagead/",
    "https://www.google.com/uds/api/ads/",
    "https://partner.googleadservices.com/",

    /*"http://www.ex.ua/js/adriver.core.2.js",
    "http://cdn.admixer.net/scripts3/loader.js",
    "http://inv-nets.admixer.net/dmp/survey",
    "http://inv-nets.admixer.net/dsp.aspx",*/


    "https://securepubads",
    "adformat=",
    "https://www.youtube.com/api/stats/ads",
    "https://www.youtube.com/pagead/adview",
    "https://pagead2.googlesyndication.com/",
    "https://www.youtube.com/ptracking",
    "https://csi.gstatic.com/csi"

];

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {

        var settings = getSettings();

        // block adv
        if(
            (!settings || !settings.bAdvertising || settings.bAdvertising == 2)
            || (settings && settings.onlySound && settings.onlySound == 2)
        ) {

            if (tabUrls[details.tabId] && tabUrls[details.tabId].search('^https://www.youtube.com/') != -1) {
                for (var i in blockedUrls) {
                    if (details.url.indexOf(blockedUrls[i]) != -1) {
                        /*console.log('tabUrl', tabUrls[details.tabId]);
                        console.log('details', details);*/
                        return {cancel: true};
                    }
                }
            }
        }

        //only sound
        if(
            settings
            && settings.onlySound
            && settings.onlySound == 2
            && details.url.indexOf('mime=audio') !== -1
        ) {
            var paramsForRemove = ['range', 'rn', 'rbuf'];
            var soundUrl = (function(soundUrl, params){
                params.forEach(function(param) {
                    var urlparts = soundUrl.split('?');
                    if (urlparts.length >= 2) {
                        var prefix = encodeURIComponent(param) + '=';
                        var pars = urlparts[1].split(/[&;]/g);

                        for (var i = pars.length; i-- > 0;) {
                            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                                pars.splice(i, 1);
                            }
                        }

                        soundUrl = urlparts[0] + '?' + pars.join('&');
                    }
                });
                return soundUrl;
            })(details.url, paramsForRemove);

            chrome.tabs.sendMessage(details.tabId, {
                title: "onlySound",
                body: {url: soundUrl}
            });
        }
        else if(settings && settings.onlySound && settings.onlySound == 2) {
            if (
                details.url.match("https://www.youtube.com/annotations_invideo")
                || details.url.match("https://i9.ytimg.com/sb/")
            ) {
                return {cancel: true};
            }
        }

    },
    {urls: [
        "<all_urls>"
    ]},
    ["blocking"]
);


chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        //console.log("url", details.url);
        var settings = getSettings();
        if(settings && settings.subtitleTranslate && settings.subtitleTranslate == 2) {
            var bl = chrome.i18n.getUILanguage();
            if (bl && !details.url.match("tlang=|lang=" + bl)) {
                //console.log("sub_url", details.url);
                if(details.url.search('sparams=asr_langs|caps=asr') != -1){
                    return {redirectUrl: details.url.replace('fmt=srv3', 'fmt=srv1') + "&tlang=" + bl};
                }
                else return {redirectUrl: details.url + "&tlang=" + bl};
            }
        }
    },
    {
        urls: [ "https://www.youtube.com/api/timedtext*"]
    },
    ["blocking"]
);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    /*console.log('tabId', tabId);
    console.log('changeInfo', changeInfo);
    console.log('tab', tab);*/
    if(tab.status == 'complete'){
        tabUrls[tab.id] = tab.url;
        /*console.log(tabUrls);*/
    }
});