//page listener
chrome.runtime.onMessage.addListener(function(response, sender) {
    var title = response.title;
    if(response.body) var body = response.body;

    if(title == 'verifyYandexCaptcha' && body){
        //console.log(body);

        $.post(
            'https://direct.yandex.ru/registered/main.' +
            randomString(1, RANDOM_STRING_LETTERS_ONLY) +
            randomString(15, RANDOM_STRING_LETTERS_AND_NUMBERS) +
            '.pl',
            {
                captcha_code : body.captchaCode,
                captcha_id : body.captchaId,
                checkboxes : 1,
                cmd : 'wordstat',
                from_forecast : 1,
                suffix : 0,
                text : body.word
            },
            function(res){
                body.verify = true;

                if(
                    $($.parseHTML(res)).find('div.b-captcha-form__hint').length > 0
                ){
                    body.captcha = $($.parseHTML(res)).find('img.b-captcha-form__captcha').attr('src');
                    body.verify = false;
                }
                else {
                    if(body.targetAction == 'getRanks'){
                        body.additional.rank = parseYandexResponseForRank(res);
                    }
                    else if(body.targetAction == 'getKeywords'){
                        body.additional.keywords = parseYandexResponseForKeywords(res);
                        chrome.tabs.sendMessage(
                            sender.tab.id,
                            {
                                'title' : 'insertYoutubeUploadTags',
                                'body' : body.additional
                            }
                        );
                    }
                }

                chrome.tabs.sendMessage(
                    sender.tab.id,
                    {
                        'title' : 'verifyYandexCaptchaResponse',
                        'body' : body
                    }
                );
            }
        ).fail(function (info) {
            if(info.status === 0) {
                BG_NOTIFICATIONS.yandexError();
            }
        });
    }
});