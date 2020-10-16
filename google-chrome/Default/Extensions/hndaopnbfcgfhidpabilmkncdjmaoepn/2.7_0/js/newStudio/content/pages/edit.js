class EditMetaData {

    constructor(){
        this.maxTagsLength = 500;
        this.editUrlRegexp = new RegExp('https://studio.youtube.com/video/([^/]+)/edit');
        this.tagsObserver = null;

        this.id = {
            tagsLeftLength : 'fua-plugin-youtube-id_our_total_tags_length',
            titleRation : 'fua_title_tags_ration',
            descriptionRation : 'fua_description_tags_ration',
        };

        this.class = {
            lengthLabel : 'fua_tag_length_label',
            rationCount : 'fau_tags_ration_count',
            highlighted : 'fua_highlighted_text',
            rationActive : 'fua_tags_ration_active',
            youubePlaceLabel : 'fua_youtube_place_label',
            yandexLabel : 'fua_yandex_label',
        };

        this.titleHtml =
            '<div id="id_our_panel_after_title">' +
                '<div style="background-color: #F8F8F8; margin-bottom: 5px; padding: 5px;">' +
                    '<span style="margin-top: -7px;" class="'+ FUA_YT_SIGNS.class.open_button +'" data_selector="input.video-settings-title">☺</span>' +

                    '<div style="margin-left: 40px;" id="'+ this.id.titleRation +'">' +
                        'tagRation:  <span class="'+ this.class.rationCount +'"></span>' +
                    '</div>' +
                '</div>' +
            '</div>';


        this.htmlDescription =
            '<div id="id_our_panel_after_description">' +
                '<div style="background-color: #F8F8F8; margin-bottom: 5px; padding: 5px;">' +
                    '<span  style="margin-top: -7px;" class="'+ FUA_YT_SIGNS.class.open_button +'" data_selector="textarea.video-settings-description">☺</span>' +

                    '<span style="margin-left: 40px;" id="'+ this.id.descriptionRation +'">' +
                        'tagRation:  <span class="'+ this.class.rationCount +'"></span>' +
                    '</span>' +

                    '<span style="float: right;" id="add-tags-to-description-block-id">' +
                        chrome.i18n.getMessage("word_add") + ' ' +
                        '<span id="add-tags-to-description-id" class="fua-plugin-youtube-like-link">' +
                            '#' + chrome.i18n.getMessage("word_tags") +
                        '</span>' +
                        ' '+ chrome.i18n.getMessage("word_or") +' ' +
                        '<span id="add-double-tags-to-description-id" class="fua-plugin-youtube-like-link">' +
                            '#' + chrome.i18n.getMessage("word_double_tags") +
                        '</span>' +
                    '</span>' +
                '</div>' +
            '</div>';




        this.htmlTags =
            '<div id="id_our_panel_after_youtube_tags">' +

                '<div class="fua-plugin-youtube-text-after-youtube-tags" style="background-color: #F8F8F8;">' +
                    chrome.i18n.getMessage("word_left") + ': ' +
                    '<span id="'+ this.id.tagsLeftLength +'">' +

                    '</span> ' +
                    chrome.i18n.getMessage("word_symbols") +
                    '<span id="fua_copy_all_tags" class="fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                        chrome.i18n.getMessage("copy_all") +
                    '</span>' +
                '</div>' +

                '<div class="fua-plugin-youtube-text-after-youtube-tags" style="background-color: #E2EED8; margin-top: 5px;">' +
                    '<div id="fua-plugin-youtube-show_place_in_youtube_box">' +
                        chrome.i18n.getMessage("place_in_youtube_search") + ' - ' +
                        '<span id="fua-plugin-youtube-show_place_in_youtube" class="fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                            chrome.i18n.getMessage("word_show") +
                        '</span>' +
                    '</div>' +
                    '<div id="fua-plugin-youtube-search-place_progress" style="clear: both;">' +
                        '<div id="fua-plugin-youtube-search-place_progress_percentage" style="width: 395px;">' +
                            '0%' +
                        '</div>' +
                        '<div id="fua-plugin-youtube-search-place_progress_line">' +
                            '<div id="fua-plugin-youtube-search-place_progress_line_inner">' +
                                '<div class="fua-plugin-youtube-search-progress-line-parts" style="background-color: orange;">' +
                                '</div>' +
                                '<div class="fua-plugin-youtube-search-progress-line-parts">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>'+

                '<div id="'+ FUA_YT_YANDEX_KW.id.horizontal_block +'" class="fua-plugin-youtube-text-after-youtube-tags" style="background-color: #FDFBCA; margin-top: 5px;">' +
                    '<div id="'+ FUA_YT_YANDEX_KW.id.control_panel +'">' +
                        chrome.i18n.getMessage("ranks_in_yandex_keywords") + ' - ' +
                        '<span id="id_our_tag_show_ranks_in_yandex_keyword" class="fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                            chrome.i18n.getMessage("word_show") +
                        '</span>' +
                    '</div>' +
                '</div>' +

                /*'<div id="'+ FUA_YT_COPY_META_DATA.id.horizontal_block +'" class="fua-plugin-youtube-text-after-youtube-tags" style="background-color: #FDFBCA; margin-top: 5px;">' +
                    '<div id="'+ FUA_YT_COPY_META_DATA.id.control_panel +'">' +
                        '<input type="text" id="'+  FUA_YT_COPY_META_DATA.id.url_input +'" placeholder="Video URL">' +
                        '<select id="'+ FUA_YT_COPY_META_DATA.id.select_language +'"></select>' +
                        '<span id="' + FUA_YT_COPY_META_DATA.id.copy_button + '" class="fua-plugin-youtube-check-is-our-channel-in-favorites">' +
                            chrome.i18n.getMessage("word_copy") +
                        '</span>' +
                    '</div>' +
                '</div>' +*/


                '<div id="id_our_tags_inform_block">' +
                '</div>' +
            '</div>';

        this.htmlSearchTag =
            '<div id="' + ID_OUR_SEARCH_TAGS_PANEL + '">' +
            '<div>' +
            '<input id="' + ID_OUR_TAG_UPLOAD_INPUT + '" type="text" placeholder="'+ C_TEXT_SEARCH_TAGS_INPUT_PLACEHOLDER +'" style="width: 60%;">' +
            '<span id="' + ID_OUR_TAG_UPLOAD_ADD_BUTTON + '" class="fua-plugin-youtube-check-is-our-channel-in-favorites" style="float: right; margin-left: 0px; width: 30%; border-color: #167ac6; background: #167ac6; color: #fff;">' +
            '<span class="yt-uix-button-content">' +
            C_TEXT_WORD_SEARCH +
            '</span>' +
            '</span>' +
            '<div id="fua_search_tag_hints_box"></div>' +
            '</div>' +

            '<div style="margin-top: 10px;">' +
            '<div style="display: inline-block">' +
            '<div style="display: table-cell; vertical-align: middle;">' +
            '<input style="margin-right: 5px;" type="checkbox" name="' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX + '">' +
            '</div>' +
            '<div style="display: table-cell">' +
            '<label style="margin-right: 5px;" for="' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX + '">' +
            C_TEXT_WORD_HINTS +
            '</label>' +
            '</div>' +
            '</div>' +

            '<div style="display: inline-block">' +
            '<div style="display: table-cell; vertical-align: middle;">' +
            '<input style="margin-right: 5px;" type="checkbox" name="' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX + '">' +
            '</div>' +
            '<div style="display: table-cell">' +
            '<label style="margin-right: 5px;" for="' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX + '">' +
            C_TEXT_GOOGLE_TRENDS +
            '</label>' +
            '</div>' +
            '</div>' +

            '<div style="display: inline-block">' +
            '<div style="display: table-cell; vertical-align: middle;">' +
            '<input  style="margin-right: 5px;" type="checkbox" name="' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX + '">' +
            '</div>' +
            '<div style="display: table-cell;">' +
            '<label style="margin-right: 5px;" for="' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX + '">' +
            C_TEXT_WORD_YOUTUBE + ' ' + C_TEXT_WORD_TAGS +
            '</label>' +
            '</div>' +
            '</div>' +

            '<div style="display: inline-block">' +
            '<div style="display: table-cell; vertical-align: middle;">' +
            '<input  style="margin-right: 5px;" type="checkbox" name="' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX + '">' +
            '</div>' +
            '<div style="display: table-cell;">' +
            '<label style="margin-right: 5px;" for="' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX + '" id="' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX + '">' +
            'Yandex Keywords' +
            '</label>' +
            '</div>' +
            '</div>' +

            '</div>' +

            '<div id="' + ID_OUR_SEARCH_PROGRESS + '" style="clear: both; width: 350px;">' +
            '<div id="' + ID_OUR_SEARCH_PROGRESS_PERCENTAGE + '" style="width: 350px;">0%</div>' +
            '<div id="' + ID_OUR_SEARCH_PROGRESS_LINE + '">' +
            '<div id="' + ID_OUR_SEARCH_PROGRESS_LINE_INNER + '">' +
            '<div class="fua-plugin-youtube-search-progress-line-parts" style="background-color: orange;">' +
            '</div>' +
            '<div class="fua-plugin-youtube-search-progress-line-parts">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="' + ID_OUR_NOT_ADDED_TAGS_BOX + '" style="clear: both">' +
            '</div>' +
            '</div>';


        this.tagsCount = 0;
        this.tagsLength = 0;
        this.tagRationName = null;
        this.tagRationTitle = 0;
        this.tagRationDescription = 0;

    }


    getTitle(){
        return $('div.title textarea.ytcp-form-textarea');
    }

    getDescription(){
        return $('div.description textarea.ytcp-form-textarea');
    }


    getTagsElements(){
        return $('ytcp-chip-bar#chip-bar div.chip-and-bar ytcp-chip.chip');
    }

    getTagText(tag){
        return $(tag).find('div.text').text();
    }

    getTagLength(tag){
        return this.getTagText(tag).length;
    }

    getTotalTagLength(){
        let length = 0;
        let count = 0;

        this.getTagsElements().each((index, tag) => {
            count++;
            length += this.getTagLength(tag);
        });


        this.tagsLength = length;
        this.tagsCount = count;
        return length;
    }

    renderTagsLeftLength(){
        $('#' + this.id.tagsLeftLength).text(this.maxTagsLength - this.getTotalTagLength());
    }

    addLengthLabel(tag){
        let length = this.getTagLength(tag);

        if(length.length < 1) return false;

        if($(tag).find('.' + this.class.lengthLabel).length > 0){
            $(tag).find('.' + this.class.lengthLabel + ' > div').text(length);
        }
        else {
            $(tag).prepend(
                '<div class="' + this.class.lengthLabel + '" >' +
                '<div>' +
                length +
                '<div>' +
                '</div>'
            ).addClass(FUA_YT_EDIT_TAGS_WORKER.class.tag);
        }
    }

    addAllLengthLabels(){
        this.getTagsElements().each((index, tag) => {
            this.addLengthLabel(tag);
        });
    }


    addTagsObserver(){
        let target = document.querySelector('ytcp-chip-bar#chip-bar div.chip-and-bar');
        if(this.tagsObserver) this.tagsObserver.disconnect();

        this.tagsObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if(
                    /*mutation.target.className === 'style-scope ytcp-chip'
                    ||*/ mutation.target.className === 'chip-and-bar style-scope ytcp-chip-bar'
                    || mutation.addedNodes.length === 3
                ){
                    //console.log('mutation', mutation);
                    this.addAllLengthLabels();
                    this.renderTagsLeftLength();
                    this.updateTagRation();
                }
            });
        });

        this.tagsObserver.observe(target, { childList: true, subtree: true });
    }


    addListeners(){
        this.getTitle()[0].addEventListener('input', (e) => {
            this.updateTagRation();
        });

        this.getDescription()[0].addEventListener('input', (e) => {
            this.updateTagRation();
        });

        $('#' + this.id.titleRation).click(() => {
            this.toggleTagsRation('title', this.id.titleRation);
        });

        $('#' + this.id.descriptionRation).click(() => {
            this.toggleTagsRation('description', this.id.descriptionRation);
        });


        $('#add-double-tags-to-description-id').click(() => {
            let doubleTags = this.getTagsForDescription();
            let doubleTagsString = '';
            for(let i in doubleTags){
                let tmpTags = doubleTags[i].split(' ');
                let tagString = '#';
                for(let j in tmpTags){
                    tagString += capitalizeFirstLetter(tmpTags[j])
                }
                if(doubleTagsString) doubleTagsString += ' ';
                doubleTagsString += tagString;
            }

            this.addToDescriptionEnd(doubleTagsString);
        });


        $('#add-tags-to-description-id').click(() => {
            let tags = this.getTagsForDescription();
            let onlyRussianWords = {};
            let otherWords = {};
            for(let i in tags){
                let tmpTags = tags[i].split(' ');
                for(let j in tmpTags){
                    let tag = tmpTags[j].toLowerCase();
                    if(tag.match('[^а-я]')) otherWords[tag] = true;
                    else if(!tag.match('^(и|да|не|только|но|также|тоже|ни|как|так|или|либо|то|же|зато|же|а|без|близ|в|во|до|за|из|к|ко|кроме|на|над|о|об|обо|от|под|подо|при|с|со|у)$')){
                        onlyRussianWords[tag] = true;
                    }
                }
            }

            chrome.runtime.sendMessage({
                'title': 'getFilterWords',
                'body': {
                    'otherWords': otherWords,
                    'onlyRussianWords' : onlyRussianWords
                }
            });
        });


        // place in youtube search
        $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE).click(() => {
            let videoId = window.location.href.match(new RegExp('https://studio.youtube.com/video/([^/]+)/'))[1];
            let tags = [];
            this.getTagsElements().each((index, tag) =>  {
                if($(tag).find('.' + this.class.youubePlaceLabel).length < 1) {
                    tags.push(this.getTagText(tag));
                }
            });

            if(tags.length > 0){
                chrome.runtime.sendMessage({
                    'title': 'getVideoPlaceInYoutubeByTags',
                    'body': {'id': videoId, 'tags': tags}
                });

                $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE).hide();
                $('#' + ID_OUR_SEARCH_PLACE_PROGRESS_PERCENTAGE).html('0%');
                $('#' + ID_OUR_SEARCH_PLACE_PROGRESS_LINE_INNER).css('margin-left', '-100%');
                $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE_BOX).hide();
                $('#' + ID_OUR_SEARCH_PLACE_PROGRESS).show();
            }
        });


        //work with yandex keywords
        $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).click(() => {
            let tags = [];
            this.getTagsElements().each((index, tag) => {
                if($(tag).find('.' + this.class.yandexLabel).length < 1) {
                    tags.push(this.getTagText(tag));
                }
            });

            if($('div.fua-plugin-youtube-no-added-tag').length > 0){
                $('div.fua-plugin-youtube-no-added-tag').each(function(){
                    if($(this).find('.fua-plugin-youtube-yandex-keywords-label-not-added-tag').length < 1){
                        tags.push($(this).find('.fua-plugin-youtube-no-added-tag-text').html());
                    }
                });
            }

            if(tags.length > 0) {
                chrome.runtime.sendMessage({
                    'title': 'getYandexKeywordsRank',
                    'body': {'tags': tags}
                });
                $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).hide();
            }
        });


        $('#fua_copy_all_tags').click(() => {
            this.copyTags();
        });

        // work with checkboxes
        $('#' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX).change(e =>  {
            this.searchCheckboxClick('checkboxAddHintsToTags', $(e.target).prop('checked'));
        });

        $('#' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX).change(e =>  {
            this.searchCheckboxClick('checkboxAddTrendsToTags', $(e.target).prop('checked'));
        });

        $('#' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX).change(e =>  {
            this.searchCheckboxClick('checkboxAddYoutubeTagsToTags', $(e.target).prop('checked'));
        });

        $('#' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX).change(e =>  {
            this.searchCheckboxClick('checkboxAddYandexKeywordsToTags', $(e.target).prop('checked'));
        });


        //search tags
        document.getElementById(ID_OUR_TAG_UPLOAD_INPUT).oninput = (e) => {
            this.getHintsForSearchTag();
        }

        $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON).click( () => {
            this.getTopicTags();
        });

        $('#' + ID_OUR_TAG_UPLOAD_INPUT).keypress((e) => {
            if (e.which == 13) this.getTopicTags();
        });
    }


    getTopicTags() {
        let tagsTopic = $('#' + ID_OUR_TAG_UPLOAD_INPUT).val();
        let enterButton = $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON);
        if (
            tagsTopic
            && !enterButton.hasClass('fua-plugin-youtube-disable-button')
            && !enterButton.hasClass(CLASS_OUR_NO_CHECKBOX_BUTTON)
        ) {
            enterButton.addClass('fua-plugin-youtube-disable-button');
            $('#fua_search_tag_hints_box').hide();
            chrome.runtime.sendMessage({
                'title': 'getYoutubeTags',
                'body': {'tagsTopic': tagsTopic}
            });
            $('#' + ID_OUR_SEARCH_PROGRESS_PERCENTAGE).html('0%');
            $('#' + ID_OUR_SEARCH_PROGRESS_LINE_INNER).css('margin-left', '-100%');
            $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).hide();
            $('#' + ID_OUR_SEARCH_PROGRESS).show();
        }
    }


    getHintsForSearchTag(){
        let searchInput = $('#'+ ID_OUR_TAG_UPLOAD_INPUT);
        let searchInputVal = searchInput.val().trim();
        if(
            searchInputVal
            //&& $('#' + ID_OUR_SEARCH_HINTS_CHECKBOX).prop('checked')
            && searchInputVal.replace(new RegExp('[^0-9a-zа-я]*', 'gi'), '').length > 2
        ){
            chrome.runtime.sendMessage({
                'title' : 'getSearchHints',
                'body': {'value' : searchInputVal}
            });
        }
        else {
            $('#fua_search_tag_hints_box').hide();
            $('#fua_search_tag_hints_box').html(null);
            $('#' + ID_OUR_SEARCH_TAGS_PANEL)
                .css('min-height', $('#fua_search_tag_hints_box').css('height'));
        }
    };


    toggleTagsRation(name, id){
        $('.' + this.class.rationActive).removeClass(this.class.rationActive);
        if(this.tagRationName === name) this.tagRationName = null;
        else {
            $('#' + id).addClass(this.class.rationActive);
            this.tagRationName = name;
        }
        this.updateTagRation();
    }

    updateTagRation() {
        if(!this.getTitle().length || !this.getDescription().length) return false;
        let title = this.getTitle().val().toLowerCase();
        let description = this.getDescription().val().toLowerCase();
        this.tagRationTitle = 0;
        this.tagRationDescription = 0;

        this.getTagsElements().each((index, tag) => {
            let text = this.getTagText(tag).toLowerCase();
            $(tag).removeClass(this.class.highlighted);

            if(title.indexOf(text) !== -1) {
                this.tagRationTitle++;

                if(this.tagRationName === 'title'){
                    $(tag).addClass(this.class.highlighted);
                }
            }

            if(description.indexOf(text) !== -1) {
                this.tagRationDescription++;

                if(this.tagRationName === 'description'){
                    $(tag).addClass(this.class.highlighted);
                }
            }
        });

        $('#' + this.id.titleRation + ' .' + this.class.rationCount)
            .text(this.tagRationTitle + '/' + this.tagsCount);
        $('#' + this.id.descriptionRation + ' .' + this.class.rationCount)
            .text(this.tagRationDescription + '/' + this.tagsCount);
    }


    getTagsForDescription(){
        const tags = [];

        this.getTagsElements().each((index, tag) => {
            tags.push(
                this.getTagText(tag)
                    .replace(new RegExp('[^0-9a-zа-яёй ]', 'ig'), '')
                    .replace(new RegExp('[ ]{2,}', 'ig'), ' ')
            );
        });

        return tags;
    }

    addToDescriptionEnd(string){
        let descriptionTextarea = this.getDescription();

        let textValue = $(descriptionTextarea).val();
        let textLength = textValue.length;

        if(textLength < 1) $(descriptionTextarea).val(string);
        else if(textValue.match('^[ ]*[\n]*\n$')) {
            $(descriptionTextarea).val(textValue + string);
        }
        else if(textValue.match('\n[ ]*$') || textValue.match('^[ ]*$')) {
            $(descriptionTextarea).val(textValue + '\n' + string);
        }
        else {
            $(descriptionTextarea).val(textValue + '\n\n' + string);
        }

        descriptionTextarea[0].scrollTop = descriptionTextarea[0].scrollHeight - 20;
        descriptionTextarea[0].selectionEnd = $(descriptionTextarea).val().length;
        descriptionTextarea[0].dispatchEvent(new Event("input", {bubbles: true, cancelable: false}));
    }

    insertYoutubePlaceLabels(options){
        let places = options.places;

        this.getTagsElements().each((index, tag) => {
            let place = places[this.getTagText(tag)];
            if ($(tag).find('.' + this.class.youubePlaceLabel).length < 1 && place) {
                if (place === 'more') place = '20+';
                else place++;

                let style = '';
                if (place !== '20+' && parseInt(place) < 21){
                    style = 'style="background-color: #009900; color: #ffffff;"';
                }

                $(tag).prepend(
                    '<div class="'+ this.class.youubePlaceLabel +'">' +
                        '<div ' + style + '>' +
                            place +
                        '<div>' +
                    '</div>'
                )
            }
        });

        $('#' + ID_OUR_SEARCH_PLACE_PROGRESS).hide();
        $('#' + ID_OUR_VIDEO_YOUTUBE_PLACE_CIRCLE_LOAD).hide();

        $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE).show();
        $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE).parent().show();

        $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE)
            .closest('.fua-plugin-youtube-video-show-text-line')
            .css('margin-top', 11);

        $('#' + ID_OUR_TAG_SHOW_PLACE_IN_YOUTUBE_BOX).show();
    }

    insertYandexVolumeLabels(options){
        let ranks = options.ranks;

        this.getTagsElements().each((index, element) => {
            let tag = this.getTagText(element).toLowerCase();
            if (
                $(element).find('.' + this.class.yandexLabel).length < 1
                && (ranks[tag] || ranks[tag] == '0')
            ) {
                let style = '';
                if (parseInt(ranks[tag]) > 100000) {
                    style = 'style="background-color: #FFFF66; color: #000000;"';
                }

                $(element).prepend(
                    '<div style="text-align: left" class="' + this.class.yandexLabel + '">' +
                        '<div ' + style + '>' +
                            numberWithDelimiters(ranks[tag], '`') +
                        '</div>' +
                    '</div>'
                )
            }
        });


        if($('div.fua-plugin-youtube-no-added-tag').length > 0){
            $('div.fua-plugin-youtube-no-added-tag').each(function(){
                var tag = $(this).find('.fua-plugin-youtube-no-added-tag-text').html().toLowerCase();
                if(
                    $(this).find('.fua-plugin-youtube-yandex-keywords-label-not-added-tag').length < 1
                    && (ranks[tag] || ranks[tag] == '0')
                ){
                    $(this).find('.fua-plugin-youtube-no-added-tag-text').after(
                        '<span class="fua-plugin-youtube-yandex-keywords-label-not-added-tag">' +
                            numberWithDelimiters(ranks[tag], '`')  +
                        '</span>'
                    );
                }
            });
        }
    }

    copyTags(){
        let tags = [];
        this.getTagsElements().each((index, tag) => {
            tags.push(this.getTagText(tag));
        });

        if(tags.length) {
            let copyString = tags.join(',');
            copyToClipboard(copyString);

            chrome.runtime.sendMessage({
                'title': 'copyTagsNotification',
                'body': {'text': copyString}
            });
        }
    }

    searchCheckboxClick(msgTitle, checked){
        chrome.runtime.sendMessage({
            'title': msgTitle,
            'body': {'checked': checked}
        });

        this.checkAllSearchCheckBox();
    }

    updateSearchCheckbox(){
        chrome.storage.local.get(['checkbox'], (result) => {
            $('#' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX)
                .prop('checked', result.checkbox.addHintsToTags);

            $('#' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX)
                .prop('checked', result.checkbox.addTrendsToTags);

            $('#' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX)
                .prop('checked', result.checkbox.addYoutubeTagsToTags);

            $('#' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX)
                .prop('checked', result.checkbox.addYandexKeywordsToTags);

            this.checkAllSearchCheckBox();
        });
    }

    checkAllSearchCheckBox(){
        let leastOneActive = false;
        let objectArray = [
            $('#' + ID_OUR_ADD_HINTS_TO_TAGS_CHECKBOX),
            $('#' + ID_OUR_ADD_TRENDS_TO_TAGS_CHECKBOX),
            $('#' + ID_OUR_ADD_YOUTUBE_TAGS_TO_TAGS_CHECKBOX),
            $('#' + ID_OUR_ADD_YANDEX_KEYWORDS_TO_TAGS_CHECKBOX),
        ];

        for(let i in objectArray){
            if(objectArray[i].prop('checked')) leastOneActive = true;
        }

        if(leastOneActive) {
            $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON)
                .removeClass(CLASS_OUR_NO_CHECKBOX_BUTTON);
        }
        else{
            $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON)
                .addClass(CLASS_OUR_NO_CHECKBOX_BUTTON);
        }
    }

    createRegexpEndingRuWord(word){
        let scl = {
            scl1 : {
                start : '[бвгджзйклмнпрстфхцчшщь][аяыиеую]|ой|ёй|ей',
                variants : {
                    'ой|ёй|ей' : 2,
                    '[бвгджзйклмнпрстфхцчшщь][аяыиеую]' : 1
                },
                final : '([аяыиеую]|ой|ёй|ей)'
            },
            scl2 : {
                start : '[а-я][бвгджзйклмнпрстфхцчшщ]|[бвгджзйклмнпрстфхцчшщи][оеаяуюь]|ом|ем|ём',
                variants : {
                    'ом|ем|ём' : 2,
                    '[а-я][бвгджзклмнпрстфхцчшщ]' : 0,
                    '[бвгджзйклмнпрстфхцчшщи][оеаяуюь]' : 1,
                    '[ауоыиэяюёе][оеаяуюй]' : 1
                },
                final : '([оеаяуюь]{0,1}|ом|ем|ём)'
            },
            scl3 : {
                start : '[бвгджзйклмнпрстфхцчшщ][иь]|ью',
                variants : {
                    'ью' : 2,
                    '[бвгджзйклмнпрстфхцчшщ][иь]' : 1
                },
                final : '([иь]|ью)'
            }
        };

        let regexpString = '';
        let wLength = word.length;


        if(wLength < 3) return '(^|[ ])(' + word + ')([ ]|$)';

        let wLast2Letters = word.slice(wLength - 2);
        for(let i in scl){
            if(wLast2Letters.search(scl[i].start) != -1){
                let endingSliceIndex = 0;
                for(let j in scl[i].variants){
                    if(wLast2Letters.search(j) != -1) endingSliceIndex = scl[i].variants[j];
                }
                let partRegexp =
                    '(' + word.slice(0, wLength - endingSliceIndex) + scl[i].final + ')';
                if(regexpString) regexpString += '|';
                regexpString += partRegexp;
            }
        }

        if(regexpString) return '(^|[ ])(' + regexpString + ')([ ]|$)';
        else return '(^|[ ])(' + word + ')([ ]|$)';
    }


    insertSortedTags(options) {
        console.log('insertSortedTags', options);
        let sortedTags =  options.sortedTags;
        let prepend = options.prepend;
        let dataName = options.dataName;

        for (let i in sortedTags) {
            let htmlRankTags = '';

            for (let j in sortedTags[i]) {
                let titleText = '';

                let title_label = sortedTags[i][j];
                if(sortedTags[i][j]['title_label']) title_label = sortedTags[i][j]['title_label'];


                for (let k in title_label) {
                    if (
                        typeof title_label[k] === 'string'
                        || typeof title_label[k] === 'number'
                    ) {
                        titleText += k + ' (' + title_label[k] + '); ';
                    }
                    else {
                        titleText += k + ' (';
                        let tmpM = '';
                        for (var m in title_label[k]) {
                            if (tmpM) tmpM += ', ';
                            tmpM += m + ' - ' + title_label[k][m];
                        }
                        titleText += tmpM + '); ';
                    }
                }

                let nString = '';
                if(sortedTags[i][j]['yandex_label']){
                    nString =
                        '<span class="fua-plugin-youtube-yandex-keywords-label-not-added-tag">' +
                        numberWithDelimiters(sortedTags[i][j]['yandex_label']) +
                        '</span>';
                }


                let text = j;
                if(sortedTags[i][j]['text']) text = sortedTags[i][j]['text'];

                htmlRankTags +=
                    '<div class="fua-plugin-youtube-no-added-tag">' +
                    '<span class="fua-plugin-youtube-no-added-tag-text" title="' + titleText + '">' +
                    text +
                    '</span>' +
                    nString +
                    '<span class="fua-plugin-youtube-no-added-tag-disable">' +
                    '&times;' +
                    '</span>' +
                    '<span class="fua-plugin-youtube-no-added-tag-enable">' +
                    '&#8629;' +
                    '</span>' +
                    '</div>';
            }


            if (htmlRankTags) {
                let tmpHtml =
                    '<div class="fua-plugin-youtube-no-added-tags-rank">' +
                    '<div class="fua-plugin-youtube-no-added-tags-rank-title">' +
                    C_TEXT_TAGS_POPULARITY +' ' + i + ' - ' +
                    '<span class="fua-plugin-youtube-no-added-tags-rank-add-all">' +
                    C_TEXT_WORD_ADD + ' ' + C_TEXT_WORD_ALL +
                    '</span>' +
                    '</div>' +
                    '<div class="fua-plugin-youtube-no-added-tags-rank-box">' +
                    htmlRankTags +
                    '</div>' +
                    '</div>';

                let afterThis = false;
                if(options.afterMatch){
                    $('div.fua-plugin-youtube-no-added-tags-rank').each(function(){
                        var tmpTitle = $(this).find('.fua-plugin-youtube-no-added-tags-rank-title').html();
                        if(tmpTitle.match(options.afterMatch)) afterThis = $(this);
                    });
                }

                if(afterThis) afterThis.after(tmpHtml)
                else if(prepend) $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).prepend(tmpHtml);
                else $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).append(tmpHtml);
            }
        }
    }


    addOneTag(string){
        $(SELECTORS_YOUTUBE_ADD_TAG_INPUT)
            .trigger('focus').val(string).trigger('blur');


        let input = $('div#child-input input#text-input');
        input[0].dispatchEvent(new Event("focus", {bubbles: true, cancelable: false}));
        input.val(string);
        input[0].dispatchEvent(new Event("input", {bubbles: true, cancelable: false}));
        input[0].dispatchEvent(new Event("blur", {bubbles: true, cancelable: false}));


        setTimeout(() => {
            this.addAllLengthLabels();
            this.renderTagsLeftLength();
            this.updateTagRation();
        }, 10);
    };


    addGroupTags(array, index){
        if(array[index]){
            this.addOneTag(array[index]);
            setTimeout(() => {
                this.addGroupTags(array, index + 1);
            }, 25);
        }
    };

    insertYoutubeUploadTags(options){
        let sortedTags = options.sortedTags;
        let sortedTagsRanks = options.sortedTagsRanks;
        let groupedTags = options.groupedTags;
        let aggregatedTags = options.aggregatedTags;

        $('#' + ID_OUR_SEARCH_PROGRESS).hide();
        $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).html(null);

        this.insertSortedTags({sortedTags : sortedTags, prepend : true});
        for(let i in aggregatedTags){
            for(let j in aggregatedTags[i]){
                if(j.match(C_TEXT_YANDEX_KEYWORDS_TITLE)){
                    let tmpArray = [];
                    for(let k in aggregatedTags[i][j]) {
                        tmpArray.push({
                            text : k,
                            volume : parseInt(aggregatedTags[i][j][k][C_TEXT_YANDEX_KEYWORDS_TITLE][C_TEXT_YENDEX_KEYWORD_VOLUME]),
                            yandex_label : aggregatedTags[i][j][k][C_TEXT_YANDEX_KEYWORDS_TITLE][C_TEXT_YENDEX_KEYWORD_VOLUME],
                            title_label : aggregatedTags[i][j][k]
                        });
                    }

                    tmpArray.sort(function (a, b) {
                        if (a.volume < b.volume) return 1;
                        if (a.volume > b.volume) return -1;
                        return 0;
                    });

                    aggregatedTags[i][j] = tmpArray;
                }
            }


            this.insertSortedTags({sortedTags : aggregatedTags[i], prepend : true});
        }

        let yandexArray = [];
        for(let i in groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE]){
            yandexArray.push({
                text : i,
                volume : parseInt(groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE][i][C_TEXT_YENDEX_KEYWORD_VOLUME]),
                yandex_label : groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE][i][C_TEXT_YENDEX_KEYWORD_VOLUME],
                title_label : groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE][i]
            });
        }

        yandexArray.sort(function (a, b) {
            if (a.volume < b.volume) return 1;
            if (a.volume > b.volume) return -1;
            return 0;
        });

        let tmpData = {
            sortedTags : {},
            prepend : true,
            'afterMatch' : C_TEXT_YANDEX_KEYWORDS_TITLE
        };
        tmpData.sortedTags[C_TEXT_YANDEX_KEYWORDS_TITLE] = yandexArray;
        this.insertSortedTags(tmpData);

        delete groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE];
        this.insertSortedTags({sortedTags : groupedTags});

        $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).show();

        $('#' + ID_OUR_NOT_ADDED_TAGS_BOX).find('.fua-plugin-youtube-no-added-tag-text').click((e) => {
            let tag = $(e.target).closest('.fua-plugin-youtube-no-added-tag');
            if(!tag.hasClass('fua-plugin-youtube-no-added-tag-not-active')) {
                this.addOneTag($(e.target).html());
                let rankTagsBlock = tag.closest('.fua-plugin-youtube-no-added-tags-rank-box');
                tag.remove();
                if(rankTagsBlock.find('.fua-plugin-youtube-no-added-tag').length < 1){
                    rankTagsBlock
                        .closest('.fua-plugin-youtube-no-added-tags-rank').remove();
                }
            }
        });

        $('#' + ID_OUR_NOT_ADDED_TAGS_BOX)
            .find('.fua-plugin-youtube-no-added-tag-disable').click((event) => {
            event.stopPropagation();
            let tag = $(event.target).closest('.fua-plugin-youtube-no-added-tag');
            tag.addClass('fua-plugin-youtube-no-added-tag-not-active');
            tag.hide();
            tag.find('.fua-plugin-youtube-no-added-tag-enable').show();
        });


        $('.fua-plugin-youtube-no-added-tag').click(function(){
            if($(this).hasClass('fua-plugin-youtube-no-added-tag-not-active')) {
                $(this).removeClass('fua-plugin-youtube-no-added-tag-not-active');
                $(this).find('.fua-plugin-youtube-no-added-tag-enable').hide();
                $(this).find('.fua-plugin-youtube-no-added-tag-disable').show();
            }
        });


        $('#' + ID_OUR_NOT_ADDED_TAGS_BOX)
            .find('.fua-plugin-youtube-no-added-tags-rank-add-all').click((e) => {
            let rank = $(e.target).closest('.fua-plugin-youtube-no-added-tags-rank');
            let rankTagsBlock = rank.find('.fua-plugin-youtube-no-added-tags-rank-box');
            let tagsArray = [];
            rankTagsBlock
                .find('.fua-plugin-youtube-no-added-tag').each((index, element) =>{
                if(!$(element).hasClass('fua-plugin-youtube-no-added-tag-not-active')) {
                    tagsArray.push(
                        $(element).find('.fua-plugin-youtube-no-added-tag-text').html()
                    );
                    $(element).remove();
                }
            });

            if(rankTagsBlock.find('.fua-plugin-youtube-no-added-tag').length < 1){
                rank.remove();
            }

            this.addGroupTags(tagsArray, 0);
        });

        $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON)
            .removeClass('fua-plugin-youtube-disable-button');
    }


    addHtml(){
        if(
            !$('#id_our_panel_after_title').length
            && !$('#id_our_panel_after_description').length
            && !$('#id_our_panel_after_youtube_tags').length
            && !$('#id_our_search_tags_panel').length
            && $('div.title').length
            && $('div.description').length
            && $('div.input-container.style-scope.ytcp-video-metadata-basics > ytcp-form-input-container').length
            && $('div.input-container.playlists.style-scope.ytcp-video-metadata-basics').length
        ){
            $('div.title').before(this.titleHtml);
            $('div.description').first().before(this.htmlDescription);
            $('div.input-container.style-scope.ytcp-video-metadata-basics > ytcp-form-input-container').after(this.htmlTags);
            $('div.input-container.playlists.style-scope.ytcp-video-metadata-basics').after(this.htmlSearchTag);
            this.renderTagsLeftLength();
            this.addAllLengthLabels();
            this.updateTagRation();
            this.updateSearchCheckbox();

            this.addTagsObserver();
            this.addListeners();

            FUA_YT_SIGNS.clickByOpenButton();
        }
    }
}



