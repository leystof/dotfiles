var FUA_BLOCKER_PREVIEW = (function(){
    function Preview_window(){
        this.prefix = "fua_blocker_";
        this.id = {
            "window" : this.prefix + "preview_window_id",
            "preview_window_img" : this.prefix + "preview_window_img_id",
        };
    }

    Preview_window.prototype.createPreview = function(){
        if(!$("#" + FUA_BLOCKER_PREVIEW.id.window).length) {
            $("body").prepend(
                '<div id="'+ FUA_BLOCKER_PREVIEW.id.window +'"></div>'
            );
        }
        return $("#" + FUA_BLOCKER_PREVIEW.id.window);
    };

    Preview_window.prototype.addContent = function(options){
        var preview = FUA_BLOCKER_PREVIEW.createPreview();
        preview.html(options.content);
        if(options.callback) options.callback();
    };

    return new Preview_window();
})();