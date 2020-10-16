var FUA_YT_COPY_META_DATA = (function(){
    function Copy_meta_data(){
        this.prefix = 'fua_youtube_';
        this.id = {
            'horizontal_block' : this.prefix + 'copy_meta_data_horizontal_block_id',
            'control_panel' : this.prefix + 'copy_meta_data_control_panel_id',
            'h_progress_bar' : this.prefix + 'copy_meta_data_h_progress_bar_id',
            'url_input' : this.prefix + 'copy_meta_data_url_input_id',
            'select_language' : this.prefix + 'copy_meta_data_select_language_id',
            'copy_button' : this.prefix + 'copy_meta_data_copy_button_id',
        };
        this.class = {

        };

        this.delimiter2 = " %%%###%%% ";
    }



    Copy_meta_data.prototype.translateMeta = function(options){

        //console.log('text', options.meta[options.target]);

        var data = {
            text : options.meta[options.target],
            targetLang : options.lang,
            format : 'html',
            successCallback : function(translatedText, lang){
                options.meta[options.target] = translatedText;
                if(options.target == "title") options.target = "description";
                else if(options.target == "description") options.target = "tags";
                else if(options.target == "tags") {
                    options.meta[options.target] = options.meta[options.target]
                        .replace(new RegExp('([ ]%[ ]%[ ]%[ ]#[ ]#[ ]#[ ]%[ ]%[ ]%[ ]){1,2}', 'g'), FUA_YT_COPY_META_DATA.delimiter2)
                        .replace(new RegExp('([ ]%[ ]%[ ]%[ ]#[ ]#[ ]#[ ]%[ ]%[ ]%[ ]){1,2}', 'g'), FUA_YT_COPY_META_DATA.delimiter2)
                        .replace(new RegExp(',', 'g'), '')
                        .replace(new RegExp(FUA_YT_COPY_META_DATA.delimiter2.trim(), 'g'), ',');

                    options.target = "nothing";
                }

                if(options.meta[options.target]){
                    FUA_YT_COPY_META_DATA.translateMeta(options);
                }
                else FUA_YT_COPY_META_DATA.insertMetaData(options.meta);
            },
            failCallback : function(info){

            }
        };

        FUA_YT_TR.getYandexTranslate(data);
    };


    Copy_meta_data.prototype.clickByCopyButton = function(){

        var url = $('#' + FUA_YT_COPY_META_DATA.id.url_input).val();
        if(!url || !url.trim()) return false;
        var video_id = FUA_GET_VALUE.getVideoIdFromUrl(url);
        if(!video_id) return false;
        $('#' + FUA_YT_COPY_META_DATA.id.copy_button).hide();
        var translate_language = $('#' + FUA_YT_COPY_META_DATA.id.select_language).val();
        FUA_YT_COPY_META_DATA.getMetaDataFromVideo({
            video_id : video_id,
            successCallback : function(meta){
                console.log("meta", meta);
                if(translate_language == "not_translate"){
                    FUA_YT_COPY_META_DATA.insertMetaData(meta);
                }
                else{
                    if(meta.tags) meta.tags = meta.tags.replace(new RegExp(",", 'g'), FUA_YT_COPY_META_DATA.delimiter2);

                    FUA_YT_COPY_META_DATA.translateMeta({
                        meta : meta,
                        lang : translate_language,
                        target : "title"
                    });


                    /*var delimiter = " %%%%123%%%% ";
                    var delimiter2 = " %%%###%%% ";

                    var textForTranslation = meta.title + delimiter + meta.description;
                    if(meta.tags) textForTranslation += delimiter + meta.tags.replace(new RegExp(",", 'g'), delimiter2);
                    var data = {
                        text : textForTranslation,
                        targetLang : translate_language,
                        format : 'html',
                        successCallback : function(translatedText, lang){
                            //console.log("translatedText", translatedText);

                            var tmpArr = translatedText.split(delimiter);
                            var newMeta = {
                                title : tmpArr[0],
                                description : tmpArr[1]
                            };

                            if(tmpArr[2]) newMeta.tags = tmpArr[2].replace(new RegExp(delimiter2, 'g'), ',');

                            FUA_YT_COPY_META_DATA.insertMetaData(newMeta);
                        },
                        failCallback : function(info){

                        }
                    };

                    FUA_YT_TR.getYandexTranslate(data);*/
                }
            }
        });
    };


    Copy_meta_data.prototype.getMetaDataFromVideo = function(options){
        $.get("https://www.youtube.com/watch?v=" + options.video_id, "", function(response){
            var tagsString = response.match('"keywords"[ ]*:[ ]*"([^"]+)');
            if(tagsString) tagsString = tagsString[1];

            var title =  response.match('"title"[ ]*:[ ]*"([^"]+)');
            if(title) title = title[1];

            /*var description = response.match('meta[ ]*itemprop="description"[ ]*content="([^"]+)');
            if(description) description = description[1];**/
            var description = $($.parseHTML(response)).find("#watch-description-text #eow-description").html();

            if(!description){
                description = response.match(new RegExp('window\\["ytInitialData"\\] = (.*?\\}\\});\n'));
                if(description){
                    description = $.parseJSON(description[1]).contents.twoColumnWatchNextResults.results.results.contents[1].videoSecondaryInfoRenderer.description.runs;
                    var text = '';
                    for(var i in description) text += description[i].text;
                    description = text;
                }

            }

            if(description) {
                description = description
                    .replace(new RegExp("<br>", "g"), '\n')
                    .replace(new RegExp('<a[^>]*href="([^">]*)"[^>]*>[^<]*</a>', "g"), '$1');
            }



            options.successCallback({
                tags : tagsString,
                title : title,
                description : description
            });
        });
    };


    Copy_meta_data.prototype.addLanguageSelectOptions = function(){
        FUA_YT_TR.addLanguageSelectOptions({
            select_id : FUA_YT_COPY_META_DATA.id.select_language
        });
        $('#' + FUA_YT_COPY_META_DATA.id.select_language).prepend(
            '<option value="not_translate" selected>' +
                    chrome.i18n.getMessage("no_translate") +
            '</option>'
        );
    };


    Copy_meta_data.prototype.insertMetaData = function(meta){
        if(meta.title) $(".video-settings-title").val(meta.title);
        if(meta.description) $(".video-settings-description").val(meta.description);
        if(meta.tags){
            var tags = meta.tags.split(',');
            FUA_YT_EDIT_TAGS_WORKER.clearAllTags();
            FUA_YT_EDIT_TAGS_WORKER.addGroupTags(tags, 0);
        }

        setTimeout(function() {
            FUA_YT_EDIT_VIDEO.renderLeftValueCharactersTitle();
            FUA_YT_EDIT_VIDEO.renderLeftValueCharactersDescription();
            FUA_YT_EDIT_TAGS_WORKER.renderLeftTagsCharactersCount();
            $('#' + FUA_YT_COPY_META_DATA.id.copy_button).show();
        }, 100);
    };


    return new  Copy_meta_data();
})();