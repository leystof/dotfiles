chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;


    /*******/
    if (title == 'addHtmlToVideoCommentsPage') {
       FUA_YT_COMMENTS.addSelect();
        //console.log('addHtmlToVideoCommentsPage');
    }
});