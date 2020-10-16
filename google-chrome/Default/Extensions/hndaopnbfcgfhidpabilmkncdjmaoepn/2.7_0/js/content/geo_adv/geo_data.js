const FUA_GEO_DATA_2 = (function(){

    function GeoData(){
        this.advWordsRegexp = new RegExp("продажа|купить|цена|цене|цены|оплата", "gi");
    }

    GeoData.prototype.getBingSearch= options => {
        return new Promise((resolve, reject) => {
            const port = chrome.runtime.connect({name: "getBingSearch"});

            port.onMessage.addListener(data => {
                if(data.res){
                    let objects = [];
                    const html = $($.parseHTML(data.res));

                    html.find('#b_results li.b_algo').each((index, tag) => {
                        tag = $(tag);
                        const item = {
                            url : tag.find('h2 a').attr('href'),
                            title: tag.find('h2 a').text(),
                            content: tag.find('.b_caption p').text()
                        };
                        objects.push(item);
                    });

                    resolve(objects);
                }
                else if(data.info){
                    reject(data.info);
                }
            });

            port.postMessage({
                q: options.q,
            });
        });
    };



    GeoData.prototype.getBingImage = options => {
       return new Promise((resolve, reject) => {
           const port = chrome.runtime.connect({name: "getBingImage"});

           port.onMessage.addListener(data => {
               if(data.res){
                   const html = $($.parseHTML(data.res));
                   let img = html.find('img.mimg.vimgld').attr('data-src');
                   if (img) img = 'https://www.bing.com' + img;
                   resolve(img);
               }
               else if(data.info){
                   reject(data.info);
               }
           });

           port.postMessage({
               q: options.q,
           });
       });
    };


    GeoData.prototype.getYandexImage = options => {
        return new Promise((resolve, reject) => {
            const port = chrome.runtime.connect({name: "getYandexImage"});

            port.onMessage.addListener(data => {
                if(data.res){
                    const html = $($.parseHTML(data.res));
                    let img = html.find('img.serp-item__thumb').attr('src');
                    resolve(img)
                }
                else if(data.info){
                    reject(data.info);
                }
            });

            port.postMessage({
                text: options.q,
                site: options.domains.join(',')
            });
        });
    };


    GeoData.prototype.getDataFromHtml = options => {
        return new Promise((resolve, reject) => {
            let objects = [];
            if(options.source === 'google') {
                $('.g').each((index, tag) => {
                    let a = $(tag).find('a').eq(0);

                    let u = a.attr('href');
                    if (u) {
                        let d = u.match(new RegExp('http(s|)://([^/\\?]+)'));

                        if (d && options.domains.filter(domain => !!d[2].match(new RegExp('^(.+\\.|)' + domain))).length) {
                            let title = a.find('h3').text();
                            let content = $(tag).find('.s .st').html();

                            if(title && content && title.trim() && content.trim()) {
                                objects.push({
                                    url: u,
                                    title: title,
                                    content: content
                                });
                            }
                        }
                    }
                });
            }

            resolve(objects);
        });
    };


    GeoData.prototype.getGoogleSearchResult = function(options){
        FUA_GEO_ADV.sendingRequest = true;
        let notUA = false;


        /*let site = 'site:f.ua';
        if(
            !document.documentElement.innerHTML.match(new RegExp('"com.ua"'))
        ){
            site = '(site:amazon.com | site:aliexpress.com | site:geerbest.com | site:labirint.ru)';
            notUA = true;
        }



        $.get(
            'https://www.google.com/search',
            {
                q: options.query + ' ' + site,
                ie: 'UTF-8'
            },
            function(res){
                FUA_GEO_ADV.sendingRequest = false;
                const objects = [];
                const html = $($.parseHTML(res));
                html.find('#search div.rc').each((index, tag) => {
                    tag = $(tag);
                    const item = {
                        url : tag.find('a').attr('href'),
                        title: tag.find('h3').text(),
                        content: tag.find('.s').text(),
                        notUA:  notUA
                    };
                    //console.log('item', item);
                    objects.push(item);
                });
                options.callback(objects);
            }
        ).fail(function(info){
            FUA_GEO_ADV.sendingRequest = false;
        });*/

        let title = null;
        let link = null;
        let description = null;

        let domains = ['f.ua'];
        if(
            !document.documentElement.innerHTML.match(new RegExp('"com.ua"'))
            && !window.location.href.match(new RegExp('http(|s)://[^/]+.ua/'))
        ){
            domains = [
                'amazon.com',
                'aliexpress.com',
                'gearbest.com',
                'labirint.ru',
                'bonprix.ru',
                'onetwotrip.com',
                'akusherstvo.ru'
            ];

            notUA = true;
        }

        let site = '';
        for(let d of domains){
            if(site) site += ' OR ';
            site += 'domain:' + d;
        }

        if(domains.length > 1) site = '('+ site +')';

        let img = null;
        let items = [];
        this.getDataFromHtml({domains: domains, source: options.source}).then(objects => {
            if(objects.length) return objects;
            return this.getBingSearch({q : options.query + ' ' + site});
        }).then(objects => {

            items = objects;
            if(options.source === 'google'){
                img = document.documentElement.innerHTML.match(new RegExp('src="([^"]+/shopping[^"]+)"', 'i'));
                if(img) img = img[1];
                /*if(!img) img = $('img#dimg_1').attr('src');
                if(!img) img = $('img#dimg_2').attr('src');
                if(!img) img = $('img#dimg_3').attr('src');*/
                if(!img) img = $('.img-brk .rg_el img').attr('src');
                if(!img) img = $('img#plarhs0').attr('src');
                if(!img) img = $('img#plarhs1').attr('src');
                if(!img) img = $('img#plarhs2').attr('src');
                if(!img) img = $('div[data-hveid="CAAQJw"] img.tLipRb').attr('src');
            }
            else if(options.source === 'yandex'){
                img = document.documentElement.innerHTML.match(new RegExp('src="(//avatars.mds.yandex.net/get-mpic/[^"]+)"', 'i'));
                if(img) img = img[1];
                if(!img){
                    let imgDiv = document.querySelector('.serp-item .gallery__thumb .thumb__image');
                    if(imgDiv) img = imgDiv.style.backgroundImage.match(new RegExp('url\\("([^"]+)'));
                    if(img) img = img[1]
                }
            }


            if(img) return img;
            else if(items.length && options.source === 'yandex') {
                return this.getYandexImage({
                    q: items[0].title.replace(new RegExp('\\.\\.\\.'), '').trim(),
                    domains: domains
                });
            }
            return null;
        }).then(img => {
            if(img) return img;
            else if(items.length) {
                return this.getBingImage({
                    q: items[0].title.replace(new RegExp('\\.\\.\\.'), '').trim()
                        //+ ' ' + site
                });
            }
            return img;
        }).then(img => {
            FUA_GEO_ADV.sendingRequest = false;
            items = items.map(item => {
                item.img = img;
                item.notUA =  notUA;
                return item;
            });
            options.callback(items);
        }).catch(err => {
            FUA_GEO_ADV.sendingRequest = false;
        });
    };

    return new GeoData();
})();