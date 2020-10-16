var FUA_BLOCKER_DESIGN = (function(){
    function Blocker_design(){
        this.prefix = "fua_blocker_";
        this.id = {
            "app_view_on" : this.prefix + "app_view_on_id"
        };
        this.class = {
            "observer" :  this.prefix + "our_design_observer"
        };
    }


    Blocker_design.prototype.addOnMarker = function(){
        if(!$('#' + FUA_BLOCKER_DESIGN.id.app_view_on).length){
            $(window).resize();
            $('html').append(
                '<div id="'+ FUA_BLOCKER_DESIGN.id.app_view_on +'"></div>'
            );
        }
    };


    Blocker_design.prototype.getPlayerApiBlock = function(){
        var block = $('#player-container');
        if(!block.length) block =  $('#player-api');
        return block;
    };


    Blocker_design.prototype.getRecommendedVideosMainBlock = function(){
        var block = $('#watch7-sidebar-contents');
        if(!block.length) block =  $('#related');
        return block;
    };


    Blocker_design.prototype.getLogoBlock = function(){
        var block = $('.masthead-logo-renderer');
        if(!block.length) block =  $('div#content > div#masthead-container > ytd-masthead#masthead ytd-topbar-logo-renderer > a#logo');
        return block;
    };


    Blocker_design.prototype.getMainMetaBlock= function(){
        var block = $('#watch7-content');
        if(!block.length) block =  $("ytd-watch > div#top > div#container >div#main");
        return block;
    };


    Blocker_design.prototype.addEmbedVideo = function(options){
        $('#body').removeClass('fua_scrolled_video_player');

        gv_open_comments = options.openComments;
        FUA_BLOCKER_DESIGN.updateSizes();
        updateCommentsSize();
        window.dispatchEvent(new Event("resize"));

        FUA_BLOCKER_DESIGN.addCommentsButtons();
        FUA_BLOCKER_DESIGN.addInfoLine();
        FUA_BLOCKER_DESIGN.changeActionButton();
        FUA_BLOCKER_DESIGN.addCommentsAutoLoad();

        if(!$('#fua_search_img_id').length) {
            $('.search-button').append(
                '<div id="fua_search_img_id" style="display: none;">' +
                    '<img src="' + IMAGE_SEARCH + '">' +
                '</div>'
            );
        }


        if(!$('#new_youtube_logo_id').length) {
            FUA_BLOCKER_DESIGN.getLogoBlock().append(
                '<img style="height: 30px; display: none;" id="new_youtube_logo_id" src="'+ IMAGE_YOUTUBE_LOGO +'"/>'
            );
        }


        if(!$("#watch7-content").hasClass('fua_transition_class')) {
            setTimeout(function () {
                $("#watch7-content").addClass('fua_transition_class');
            }, 1000);
        }


        if(!$('#fua_resize_window_event_id').length){
            $('html').append('<div id="fua_resize_window_event_id"></div>');
            $(window).resize(function(){
                FUA_BLOCKER_DESIGN.updateSizes();
            });
        }
    };



    Blocker_design.prototype.updateSizes = function(){

        $('#fua-plugin-youtube_video_tags_panel').hide();
        $('#fua-plugin-youtube_show_video_tags_button').hide();

        var windowHeight = $(window).height();
        var windowWidth = $(window).width();
        var gv_recommended_videos_height = 105;

        var watchContent = FUA_BLOCKER_DESIGN.getMainMetaBlock();

        var gap = 0;
        var commentsWidth = 0;
        //gv_open_comments = 2;
        if(gv_open_comments > 1){
            gap = 50;
            commentsWidth = watchContent.width();
        }

        var headerLine = 80;
        var infoLineHeight = 60;
        var buttonLineHeight = 40;
        var allowLeftHeight = windowHeight - gv_recommended_videos_height - headerLine;
        var playerHeight = allowLeftHeight - infoLineHeight - buttonLineHeight;

        var playerWidth = windowWidth - commentsWidth - gap;

        if(playerWidth * 0.5625 <= playerHeight) playerHeight = playerWidth * 0.5625;
        else playerWidth = playerHeight / 0.5625;


        if(playerWidth < 300) {
            playerWidth = 300;
            playerHeight = playerWidth * 0.5625;
        }
        else if(playerWidth > 840) {
            playerWidth = 840;
            playerHeight = playerWidth * 0.5625;
        }



        var playerTop =  (allowLeftHeight - (playerHeight + buttonLineHeight + infoLineHeight)) / 2 + infoLineHeight + headerLine;
        var playerLeft = (windowWidth - (commentsWidth + gap + playerWidth)) / 2;
        if(playerLeft < 0) playerLeft = 0;


        $('#placeholder-player').css('display', 'none');
        $('#theater-background').css('display', 'none');


        var playerApi = FUA_BLOCKER_DESIGN.getPlayerApiBlock();


        playerApi
            .css('height', playerHeight)
            .css('width', playerWidth)
            .css('top', playerTop.toString() + 'px')
            .css('left', playerLeft.toString() + 'px');


        $('#player-unavailable')
            .css('height', playerHeight)
            .css('width', playerWidth)
            .css('top', playerTop.toString() + 'px')
            .css('left', playerLeft.toString() + 'px');


        $('#error-screen')
            .css('height', playerHeight)
            .css('width', playerWidth)
            .css('top', playerTop.toString() + 'px')
            .css('left', playerLeft.toString() + 'px');


        if(window.location.href.match('^https://www.youtube.com/watch[\?]v=')){
            playerApi.css('display', 'block');
            $('#player-unavailable').css('visibility', 'visible');
        }
        else {
            playerApi.css('display', 'none');
            $('#player-unavailable').css('visibility', 'hidden');
        }


        $('#fua_close_comments_id')
            .css('top', (playerTop + playerHeight / 2 - 40) .toString() + 'px')
            .css('left', (playerLeft + playerWidth).toString() + 'px');



        $('#fua_new_video_info_line')
            .css('width', playerWidth)
            .css('top', (playerTop - infoLineHeight).toString() + 'px')
            .css('left', playerLeft.toString() + 'px');

        $('#fua_new_video_info_line .fua_text_block')
            .css('max-width', playerWidth.toString() + 'px');


        /*$('#watch-header')
         .css('width', playerWidth)
         .css('top', (playerTop + playerHeight).toString() + 'px')
         .css('left', playerLeft.toString() + 'px');*/


        $('#fua_new_action_buttons_line_id')
            .css('width', playerWidth)
            .css('top', (playerTop + playerHeight).toString() + 'px')
            .css('left', playerLeft.toString() + 'px');



        var commentsLeft  = windowWidth + 100;
        if(gv_open_comments > 1){
            commentsLeft  = playerLeft + playerWidth + gap;
        }
        watchContent
            .css('left', commentsLeft + 'px')
            .css('height', allowLeftHeight)
            .css('display', 'none');





        $('#watch-discussion .comment-simplebox-renderer')
            .css('left', commentsLeft + 'px');


        var commentsItems = $('#comment-section-renderer-items');
        if(!commentsItems.length) commentsItems = $('#top > #container > #main > ytd-comments#comments > ytd-item-section-renderer > div#contents');

        commentsItems.css('height', allowLeftHeight - 105);

        var loadingBlock = $("#top > #container > #main > ytd-comments#comments > ytd-item-section-renderer > div#continuations");
        if(loadingBlock.length) loadingBlock.width(commentsItems.width());


        $('#action-panel-details')
            .css('height', allowLeftHeight - 40);


        $("#top > #container > #main > div#meta > ytd-video-secondary-info-renderer ytd-expander")
            .css('height', allowLeftHeight - 80);

        $('#fua_tags_block_id')
            .css('height', allowLeftHeight - 40);


        FUA_BLOCKER_DESIGN.getRecommendedVideosMainBlock()
            .css('top', windowHeight - gv_recommended_videos_height)
            .css('display', 'none');

        FUA_BLOCKER_DESIGN.showHideRecommendedVideosNavigation();
    };


    Blocker_design.prototype.getScrollRecommendedVideosBlock = function(){
        var recommendedBlock = $('.watch-sidebar-section:last');
        if(!recommendedBlock.length) {
            recommendedBlock = $('ytd-watch-next-secondary-results-renderer > div#items');
        }
        return recommendedBlock;
    };


    Blocker_design.prototype.showHideRecommendedVideosNavigation = function(){
        var recommendedBlock =
            FUA_BLOCKER_DESIGN.getScrollRecommendedVideosBlock();

        if(recommendedBlock.length) {
            var videosPanel = recommendedBlock[0];
            if ($(videosPanel).width() == videosPanel.scrollWidth) {
                $('.recommended_videos_navigation').hide();
            }
            else if (videosPanel.scrollLeft + $(videosPanel).width() + 10 >= videosPanel.scrollWidth) {
                $('.recommended_videos_navigation[direction="left"]').show();
                $('.recommended_videos_navigation[direction="right"]').hide();
            }
            else if (videosPanel.scrollLeft == 0) {
                $('.recommended_videos_navigation[direction="left"]').hide();
                $('.recommended_videos_navigation[direction="right"]').show();
            }
            else {
                $('.recommended_videos_navigation').show();
            }
        }
    };


    Blocker_design.prototype.scrollRecommendedVideos =  function(){
        var videosBlock =
            FUA_BLOCKER_DESIGN.getScrollRecommendedVideosBlock()[0];

        if(gv_scroll_recommended_videos === 'right' && videosBlock.scrollLeft + $(videosBlock).width() < videosBlock.scrollWidth){
            $(videosBlock).finish().animate({scrollLeft: videosBlock.scrollLeft + 170}, '100', 'linear', function(){
                FUA_BLOCKER_DESIGN.scrollRecommendedVideos();
                FUA_BLOCKER_DESIGN.showHideRecommendedVideosNavigation();
            });
        }
        else if(gv_scroll_recommended_videos === 'left' && videosBlock.scrollLeft > 0){
            $(videosBlock).finish().animate({scrollLeft: videosBlock.scrollLeft - 170}, '100', 'linear', function(){
                FUA_BLOCKER_DESIGN.scrollRecommendedVideos();
                FUA_BLOCKER_DESIGN.showHideRecommendedVideosNavigation();
            });
        }
        else gv_scroll_recommended_videos = false;
    };


    Blocker_design.prototype.addRecommendedVideosNavigation = function(){
        if(!$('.recommended_videos_navigation').length){
            var recommendedVideosBlock = $('#watch7-sidebar-modules');
            if(!recommendedVideosBlock.length) recommendedVideosBlock = $('ytd-watch-next-secondary-results-renderer');

            recommendedVideosBlock.prepend(
                '<div class="recommended_videos_navigation" direction="left"> ' +
                    '<img src="'+ IMAGE_LEFT_ARROW +'" class="recommended_videos_navigation_img"> ' +
                '</div>' +
                '<div style="margin: 0px 0px 0px 100%; position: absolute;"> ' +
                    '<div class="recommended_videos_navigation" style="margin: 0px 0px 0px -36px;" direction="right"> ' +
                        '<img src="'+ IMAGE_RIGHT_ARROW +'" class="recommended_videos_navigation_img"> ' +
                    '</div> ' +
                '</div>'
            );

            $('.recommended_videos_navigation').hover(
                function(){
                    window.dispatchEvent(new Event("resize"));
                    gv_scroll_recommended_videos = $(this).attr('direction');
                    setTimeout(function(){
                        FUA_BLOCKER_DESIGN.scrollRecommendedVideos();
                    }, 50);
                    FUA_BLOCKER_DESIGN.showHideRecommendedVideosNavigation();
                },
                function(){
                    window.dispatchEvent(new Event("resize"));
                    gv_scroll_recommended_videos = false;
                    FUA_BLOCKER_DESIGN.getScrollRecommendedVideosBlock().stop();
                    FUA_BLOCKER_DESIGN.showHideRecommendedVideosNavigation();
                }
            );


            $('.recommended_videos_navigation').click(function(){
                var direction = $(this).attr('direction');
                var videosBlock =
                    FUA_BLOCKER_DESIGN.getScrollRecommendedVideosBlock()[0];

                if(direction === 'right' && videosBlock.scrollLeft < videosBlock.scrollWidth){
                    $(videosBlock).finish().animate({scrollLeft: videosBlock.scrollWidth}, '200', 'swing', function(){
                        FUA_BLOCKER_DESIGN.showHideRecommendedVideosNavigation();
                    });
                }
                else if(direction === 'left' && videosBlock.scrollLeft > 0){
                    $(videosBlock).finish().animate({scrollLeft: 0}, '200', 'swing', function(){
                        FUA_BLOCKER_DESIGN.showHideRecommendedVideosNavigation();
                    });
                }
            });
        }
    };


    Blocker_design.prototype.changeRecommendedVideosViewForNewDesign = function(){
        FUA_BLOCKER_DESIGN.addRecommendedVideosNavigation();

        $('ytd-watch-next-secondary-results-renderer > div#items ytd-compact-video-renderer').each(function () {
            if (!$(this).find('ytd-thumbnail > a#thumbnail .fua_app_view_video_title').length) {
                var img_src = $(this).find('ytd-thumbnail > a#thumbnail img').attr('src');
                if(img_src && img_src.indexOf("https") != -1) {
                    img_src = img_src.replace(new RegExp('hqdefault.jpg', ''), 'mqdefault.jpg');
                    var video_title = $(this).find('ytd-video-meta-block div#heading yt-formatted-string#video-title').html();

                    $(this).find('ytd-thumbnail > a#thumbnail')
                        .css('background-image', 'url(' + img_src + ')')
                        .css('background-size', 'cover')
                        .css('background-repeat', 'no-repeat');

                    $(this).find('ytd-thumbnail > a#thumbnail').append(
                        '<div class="fua_app_view_video_title">' +
                            '<div style="width: 120px; margin: 0px 20px 0px; height: 80px; overflow: hidden;">' +
                                video_title +
                            '</div>' +
                        '</div>'
                    );
                }
            }
        });

        var videoCount = $('ytd-watch-next-secondary-results-renderer > div#items ytd-compact-video-renderer').length;
        $('ytd-watch-next-secondary-results-renderer').css('width', videoCount * 170);
    };


    Blocker_design.prototype.changeRecommendedVideosView= function(time){
        if(!time) var time = 0;

        // old design
        if(!$('.fua_app_view_video_title').length) {
            FUA_BLOCKER_DESIGN.addRecommendedVideosNavigation();

            $('ul.video-list li.video-list-item').each(function () {
                if ($(this).hasClass('related-list-item-compact-video')) {
                    if (!$(this).find('div.thumb-wrapper > a span:first .fua_app_view_video_title').length) {
                        var img_src = $(this).find('div.thumb-wrapper > a img').hide().attr('data-thumb');
                        var video_title = $(this).find('div.content-wrapper > a span.title').html();
                        if (!img_src) img_src = $(this).find('div.thumb-wrapper > a img').attr('src');
                        img_src = img_src.replace(new RegExp('hqdefault.jpg', ''), 'mqdefault.jpg');
                        $(this).find('div.thumb-wrapper > a')
                            .css('background-image', 'url(' + img_src + ')')
                            .css('background-size', 'cover')
                            .css('background-repeat', 'no-repeat');

                        $(this).find('div.thumb-wrapper > a span:first').append(
                            '<div class="fua_app_view_video_title">' +
                            video_title +
                            '</div>'
                        );
                    }
                }
            });

            var videoCount = $('ul#watch-related > li.related-list-item-compact-video').length;
            $('#watch-related').css('width', videoCount * 170);
        }

        // new design
        var recommendedVideoItems = $('ytd-watch-next-secondary-results-renderer > div#items');
        if(
            recommendedVideoItems.length
            && !recommendedVideoItems.hasClass(FUA_BLOCKER_DESIGN.class.observer)
        ){
            recommendedVideoItems.addClass(FUA_BLOCKER_DESIGN.class.observer);
            var observer = new MutationObserver(function(){
                FUA_BLOCKER_DESIGN.changeRecommendedVideosViewForNewDesign();
            });
            observer.observe(recommendedVideoItems[0], {
                childList: true,
                subtree : true,
                attributes : true,
                attributeFilter : ["src"]
            });
        }



        if(time < 5000){
            setTimeout(function(){
                time = time + 500;
                FUA_BLOCKER_DESIGN.changeRecommendedVideosView(time);
            }, 500);
        }
    };



     Blocker_design.prototype.addInfoLine = function(time){
        if(!time) time = 0;
         var mainBlock = FUA_BLOCKER_DESIGN.getMainMetaBlock();


        if(!$('#fua_new_video_info_line').length) {
            mainBlock.append(
                '<div id="fua_new_video_info_line" style="display: none;">' +
                    '<table>' +
                        '<tr>' +
                            '<td class="fua_img_block">' +
                            '   <div></div>' +
                            '</td>' +
                            '<td class="fua_text_block">' +
                                '<div class="fua_first_line">' +
                                    '<span class="fua_video_title"></span>' +
                                    '<span class="fua_views_count"></span>' +
                                '</div>' +
                                '<div class="fua_second_line">' +
                                    '<span class="fua_channel_link"></span>' +
                                    '<span class="fua_published_date"></span>' +
                                '</div>' +
                            '</td>' +
                        '</tr>' +
                    '</table>' +
                '</div>'
            );
        }


         var img = $('#fua_new_video_info_line .fua_img_block > div img');
         var photo = $('#watch7-user-header a.yt-user-photo');
         if (!photo.length) photo = mainBlock.find("div#meta ytd-video-secondary-info-renderer ytd-video-owner-renderer > a");

         if (!img.length || img.closest("a").attr("href") != photo.attr("href")) {
             $('#fua_new_video_info_line .fua_img_block > div').html(photo.clone());
         }

         if (img.length && (!img.attr('src') || !img.attr('src').match("^https"))) {
             if (img.attr('data-thumb')) img.attr('src', img.attr('data-thumb'));
             else if (photo.length && photo.find("img").attr('src') && photo.find("img").attr('src').match("^https")) {
                 img.attr('src', photo.find("img").attr('src'));
             }
         }

        var videoTitle = $('#eow-title');
        if(!videoTitle.length) videoTitle = mainBlock.find("div#info ytd-video-primary-info-renderer h1");

        var infoTitle = $('#fua_new_video_info_line .fua_video_title');
        if(infoTitle.html() != videoTitle.html()) {
             infoTitle.html(videoTitle.html());
        }


         var viewsCount = $('#watch7-views-info .watch-view-count');
         if(!viewsCount.length) viewsCount = mainBlock.find("div#info ytd-video-primary-info-renderer div#info yt-view-count-renderer > yt-formatted-string.view-count");


         var infoViewCount = $('#fua_new_video_info_line .fua_views_count');
         if(viewsCount.html() != infoViewCount.html()){
             infoViewCount.html(viewsCount.html());
         }


         var pubDate = $('#watch-uploader-info strong');
         if(!pubDate.length) pubDate = mainBlock.find("div#upload-info yt-formatted-string.date");
         var infoDate = $('#fua_new_video_info_line .fua_published_date');
         if(pubDate.html() != infoDate.html()) infoDate.html(pubDate.html());



         var channel = $('#watch7-user-header .yt-user-info');
         if(!channel.length) channel = mainBlock.find("yt-formatted-string#owner-name");
         var infoChannel = $('#fua_new_video_info_line .fua_channel_link');
         if(channel.html() != infoChannel.html()) infoChannel.html(channel.html());


        if(time < 5000){
            time = time + 300;
            setTimeout(function(){
                FUA_BLOCKER_DESIGN.addInfoLine(time);
            }, 300);
        }
    };



    Blocker_design.prototype.changeTags = function(){
        var currentUrl = window.location.href;
        var tagsBlock = $('#fua_tags_block_id');

        if(tagsBlock.length && tagsBlock.attr("tags_url") != currentUrl) {

            tagsBlock.attr("tags_url", currentUrl);

            var video_id =
                FUA_BLOCKER_TEXT_HELPER.getVideoIdFromUrl(currentUrl);
            if (video_id) {
                getOneVideoTags(
                    video_id,
                    function (tags) {
                        var stringTags = '';
                        if (tags.length) {
                            for (var i in tags) {
                                stringTags +=
                                    '<span class="fua_video_tags">' + tags[i] + '</span>';
                            }

                            $('.fua_tag_items_box').html(stringTags);
                        }
                        else $('.fua_tag_items_box').html(
                            '<span style="margin: 0px 10px 0px">' + C_TEXT_NO_TAGS + '</span>'
                        );
                    }
                );
            }
        }
    };



    Blocker_design.prototype.addCommentsCount = function () {
        var commentsHeaderTitle = $("#comment-section-renderer .comment-section-header-renderer b");
        if(!commentsHeaderTitle.length) {
            commentsHeaderTitle = $("h2.ytd-comments-header-renderer yt-formatted-string.count-text");
        }

        var commentsCount = commentsHeaderTitle.html();
        if(commentsCount){
            commentsCount = commentsCount.trim().replace(new RegExp('[A-ZА-Я]*$', 'i'), '').trim();
        }

        if(!commentsCount == 0) {
            $('#fua_right_content_toggle_id .fua_youtube_button_show_comments').html(
                C_WORD_COMMENTS + ' (' + commentsCount + ')'
            );
        }
    };



    Blocker_design.prototype.addCommentsButtons = function(time){
        if(!time) time = 0;
        var watchBlock = FUA_BLOCKER_DESIGN.getMainMetaBlock();

        if(!$('#fua_right_content_toggle_id').length){
            watchBlock.prepend(
                '<div id="fua_right_content_toggle_id">' +
                    '<div class="fua_youtube_button fua_youtube_button_show_comments fua_active_button">'+ C_WORD_COMMENTS +'</div>' +
                    '<div class="fua_youtube_button fua_youtube_button_show_info">'+ C_WORD_DESCRIPTION +'</div>' +
                    '<div class="fua_youtube_button fua_youtube_button_show_tags">#'+ C_WORD_TAGS +'</div>' +
                '</div>'
            );

            if(!$('#fua_tags_block_id').length){
                watchBlock.append(
                    '<div id="fua_tags_block_id"></div>'
                );

                if($('#fua_tags_block_id').length) {

                    $('#fua_tags_block_id').html(
                        '<div class="fua_tag_items_box"></div>' +
                        '<div class="fus_tag_msg_box" style="margin: 10px;">' +
                            '<div style="font-weight: bold; margin: 0px 0px 10px">' +
                                C_TEXT_FIRST_ADV_CLEVER_FOR_YOUTUBE +
                            '</div>' +
                            '<div>' +
                                 C_TEXT_SECOND_ADV_CLEVER_FOR_YOUTUBE +
                                '<a target="_blank" href="'+ FOU_BLOCKER_BROWSER_CONSTANTS.plugin_for_youtube_url +'">' +
                                    C_WORD_READ +
                                '</a>' +
                            '</div>' +
                        '</div>'
                    );

                    FUA_BLOCKER_DESIGN.changeTags();

                }
            }




            $('#fua_right_content_toggle_id .fua_youtube_button').click(function(){
                $('#fua_right_content_toggle_id .fua_youtube_button').removeClass('fua_active_button');
                $(this).addClass('fua_active_button');

                $('#top > #container > #main > div#info').hide();
                $('#top > #container > #main > ytd-comments#comments').hide();
                $("#top > #container > #main > div#meta > ytd-video-secondary-info-renderer ytd-expander").hide();

                $('#action-panel-details').hide();
                $('#watch-discussion').hide();
                //$('#watch7-creator-bar').hide();
                //$('#watch-header').hide();
                $('#fua_tags_block_id').hide();
                //$('#watch-action-panels').css('position', 'absolute').css('visibility', 'hidden');


                if($(this).hasClass('fua_youtube_button_show_comments')){
                    $('#top > #container > #main > ytd-comments#comments').show();
                    $('#watch-discussion').show();
                    gv_open_comments = 2;
                }
                else if($(this).hasClass('fua_youtube_button_show_info')){
                    $('#top > #container > #main > div#info').show();
                    $("#top > #container > #main > div#meta > ytd-video-secondary-info-renderer ytd-expander").show();
                    $('#action-panel-details').show();
                    //$('#watch7-creator-bar').show();
                    //$('#watch-header').show();
                    // $('#watch-action-panels').css('position', 'relative').css('visibility', 'visible');
                    gv_open_comments = 3;
                }
                else if($(this).hasClass('fua_youtube_button_show_tags')){
                    $('#fua_tags_block_id').show();
                }

                showRightBlock(gv_open_comments, true);
            });
        }

        this.changeTags();
        this.addCommentsCount();

        if(time < 5000){
            time = time + 300;
            setTimeout(function(){
                FUA_BLOCKER_DESIGN.addCommentsButtons(time);
            }, 300);
        }
    };


    Blocker_design.prototype.addCommentsAutoLoad = function(time){
        var newCommentsBlock = $('#top > #container > #main > ytd-comments#comments > ytd-item-section-renderer > div#contents');


        if(
            $('#comment-section-renderer-items').length
            && $('#comment-section-renderer .comment-section-renderer-paginator').length
            && !$('#comment-section-renderer-items').hasClass('fua_comments_auto_load')
        ){
            var commentsBlock = $('#comment-section-renderer-items');
            var informerId = 'fua_loading_comments_informer_id';



            changeCommentsThumbs();
            var observer = new MutationObserver(function(){
                var loadInformer = $('#' + informerId);
                if(loadInformer.length && loadInformer.next().length){
                    loadInformer.remove();
                }

                changeCommentsThumbs();
            });
            observer.observe(commentsBlock[0], {
                childList: true,
                subtree : true
            });


            commentsBlock.addClass('fua_comments_auto_load').scroll(function(){
                var loadMoreButton = $('#comment-section-renderer .comment-section-renderer-paginator');

                if(
                    loadMoreButton.length
                    && !loadMoreButton.hasClass('yt-uix-load-more-loading')
                    && commentsBlock[0].scrollTop + commentsBlock.height() + 50 > commentsBlock[0].scrollHeight
                ){
                    commentsBlock.append(
                        '<div id="'+ informerId +'">' +
                        '<img src="'+ IMAGE_LOADING +'">' +
                        '</div>'
                    );
                    loadMoreButton.click();
                }
            });
        }
        else if(
            newCommentsBlock.length
            && !newCommentsBlock.hasClass('fua_comments_auto_load')
        ){
            newCommentsBlock.addClass('fua_comments_auto_load').scroll(function(){
                var loadMoreBlock = $('#top > #container > #main > ytd-comments#comments > ytd-item-section-renderer > div#continuations');


                if(
                    newCommentsBlock[0].scrollTop + newCommentsBlock.height() + 50 > newCommentsBlock[0].scrollHeight
                ){
                    //console.log("scrollCommentsEnd");
                    loadMoreBlock.css("display", "block");
                }
                else{
                    //console.log("scrollComments");
                    loadMoreBlock.css("display", "none");
                }

                window.dispatchEvent(new Event("resize"));
            });

            var observer = new MutationObserver(function(){
                newCommentsBlock.scroll();
                FUA_BLOCKER_DESIGN.addCommentsCount();
            });
            observer.observe(newCommentsBlock[0], {
                childList: true
            });
        }

        if(!time) time = 0;
        if(time < 10000){
            time = time + 300;
            setTimeout(function(){
                FUA_BLOCKER_DESIGN.addCommentsAutoLoad(time);
            }, 300);
        }
    };


    Blocker_design.prototype.changeActionButton = function(time){
        if(!time) time = 0;
        var testInfoLine = $('#fua_new_action_buttons_line_id');


        if(
            !testInfoLine.length
            &&
            (
                $('#watch7-subscription-container .yt-uix-subscription-button').length
                || $('#watch7-subscription-container .channel-settings-link').length
            )
            && $('#watch8-sentiment-actions .like-button-renderer-like-button').length
            && $('#watch8-sentiment-actions .like-button-renderer-dislike-button').length
        ){
            $('#watch7-content').append(
                '<div id="fua_new_action_buttons_line_id"></div>'
            );

            var actionLine = $('#fua_new_action_buttons_line_id');

            var cloneButton = $('#watch7-subscription-container .yt-uix-subscription-button').clone();
            actionLine.append(cloneButton);
            var button = $('#fua_new_action_buttons_line_id .yt-uix-subscription-button');
            button.addClass('fua_new_subscribe_button');
            button.find('.subscribe-label').prepend(
                '<div style="margin-top: -4px; font-size: 18px; position: absolute">' +
                '+' +
                '</div>'
            );

            button.find('.subscribed-label').html('<img src="'+ IMAGE_CHECK_MARK +'">');
            button.find('.unsubscribe-label').html('<img src="'+ IMAGE_CHECK_MARK +'">');

            cloneButton = $('#watch7-subscription-container .channel-settings-link').clone();
            actionLine.append(cloneButton);

            function cloneLikeDislikeButton(options){
                var targetClass = options.targetClass;
                var otherClass = 'like';
                var image = IMAGE_DISLIKE_BUTTON;
                var image_clicked = IMAGE_DISLIKE_BUTTON_CLICKED;

                if(targetClass == 'like') {
                    otherClass ='dislike';
                    image = IMAGE_LIKE_BUTTON;
                    image_clicked = IMAGE_LIKE_BUTTON_CLICKED;
                }

                cloneButton = $('#watch8-sentiment-actions .like-button-renderer-'+ targetClass +'-button').clone();
                actionLine.append(cloneButton);

                button = $('#fua_new_action_buttons_line_id .like-button-renderer-'+ targetClass +'-button');
                button.click(function(event){
                    event.stopPropagation();
                    $('#watch8-sentiment-actions .like-button-renderer-'+ targetClass +'-button').not('.hid').click();
                    return false;
                });

                $('#watch8-sentiment-actions .like-button-renderer-'+ targetClass +'-button').click(function(){
                    $('#fua_new_action_buttons_line_id .like-button-renderer-'+ targetClass +'-button').each(function(){
                        if($(this).hasClass('hid')) $(this).removeClass('hid');
                        else $(this).addClass('hid');
                    });
                    $('#fua_new_action_buttons_line_id .like-button-renderer-'+ otherClass +'-button').removeClass('hid');
                    $('#fua_new_action_buttons_line_id .like-button-renderer-'+ otherClass +'-button').last().addClass('hid');
                });

                button.addClass('fua_new_'+targetClass+'_button');
                button.prepend(
                    '<span style="margin-top: -2px; position: absolute;">' +
                    '<img class="fua_no_clicked" src="'+ image +'">' +
                    '<img class="fua_clicked" src="'+ image_clicked +'">' +
                    '</span>'
                );
            }

            cloneLikeDislikeButton({targetClass : 'dislike'});
            cloneLikeDislikeButton({targetClass : 'like'});
            FUA_BLOCKER_DESIGN.addCommentIcon();
            changePlaceOfSomePanels();
        }



        var likeButton = $("#top > #container > #main > div#info ytd-menu-renderer div#top-level-buttons > ytd-toggle-button-renderer").eq(0);
        var dislikeButton = $("#top > #container > #main > div#info ytd-menu-renderer div#top-level-buttons > ytd-toggle-button-renderer").eq(1);
        var subscribeButton = $("#top > #container > #main > div#meta div#subscribe-button");
        var currentUrl = window.location.href;

        if(!testInfoLine.length && subscribeButton.length && likeButton.length && dislikeButton.length){
            FUA_BLOCKER_DESIGN.getMainMetaBlock().append(
                '<div id="fua_new_action_buttons_line_id" class="fua_new_design_action_buttons_line" video_url="'+ currentUrl +'"></div>'
            );
            var actionLine = $('#fua_new_action_buttons_line_id');
            actionLine.append(subscribeButton);

            actionLine.append(likeButton);
            actionLine.append(dislikeButton);
            FUA_BLOCKER_DESIGN.addCommentIcon();
        }
        else if(
            testInfoLine.length
            && testInfoLine.hasClass("fua_new_design_action_buttons_line")
            && testInfoLine.attr("video_url") != currentUrl
        ){
            testInfoLine.find("ytd-toggle-button-renderer").remove();
            var likeButton = $("#top > #container > #main > div#info ytd-menu-renderer div#top-level-buttons > ytd-toggle-button-renderer").eq(0);
            var dislikeButton = $("#top > #container > #main > div#info ytd-menu-renderer div#top-level-buttons > ytd-toggle-button-renderer").eq(1);
            if(likeButton.length && dislikeButton.length){
                testInfoLine.prepend(dislikeButton);
                testInfoLine.prepend(likeButton);
                testInfoLine.attr("video_url", currentUrl);
            }
        }



        if(time < 5000){
            time = time + 300;
            setTimeout(function(){
                FUA_BLOCKER_DESIGN.changeActionButton(time);
            }, 300);
        }
    };



     Blocker_design.prototype.addCommentIcon =  function(time){
        if(!time) time = 0;
        var textComments = C_WORD_COMMENTS;
        var textDescription = C_WORD_DESCRIPTION;
        var targetBlock = $('#fua_new_action_buttons_line_id');

        if(
            !$('#fua_show_description_id').length
            && !$('#fua_open_comments_id').length
            && targetBlock.length
        ) {

            targetBlock.append(
                '<span id="fua_open_comments_id" class="fua_under_video_button fua_under_video_comments" initial-text="'+ textComments +'">' +
                '<button class="yt-uix-button yt-uix-button-size-default yt-uix-tooltip" type="button" data-force-position="true" data-position="bottomright" data-orientation="vertical" data-tooltip-text="'+ textComments +'">' +
                '<img src="'+ IMAGE_COMMENTS +'">' +
                '<span class="yt-uix-button-content">' +
                textComments +
                '</span>' +
                '</button>' +
                '</span>'
            );

            targetBlock.append(
                '<span id="fua_show_description_id" class="fua_under_video_button fua_under_video_description" initial-text="'+ textDescription +'">' +
                '<button class="yt-uix-button yt-uix-button-size-default yt-uix-tooltip" type="button" data-force-position="true" data-position="bottomright" data-orientation="vertical" data-tooltip-text="'+ textDescription +'">' +
                '<img src="'+ IMAGE_DESCRIPTION +'">' +
                '<span class="yt-uix-button-content">' +
                textDescription +
                '</span>' +
                '</button>' +
                '</span>'
            );


            $('.fua_under_video_button').click(function(){
                var tabNumber = 2;
                if($(this).hasClass('fua_under_video_description')) tabNumber = 3;

                if(gv_open_comments > 1) hideRightBlock();
                else {
                    gv_open_comments = tabNumber;
                    showRightBlock(tabNumber);
                }
            });
        }


        if(!$('#fua_close_comments_id').length) {

            $('#watch7-content').append(
                '<div id="fua_close_comments_id">' +
                '<div>' +
                '<img src="'+ IMAGE_LEFT_WHITE_ARROW +'">' +
                '</div>' +
                '</div>'
            );


            $('#fua_close_comments_id').click(function(){
                hideRightBlock();
            });
        }


        if(gv_open_comments > 1) {
            showRightBlock(gv_open_comments);
        }
    };


    return new Blocker_design();
})();