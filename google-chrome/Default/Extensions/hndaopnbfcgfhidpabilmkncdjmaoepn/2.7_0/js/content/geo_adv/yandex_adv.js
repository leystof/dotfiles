var FUA_GEO_YANDEX_ADV = (function(){
    function Adv(){}

    Adv.prototype.isAdvNeeded = function(){
        if(FUA_GEO_ADV.sendingRequest) return false;
        let str = "";
        $('div.content__left .serp-item:not(".serp-adv-item")').not('.fua_geo_adv_parsed').each(function(){
            str += " " + $(this).text();
            $(this).addClass("fua_geo_adv_parsed");
        });

        let result = str.match(FUA_GEO_DATA_2.advWordsRegexp);
        if(result && result.length > 2) {
            var query = $(".input__control").val();
            if(query){
                var advQuery = $('#fua_geo_adv_block_id').attr("adv_query");
                if(!advQuery || query != advQuery){
                    FUA_GEO_DATA_2.getGoogleSearchResult({
                        query : query,
                        callback : function(results){
                            FUA_GEO_ADV.addAdvBlock({
                                query : query,
                                results : results,
                                targetElement : $(".content__right")
                            })
                        },
                        source: 'yandex'
                    })
                }
            }
        }
    };

    return new Adv();
})();

if(window.location.href.match("^http(s|)://(www.|)yandex.[a-z]+/search/")) {
    let target = document.getElementsByTagName("body")[0];
    if(target && !target.classList.contains("fua_geo_search_observer")) {
        FUA_GEO_ADV.addObserver({
            callback: FUA_GEO_YANDEX_ADV.isAdvNeeded,
            additionalCallback: () => {
                FUA_GEO_YANDEX_ADV.isAdvNeeded();
            }
        });
    }
}