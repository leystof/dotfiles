var BG_LOGGING = (function(){
    function Logging(){
        this.watch = false;
    }

    Logging.prototype.watchSwitchOn = function(){
        if(BG_LOGGING.watch) return false;
        BG_LOGGING.watch = true;
        chrome.runtime.onMessage.addListener(function(response, sender) {
            var title = response.title;
            if (response.body) var body = response.body;

            if(title == "logging") {
                if(body.logs_action) var logs_action = body.logs_action;
                delete body.logs_action;
                if(logs_action == "addStartData"){
                    BG_LOGGING.addStartLogData(body);
                }
                else if(logs_action == "addLogItem"){
                    BG_LOGGING.addLogItem(body);
                }
                else if(logs_action == "addFinishData"){
                    BG_LOGGING.addFinishData(body);
                }
                else if(logs_action == "openLogTab"){
                    chrome.tabs.create({
                        url : body.url
                    });
                }
            }
        });
    };

    Logging.prototype.addStartLogData = function(log){
        log.parsed = [];

        var logs = STORAGE_SINGLETON.getStorageProperty({
            propertyName : 'logs.' + log.logs_name
        });

        /*if(!logs) logs = [];
        logs.push(log);*/
        logs = [log];


        STORAGE_SINGLETON.saveToStorage({
            propertyName : 'logs.' + log.logs_name,
            value : logs
        });
    };


    Logging.prototype.addLogItem = function(options){
        var logs = STORAGE_SINGLETON.getStorageProperty({
            propertyName : 'logs.' + options.logs_name
        });

        if(logs){
            for(var i in logs){
                if(options.log_id === logs[i].log_id){
                    logs[i].parsed.push(options.log_item);
                    STORAGE_SINGLETON.saveToStorage({
                        propertyName : 'logs.' + options.logs_name,
                        value : logs
                    });
                    break;
                }
            }
        }
    };


    Logging.prototype.addFinishData = function(options){
        var logs = STORAGE_SINGLETON.getStorageProperty({
            propertyName : 'logs.' + options.logs_name
        });

        if(logs){
            for(var i in logs){
                if(options.log_id === logs[i].log_id){
                    logs[i].finish_data = options.finish_data;
                    STORAGE_SINGLETON.saveToStorage({
                        propertyName : 'logs.' + options.logs_name,
                        value : logs
                    });
                    break;
                }
            }
        }
    };


    Logging.prototype.getLastLog = function(options){
        var lastLog = false;
        var logs = STORAGE_SINGLETON.getStorageProperty({
            propertyName : 'logs.' + options.logs_name
        });

        if(logs && logs.length) lastLog = logs[logs.length - 1];
        return lastLog;
    };


    return new Logging();
})();

BG_LOGGING.watchSwitchOn();