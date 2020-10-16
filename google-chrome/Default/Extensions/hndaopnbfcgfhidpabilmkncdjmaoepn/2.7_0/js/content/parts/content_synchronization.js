var CONTENT_SYNCHRONIZATION = (function(){
    function Synchronization(){
        this.currentActions = {};
        this.actionTypes = {
           "massEditDescription" : true
        };
        this.watch = false;
    }


    Synchronization.prototype.watchSwitchOn = function(){
        if(CONTENT_SYNCHRONIZATION.watch) return false;
        CONTENT_SYNCHRONIZATION.watch = true;

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            var title = request.title;
            if (request.body) var body = request.body;

            if(title === "isSyncActionExisting"){
                var data = { actionMark : false };
                if(CONTENT_SYNCHRONIZATION.currentActions[body.action]){
                    data.actionMark = true;
                }
                console.log("isSyncActionExisting", data);
                sendResponse(data);
            }
            else if(title === "syncActionExisting"){
                if(body.action === "massEditDescription"){
                    FUA_MW.addToInfo({
                        'text' : chrome.i18n.getMessage("the_other_tab_is_in_the_process_of_mass_update_meta_data_try_again_later") + '...',
                        'class' : FUA_MW.class.error_info_line,
                        'info' : document.getElementById(FUA_MD_EDIT.id.info)
                    });
                }
            }
            else if(title === "markSyncAction"){
                CONTENT_SYNCHRONIZATION.currentActions[body.action] = true;
                if(body.action === "massEditDescription"){
                    if(body.entireOption.logsRecover){
                        FUA_MD_EDIT.recoverLog(body.entireOption);
                    }
                    else{
                        FUA_MD_EDIT.prepareToEdit(body.entireOption);
                    }
                }
            }
        });
    };


    Synchronization.prototype.removeActionMark = function(options){
        delete CONTENT_SYNCHRONIZATION.currentActions[options.action];
        chrome.runtime.sendMessage({
            'title': 'synchronization',
            'body': {
                syncOff : true,
                action : options.action
            }
        });
    };


    Synchronization.prototype.addActionMark = function(options){
        chrome.runtime.sendMessage({
            'title': 'synchronization',
            'body': {
                syncOn : true,
                action : options.action,
                entireOption : options.entireOption
            }
        });
    };

    return new Synchronization();
})();

CONTENT_SYNCHRONIZATION.watchSwitchOn();