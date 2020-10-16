var BG_NOTIFICATIONS = (function(){
    function Bg_notifications(){
        this.id = {
            'yaErr' : 'fua_youtube_yandex_error',
            'yaLoginErr' : 'fua_youtube_login_yandex_error'
        };


        chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex){
            if(BG_NOTIFICATIONS.id.yaErr == notificationId){
                if(buttonIndex === 0) {
                    chrome.tabs.create({url : 'https://chrome.google.com/webstore/detail/tunnelbear-vpn/omdakjcmkglenbhjadbccaookpfjihpa', active : true});
                }
                else if(buttonIndex === 1) {
                    chrome.tabs.create({url : 'https://chrome.google.com/webstore/detail/gom-vpn-bypass-and-unbloc/ckiahbcmlmkpfiijecbpflfahoimklke', active : true});
                }
            }

            else if(BG_NOTIFICATIONS.id.yaLoginErr == notificationId){
                if(buttonIndex === 0) {
                    chrome.tabs.create({url : 'https://direct.yandex.ru/registered/main.mok5xwRGiWbC2pCw.pl?authredirlevel=1512044536.0&text=f.ua&regions=&suffix=0&phrase_num_from_forecast=&checkboxes=1&from_forecast=1&cmd=wordstat&geo=', active : true});
                }
            }

        });
    }

    Bg_notifications.prototype.createNotification = function(options){
        var opt = {
            type: "basic",
            title: options.title,
            message: options.message,
            iconUrl: 'img/icon128.png',
            eventTime : (new Date).getTime() + 120000
        };

        var idString = (new Date()).getTime().toString();
        if(options.tabId && options.windowId) {
            idString += '__' + options.tabId + '__' + options.windowId;
        }

        chrome.notifications.create(idString, opt);
    };

    Bg_notifications.prototype.yandexError = function () {
        chrome.notifications.create(this.id.yaErr, {
            type : 'basic',
            title : 'У вас заблокирован Яндекс?',
            iconUrl : 'img/icon128.png',
            message : 'Если у вас заблокирован Яндекс, то рекомендуем воспользоваться VPN расширениями.',
            requireInteraction : true,
            buttons : [
                {title : "TunnelBear VPN"},
                {title : "Gom VPN"}
            ]
        });
    };


    Bg_notifications.prototype.yandexLoginError = function () {
        chrome.notifications.create(this.id.yaLoginErr, {
            type : 'basic',
            title : 'Авторизоваться не удалось',
            iconUrl : 'img/icon128.png',
            message : 'Логины вида @yourdomain.ru не поддерживаются сервисом Яндекс.Директ.\n' +
            'Пожалуйста, введите свой обычный логин и пароль на Яндексе или зарегистрируйтесь.',
            requireInteraction : true,
            buttons : [
                {title : "Перейти для проверки"}
            ]
        });
    };

    return new Bg_notifications();
})();