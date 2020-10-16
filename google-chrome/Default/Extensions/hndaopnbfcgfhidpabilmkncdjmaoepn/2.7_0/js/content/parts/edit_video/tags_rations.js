var FUA_YT_TAGS_RATIONS = (function(){
    function Tag_rations(){
        this.prefix = 'fua_youtube_';
        this.id = {
            'title_tags_ration' : this.prefix + 'title_tags_ration_id',
            'description_tags_ration' : this.prefix + 'description_tags_ration_id',
        };
        this.class = {
            'tags_ration_count' : this.prefix + 'tags_ration_count',
            'tags_ration_active' : this.prefix + 'tags_ration_active',
            'highlighted_text' : this.prefix + 'highlighted_text'
        };
    }


    Tag_rations.prototype.tagsRationInText = function(options){
        var tagCounts = [];
        var tagsText = [];
        for(var i in options.texts){
            options.texts[i] = options.texts[i].toLowerCase().replace(new RegExp("[\\s]+", "g"), " ");
            tagCounts[i] = 0;
            tagsText[i] = [];
        }

        $('div.video-settings-tag-chips-container span.yt-chip').each(function(){
            var tagText = $(this).find('span:first').html().toLowerCase();
            for(var i in options.texts){
                if(options.texts[i].toLowerCase().match(tagText)){
                    tagCounts[i]++;
                    tagsText[i].push(tagText);
                }
            }
        });

        return {
            tagCounts : tagCounts,
            tagsText : tagsText,
            tagsLength : $('div.video-settings-tag-chips-container span.yt-chip').length
        }
    };


    Tag_rations.prototype.setOneTagsRation = function(options){
        $("#" + options.id).attr("title", options.tagsText.join(", "))
            .find("." + FUA_YT_TAGS_RATIONS.class.tags_ration_count)
            .html( options.tagCounts + '/' + options.tagsLength);
    };


    Tag_rations.prototype.setTagsRation = function(){
        var tagRations = FUA_YT_TAGS_RATIONS.tagsRationInText({
            texts : [
                FUA_YT_EDIT_VIDEO.getTitleText(),
                FUA_YT_EDIT_VIDEO.getDescriptionText()
            ]
        });


        FUA_YT_TAGS_RATIONS.setOneTagsRation({
            id : FUA_YT_TAGS_RATIONS.id.title_tags_ration,
            tagsText : tagRations.tagsText[0],
            tagCounts : tagRations.tagCounts[0],
            tagsLength : tagRations.tagsLength
        });

        FUA_YT_TAGS_RATIONS.setOneTagsRation({
            id : FUA_YT_TAGS_RATIONS.id.description_tags_ration,
            tagsText : tagRations.tagsText[1],
            tagCounts : tagRations.tagCounts[1],
            tagsLength : tagRations.tagsLength
        });

        var activeRationId =
            $("." + FUA_YT_TAGS_RATIONS.class.tags_ration_active).attr('id');
        if(activeRationId) {
            FUA_YT_TAGS_RATIONS.highlightsRationTags({id : activeRationId});
        }

    };


    Tag_rations.prototype.autoHighlightTagsRation = function(options){
        if($("#" + options.id).hasClass(FUA_YT_TAGS_RATIONS.class.tags_ration_active)){
            FUA_YT_TAGS_RATIONS.highlightsRationTags({ id : options.id });
        }
    };


    Tag_rations.prototype.setTitleTagsRation = function(){
        var tagRations = FUA_YT_TAGS_RATIONS.tagsRationInText({
            texts : [ FUA_YT_EDIT_VIDEO.getTitleText() ]
        });

        FUA_YT_TAGS_RATIONS.setOneTagsRation({
            id : FUA_YT_TAGS_RATIONS.id.title_tags_ration,
            tagsText : tagRations.tagsText[0],
            tagCounts : tagRations.tagCounts[0],
            tagsLength : tagRations.tagsLength
        });

        FUA_YT_TAGS_RATIONS.autoHighlightTagsRation({
            id : FUA_YT_TAGS_RATIONS.id.title_tags_ration
        });
    };


    Tag_rations.prototype.setDescriptionTagsRation = function(){
        var tagRations = FUA_YT_TAGS_RATIONS.tagsRationInText({
            texts : [ FUA_YT_EDIT_VIDEO.getDescriptionText() ]
        });

        FUA_YT_TAGS_RATIONS.setOneTagsRation({
            id : FUA_YT_TAGS_RATIONS.id.description_tags_ration,
            tagsText : tagRations.tagsText[0],
            tagCounts : tagRations.tagCounts[0],
            tagsLength : tagRations.tagsLength
        });

        FUA_YT_TAGS_RATIONS.autoHighlightTagsRation({
            id : FUA_YT_TAGS_RATIONS.id.description_tags_ration
        });
    };


    Tag_rations.prototype.highlightsRationTags = function(options){
        $("." + FUA_YT_TAGS_RATIONS.class.highlighted_text)
            .removeClass(FUA_YT_TAGS_RATIONS.class.highlighted_text);
        var arrayString = $("#" + options.id).attr("title");

        if(arrayString) {
            var arr = arrayString.split(", ");

            $('div.video-settings-tag-chips-container span.yt-chip').each(function () {
                var tagText = $(this).find('span:first').html().toLowerCase();
                if(arr.indexOf(tagText) != -1) {
                    $(this).addClass(FUA_YT_TAGS_RATIONS.class.highlighted_text);
                }
            });
        }
    };


    Tag_rations.prototype.addListenerToTagsRationLabel = function(options){
        $("#" + options.id).click(function(){
            if($(this).hasClass(FUA_YT_TAGS_RATIONS.class.tags_ration_active)){
                $(this).removeClass(FUA_YT_TAGS_RATIONS.class.tags_ration_active);
                $("." + FUA_YT_TAGS_RATIONS.class.highlighted_text)
                    .removeClass(FUA_YT_TAGS_RATIONS.class.highlighted_text);
            }
            else{
                FUA_YT_TAGS_RATIONS.highlightsRationTags({id : options.id});
                $("." + FUA_YT_TAGS_RATIONS.class.tags_ration_active)
                    .removeClass(FUA_YT_TAGS_RATIONS.class.tags_ration_active);
                $(this).addClass(FUA_YT_TAGS_RATIONS.class.tags_ration_active);
            }
        });
    };


    return new Tag_rations();
})();