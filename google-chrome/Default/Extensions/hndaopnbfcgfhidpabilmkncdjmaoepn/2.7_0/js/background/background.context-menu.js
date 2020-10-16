// tabs listener
chrome.tabs.onUpdated.addListener(function(tabId, tab, tabInfo){
    if(background_gv_cm_add_video_time_code){
        background_gv_cm_add_video_time_code = false;
        chrome.contextMenus.remove(CONTEXT_MENU_ADD_VIDEO_TIME_CODE);
    }
});

//page listener
chrome.runtime.onMessage.addListener(function(response, sender) {
    var title = response.title;
    if(response.body) var body = response.body;

    if(title == 'createContextMenuAddVideoTimeCode'){
        if(!background_gv_cm_add_video_time_code){
            background_gv_cm_add_video_time_code = true;
            console.log('yes');
            chrome.contextMenus.create({
                "id" : CONTEXT_MENU_ADD_VIDEO_TIME_CODE,
                "title": C_TEXT_ADD_TIME_CODE,
                "contexts": ["editable"],
                "onclick": function(){
                    chrome.tabs.sendMessage(
                        sender.tab.id,
                        { 'title' : 'addVideoTimeCode'}
                    );
                }
            });
        }
        else{
            chrome.contextMenus.update(
                CONTEXT_MENU_ADD_VIDEO_TIME_CODE,
                {
                    "onclick": function(){
                        chrome.tabs.sendMessage(
                            sender.tab.id,
                            { 'title' : 'addVideoTimeCode'}
                        );
                    }
                }
            );
        }
    }
    else if(title == 'removeContextMenuAddVideoTimeCode'){
        if(background_gv_cm_add_video_time_code){
            background_gv_cm_add_video_time_code = false;
            chrome.contextMenus.remove(CONTEXT_MENU_ADD_VIDEO_TIME_CODE);
        }
    }
});