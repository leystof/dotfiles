var FUA_GEO_GOOGLE_ADV = (function(){
    function Adv(){}

    Adv.prototype.isAdvNeeded = function(){

        if(
            FUA_GEO_ADV.sendingRequest
            || !$("#hdtb-msb").closest("#hdtbSum").length
        ) return false;
        var str = "";


        $('.g:not(".fua_geo_adv_parsed")').each(function(){
            str += " " + $(this).text();
            $(this).addClass("fua_geo_adv_parsed");
        });


        var result = str.match(FUA_GEO_DATA_2.advWordsRegexp);

        if(
            (result && result.length > 2)
            || document.documentElement.innerHTML.match(new RegExp('src="([^"]+/shopping[^"]+)"', 'i'))
        ) {

            var query = $('[name="q"]').val();

            if(query){
                var advQuery = $('#fua_geo_adv_block_id').attr("adv_query");
                if(!advQuery || query != advQuery){
                    FUA_GEO_DATA_2.getGoogleSearchResult({
                        query : query,
                        callback : function(results){
                            FUA_GEO_ADV.addAdvBlock({
                                query : query,
                                results : results,
                                targetElement : $("#rhs_block, #rhs")
                            })
                        },
                        source: 'google'
                    })
                }
            }
        }
    };

    return new Adv();
})();



if(
    !window.location.href
    || window.location.href.match("^http(s|)://www.google.[a-z\.]+/(search|webhp|[\?])")
) {
    FUA_GEO_ADV.addObserver({
        callback: FUA_GEO_GOOGLE_ADV.isAdvNeeded
    });
}