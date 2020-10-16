function getYandexKeywordsRank(options){
    console.log('getYandexKeywordsRank');
    var words = options.words;
    var wordIndex = options.wordIndex;
    var callback = options.callback;
    var authCallback = options.authCallback;
    var noPassportLoginCallback = options.noPassportLoginCallback;
    var captchaCallback = options.captchaCallback;
    var progressCallback = options.progressCallback;

    var ranks = {};
    if(options.ranks) ranks = options.ranks;

    $.post(
        'https://direct.yandex.ru/registered/main.' +
        randomString(1, RANDOM_STRING_LETTERS_ONLY) +
        randomString(15, RANDOM_STRING_LETTERS_AND_NUMBERS) +
        '.pl',
        {
            checkboxes : 1,
            cmd : "wordstat",
            from_forecast : 1,
            geo : "",
            phrase_num_from_forecast : "",
            suffix : 0,
            text : words[wordIndex]
        },
        function(res){



            var rank = parseYandexResponseForRank(res);


            console.log('rank', rank);


            if(rank || rank === 0) {
                ranks[words[wordIndex].toLowerCase()] = rank;

                if(progressCallback) progressCallback(Math.ceil((wordIndex + 1) / words.length * 100));

                if (words[wordIndex + 1]) {
                    getYandexKeywordsRank({
                        words: words,
                        wordIndex: wordIndex + 1,
                        callback: callback,
                        authCallback: authCallback,
                        captchaCallback: captchaCallback,
                        progressCallback : progressCallback,
                        ranks: ranks,
                    });
                }
                else callback(ranks);
            }
            else if(
                $($.parseHTML(res)).find('div.b-captcha-form__hint').length > 0
            ){
                captchaCallback({
                    'ranks': ranks,
                    'captcha' : $($.parseHTML(res)).find('img.b-captcha-form__captcha').attr('src'),
                    'word' : words[wordIndex],
                    'words' : words,
                    'wordIndex' : wordIndex
                });
            }
            else if(
                $($.parseHTML(res)).find('input#passwd').length > 0
                || $($.parseHTML(res)).find('.passport-Domik').length > 0
            ){
                authCallback();
            }
            else if(
                $($.parseHTML(res)).find('input.control__input_name_password').length > 0
                || $($.parseHTML(res)).find('input#passp-field-passwd').length > 0
                || $($.parseHTML(res)).find('input#passp-field-login').length > 0
            ){
                noPassportLoginCallback();
            }
            else if($($.parseHTML(res)).find('.p-pdd-error__message').length > 0){
                BG_NOTIFICATIONS.yandexLoginError();
                callback(ranks);
            }
            else{
                callback(ranks);
            }
        }
    ).fail(function (info) {
        console.log('info', info);
        if(info.status === 0) {
            BG_NOTIFICATIONS.yandexError();
            callback(ranks);
        }
    });
}


function getYandexKeywords(options){
    var word = options.word;
    var callback = options.callback;
    var authCallback = options.authCallback;
    var noPassportLoginCallback = options.noPassportLoginCallback;
    var captchaCallback = options.captchaCallback;

    $.post(
        'https://direct.yandex.ru/registered/main.' +
        randomString(1, RANDOM_STRING_LETTERS_ONLY) +
        randomString(15, RANDOM_STRING_LETTERS_AND_NUMBERS) +
        '.pl',
        {
            checkboxes : 1,
            cmd : "wordstat",
            from_forecast : 1,
            geo : "",
            phrase_num_from_forecast : "",
            suffix : 0,
            text : word
        },
        function(res){
            var keywords = parseYandexResponseForKeywords(res);
            var rank = parseYandexResponseForRank(res);

            if(keywords) {
                callback(keywords);
            }
            else if(rank){
                keywords = {};
                keywords[word.toLowerCase()] = {};
                keywords[word.toLowerCase()][C_TEXT_YENDEX_KEYWORD_VOLUME] = rank;
                callback(keywords);
            }
            else if(
                $($.parseHTML(res)).find('div.b-captcha-form__hint').length > 0
            ){
                captchaCallback({
                    'captcha' : $($.parseHTML(res)).find('img.b-captcha-form__captcha').attr('src'),
                    'word' : word
                });
            }
            else if(
                $($.parseHTML(res)).find('input#passwd').length > 0
                || $($.parseHTML(res)).find('.passport-Domik').length > 0
            ){
                authCallback();
            }
            else if(
                $($.parseHTML(res)).find('input.control__input_name_password').length > 0
                || $($.parseHTML(res)).find('input#passp-field-passwd').length > 0
                || $($.parseHTML(res)).find('input#passp-field-login').length > 0
            ){
                noPassportLoginCallback();
            }
            else if($($.parseHTML(res)).find('.p-pdd-error__message').length > 0){
                BG_NOTIFICATIONS.yandexLoginError();
                callback(ranks);
            }
            else{
                callback({});
            }
        }
    ).fail(function (info) {
        if(info.status === 0) {
            BG_NOTIFICATIONS.yandexError();
            callback({});
        }
    });
}



function parseYandexResponseForRank(res){
    var html = $($.parseHTML(res)).find('table[width="100%"]').parent().html();
    if(!html) return false;
    var tmp = html.match('&nbsp;(&#151;|—)&nbsp;([0-9]*)&nbsp;показ');
    return  tmp[2];
}

function parseYandexResponseForKeywords(res){
    var keywords = {};
    var block = $($.parseHTML(res)).find('table.campaign');
    if(block.length < 1) return false;
    var leftTable = block.find('table#left-table');
    var rightTable = block.find('table#right-table');
    if(leftTable.length < 1 && rightTable.length < 1) return false;

    function getKeywords(table){
        table.find('tr.tlist').each(function(){
            var key = $(this).find('td:nth-child(2) a').html().trim();
            if(key) keywords[key.replace(new RegExp('[\+]', 'g'), '').toLowerCase()] = {};
            keywords[key.replace(new RegExp('[\+]', 'g'), '').toLowerCase()][C_TEXT_YENDEX_KEYWORD_VOLUME] = $(this).find('td:last').html().trim();
        });
    }

    getKeywords(leftTable);
    getKeywords(rightTable);
    return keywords;
}