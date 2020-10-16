function getYandexHints(options){
    if(!options.value || !options.successCallback) return false;
    var hints = {};
    var value = options.value;

    tabId = false;
    if(options.tabId) tabId = options.tabId;

    var successCallback = options.successCallback;
    if(options.hints) hints = options.hints;

    function parseRes(arr){
        for(var i in arr){
            var hint = arr[i][1];
            if(!hints[hint]) hints[hint] = [];
            hints[hint].push(C_TEXT_WORD_YANDEX);
        }
        successCallback(hints, tabId);
    }

    $.get(
        'https://yandex.ua/suggest/suggest-ya.cgi?uil=ru&fact=1&v=4&icon=1&hl=1&html=1&bemjson=1&part='
        + value,
        '',
        function(res){
            var arr = res[1];
            parseRes(arr);
        }
    ).fail(function(info){
        successCallback(hints, tabId);
        
        if(info.status === 0) {
            BG_NOTIFICATIONS.yandexError();
        }
    });
}

/*getYandexHints({
    value: "gta",
    successCallback : function(hints, tabId){
        console.log(hints);
    }
});*/