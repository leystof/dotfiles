chrome.runtime.onConnect.addListener(function(port) {
    if(port.name === 'getBingSearch'){
        port.onMessage.addListener(data => {
            $.get(
                'https://www.bing.com/search',
                {q: data.q},
                res => {
                    port.postMessage({res: res});
                    port.disconnect();
                }
            ).fail(function(info){
                port.postMessage({info: info});
                port.disconnect();
            });
        });
    }
    else if(port.name === 'getBingImage'){
        port.onMessage.addListener(data => {
            $.get(
                'https://www.bing.com/images/search',
                {q: data.q},
                res => {
                    port.postMessage({res: res});
                    port.disconnect();
                }
            ).fail(info => {
                port.postMessage({info: info});
                port.disconnect();
            });
        });
    }
    else if(port.name === 'getYandexImage'){
        port.onMessage.addListener(data => {
            $.get(
                'https://yandex.ua/images/search',
                {
                    text: data.text,
                    //site: data.site
                },
                res => {
                    port.postMessage({res: res});
                    port.disconnect();
                }
            ).fail(function(info){
                port.postMessage({info: info});
                port.disconnect();
            });
        });
    }
});