var FUA_BLOCKER_TEXT_HELPER = (function(){
    function Text_helper(){

    }

    Text_helper.prototype.getNumbersCodeOfString = function(string){
        var length = string.length;
        var code = 0;
        for(var i = 0; i < length; i++){
            code += string.charCodeAt(i);
        }

        return code;
    };


    Text_helper.prototype.getVideoIdFromUrl = function(url){
        var m = url.match('(v|video_id)=([^\&]*)(&|$)');
        if(m && m[2]) return m[2];
        else return false;
    };

    return new Text_helper();
})();