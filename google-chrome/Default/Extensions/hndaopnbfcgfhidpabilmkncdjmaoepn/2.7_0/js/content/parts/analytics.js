var FUA_YT_ANALYTICS = (function(){
    function Analytics(){
        this.prefix = 'fua_youtube_';
        this.id = {
            "er_by_coverage" : this.prefix + "er_by_coverage_id",
            "er_by_base" : this.prefix + "er_by_base_id"
        };
        this.class = {

        };

        this.commentSubscribers = {};
    }


    Analytics.prototype.calculateEngagementRates = function(options){
        if(!options) options = {};

        if(FUA_YT_GV.comments_token) {
            var likes = $(".like-button-renderer-like-button .yt-uix-button-content").html();
            var dislikes = $(".like-button-renderer-dislike-button .yt-uix-button-content").html();
            var subscribers = $("#watch7-subscription-container .yt-subscriber-count").html();
            var views = $(".watch-view-count").html();
        }
        else if(FUA_YT_GV.new_comments_token){

            var likes = $("div#top-level-buttons > ytd-toggle-button-renderer:first > a.ytd-toggle-button-renderer button")
                .attr('aria-label');
            var dislikes = $("div#top-level-buttons > ytd-toggle-button-renderer:nth-child(2) > a.ytd-toggle-button-renderer button")
                .attr('aria-label');
            var subscribers = FUA_YT_GV.external_subscribers;
            var views = $("div#count > yt-view-count-renderer > span.view-count").html();
        }

        if(
            likes !== undefined
            && dislikes !== undefined
            && views !== undefined
            && (FUA_YT_GV.comments_token || FUA_YT_GV.new_comments_token)
        ){

            console.log('yes');

            if(!subscribers) subscribers = '0';
            else subscribers =
                subscribers
                    .replace(new RegExp("тыс|K", "g"), '000')
                    .replace(new RegExp("млн|M", "g"), '000000')
                    .replace(new RegExp("[^0-9]*", "g"), "");
            likes = likes.replace(new RegExp("[^0-9]*", "g"), "");
            dislikes = dislikes.replace(new RegExp("[^0-9]*", "g"), "");
            views = views.replace(new RegExp("[^0-9]*", "g"), "");

            //console.log('subscribers', subscribers);

            var commentsToken = FUA_YT_GV.comments_token;
            if(!commentsToken) commentsToken = FUA_YT_GV.new_comments_token;

            $.post(
                "https://www.youtube.com/watch_fragments_ajax?" +
                "v=" + getVideoIdFromVideoUrl(window.location.href) +
                "&tr=scroll&distiller=1" +
                "&ctoken=" + encodeURIComponent(commentsToken) +
                "&frags=comments",
                {
                    session_token: FUA_GET_VALUE.getXsrfToken($("html").html()),
                    client_url: window.location.href
                },
                function (res) {
                    var html = $($.parseHTML(res.body['watch-discussion']));
                    var comments = html.find(".comment-section-header-renderer").html();
                    comments = comments.replace(new RegExp("[^0-9]*", "g"), "");
                    if (!comments) comments = 0;

                    console.log('likes', likes);
                    console.log('dislikes', dislikes);
                    console.log('subscribers', subscribers);
                    console.log('views', views);
                    console.log('comments', comments);


                    var by_coverage =
                        Math.ceil((parseInt(likes) + parseInt(dislikes) + parseInt(comments)) / parseInt(views) * 100);
                    var by_base =
                        Math.ceil((parseInt(likes) + parseInt(dislikes) + parseInt(comments)) / parseInt(subscribers) * 100);

                    $("#" + FUA_YT_ANALYTICS.id.er_by_coverage).html(by_coverage + "%");
                    $("#" + FUA_YT_ANALYTICS.id.er_by_base).html(by_base + "%");
                }
            );

            /*$.post(
             "https://www.youtube.com/comment_service_ajax?action_get_comments=1&pbj=1" +
             "&ctoken=" + encodeURIComponent(FUA_YT_GV.new_comments_token)  +
             "&itct=" +  FUA_YT_GV.itct,
             {session_token: FUA_YT_GV.external_xsrf_token},
             function (res) {
             console.log("res", res);
             }
             );*/
        }
        else{
            if(!options.time) options.time = 0;
            options.time = options.time + 300;
            if(options.time < 10000){
                setTimeout(function(){
                    FUA_YT_ANALYTICS.calculateEngagementRates(options);
                }, 300);
            }
        }
    };


    Analytics.prototype.addCommentSubscribers = function (options) {
        options.element.append(
            '<span style="margin-left: 5px; margin-right: 5px; display: inline-block; background-color: red; color: white; padding-left: 3px; padding-right: 3px;">' +
                options.subscribers +
            '</span>')
    };


    Analytics.prototype.commentUserSubscribers = function (options) {
        if(!options) options = {};
        var config = { childList: true, subtree : true};
        var target = document.getElementById('watch-discussion');

        if(target && !target.getAttribute('youclever_observer')){
            target.setAttribute('youclever_observer', true);

            var observer = new MutationObserver(function(mutations) {

                $('a.comment-author-text').not('[youclever_observer]').each(function () {
                    $(this).attr('youclever_observer', true);
                    var href = $(this).attr('href');
                    var subscribers = FUA_YT_ANALYTICS.commentSubscribers[href];
                    var element = $(this);
                    if(subscribers) {
                        FUA_YT_ANALYTICS.addCommentSubscribers({
                            element : element,
                            subscribers : subscribers
                        });
                    }
                    else {
                        $.get(href, '', function (res) {
                            FUA_YT_ANALYTICS.commentSubscribers[href] =
                                $($.parseHTML(res)).find('.yt-subscription-button-subscriber-count-branded-horizontal')
                                    .attr('title')
                                    .replace(new RegExp("[^0-9]*", "g"), "");
                            FUA_YT_ANALYTICS.addCommentSubscribers({
                                element : element,
                                subscribers : FUA_YT_ANALYTICS.commentSubscribers[href]
                            });
                        });
                    }
                });
            });


            observer.observe(target, config);
        }


        var targetND = document.querySelector('ytd-comments > ytd-item-section-renderer > div#contents');
        if(targetND && !targetND.getAttribute('youclever_observer')){
            targetND.setAttribute('youclever_observer', true);

            var observer = new MutationObserver(function(mutations) {

                $('a#author-text, ytd-author-comment-badge-renderer > a#name').not('[youclever_observer]').each(function () {
                    $(this).attr('youclever_observer', true);
                    var href = $(this).attr('href');
                    var subscribers = FUA_YT_ANALYTICS.commentSubscribers[href];
                    var element = $(this);
                    if(subscribers) {
                        FUA_YT_ANALYTICS.addCommentSubscribers({
                            element : element,
                            subscribers : subscribers
                        });
                    }
                    else {
                        $.get(href, '', function (res) {
                            /*var match = res.match(new RegExp('"shortSubscriberCountText":{"simpleText":"([0-9]+)'));
                            if(match){
                                FUA_YT_ANALYTICS.commentSubscribers[href] = match[1];
                                FUA_YT_ANALYTICS.addCommentSubscribers({
                                    element : element,
                                    subscribers : FUA_YT_ANALYTICS.commentSubscribers[href]
                                });
                            }*/

                            const json = JSON.parse(res.match(new RegExp('window\\["ytInitialData"\\][ ]*=[ ]*(.+}]}}})', 'i'))[1]);
                            let subscribers = '0';
                            if(json.header.c4TabbedHeaderRenderer.subscriberCountText){
                                subscribers = json.header.c4TabbedHeaderRenderer
                                    .subscriberCountText
                                    .simpleText
                                    .replace('тыс', '000')
                                    .replace('млн', '000000')
                                    .replace(new RegExp('[^0-9]+', 'gi'), '')
                            }

                            FUA_YT_ANALYTICS.commentSubscribers[href] = subscribers;
                            FUA_YT_ANALYTICS.addCommentSubscribers({
                                element : element,
                                subscribers : FUA_YT_ANALYTICS.commentSubscribers[href]
                            });
                        });
                    }
                });
            });

            observer.observe(targetND, config);
        }


        if(!options.time) options.time = 0;
        options.time = options.time + 500;
        if(options.time < 10000){
            setTimeout(function(){
                FUA_YT_ANALYTICS.commentUserSubscribers(options);
            }, 500);
        }
    };


    return new Analytics();
})();