function getGoogleHints(options){
    if(!options.value || !options.successCallback) return false;
    var hints = {};
    var value = options.value;

    tabId = false;
    if(options.tabId) tabId = options.tabId;

    var successCallback = options.successCallback;
    if(options.hints) hints = options.hints;

    function parseRes(arr){
        for(var i in arr){
            var hint = arr[i][0].replace(new RegExp('<b>|</b>', 'g'), '');
            if(!hints[hint]) hints[hint] = [];
            hints[hint].push('Google');
        }
        successCallback(hints, tabId);
    }

    $.get(
        'https://www.google.com/complete/search?sclient=psy-ab&hl=ru-UA&biw=1034&bih=346&site=webhp&q='
        + value,
        '',
        function(res){
            var arr = res[1];
            parseRes(arr);
        }
    ).fail(function(info){
        if(info.status == 200){
            var arr = info.responseText[1];
            parseRes(arr);
        }
        else successCallback(hints, tabId);
    });
}

/*getGoogleHints({
    value: "gta",
    successCallback : function(hints, tabId){
        console.log(hints);
    }
});*/