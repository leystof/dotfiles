var FUA_YT_EDIT_TAGS_WORKER = (function(){

    function Edit_tags_worker(){
        this.class = {
            tag_box : "fua-plugin-youtube-tags-box",
            length_label : "fua-plugin-youtube-tag-length-label",
            tag : "fua-plugin-youtube-tag"
        };
        this.selector = {
            tag_box : "div.video-settings-tag-chips-container:first",
            added_tags : "div.video-settings-tag-chips-container:first span.yt-chip"
        }
    }


    Edit_tags_worker.prototype.addTagLengthLabels = function(){
        $(FUA_YT_EDIT_TAGS_WORKER.selector.added_tags).each(function () {
            $(this).prepend(
                '<div class="' + FUA_YT_EDIT_TAGS_WORKER.class.length_label + '">' +
                $(this).find('span:first').html().length +
                '<div>'
            ).addClass(FUA_YT_EDIT_TAGS_WORKER.class.tag);

            FUA_YT_EDIT_TAGS_WORKER.addOneTagClickListener({
                tag : $(this)
            })
        });
    };


    Edit_tags_worker.prototype.getAllTags = function(){
        var tags = [];
        $('div.video-settings-tag-chips-container span.yt-chip').each(function(){
            tags.push($(this).find('span:first').html());
        });

        return tags;
    };


    Edit_tags_worker.prototype.addOneTagClickListener = function(options){
        options.tag.find('span:first').click(function () {
            $('#' + ID_OUR_TAG_UPLOAD_INPUT).val($(this).html());
            getHintsForSearchTag();
            FUA_YT_COPY_EDIT_TAGS.toggleTagSelection({
                tag : $(this).closest(".fua-plugin-youtube-tag")
            });
        });
    };


    Edit_tags_worker.prototype.getTotalTagsLength = function(){
        return $('.video-settings-tags:first').val().length;
    };


    Edit_tags_worker.prototype.countTagsLeftCharacters = function(){
        var tLength = FUA_YT_EDIT_TAGS_WORKER.getTotalTagsLength();
        if(tLength < 1) {
            $('#' + ID_OUR_TAG_UPLOAD_CLEAR_BUTTON).hide();
            $('#add-tags-to-description-block-id').hide();
        }
        else {
            $('#' + ID_OUR_TAG_UPLOAD_CLEAR_BUTTON).show();
            $('#add-tags-to-description-block-id').show();
        }
        return MAX_TAGS_TOTAL_LENGTH - tLength;
    };



    Edit_tags_worker.prototype.renderLeftTagsCharactersCount = function(){
        var charCount = FUA_YT_EDIT_TAGS_WORKER.countTagsLeftCharacters();
        $('#' + ID_OUR_TOTAL_TAGS_LENGTH).html(charCount);
        FUA_YT_TAGS_RATIONS.setTagsRation();
        var copyTagsButton = $('#' + FUA_YT_COPY_EDIT_TAGS.id.copy_tags_button);
        if(charCount < 500) copyTagsButton.show();
        else copyTagsButton.hide();

        FUA_YT_EDIT_TAGS_WORKER.addLengthLabelToLastTag();
    };


    Edit_tags_worker.prototype.addOneTag = function(string){
        $(SELECTORS_YOUTUBE_ADD_TAG_INPUT)
            .trigger('focus').val(string).trigger('blur');

        setTimeout(function() {
            FUA_YT_EDIT_TAGS_WORKER.addLengthLabelToLastTag();
        }, 10);
    };

    Edit_tags_worker.prototype.addGroupTags = function(array, index){
        if(array[index]){
            FUA_YT_EDIT_TAGS_WORKER.addOneTag(array[index]);
            setTimeout(function(){
                FUA_YT_EDIT_TAGS_WORKER.addGroupTags(array, index + 1);
            }, 25);
        }
    };


    Edit_tags_worker.prototype.clearAllTags = function(){
        $('div.video-settings-tag-chips-container')
            .find('span.yt-chip').find('.yt-delete-chip').trigger('click');
        FUA_YT_EDIT_TAGS_WORKER.renderLeftTagsCharactersCount();
    };


    Edit_tags_worker.prototype.addLengthLabelToLastTag = function(){
        var lastTag = $(SELECTORS_YOUTUBE_TAGS_BOX).find('span.yt-chip:last');
        if(
            lastTag.length > 0
            && lastTag.find('.fua-plugin-youtube-tag-length-label').length < 1
        ) {
            fromTagToInput();
            lastTag.prepend(
                '<div class="fua-plugin-youtube-tag-length-label">' +
                lastTag.find('span:first').html().length +
                '<div>'
            ).addClass('fua-plugin-youtube-tag');
        }
    };

    return new Edit_tags_worker();
})();