var BG_SYNCHRONIZATION = (function(){
    function Synchronization(){
        this.currentActions = {};
        this.actionTypes = {
           "massEditDescription" : true
        };
        this.watch = false;
    }


    Synchronization.prototype.watchSwitchOn = function(){
        if(BG_SYNCHRONIZATION.watch) return false;
        BG_SYNCHRONIZATION.watch = true;
        chrome.runtime.onMessage.addListener(function(response, sender) {
            var title = response.title;
            if (response.body) var body = response.body;

            if(title == "synchronization") {
                //console.log("synchronization");
                if (BG_SYNCHRONIZATION.actionTypes[body.action]) {
                    if (body.syncOn) {
                        //console.log("markAction", BG_SYNCHRONIZATION.currentActions);

                        if (BG_SYNCHRONIZATION.currentActions[body.action]) {
                            BG_SYNCHRONIZATION.isTabActionMarkExisting({
                                action: body.action,
                                tabId: sender.tab.id,
                                entireOption: body.entireOption
                            });
                        }
                        else {
                            BG_SYNCHRONIZATION.markAction({
                                action: body.action,
                                tabId: sender.tab.id,
                                entireOption: body.entireOption
                            });
                        }
                    }
                    else if (body.syncOff) {
                        BG_SYNCHRONIZATION.removeActionMark({
                            action: body.action,
                            tabId : sender.tab.id
                        })
                    }
                }
            }
        });
    };


    Synchronization.prototype.isTabActionMarkExisting = function(options){
        chrome.tabs.sendMessage(
            BG_SYNCHRONIZATION.currentActions[options.action].tabId,
            {
                'title': 'isSyncActionExisting',
                'body': {
                    "action" : options.action
                }
            },
            function(response){
                //console.log(response);
                if(response && response.actionMark){
                    BG_SYNCHRONIZATION.informAboutExistingAction({
                        action : options.action,
                        tabId : options.tabId
                    })
                }
                else{
                    BG_SYNCHRONIZATION.removeActionMark({
                        action : options.action,
                        tabId : options.tabId
                    });

                    BG_SYNCHRONIZATION.markAction({
                        action :  options.action,
                        tabId : options.tabId,
                        entireOption : options.entireOption
                    });
                }
            }
        );
    };



    Synchronization.prototype.informAboutExistingAction = function(options){
        chrome.tabs.sendMessage(
            options.tabId,
            {
                'title': 'syncActionExisting',
                'body': {
                    "action" : options.action,
                }
            }
        );
    };



    Synchronization.prototype.markAction = function(options){
        BG_SYNCHRONIZATION.currentActions[options.action] = {
            tabId : options.tabId
        };

        chrome.tabs.sendMessage(
            options.tabId,
            {
                'title': 'markSyncAction',
                'body': {
                    "action" : options.action,
                    "entireOption" : options.entireOption
                }
            }
        );
    };

    Synchronization.prototype.removeActionMark = function(options){
        if(
            BG_SYNCHRONIZATION.currentActions[options.action]
            && BG_SYNCHRONIZATION.currentActions[options.action].tabId === options.tabId
        ){
            delete BG_SYNCHRONIZATION.currentActions[options.action];
        }
    };

    return new Synchronization();
})();

BG_SYNCHRONIZATION.watchSwitchOn();