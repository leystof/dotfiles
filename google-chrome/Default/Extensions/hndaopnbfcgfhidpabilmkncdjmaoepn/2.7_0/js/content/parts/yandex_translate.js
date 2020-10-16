const FUA_YT_TR = (function(){

    function Fua_youtube_translation(){
        this.translation_languages = false;
        this.traslations = false;
        this.api_key = false;
        //this.standard_api_key = 'trnsl.1.1.20160706T131328Z.5ed289134a543283.4ca85b72c1835459212e3eea974888de5f66693b';
        this.standard_api_key = '';
        this.prefix = 'fua_youtube_';
        this.base64Json = false;
        this.selectedLanguages = false;

        this.id = {
            'select' : 'fua_meta_auto_translate_select_id',
            'info' : 'fua_meta_auto_translate_info_id',
            'input_key_div' : 'fua_meta_auto_translate_input_key_div_id',
            'additional_block' : this.prefix + 'meta_auto_translate_additional_block_id',
            'progress_bar' : this.prefix + 'meta_auto_translate_progress_bar_id',
            'input_key' : 'fua_meta_auto_translate_input_key_id',
            'new_tr_btn' : 'fua_meta_auto_translate_new_translate_id',
            'save_btn' : 'fua_meta_auto_translate_save_btn_id',
            'start_button' : 'fua_meta_auto_translate_button_id'
        };
        this.class = {
            'success_info_line' : 'fua_youtube_success_info_line',
            'finish_info_line' : 'fua_youtube_finish_info_line',
            'error_info_line' : 'fua_youtube_error_info_line',
            'disable' : 'fua-plugin-youtube-disable-button'
        }

        //this.port = chrome.runtime.connect({name: "yandexTranslation"});
    }


    Fua_youtube_translation.prototype.addHtmlTranslateButton = function(time){
        if(!$('#' + FUA_YT_TR.id.start_button).length) FUA_YT_TR.addHtmlButton();
        //console.log("rimlyaninTest-1", $('.translation-editor-original-language').length);
        //console.log("rimlyaninTest-2", $('#' + FUA_YT_TR.id.start_button).length);

        if(!time) time = 0;
        if(time < 30000){
            setTimeout(function(){
                FUA_YT_TR.addHtmlTranslateButton(time + 300);
            }, 300)
        }
    };


    Fua_youtube_translation.prototype.updateProgressBar = function(options){
        FUA_YT_PROGRESS_BAR.createProgressBar({
            progress_id : FUA_YT_TR.id.progress_bar,
            target_element : document.getElementById(FUA_YT_TR.id.additional_block)
        });

        FUA_YT_PROGRESS_BAR.updateProgressBar({
            progress_id : FUA_YT_TR.id.progress_bar,
            percentages : options.percentages
        });
    };


    Fua_youtube_translation.prototype.addLanguageSelectOptions = function(options){
        var langs = this.translation_languages;
        var select_id = this.id.select;

        if(options) {
            if(options.select_id) select_id = options.select_id;
        }

        //console.log("langs", langs);

        if(langs){
            var select = document.getElementById(select_id);
            while (select.firstChild) select.removeChild(select.firstChild);


            if(FUA_YT_TR.base64Json){
                var allowedLangs = FUA_YT_TR.base64Json.allowed_language;
                if(allowedLangs && allowedLangs.length > 50) {
                    var ytLangs = {};
                    for (var i in allowedLangs) {
                        ytLangs[allowedLangs[i].code] = true;
                    }

                    var newLangs = {};
                    for (var i in langs) {
                        if(ytLangs[FUA_YT_TR.correct2LanguageSymbol(i)]){
                            newLangs[i] = langs[i]
                        }
                    }

                    langs = newLangs;
                }
            }


            for(var i in langs){
                if(!i.match('ht|udm|ceb|mhr|mrj')) {
                    var option = document.createElement('option');
                    option.setAttribute('value', i);
                    if(
                        FUA_YT_TR.selectedLanguages
                        && FUA_YT_TR.selectedLanguages.length
                        && FUA_YT_TR.selectedLanguages.indexOf(i) != -1
                    ){
                        option.setAttribute('selected', 'selected');
                    }
                    option.textContent = langs[i];
                    select.appendChild(option);
                }
            }
        }
        else if(this.api_key) this.addTranslateKeyFromContent(this.api_key);
        else this.invalidApiKey(chrome.i18n.getMessage("you_need_api_key"));
    };


    Fua_youtube_translation.prototype.translateMetaData = function(options){
        var translateText = options.translateText;
        if(!options.index) options.index = 0;
        if(!options.translated) options.translated = {};
        if(translateText[options.index]){
            FUA_YT_TR.disableButton(FUA_YT_TR.id.save_btn);
            var data = {
                text : translateText[options.index].text,
                targetLang : translateText[options.index].targetLang,
                format : 'html',
                successCallback : function(translatedText, lang){
                    var targetLang = FUA_YT_TR.correct2LanguageSymbol(translateText[options.index].targetLang);
                    if(!options.translated[targetLang]) options.translated[targetLang] = {};
                    options.translated[targetLang][translateText[options.index].part] = translatedText;
                    options.translated[targetLang].originalLang = lang.substr(0, 2);


                    //console.log('targetLang', targetLang);

                    FUA_YT_TR.addToInfo({
                        'text' :
                            translateText[options.index].part +
                            ' '+ chrome.i18n.getMessage("successfully_translated_at") +' ' +
                            FUA_YT_TR.translation_languages[translateText[options.index].targetLang],
                        'class' : FUA_YT_TR.class.success_info_line
                    });

                    FUA_YT_TR.updateProgressBar({
                        percentages : (options.index + 1) / translateText.length * 100
                    });

                    options.index++;
                    FUA_YT_TR.translateMetaData(options);
                },
                failCallback : function(info){
                    if(info.undefined_error){
                        var targetLang = FUA_YT_TR.correct2LanguageSymbol(translateText[options.index].targetLang);
                        FUA_YT_TR.addToInfo({
                            'text' : chrome.i18n.getMessage("while_translating") +' "' + translateText[options.index].part +
                                '" '+ chrome.i18n.getMessage("word_on_to") +' ' + FUA_YT_TR.translation_languages[targetLang] +
                                ' '+ chrome.i18n.getMessage("unknown_error_occurred").toLowerCase() +'!',
                            'class' : FUA_YT_TR.class.error_info_line
                        });

                    }
                    else if(info.responseJSON){
                        var json = info.responseJSON;
                        if(json.code == 401 || json.code == 402 || json.code == 404){
                            FUA_YT_TR.invalidApiKey(json.code + ' - ' + json.message);
                            return false;
                        }
                        else{
                            var targetLang = FUA_YT_TR.correct2LanguageSymbol(translateText[options.index].targetLang);
                            FUA_YT_TR.addToInfo({
                                'text' :
                                    chrome.i18n.getMessage("while_translating") + ' "' + translateText[options.index].part +
                                    '" '+ chrome.i18n.getMessage("word_on_to") +' ' + FUA_YT_TR.translation_languages[targetLang] +
                                    ' '+ chrome.i18n.getMessage("error_occurred").toLowerCase() +': ' + json.code + ' - ' + json.message,
                                'class' : FUA_YT_TR.class.error_info_line
                            });
                        }
                    }
                    else if((info.status || info.status===0) && info.statusText){
                        var targetLang = FUA_YT_TR.correct2LanguageSymbol(translateText[options.index].targetLang);
                        FUA_YT_TR.addToInfo({
                            'text' :
                                chrome.i18n.getMessage("while_translating") + ' "' + translateText[options.index].part +
                                '" '+ chrome.i18n.getMessage("word_on_to") +' ' + FUA_YT_TR.translation_languages[targetLang] +
                                ' '+ chrome.i18n.getMessage("error_occurred").toLowerCase() +': ' + info.status + ' - ' + info.statusText,
                            'class' : FUA_YT_TR.class.error_info_line
                        });
                    }


                    FUA_YT_TR.updateProgressBar({
                        percentages : (options.index + 1) / translateText.length * 100
                    });

                    options.index++;
                    FUA_YT_TR.translateMetaData(options);
                }
            };

            if(options.originalLang) data.originalLang = options.originalLang;
            this.getYandexTranslate(data);
        }
        else {
            FUA_YT_TR.traslations = options.translated;
            console.log('options.translated', options.translated);

            var targetLanguages = [];
            var nLanguages = [];
            for(var i in translateText){
                var la = FUA_YT_TR.correct2LanguageSymbol(translateText[i].targetLang);
                if(targetLanguages.indexOf(la) == -1) targetLanguages.push(la);
                var tr = FUA_YT_TR.traslations[la];



                if(!tr || !tr.title || !tr.description){
                    if(nLanguages.indexOf(la) == -1) nLanguages.push(la);
                    if(tr) delete FUA_YT_TR.traslations[la];
                }
                else if(
                    (FUA_YT_TR.traslations[la].title && FUA_YT_TR.traslations[la].title.length > MAX_TITLE_LENGTH)
                    || (FUA_YT_TR.traslations[la].description && FUA_YT_TR.traslations[la].description.length > MAX_DESCRIPTION_LENGTH)
                ){

                    var titleError = "";
                    if(FUA_YT_TR.traslations[la].title && FUA_YT_TR.traslations[la].title.length > MAX_TITLE_LENGTH){
                        titleError =
                            chrome.i18n.getMessage("length_of_title_more_than")
                            + " "  + MAX_TITLE_LENGTH +
                            " ("+ FUA_YT_TR.traslations[la].title.length +") "
                            + chrome.i18n.getMessage("word_characters")
                            + ", " + chrome.i18n.getMessage("it_will_trim_end")
                            + "; "
                        FUA_YT_TR.traslations[la].title = FUA_YT_TR.traslations[la].title.slice(0, MAX_TITLE_LENGTH);
                    }

                    var descriptionError = "";
                    if(FUA_YT_TR.traslations[la].description && FUA_YT_TR.traslations[la].description.length > MAX_DESCRIPTION_LENGTH){
                        descriptionError =
                            chrome.i18n.getMessage("length_of_description_more_than")
                            + " " + MAX_DESCRIPTION_LENGTH
                            + " ("+ FUA_YT_TR.traslations[la].description.length +") "
                            + ", " + chrome.i18n.getMessage("it_will_trim_end")
                            + chrome.i18n.getMessage("word_characters") +". "
                        FUA_YT_TR.traslations[la].description = FUA_YT_TR.traslations[la].description.slice(0, MAX_DESCRIPTION_LENGTH);
                    }


                    FUA_YT_TR.addToInfo({
                        'text' : chrome.i18n.getMessage("translation_to") + " " +
                        FUA_YT_TR.translation_languages[la] + ": " + titleError + descriptionError,
                        'class' : FUA_YT_TR.class.error_info_line
                    });
                    /*if(nLanguages.indexOf(la) == -1) nLanguages.push(la);
                    if(tr) delete FUA_YT_TR.traslations[la];*/
                }
            }

            var tmpString =
                ' '+ chrome.i18n.getMessage("translated_to_all_planned_languages") +' - '
                + targetLanguages.length;

            if(nLanguages.length){
                tmpString =
                    ' '+ chrome.i18n.getMessage("translated_to") +' ' + (targetLanguages.length - nLanguages.length)
                    + ' '+ chrome.i18n.getMessage("word_from") +' ' + targetLanguages.length + ' '+ chrome.i18n.getMessage("planned_languages") +'.';
            }

            FUA_YT_TR.addToInfo({
                'text' :  chrome.i18n.getMessage("translating_completed") + '.' + tmpString,
                'class' : FUA_YT_TR.class.finish_info_line
            });



            chrome.runtime.sendMessage({
                'title': 'translateNotification',
                'body': {
                    'title': chrome.i18n.getMessage("translating_completed"),
                    'text' : chrome.i18n.getMessage("translating_completed") + '.' + tmpString
                }
            });


            if(targetLanguages.length - nLanguages.length > 0) {
                FUA_YT_TR.enableButton(FUA_YT_TR.id.save_btn);
            }
            FUA_YT_TR.enableButton(FUA_YT_TR.id.new_tr_btn);
        }
    };




    Fua_youtube_translation.prototype.addToInfo = function(options){
        var info = document.getElementById(FUA_YT_TR.id.info);
        if(info){
            var info_line = document.createElement('div');
            if(options.class) info_line.classList.add(options.class);
            info_line.textContent = options.text;
            info.appendChild(info_line);
        }
        info.scrollTop = info.scrollHeight;
    };



    Fua_youtube_translation.prototype.getYandexTranslate = function(options){
        var lang = options.targetLang;
        //if(lang == 'af') lang = 'gg';
        if(options.originalLang) lang = options.originalLang + '-' + lang;
        var format = 'plain';
        if(options.format) format = options.format;

        const port = chrome.runtime.connect({name: "getYandexTranslate"});

        port.onMessage.addListener(data => {
            if(data.res){
                let res = data.res;
                if(
                    res.text
                    && res.text[0]
                    && res.lang
                    && options.successCallback
                ) {
                    options.successCallback(res.text[0], res.lang);
                }
                else if(options.failCallback) options.failCallback({ 'undefined_error' : true });
                console.log('successCallback', res);
            }
            else if(data.info) {
                let info = data.info;
                console.log('translateFailInfo', info);
                if(options.failCallback) options.failCallback(info);

                if(info.status === 0) {
                    chrome.runtime.sendMessage({'title': 'blockedYandexError'});
                }
            }
        });

        port.postMessage({
            api_key: this.api_key,
            text: options.text,
            lang: lang,
            format: format
        });

        /*$.post(
            'https://translate.yandex.net/api/v1.5/tr.json/translate?key='
            + this.api_key,
            {
                text : options.text,
                lang : lang,
                format : format
            },
            function(res){
                if(
                    res.text
                    && res.text[0]
                    && res.lang
                    && options.successCallback
                ) {
                    options.successCallback(res.text[0], res.lang);
                }
                else if(options.failCallback) options.failCallback({ 'undefined_error' : true });
                console.log('successCallback', res);
            }
        ).fail(function(info){
            console.log('translateFailInfo', info);
            if(options.failCallback) options.failCallback(info);

            if(info.status === 0) {
                chrome.runtime.sendMessage({'title': 'blockedYandexError'});
            }
        });*/
    };


    Fua_youtube_translation.prototype.addTranslateKeyFromContent = function(apiKey){
        if(!apiKey || !apiKey.trim()) return false;
        apiKey = apiKey.trim();


        const port = chrome.runtime.connect({name: "addTranslateKeyFromContent"});

        port.onMessage.addListener(data => {
            if(data.res){
                let res = data.res;
                if(res && res.langs){
                    if(apiKey != FUA_YT_TR.standard_api_key) {
                        FUA_YT_TR.addToInfo({
                            'text' : chrome.i18n.getMessage("word_key") + ' (' + apiKey + ') '+ chrome.i18n.getMessage("successfully_saved") +'!',
                            'class' : FUA_YT_TR.class.success_info_line
                        });

                        chrome.runtime.sendMessage({
                            'title': 'saveApiKey',
                            'body': {'apiKey': apiKey}
                        });
                    }

                    chrome.runtime.sendMessage({
                        'title': 'saveTranslateLangs',
                        'body': {'langs' : res.langs}
                    });

                    FUA_YT_TR.api_key = apiKey;
                    FUA_YT_TR.translation_languages = res.langs;
                    FUA_YT_TR.addLanguageSelectOptions();

                    document.getElementById(FUA_YT_TR.id.input_key_div)
                        .classList.add(FUA_MW.class.hidden);
                }
            }
            else if(data.info){
                let info = data.info;
                if(info.status === 0) {
                    chrome.runtime.sendMessage({'title': 'blockedYandexError'});
                }

                var json = info.responseJSON;
                if(json && (json.code == 401 || json.code == 402)){
                    FUA_YT_TR.invalidApiKey(json.code + ' - ' + json.message);
                    chrome.runtime.sendMessage({
                        'title': 'saveApiKey',
                        'body': {'apiKey': false}
                    });
                    return false;
                }
            }
        });

        port.postMessage({
            apiKey: apiKey
        });


        /*$.post(
            'https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=' +
            apiKey + '&ui=ru',
            '',
            function(res){
                if(res && res.langs){

                    if(apiKey != FUA_YT_TR.standard_api_key) {
                        FUA_YT_TR.addToInfo({
                            'text' : chrome.i18n.getMessage("word_key") + ' (' + apiKey + ') '+ chrome.i18n.getMessage("successfully_saved") +'!',
                            'class' : FUA_YT_TR.class.success_info_line
                        });

                        chrome.runtime.sendMessage({
                            'title': 'saveApiKey',
                            'body': {'apiKey': apiKey}
                        });
                    }

                    chrome.runtime.sendMessage({
                        'title': 'saveTranslateLangs',
                        'body': {'langs' : res.langs}
                    });

                    FUA_YT_TR.api_key = apiKey;
                    FUA_YT_TR.translation_languages = res.langs;
                    FUA_YT_TR.addLanguageSelectOptions();

                    document.getElementById(FUA_YT_TR.id.input_key_div)
                        .classList.add(FUA_MW.class.hidden);
                }
            }
        ).fail(function(info){
            if(info.status === 0) {
                chrome.runtime.sendMessage({'title': 'blockedYandexError'});
            }

            var json = info.responseJSON;
            if(json && (json.code == 401 || json.code == 402)){
                FUA_YT_TR.invalidApiKey(json.code + ' - ' + json.message);
                chrome.runtime.sendMessage({
                    'title': 'saveApiKey',
                    'body': {'apiKey': false}
                });
                return false;
            }
        });*/
    };


    Fua_youtube_translation.prototype.invalidApiKey = function (text){
        var div_input = document.getElementById(FUA_YT_TR.id.input_key_div);
        if(div_input) {
            div_input.classList.remove(FUA_MW.class.hidden);
            FUA_YT_TR.enableButton(FUA_YT_TR.id.new_tr_btn);
            FUA_YT_TR.addToInfo({
                'text': text,
                'class': FUA_YT_TR.class.error_info_line
            });
        }
    };


    Fua_youtube_translation.prototype.enableButton = function (id){
        document.getElementById(id).classList.remove(FUA_YT_TR.class.disable);
    };

    Fua_youtube_translation.prototype.disableButton = function (id){
        document.getElementById(id).classList.add(FUA_YT_TR.class.disable);
    };

    Fua_youtube_translation.prototype.isDisableButton = function (id){
        return document.getElementById(id).classList.contains(FUA_YT_TR.class.disable);
    };


    Fua_youtube_translation.prototype.saveTranslations = function (){
        var translated = FUA_YT_TR.traslations;
        var translation = [];
        var originalLang = false;
        for (var i in translated) {
            if (translated[i].originalLang) {
                originalLang = translated[i].originalLang;
            }
            if (originalLang != i) {
                //console.log(i, translated[i].title.length);
                translation.push({
                    'language': i,
                    'title': translated[i].title,
                    'description': translated[i].description
                });
            }
            else console.log(i);
        }
        if (translation.length && !FUA_YT_TR.isDisableButton(FUA_YT_TR.id.save_btn)) {
            FUA_YT_TR.disableButton(FUA_YT_TR.id.save_btn);
            FUA_YT_TR.disableButton(FUA_YT_TR.id.new_tr_btn);
            FUA_YT_TR.addToInfo({
                'text' : chrome.i18n.getMessage("translations_are_saving_wait") + '...',
                'class' : FUA_YT_TR.class.success_info_line
            });
            /*var htmlString = document.documentElement.textContent;
            var base64 = htmlString.match('data-init-from-base64-json="([^"]*)');
            console.log('base64', base64);*/


            var base64 = document.getElementsByClassName('translation-editor-container');
            if(base64.length) base64 = base64[0].getAttribute("data-init-from-base64-json");
            else base64 = false;



            if (base64) {
                var base64Json = JSON.parse(b64DecodeUnicode(base64));
                //console.log('base64Json', base64Json);
                if (base64Json.translation && base64Json.translation.length) {
                    for (var i in base64Json.translation) {
                        var tmp = base64Json.translation[i];
                        if(tmp.source) delete tmp.source;
                        var tmpLang = base64Json.translation[i].language;
                        if (tmpLang != originalLang && !translated[tmpLang]) {
                            translation.push(tmp);
                        }
                    }
                }
            }


            if(
                !FUA_YT_GV.video_id
                && window.location.href.match("^https://www.youtube.com/upload")
            ) {
                var newUrl  = $(".watch-page-link a").attr("href");
                if(newUrl){
                    var newVideoId = newUrl.match("https://youtu.be/(.*)$");
                    if(newVideoId)  FUA_YT_GV.video_id = newVideoId[1];
                }

                if(!FUA_YT_GV.video_id) {
                    FUA_YT_TR.addToInfo({
                        'text': chrome.i18n.getMessage("wait_until_the_link_to_the_video_appears") + '!',
                        'class': FUA_YT_TR.class.error_info_line
                    });
                    FUA_YT_TR.enableButton(FUA_YT_TR.id.save_btn);
                    FUA_YT_TR.enableButton(FUA_YT_TR.id.new_tr_btn);
                    return false
                }
            }

            var data =
                'metadata_language=' + originalLang +
                '&translations=' + encodeURIComponent(JSON.stringify(translation)) +
                '&modified_fields=translations,metadata_language' +
                '&video_id=' + FUA_YT_GV.video_id +
                '&session_token=' + FUA_YT_GV.xsrf_token;

            $.post(
                'https://www.youtube.com/metadata_ajax?action_edit_video=1',
                data,
                function(res){
                    console.log('testResponse', res);

                    if(res && res.metadata_errors && res.metadata_errors.length){
                        for(var i in res.metadata_errors){
                            if(res.metadata_errors[i].message){
                                var error = res.metadata_errors[i].message.error || res.metadata_errors[i].message;
                                var field = res.metadata_errors[i].field || '';
                                FUA_YT_TR.addToInfo({
                                    'text' : chrome.i18n.getMessage("saving_error") + ': ' + error + ' ('+ field +')',
                                    'class' : FUA_YT_TR.class.error_info_line
                                });
                            }
                        }
                        FUA_YT_TR.enableButton(FUA_YT_TR.id.save_btn);
                        FUA_YT_TR.enableButton(FUA_YT_TR.id.new_tr_btn);
                    }
                    else if(res && res.metadata_errors && !res.metadata_errors.length){
                        history.pushState(null, null, window.location.href + '#fua_auto_translate');
                        location.reload();
                    }
                    else{
                        FUA_YT_TR.enableButton(FUA_YT_TR.id.save_btn);
                        FUA_YT_TR.enableButton(FUA_YT_TR.id.new_tr_btn);
                        FUA_YT_TR.addToInfo({
                            'text' : chrome.i18n.getMessage("unknown_saving_error") + '!',
                            'class' : FUA_YT_TR.class.error_info_line
                        });
                    }
                }
            );

        }
    };


    Fua_youtube_translation.prototype.deleteAllTranslations = function () {
        var translation = [];
        var originalLang = false;

        if(
            !FUA_YT_GV.video_id
            && window.location.href.match("^https://www.youtube.com/upload")
        ) {
            var newUrl  = $(".watch-page-link a").attr("href");
            if(newUrl){
                var newVideoId = newUrl.match("https://youtu.be/(.*)$");
                if(newVideoId)  FUA_YT_GV.video_id = newVideoId[1];
            }

            if(!FUA_YT_GV.video_id) {
                FUA_YT_TR.addToInfo({
                    'text': chrome.i18n.getMessage("wait_until_the_link_to_the_video_appears") + '!',
                    'class': FUA_YT_TR.class.error_info_line
                });
                FUA_YT_TR.enableButton(FUA_YT_TR.id.save_btn);
                FUA_YT_TR.enableButton(FUA_YT_TR.id.new_tr_btn);
                return false
            }
        }

        var base64 = document.getElementsByClassName('translation-editor-container');
        if(base64.length) base64 = base64[0].getAttribute("data-init-from-base64-json");
        else base64 = false;

        if (base64) {
            var base64Json = JSON.parse(b64DecodeUnicode(base64));
            originalLang = base64Json.original.language;
        }

        var data =
            'metadata_language=' + originalLang +
            '&translations=' + encodeURIComponent(JSON.stringify(translation)) +
            '&modified_fields=translations,metadata_language' +
            '&video_id=' + FUA_YT_GV.video_id +
            '&session_token=' + FUA_YT_GV.xsrf_token;

        $.post(
            'https://www.youtube.com/metadata_ajax?action_edit_video=1',
            data,
            function(res){
                console.log('testResponse', res);
               if(res && res.metadata_errors && !res.metadata_errors.length){
                    history.pushState(null, null, window.location.href + '#fua_auto_translate');
                    location.reload();
                }
            }
        );
    };


    Fua_youtube_translation.prototype.correct2LanguageSymbol = function (lang){
        if(lang == 'he') lang = 'iw';
        return lang;
    };



    Fua_youtube_translation.prototype.addHtmlButton = function(){

        $('.translation-editor-original-language').first().after(
            '<button id="fua_meta_delete_translate_button_id" style="background-color: red; color: white;" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                '<span class="yt-uix-button-content">Delete All Translations</span>' +
            '</button>'
        );

        $('.translation-editor-original-language').first().after(
            '<button id="fua_meta_auto_translate_button_id" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                '<span class="yt-uix-button-content">Clever AutoTranslate</span>' +
            '</button>'
        );



        $('#fua_meta_delete_translate_button_id').mouseup(function(){
            FUA_YT_TR.deleteAllTranslations();
        });


        $('#fua_meta_auto_translate_button_id').mouseup(function(){


            //console.log("translateClick");
            FUA_MW.createModalWindow({
                target : 'meta-translate',
                text_title : chrome.i18n.getMessage("auto_translate_of_title_and_description"),
                callback : function(){
                    var content = document.getElementById(FUA_MW.id.content);


                    var base64 = document.getElementsByClassName('translation-editor-container');
                    if(base64.length) base64 = base64[0].getAttribute("data-init-from-base64-json");
                    else base64 = false;

                    if (base64) {
                        try {
                            FUA_YT_TR.base64Json = JSON.parse(b64DecodeUnicode(base64));
                        }
                        catch (e){
                            console.log("base64error");
                        }
                        //console.log("base64Json", base64Json);
                    }


                    var first_div = document.createElement('div');
                    var info = document.createElement('div');
                    info.setAttribute('id', FUA_YT_TR.id.info);
                    var select = document.createElement('select');
                    select.setAttribute('id', FUA_YT_TR.id.select);
                    select.setAttribute('multiple', 'multiple');


                    var input_key_div = document.createElement('div');
                    input_key_div.setAttribute('id', FUA_YT_TR.id.input_key_div);
                    var input_key = document.createElement('input');
                    input_key.setAttribute('id', FUA_YT_TR.id.input_key);
                    input_key.setAttribute('placeholder', chrome.i18n.getMessage("insert_your") + ' API KEY');
                    input_key.addEventListener('keypress', function(e) {
                        if(e.which == 13) {
                            FUA_YT_TR.addTranslateKeyFromContent($(this).val().trim())
                        }
                    });
                    input_key.addEventListener('input', function(e) {
                        FUA_YT_TR.addTranslateKeyFromContent($(this).val().trim())
                    });


                    var input_key_description = document.createElement('div');
                    var tmpElement = document.createElement('span');
                    tmpElement.textContent = chrome.i18n.getMessage("insert_yandex_api_key_description") + ': ';
                    input_key_description.appendChild(tmpElement);
                    tmpElement = document.createElement('a');
                    tmpElement.textContent = 'https://tech.yandex.ru/keys/get/?service=trnsl';
                    tmpElement.setAttribute('href', 'https://tech.yandex.ru/keys/get/?service=trnsl');
                    tmpElement.setAttribute('target', '_blank');
                    input_key_description.appendChild(tmpElement);
                    input_key_div.classList.add(FUA_MW.class.hidden);

                    var additional_block = document.createElement("div");
                    additional_block.setAttribute("id", FUA_YT_TR.id.additional_block);
                    additional_block.style.clear = "both";


                    var button_div = document.createElement('div');
                    button_div.style.clear = 'both';
                    button_div.style.paddingTop = '10px';


                    var yandex_link = document.createElement('a');
                    yandex_link.textContent = chrome.i18n.getMessage("translated_by_yandex_translator");
                    yandex_link.setAttribute('href', 'http://translate.yandex.ru/');
                    yandex_link.setAttribute('target', '_blank');


                    var save_button = document.createElement('div');
                    save_button.setAttribute('id', FUA_YT_TR.id.save_btn);
                    save_button.textContent = chrome.i18n.getMessage("word_save");
                    save_button.addEventListener('click', function(){
                        FUA_YT_TR.saveTranslations();
                    });
                    save_button.classList.add(FUA_YT_TR.class.disable);

                    var new_translate_button = document.createElement('div');
                    new_translate_button
                        .setAttribute('id', FUA_YT_TR.id.new_tr_btn);
                    new_translate_button.textContent = chrome.i18n.getMessage("word_translate");


                    new_translate_button.addEventListener('click', function(){
                        var langText = $('.translation-editor-original-language span').text();
                        var originalLang = false;
                        $('.yt-uix-languagepicker-language-list > li').each(function(){
                            if($(this).find('.yt-uix-button-menu-item').html() == langText){
                                originalLang = FUA_YT_TR.correct2LanguageSymbol($(this).attr('data-value'));
                            }
                        });

                        var translateText = [];
                        var targetLangs = $('#fua_meta_auto_translate_select_id').val();
                        if(targetLangs && targetLangs.length){

                            var textTitle = $('.translation-editor-original-title').val();
                            var descriptionText = $('.translation-editor-original-description').val();

                            //console.log("targetLangs", targetLangs);

                            chrome.runtime.sendMessage({
                                'title': 'saveSelectedLanguages',
                                'body': {'langs': targetLangs}
                            });

                            if(textTitle.trim() && descriptionText.trim()) {
                                for (var i in targetLangs) {
                                    translateText.push({
                                        part : 'title',
                                        targetLang : targetLangs[i],
                                        text : textTitle
                                    });

                                    translateText.push({
                                        part : 'description',
                                        targetLang : targetLangs[i],
                                        text : descriptionText
                                    });
                                }
                            }
                        }

                        if(translateText.length) {
                            if ($(this).hasClass(FUA_YT_TR.class.disable)) return false;
                            $(this).addClass(FUA_YT_TR.class.disable);
                            var data = { translateText: translateText };
                            if (originalLang) data.originalLang = originalLang;
                            FUA_YT_TR.translateMetaData(data);
                        }
                    });


                    first_div.appendChild(info);
                    first_div.appendChild(select);
                    content.appendChild(first_div);

                    input_key_div.appendChild(input_key);
                    input_key_div.appendChild(input_key_description);
                    content.appendChild(input_key_div);

                    content.appendChild(additional_block);

                    button_div.appendChild(yandex_link);
                    button_div.appendChild(new_translate_button);
                    button_div.appendChild(save_button);
                    content.appendChild(button_div);

                    /*FUA_YT_TR.translation_languages = body.langs;
                    FUA_YT_TR.api_key =
                        body.yandexTranslateKey || FUA_YT_TR.standard_api_key;*/

                    document.getElementById(FUA_YT_TR.id.input_key)
                        .setAttribute('value', FUA_YT_TR.api_key);

                    FUA_YT_TR.addLanguageSelectOptions();
                }
            });
        });
    };



    // create instance
    return new Fua_youtube_translation();
})();


/*chrome.runtime.sendMessage({
    'title': 'test',
    'body': {}
}, response => {
    console.log('response', response);
});*/

/*var port = chrome.runtime.connect({name: "knockknock"});
console.log('port', port);
port.onMessage.addListener(function(msg) {
    console.log('msg', msg);
});
port.postMessage({joke: "Knock knock"});*/

/*FUA_YT_TR.port.onMessage.addListener(data => {
    console.log('msg', msg);
});*/