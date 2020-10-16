var FUA_YT_LOGGING = (function(){
    function Logging(){

    }

    Logging.prototype.addStartData = function(data){
        data.logs_action = "addStartData";

        chrome.runtime.sendMessage({
            'title': 'logging',
            'body': data
        });

        delete data.logs_action;
    };


    Logging.prototype.addLogItem = function(options){
        var log = {
            logs_action : "addLogItem",
            logs_name : options.logs_name,
            log_id : options.log_id,
            log_item : options.log_item
        };

        chrome.runtime.sendMessage({
            'title': 'logging',
            'body': log
        });
    };

    Logging.prototype.addLogItemErrorInfo = function(options){
        options.logData.log_item.error = true;
        options.logData.log_item.error_type = options.error_type;
        return options.logData;
    };


    Logging.prototype.addFinishData = function(data){
        data.logs_action = "addFinishData";

        chrome.runtime.sendMessage({
            'title': 'logging',
            'body': data
        });

        delete data.logs_action;
    };


    Logging.prototype.openTabLog = function(options){
        chrome.runtime.sendMessage({
            'title': 'logging',
            'body': {
                logs_action : "openLogTab",
                url : options.url
            }
        });
    };

    return new Logging();
})();