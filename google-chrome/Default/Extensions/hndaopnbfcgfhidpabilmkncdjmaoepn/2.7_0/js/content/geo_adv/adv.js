var FUA_GEO_ADV = (function(){

    function Adv(){
        this.sendingRequest = false;
        this.blockHeight = 0;
        this.blockWidth = 0;
    }


    Adv.prototype.addObserver = function(options){


        chrome.storage.local.get(['noAdv'], items =>  {
            if(
                !items.noAdv
                || items.noAdv === true
                || items.noAdv < (new Date()).getTime()
            ) {
                let target = document.getElementsByTagName("body")[0];
                let observerClass = "fua_geo_search_observer";
                if(!target || target.classList.contains(observerClass)) return false;
                target.classList.add(observerClass);

                if(options.additionalCallback) options.additionalCallback();

                let observer = new MutationObserver(mutations => {
                    options.callback();
                });

                observer.observe(target, {
                    childList: true,
                    subtree : true
                });

                if(
                    window.location.href.search("^http(s|)://www.google.[a-z\.]+/(search|webhp|[\?])") != -1
                    || window.location.href.search("^https://yandex.[^/]+/search/") != -1
                ) {
                    let marginTop = 90;
                    let balance = 30;
                    let balance2 = 0;
                    if(window.location.href.search("^https://yandex.[^/]+/search/") != -1){
                        marginTop = 15;
                        balance = 0;
                        balance2 = 85;
                    }


                    window.addEventListener("scroll", () => {
                        let advBlock = document.getElementById('fua_geo_adv_block_id');
                        if(!advBlock) return false;

                        let parent = advBlock.parentNode;
                        let parentTop = parent.getBoundingClientRect().top;

                        if(window.scrollY + marginTop > parent.offsetHeight + window.scrollY + parentTop - balance2){
                            advBlock.style.position = 'fixed';
                            advBlock.style.width = this.blockWidth + 'px';
                            advBlock.style.marginTop = '-'+ marginTop +'px';
                            parent.style.paddingTop = null;
                        }
                        else if(window.scrollY > this.blockHeight + window.scrollY + parentTop){
                            advBlock.style.position = 'fixed';
                            advBlock.style.width = this.blockWidth + 'px';
                            parent.style.paddingTop = (this.blockHeight + balance) + 'px';
                            advBlock.style.marginTop = (parent.offsetHeight - window.scrollY - this.blockHeight - balance).toString() + 'px';
                        }
                        else {
                            advBlock.style.position = 'relative';
                            advBlock.style.marginTop = '0px';
                            parent.style.paddingTop = null;
                        }
                    });

                }
            }
        });
    };


    Adv.prototype.addAdvBlock = function(options){
        if($('#fua_geo_adv_block_id').length) $('#fua_geo_adv_block_id').remove();
        let resultStr = "";
        for(var i in options.results){
            let r = options.results[i];
            let img = '';
            if(r.img) img =
                '<div style="display: flex; align-items: center; justify-content: center; border: 1px solid #dfe1e5; border-radius: 5px; width: 132px; height: 132px;">' +
                    '<img src="'+ r.img +'" style="vertical-align: middle; max-width: 120px; max-height: 120px;">' +
                '</div>';

            //resultStr += "<br>";


            let url = r.url;
            let domain = url.match('^http(|s)://[^/\\?]+')[0];
            let domainUrl = domain;
            if(!r.notUA){
                url = r.url +'?utm_source=clever_chrome_search&utm_medium=addons&utm_term=all&utm_campaign=all';
            }
            else{
                if(r.url.match('amazon')){
                    let parts = r.url.match('(.*)([\?].+)$');
                    if(parts){
                        //console.log("lastPart", parts);
                        url = parts[1] + '/ref=as_li_qf_sp_asin_il_tl' + parts[2] + '&tag=wwwfua-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B004LLIKVU&linkId=f8965f671e19d0603cd707199ac880c5';
                    }
                    else {
                        url = r.url.replace("/$", '') + '/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=wwwfua-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B004LLIKVU&linkId=f8965f671e19d0603cd707199ac880c5';
                    }

                    domainUrl = domain + '/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&tag=wwwfua-20&camp=1789&creative=9325&linkCode=as2&creativeASIN=B004LLIKVU&linkId=f8965f671e19d0603cd707199ac880c5';
                }
                else if(r.url.match('aliexpress')){
                    url = 'https://alitems.com/g/1e8d114494ab312a679816525dc3e8/?ulp=' + r.url;
                    domainUrl = 'https://alitems.com/g/1e8d114494ab312a679816525dc3e8/?ulp=' + domain;
                }
                else if(r.url.match('gearbest.com')){
                    url = 'https://lenkmio.com/g/2316b8f856ab312a679822af2ed61b/?ulp=' + r.url;
                    domainUrl = 'https://lenkmio.com/g/2316b8f856ab312a679822af2ed61b/?ulp=' + domain;
                }
                else if(r.url.match('mediamarkt.ru')){
                    url = 'https://lenkmio.com/g/3be650395aab312a6798bfa53c8a3d/?ulp=' + r.url;
                    domainUrl = 'https://lenkmio.com/g/3be650395aab312a6798bfa53c8a3d/?ulp=' + domain;
                }
                else if(r.url.match('onetwotrip.com')){
                    url = 'https://ad.admitad.com/g/49c113f01eab312a679802b3e23ee2/?ulp=' + r.url;
                    domainUrl = 'https://ad.admitad.com/g/49c113f01eab312a679802b3e23ee2/?ulp=' + domain;
                }
                else if(r.url.match('parter.ru')){
                    url = 'https://ad.admitad.com/g/8a44e8868aab312a6798ab8da1c9bd/?ulp=' + r.url;
                    domainUrl = 'https://ad.admitad.com/g/8a44e8868aab312a6798ab8da1c9bd/?ulp=' + domain;
                }
                else if(r.url.match('petrovich.ru')){
                    url = 'https://ad.admitad.com/g/fjtv2ijs43ab312a67983d96fce434/?ulp=' + r.url;
                    domainUrl = 'https://ad.admitad.com/g/fjtv2ijs43ab312a67983d96fce434/?ulp=' + domain;
                }
                else if(r.url.match('wildberries.ru')){
                    url = 'https://ad.admitad.com/g/1d9ed345ddab312a6798dc28f2033d/?ulp=' + r.url;
                    domainUrl = 'https://ad.admitad.com/g/1d9ed345ddab312a6798dc28f2033d/?ulp=' + domain;
                }
                else if(r.url.match('akusherstvo.ru')){
                    url = 'https://ad.admitad.com/g/dd8aeb9adeab312a6798748f778371/?ulp=' + r.url;
                    domainUrl = 'https://ad.admitad.com/g/dd8aeb9adeab312a6798748f778371/?ulp=' + domain;
                }
                else if(r.url.match('labirint.ru')){
                    url = 'https://ad.admitad.com/g/07d6913cf6ab312a67985ddd29e1bc/?ulp=' + r.url;
                    domainUrl = 'https://ad.admitad.com/g/07d6913cf6ab312a67985ddd29e1bc/?ulp=' + domain;
                }
                else if(r.url.match('bonprix.ru')){
                    url = 'https://ad.admitad.com/g/cdibpcgxqeab312a679888443d9e35/?ulp=' + r.url;
                    domainUrl = 'https://ad.admitad.com/g/cdibpcgxqeab312a679888443d9e35/?ulp=' + domain;
                }
                else if(r.url.match('onetwotrip.com')){
                    url = 'https://ad.admitad.com/g/49c113f01eab312a679802b3e23ee2/?ulp=' + r.url;
                    domainUrl = 'https://ad.admitad.com/g/49c113f01eab312a679802b3e23ee2/?ulp=' + domain;
                }
            }

            resultStr +=
                '<table style="margin-top: 5px;">' +
                '<tr>' +
                '<td>' + img + '</td>' +
                '<td style="padding-left: 10px;">' +
                '<a class="fua_geo_adv_item_title" href="'+ url + '" target="_blank">'+ r.title +'</a>' +
                '<div style="margin: 3px 0;">' +
                    '<a class="fua_geo_adv_item_domain" href="'+ domainUrl + '" target="_blank">'+ domain +'</a>' +
                '</div>' +
                '<div class="fua_geo_adv_item_content">'+ r.content +'</div>' +
                '</td>' +
                '</tr>' +
                '</table>';
            break;
        }

        if(!resultStr) return false;


        options.targetElement.prepend(
            '<div style="margin-bottom: 20px; border: 1px solid #dfe1e5; border-radius: 5px; padding: 2px;" id="fua_geo_adv_block_id" adv_query="'+ options.query +'">' +
                "<style>#fua_geo_adv_block_id{}  #fua_geo_adv_block_title{font-weight: bold;}  .fua_geo_adv_item_title{font-weight: bold;} .fua_geo_adv_item_domain{color: #3c763d !important;}  .fua_geo_adv_item_content{font-size: 90%; color: #666;}  #fua_geo_no_adv_msg_id{display: none;margin-bottom: 20px;}  #fua_geo_hide_adv_id, #fua_geo_switch_off_adv_id{padding: 0px 20px 0px;font-weight: bold;cursor: pointer;display: inline-block;}  #fua_geo_hide_adv_id{color: green;text-decoration: underline;}  #fua_geo_hide_adv_id:hover{text-decoration: none;}  #fua_geo_switch_off_adv_id{color: grey;}</style>" +
                '<div id="fua_geo_adv_block_title_id" style="text-align: right; font-size: 11px;">' +
                    '<span style="margin-right: 5px; color: #808080">'+ GEO_ADV_CHANGEABLE.title +' рекоммендует:</span>' +
                    '<img style="width: 11px;float: right;cursor: pointer; margin: 3px 3px 0 0;" id="fua_geo_no_adv_id" src="'+ chrome.extension.getURL("img/geo_adv/delete.png") + '">' +
                "</div>" +
                '<div id="fua_geo_adv_id">' + resultStr + '</div>' +
                '<div id="fua_geo_no_adv_msg_id">' +
                    '<div style="text-align: center; font-weight: bold">Расширение бесплатно, его разработка и поддержка осуществляется за счет рекламы!</div>' +
                    '<div style="margin-top: 20px; text-align: center;">' +
                        '<span id="fua_geo_hide_adv_id">скрыть из поиска на 1 день</span>' +
                        '<span id="fua_geo_switch_off_adv_id">скрыть из поиска на 30 дней</span>' +
                    '</div>' +
                "</div>" +
            '</div>'
        );

        $("#fua_geo_no_adv_id").click(() => {
            /*$('#fua_geo_adv_id').remove();
            $('#fua_geo_adv_block_title_id').remove();
            $("#fua_geo_no_adv_msg_id").show();*/
            this.showCatMsg();
        });

        $("#fua_geo_hide_adv_id").click(function(){
            $('#fua_geo_adv_block_id').remove();
            chrome.storage.local.set({noAdv: (new Date()).getTime() + 1000 * 60 * 60 * 24}, () => {

            });
        });

        $("#fua_geo_switch_off_adv_id").click(function(){
            $('#fua_geo_adv_block_id').remove();
            chrome.storage.local.set({noAdv: (new Date()).getTime() + 1000 * 60 * 60 * 24 * 30}, () => {

            });
        });

        let advBlock = document.getElementById('fua_geo_adv_block_id');
        if(advBlock){
            this.blockHeight = advBlock.offsetHeight;
            this.blockWidth = advBlock.offsetWidth;
        }
    };


    Adv.prototype.showCatMsg = function(){
        let htmlString = '<div id="fua_blocker_modal_background_id" modal_target="cats_message" style="font-size: 11px; font-family: Roboto, Arial, sans-serif; background-color: #fafafa; width: 100vw;height: 100vh;background-color: rgba(173, 173, 173, 0.6);position: fixed;overflow: hidden;display: table-row;vertical-align: middle;text-align: center;z-index: 2147483000;"><style>#fua_blocker_cat_button_off_id, #fua_blocker_cat_button_on_id {width: 180px;margin: 0px 10px 0px;padding: 10px 0px 10px;border-radius: 5px;font-size: 14px;font-weight: bold;text-align: center;cursor: pointer;opacity: 0.7;transition: 1s;}  #fua_blocker_cat_button_off_id:hover, #fua_blocker_cat_button_on_id:hover{opacity: 1;transition: 0.5s;}  #fua_blocker_cat_button_off_id{background-color: #d3d3d3;color: darkslategray;}  #fua_blocker_cat_button_on_id{background-color: green;color: #ffffff;}#fua_blocker_modal_background_cell_id {width: 100vw;height: 100vh;display: table-cell;vertical-align: middle;text-align: center;}  #fua_blocker_modal_body_id {padding: 10px;background-color: #ffffff;border: 3px solid rgb(173, 173, 173);border-radius: 10px;overflow-x: hidden;overflow-y: auto;display: inline-block;}  #fua_blocker_modal_title_id {width: 100%;white-space: nowrap;}  #fua_blocker_modal_title_left_id {max-width: 80%;font-size: 30px;font-weight: bold;overflow: hidden;text-overflow: ellipsis;float: left;}  #fua_blocker_modal_title_right_id {font-weight: bold;overflow: hidden;float: right;}  #fua_blocker_modal_close_id {height: 30px;cursor: pointer;float: right;}  #fua_blocker_modal_content_id {margin-top: 10px;clear: both;}</style><div id="fua_blocker_modal_background_cell_id"><div id="fua_blocker_modal_body_id"><div id="fua_blocker_modal_content_id"><div style="text-align: center;"><div style="margin: 10px 0px 10px; color: grey; font-size: 20px; font-weight: bold;">Наши программист и дизайнер</div><div><img src="'+ chrome.extension.getURL("img/geo_adv/cats.png") +'"></div><div style="margin: 10px 0px 20px; font-weight: bold;"><div>Приложение бесплатное, они живут за просмотры.</div><div>Отключив рекомендации — они будут «голодать».</div></div><div style="margin: 10px 0px 20px;"><button id="fua_blocker_cat_button_off_id">Выключить</button><button id="fua_blocker_cat_button_on_id">Включить обратно</button></div></div></div></div></div></div>'
        $(htmlString).insertBefore('body');
        //$('body').prepend(htmlString);


        $("#fua_blocker_cat_button_off_id").click(() => {
            $('#fua_geo_adv_block_id').remove();
            $('#fua_blocker_modal_background_id').remove();
            chrome.storage.local.set({noAdv: (new Date()).getTime() + 1000 * 60 * 60 * 24 * 30}, () => {

            });
        });

        $("#fua_blocker_cat_button_on_id").click(() => {
            $('#fua_blocker_modal_background_id').remove();
        });
    };


    return new Adv();
})();