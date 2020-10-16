function getYoutubeHints(options){
    if(!options.value || !options.successCallback) return false;
    var hints = {};
    var value = options.value;

    tabId = false;
    if(options.tabId) tabId = options.tabId;

    var successCallback = options.successCallback;
    if(options.hints) hints = options.hints;

    $.get(
        'https://clients1.google.com/complete/search?client=youtube&hl=ru&gl=ua&ds=yt&q='
        + value
    ).fail(function(info){
        if(info.status == 200){
            var arr = info.responseText
                .replace(new RegExp('(^window\.google\.ac\.h[\(])|([\)]$)', 'g'), '');
            arr = $.parseJSON(arr);
            arr = arr[1];

            for(var i in arr){
                var hint = arr[i][0];
                if(!hints[hint]) hints[hint] = [];
                hints[hint].push(C_TEXT_WORD_YOUTUBE);
            }

            successCallback(hints, tabId);
        }
        else{
            successCallback(hints, tabId);
        }
    });
}

/*getYoutubeHints({
    value: "gta",
    successCallback : function(hints, tabId){
        console.log(hints);
    }
});*/