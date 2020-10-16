var FUA_YT_SOCIAL = (function(){
    function Fua_youtube_social(){
        this.prefix = 'fua_youtube_';
        this.id = {
            'facebook_item' : this.prefix + 'facebook_shares_item_id',
            'facebook_shares_item' : this.prefix + 'facebook_shares_item_id',
            'facebook_likes_item' : this.prefix + 'facebook_likes_item_id',
            'facebook_comments_item' : this.prefix + 'facebook_comments_item_id',
            'vk_item' : this.prefix + 'vk_item_id',
            'google_plus_item' : this.prefix + 'google_plus_item_id',
            'ok_item' : this.prefix + 'ok_item_id',
            'linkedin_item' : this.prefix + 'linkedin_item_id',
            'pinterest_item' : this.prefix + 'pinterest_item_id',
            'tumblr_item' : this.prefix + 'tumblr_item_id',
            'google_search_links' : this.prefix + 'google_search_links_id',
            'google_search_links_show' : this.prefix + 'google_search_links_show_id',
            'google_search_embed' : this.prefix + 'google_search_embed_id',
            'google_search_embed_show' : this.prefix + 'google_search_embed_show_id',
        };
        this.class = {
            'social_item' : this.prefix + 'social_item',
            'social_count' : this.prefix + 'social_count',
            'google_search_show' : this.prefix + 'google_search_show',
        };

    }


    Fua_youtube_social.prototype.getFacebookSocialData = function(options){
        $.get(
            'https://api.facebook.com/restserver.php?method=links.getStats&urls=' +
            encodeURIComponent(options.url),
            '',
            function (res) {
                if(res) {
                    var data = {
                        shares: $(res).find("share_count").html(),
                        likes: $(res).find("like_count").html(),
                        comments: $(res).find("comment_count").html(),
                        total : $(res).find("total_count").html()
                    };
                    if(data.total && data.total != 0) options.successCallback(data);
                }
            }, 'xml'
        );
    };



    Fua_youtube_social.prototype.getFacebookShares = function(options){
        $.get(
            'https://graph.facebook.com/?id=' +
            encodeURIComponent(options.url),
            '',
            function (res) {
                if(res && res.share) {
                    var data = {
                        total : res.share.share_count
                    };

                    options.successCallback(data);
                }
            }
        );
    };


    Fua_youtube_social.prototype.getVkShares = function(options){
        $.get(
            'https://vk.com/share.php?act=count&index=1&url=' +
            encodeURIComponent(options.url),
            '',
            function (res) {
                if (res) {
                    var shareCount = res.match('VK.Share.count[\(]1, ([0-9]*)[\)]');
                    //console.log("shareCount", shareCount);
                    if (shareCount && shareCount[1] && shareCount[1] != 0) options.successCallback(shareCount[1]);
                }
            }
        );
    };


    Fua_youtube_social.prototype.getOkShares = function(options){
        $.get(
            'https://connect.ok.ru/dk?st.cmd=extLike&uid=odklcnt0&ref=' +
            encodeURIComponent(options.url),
            '',
            function (res) {
                if (res) {
                    var shareCount = res.match("'([0-9]+)'");
                    if (shareCount && shareCount[1] && shareCount[1] != 0) {
                        options.successCallback(shareCount[1]);
                    }
                }
            }
        ).fail(function(info){
            if(info && info.responseText){
                var shareCount =  info.responseText.match("'([0-9]+)'");
                if (shareCount && shareCount[1] && shareCount[1] != 0) {
                    options.successCallback(shareCount[1]);
                }
            }
        });
    };


    Fua_youtube_social.prototype.getGooglePlusShares = function(options){
        /*$.get(
            'https://plusone.google.com/_/+1/fastbutton?url=' +
            encodeURIComponent(options.url),
            '',
            function (res) {
                if (res) {
                    var html = $.parseHTML(res);
                    var shareCount = $(html).find("#aggregateCount").html();

                    if (shareCount) options.successCallback(shareCount);
                }
            }
        );*/

        var postData = [{
            "method":"pos.plusones.get",
            "id":"p",
            "params":{
                "nolog":true,
                "id": options.url,
                "source":"widget",
                "userId":"@viewer",
                "groupId":"@self"
            },
            "jsonrpc":"2.0",
            "key":"p",
            "apiVersion":"v1"
        }];

        $.ajax({
            type: 'POST',
            url: 'https://clients6.google.com/rpc',
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(postData)
        }).done(function(res){
            if(
                res
                && res[0]
                && res[0].result
                && res[0].result.metadata
                && res[0].result.metadata.globalCounts
                && res[0].result.metadata.globalCounts.count
            ){
                options.successCallback(res[0].result.metadata.globalCounts.count);
            }
        });
    };


    Fua_youtube_social.prototype.getLinkedinShares = function(options){
        $.get(
            'https://www.linkedin.com/countserv/count/share?url='+
            encodeURIComponent(options.url) +'&format=json',
            '',
            function (res) {
                if (res && res.count) options.successCallback(res.count);
            }
        );
    };

    Fua_youtube_social.prototype.getPinterestShares = function(options){
        $.get(
            'https://api.pinterest.com/v1/urls/count.json?callback%20&url=' +
            encodeURIComponent(options.url),
            '',
            function (res) {
                var shareCount = res.match('count":[ ]*([0-9]+)');
                if (shareCount && shareCount[1] && shareCount[1] != 0) options.successCallback(shareCount[1]);
            }, 'html'
        );
    };

    Fua_youtube_social.prototype.getTumblrShares = function(options){
        $.get(
            'https://api.tumblr.com/v2/share/stats?url=' +
            encodeURIComponent(options.url),
            '',
            function (res) {
                if(res && res.response && res.response.note_count){
                    options.successCallback(res.response.note_count);
                }
            }
        );
    };

    /*Fua_youtube_social.prototype.getGoogleSearchLinks = function(options){
        var url = "https://www.google.com.ua/search?safe=off&output=search&sclient=psy-ab&q="+
            options.query + "+-site:youtube.com&btnG=&gbv=2&gws_rd=cr";
        $.get(url, "", function(res){
            if(res){
                var html = $($.parseHTML(res));
                var countString = html.find("#resultStats").html();
                if(countString){
                    var count = html.find("#resultStats").html().replace(new RegExp("[ ]|&nbsp;", "g"), "").match("[0-9]+");
                    if(count) options.successCallback({
                        count : count[0],
                        url :url
                    });
                }
            }
        });
    };*/



    Fua_youtube_social.prototype.countGoogleSearchResultsOnOnePage = function(options){
        $.get(
            options.url,
            "",
            function(res){
                //var count = $($.parseHTML(res)).find(".srg > div.g").length;
                var count = $($.parseHTML(res)).find("#search div.g").length;
                options.successCallback(count);
            }
        ).fail(function(info){
            options.failCallback(info);
        });
    };



    Fua_youtube_social.prototype.getGoogleSearchLinks = function(options){
        var url = 'https://www.google.com.ua/search?safe=off&output=search&sclient=psy-ab&q='+
           '"' + options.query + '"' + '+-site:youtube.com+-site:facebook.com+-site:vk.com&btnG=&gbv=2&gws_rd=cr&start=990&filter=0&ei='
            + randomString(22, RANDOM_STRING_LETTERS_AND_NUMBERS);

        $.get(url, "", function(res){
            if(res){
                var html = $($.parseHTML(res));
                var countString = html.find("#nav .fl").last().text();
                console.log("countString", html.find("#nav .fl"));
                if(countString){
                    var count = 0;
                    if(countString == 1) {
                        count = "< 10";
                        FUA_YT_SOCIAL.countGoogleSearchResultsOnOnePage({
                            url : 'https://www.google.com.ua/search?safe=off&output=search&sclient=psy-ab&q='+
                            '"' + options.query + '"' + '+-site:youtube.com+-site:facebook.com+-site:vk.com&btnG=&gbv=2&gws_rd=cr&filter=0&ei='
                            + randomString(22, RANDOM_STRING_LETTERS_AND_NUMBERS),
                            successCallback : function(count){
                                options.successCallback({
                                    count: count,
                                    url:  'https://www.google.com.ua/search?safe=off&output=search&sclient=psy-ab&q='+
                                    '"' + options.query + '"' + '+-site:youtube.com+-site:facebook.com+-site:vk.com&btnG=&gbv=2&gws_rd=cr&filter=0&ei='
                                    + randomString(22, RANDOM_STRING_LETTERS_AND_NUMBERS),
                                });
                            },
                            failCallback : function(){
                                options.failCallback({
                                    url : url = 'https://www.google.com.ua/search?safe=off&output=search&sclient=psy-ab&q='+
                                    '"' + options.query + '"' + '+-site:youtube.com+-site:facebook.com+-site:vk.com&btnG=&gbv=2&gws_rd=cr&filter=0'
                                });
                            }
                        });
                    }
                    else {
                        count = '> ' + ((parseInt(countString) - 1) * 10);
                        options.successCallback({
                            count: count,
                            url: url = 'https://www.google.com.ua/search?safe=off&output=search&sclient=psy-ab&q=' +
                            '"' + options.query + '"' + '+-site:youtube.com+-site:facebook.com+-site:vk.com&btnG=&gbv=2&gws_rd=cr&start=' + ((parseInt(countString) - 1) * 10) + '&filter=0&ei='
                            + randomString(22, RANDOM_STRING_LETTERS_AND_NUMBERS)
                        });
                    }
                }
                else{
                    options.successCallback({
                        count : 0
                    });
                }
            }
        }).fail(function(info){
            options.failCallback({
                url : url = 'https://www.google.com.ua/search?safe=off&output=search&sclient=psy-ab&q='+
                '"' + options.query + '"' + '+-site:youtube.com&btnG=&gbv=2&gws_rd=cr&filter=0'
            });
        });
    };

    return new Fua_youtube_social();
})();