const edit = new EditMetaData();




chrome.runtime.onMessage.addListener(response => {
    let title = response.title;
    let body = null;
    if (response.body) body = response.body;

    console.log(title, body);

    if (title === 'insertTagsToDescription') {
        let tagsString = '';
        for(let i in body.aggregatedWords.one){
            if(tagsString) tagsString += ' ';
            tagsString += '#' + i;
        }
        for(let i in body.aggregatedWords.multiple){
            if(tagsString) tagsString += ' ';
            tagsString += '#' + i;
        }
        for(let i in body.aggregatedWords.noMorpher){
            if(tagsString) tagsString += ' ';
            tagsString += '#' + i;
        }
        for(let i in body.otherWords){
            if(tagsString) tagsString += ' ';
            tagsString += '#' + i;
        }

        edit.addToDescriptionEnd(tagsString)
    }

    else if (title === 'insertYoutubePlaces') {
        edit.insertYoutubePlaceLabels({places : body.places});
    }

    else if (title == 'progressYoutubePlaceSearching') {
        if($('#' + ID_OUR_SEARCH_PLACE_PROGRESS_PERCENTAGE).length > 0){
            $('#' + ID_OUR_SEARCH_PLACE_PROGRESS_PERCENTAGE)
                .html(body.progress + '%');

            $('#' + ID_OUR_SEARCH_PLACE_PROGRESS_LINE_INNER).animate({
                marginLeft: (body.progress - 100) + '%'
            }, 200);
        }
    }

    /*******/
    else if (title == 'noAuthInYandexDirect') { noAuthInYandexDirect(); }



    /*******/
    else if (title == 'noPassportLogin') { noPassportLogin(); }


    /*******/
    else if (title == 'verifyYandexCaptchaResponse') {
        if(body.verify) {
            $('#' + ID_OUR_TAGS_INFORM_BLOCK).html(
                C_TEXT_CAPTCHA_VERIFY_SUCCESS
            );

            if(body.targetAction == 'getRanks'){
                var ranks = {};
                ranks[body.word] = body.additional.rank;

                edit.insertYandexVolumeLabels({
                    ranks : ranks
                });

                if(body.additional.words[body.additional.wordIndex + 1]){
                    //console.log("vYes");
                    chrome.runtime.sendMessage({
                        'title': 'getYandexKeywordsRank',
                        'body': {'tags': body.additional.words, 'wordIndex' : body.additional.wordIndex + 1}
                    });
                }
                else {
                    $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).show();
                    //console.log("vNo");
                    if($("#" + FUA_YT_YANDEX_KW.id.horizontal_block).length){
                        $("#" + FUA_YT_YANDEX_KW.id.h_progress_bar).remove();
                        $("#" + FUA_YT_YANDEX_KW.id.control_panel).show();
                    }
                }
            }
            else if(body.targetAction == 'getKeywords'){
                $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).show();
            }
        }
        else {
            insertCaptcha({
                captcha : body.captcha,
                word : body.word,
                targetAction : body.targetAction,
                additional : body.additional
            });
        }
    }

    /*******/
    if (title == 'progressYandexRanksSearching') {
        if($(SELECTORS_OUR_YANDEX_KEYWORDS_CIRCLE_LOAD).length > 0){
            $(SELECTORS_OUR_YANDEX_KEYWORDS_CIRCLE_LOAD).data('percent', body.progress);
            updateCircleProgress(
                $(SELECTORS_OUR_YANDEX_KEYWORDS_CIRCLE_LOAD)
            );
        }
        else if($("#" + FUA_YT_YANDEX_KW.id.horizontal_block).length){
            $("#" + FUA_YT_YANDEX_KW.id.control_panel).hide();
            FUA_YT_PROGRESS_BAR.createProgressBar({
                progress_id : FUA_YT_YANDEX_KW.id.h_progress_bar,
                target_element : document.getElementById(FUA_YT_YANDEX_KW.id.horizontal_block)
            });

            FUA_YT_PROGRESS_BAR.updateProgressBar({
                progress_id : FUA_YT_YANDEX_KW.id.h_progress_bar,
                percentages : body.progress,
                finalCallback : function(){
                    $("#" + FUA_YT_YANDEX_KW.id.h_progress_bar).remove();
                    $("#" + FUA_YT_YANDEX_KW.id.control_panel).show();
                }
            })
        }
    }

    /*******/
    else if (title == 'insertYandexKeywordsRank') {
        $('#' + ID_OUR_TAGS_INFORM_BLOCK).html(null);

        edit.insertYandexVolumeLabels({
            ranks : body.ranks
        });

        if(body.captcha){
            insertCaptcha({
                captcha : body.captcha,
                word : body.word.toLowerCase(),
                targetAction : 'getRanks',
                additional : {
                    words: body.words,
                    wordIndex: body.wordIndex
                }
            });
        }
        else if(body.noAuth){
            noAuthInYandexDirect();
            $('#' + ID_OUR_VIDEO_YOUTUBE_PLACE_CIRCLE_LOAD).hide();

            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).parent().show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD)
                .closest('.fua-plugin-youtube-video-show-text-line')
                .css('margin-top', 11);
        }
        else if(body.noPassportLogin){
            noPassportLogin();
            $('#' + ID_OUR_VIDEO_YOUTUBE_PLACE_CIRCLE_LOAD).hide();

            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).parent().show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD)
                .closest('.fua-plugin-youtube-video-show-text-line')
                .css('margin-top', 11);
        }
        else{
            $('#' + ID_OUR_YANDEX_RANKS_CIRCLE_LOAD).hide();

            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD).parent().show();
            $('#' + ID_OUR_TAG_SHOW_RANKS_IN_YANDEX_KEYWORD)
                .closest('.fua-plugin-youtube-video-show-text-line')
                .css('margin-top', 11);
        }
    }

    /*******/
    if (title == 'insertHints') {
        let hints = [];

        for(let i in body.hints) hints.push([i, body.hints[i]])

        hints = hints.sort(function(f, s){
            if (f[1].length == s[1].length) return 0;
            if (f[1].length > s[1].length) return -1;
            else return 1;
        });

        let box = $('#fua_search_tag_hints_box');
        box.html(null);
        for(let i in hints){
            box.append(
                '<div class="'+ CLASS_OUR_SEARCH_HINT +'">' +
                '<span style="color: #666; margin-right: 10px; font-weight: bold;">'+
                hints[i][0] +
                '</span>' +
                '<span>('+
                hints[i][1].join(', ')
                +')</span>' +
                '</div>'
            );
        }



        if(
            !$('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON).hasClass('fua-plugin-youtube-disable-button')
        ) {
            $('#fua_search_tag_hints_box').show();

            $('#' + ID_OUR_SEARCH_TAGS_PANEL)
                .css('min-height', $('#fua_search_tag_hints_box').css('height'));

            $('.' + CLASS_OUR_SEARCH_HINT).click(function () {
                $('#' + ID_OUR_TAG_UPLOAD_INPUT).val($(this).find('span:first').html());
                edit.getHintsForSearchTag();
                $('#' + ID_OUR_TAG_UPLOAD_ADD_BUTTON).trigger('click');
            });
        }
    }


    if (
        title == 'insertYoutubeUploadTags'
        //&& $('div.video-settings-tag-chips-container').length > 0
    ) {

        if(body.yandexCaptcha){
            let yandexCaptcha = body.yandexCaptcha;
            delete body.yandexCaptcha;
            insertCaptcha({
                captcha : yandexCaptcha.captcha,
                word : yandexCaptcha.word,
                targetAction : 'getKeywords',
                additional : body
            });
        }
        else {
            $(FUA_YT_EDIT_TAGS_WORKER.selector.added_tags).each(function () {
                let tmpTag = $(this).find('span:first').html().toLowerCase();
                delete body.tags[tmpTag];
                delete body.hints[tmpTag];
                delete body.trends[tmpTag];
                delete body.keywords[tmpTag];
            });


            let groupedTags = {
                'Youtube': body.tags,
                'Hints': body.hints,
                'Trends': body.trends
            };

            groupedTags[C_TEXT_YANDEX_KEYWORDS_TITLE] = body.keywords;

            let aggregatedTags = [];


            for (let i in groupedTags) {
                for (let j in groupedTags[i]) {
                    let aggregatedNames = '';
                    let tmpObject = {};
                    let count = 0;
                    for (let k in groupedTags) {
                        if (k != i && groupedTags[k][j]) {
                            if (!aggregatedNames) {
                                aggregatedNames += i;
                                aggregatedNames += ' & ';

                                tmpObject[i] = groupedTags[i][j];
                                delete groupedTags[i][j];

                                count++;
                            }
                            else aggregatedNames += ' & ';

                            aggregatedNames += k;
                            tmpObject[k] = groupedTags[k][j];
                            delete groupedTags[k][j];

                            count++;
                        }
                    }
                    if (aggregatedNames) {
                        if (!aggregatedTags[count]) aggregatedTags[count] = {};
                        if (!aggregatedTags[count][aggregatedNames]) {
                            aggregatedTags[count][aggregatedNames] = {};
                        }
                        aggregatedTags[count][aggregatedNames][j] = tmpObject;
                    }
                }
            }

            delete groupedTags['Youtube'];

            let arrayUniqueTags = [];
            for (var i in body.tags) {
                arrayUniqueTags.push(i);
            }

            let sortedTags = {};
            let aggregatedSortedTags = {};

            for (let i in body.tags) {
                if (!sortedTags[i]) {
                    let tmpNameArr = i.split(' ');
                    let tmpNameArrLength = tmpNameArr.length;
                    let maxWord = '';
                    for (let j in tmpNameArr) {
                        if (maxWord.length <= tmpNameArr[j].length) {
                            maxWord = tmpNameArr[j];
                        }
                    }

                    let sovpadeniya = {};

                    for (let j in arrayUniqueTags) {
                        if (
                            arrayUniqueTags[j].search(edit.createRegexpEndingRuWord(maxWord)) != -1
                            && arrayUniqueTags[j].split(' ').length == tmpNameArrLength
                        ) {
                            let allGood = true;
                            for (let k in tmpNameArr) {
                                if (
                                    arrayUniqueTags[j].search(edit.createRegexpEndingRuWord(tmpNameArr[k])) == -1
                                ) {
                                    allGood = false;
                                }
                            }
                            if (allGood) {
                                sovpadeniya[arrayUniqueTags[j]] = body.tags[arrayUniqueTags[j]];
                                sortedTags[arrayUniqueTags[j]] = true;
                                delete arrayUniqueTags[j];
                            }
                        }
                    }

                    let maxRateTagQ = 0;
                    let maxRateTagN = '';
                    for (let j in sovpadeniya) {
                        if (maxRateTagQ <= sovpadeniya[j]) {
                            maxRateTagN = j;
                            maxRateTagQ = sovpadeniya[j];
                        }
                    }

                    aggregatedSortedTags[maxRateTagN] = sovpadeniya;
                }
            }


            let sortedTagsRanks = [];
            sortedTags = {};
            for (let i in aggregatedSortedTags) {
                let rank = 0;
                for (let j in aggregatedSortedTags[i]) {
                    rank = rank + aggregatedSortedTags[i][j]
                }

                if (rank > 0) {
                    if (!sortedTags[rank]) {
                        sortedTags[rank] = {};
                        sortedTagsRanks.push(rank);
                    }
                    sortedTags[rank][i] = aggregatedSortedTags[i];
                }
            }

            sortedTagsRanks = sortedTagsRanks.sort(function (f, s) {
                if (f == s) return 0;
                if (f > s) return -1;
                else return 1;
            });

            edit.insertYoutubeUploadTags({
                sortedTags: sortedTags,
                sortedTagsRanks: sortedTagsRanks,
                groupedTags: groupedTags,
                aggregatedTags: aggregatedTags
            });
        }
    }

    /*******/
    if (title == 'progressYoutubeUploadTags') {
        $('#' + ID_OUR_SEARCH_PROGRESS_PERCENTAGE)
            .html(body.progress + '%');

        $('#' + ID_OUR_SEARCH_PROGRESS_LINE_INNER).animate({
            marginLeft: (body.progress - 100) + '%'
        }, 200);
    }
});


setInterval(() => {
    if(window.location.href.match(edit.editUrlRegexp)) edit.addHtml();
}, 1500);