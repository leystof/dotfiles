var FUA_YT_COPY_EDIT_TAGS = (function(){
    function Copy_edit_tags(){
        this.prefix = 'fua_youtube_';
        this.id = {
            'copy_tags_button' : this.prefix + 'copy_tags_button_id',
        };
        this.class = {
            'selected_tag' : this.prefix + 'selected_tag'
        };
    }


    Copy_edit_tags.prototype.addHtmlCopyButton = function(options){
        var htmlButton = '<div></div><div id="'+ FUA_YT_COPY_EDIT_TAGS.id.copy_tags_button +'">' +
                                    chrome.i18n.getMessage("copy_all") +
                                '</div>';
        options.callback(htmlButton);

        $('#' + FUA_YT_COPY_EDIT_TAGS.id.copy_tags_button).click(function(){
            var tags = [];
            if($('.' + FUA_YT_COPY_EDIT_TAGS.class.selected_tag).length){
                $('div.video-settings-tag-chips-container span.' + FUA_YT_COPY_EDIT_TAGS.class.selected_tag).each(function(){
                    tags.push($(this).find('span:first').html());
                });
            }
            else tags = FUA_YT_EDIT_TAGS_WORKER.getAllTags();
            var copyString = tags.join(", ");
            copyToClipboard(copyString);

            chrome.runtime.sendMessage({
                'title': 'copyTagsNotification',
                'body': {'text': copyString}
            });
        });
    };



    Copy_edit_tags.prototype.toggleTagSelection = function(options){
        var tag = options.tag;
        tag.toggleClass(FUA_YT_COPY_EDIT_TAGS.class.selected_tag);
        var buttonText = chrome.i18n.getMessage("copy_all");
        if($('.' + FUA_YT_COPY_EDIT_TAGS.class.selected_tag).length){
            buttonText = chrome.i18n.getMessage("copy_selected");
        }
        $('#' + FUA_YT_COPY_EDIT_TAGS.id.copy_tags_button).html(buttonText);
    };


    return new Copy_edit_tags();
})();