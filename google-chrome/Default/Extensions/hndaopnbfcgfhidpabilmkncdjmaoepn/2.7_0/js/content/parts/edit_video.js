var FUA_YT_EDIT_VIDEO = (function(){
    function Fua_yt_edit_video(){
        this.prefix = 'fua_youtube_';
        this.id = {
            //'copy_tags_button' : this.prefix + 'copy_tags_button_id',
        };
        this.class = {
            //'selected_tag' : this.prefix + 'selected_tag'
        };
    }


    Fua_yt_edit_video.prototype.getTitleText = function(){
        return $('.video-settings-title:first').val();
    };


    Fua_yt_edit_video.prototype.getDescriptionText = function(){
        return $('.metadata-two-column .basic-info-form-input .video-settings-description:first').val();
    };


    Fua_yt_edit_video.prototype.renderLeftValueCharacters = function(valObject, renderObject, maxLength){
        var valueLength = valObject.val().length;
        renderObject.html(maxLength - valueLength);
    };


    Fua_yt_edit_video.prototype.renderLeftValueCharactersDescription = function(){
        FUA_YT_EDIT_VIDEO.renderLeftValueCharacters(
            $('.metadata-two-column .basic-info-form-input .video-settings-description:first'),
            $('#' + ID_OUR_DESCRIPTION_LENGTH),
            MAX_DESCRIPTION_LENGTH
        );

        FUA_YT_TAGS_RATIONS.setDescriptionTagsRation();
    };

    Fua_yt_edit_video.prototype.renderLeftValueCharactersTitle = function(){
        FUA_YT_EDIT_VIDEO.renderLeftValueCharacters(
            $('.video-settings-title:first'),
            $('#' + ID_OUR_TITLE_LENGTH),
            MAX_TITLE_LENGTH
        );

        FUA_YT_TAGS_RATIONS.setTitleTagsRation();
    };


    return new Fua_yt_edit_video();
})();