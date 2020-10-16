var FUA_YT_COMMENTS = (function(){
    function Comments(){
        this.prefix = 'fua_youtube_';
        this.id = {
            'comment_filter_select' : this.prefix + 'comment_filter_select_id',
            'comment_filter_input' : this.prefix + 'comment_filter_input_id',
        };
        this.class = {
            "comment_observer" : this.prefix + 'comment_observer',
            "hidden_comment" :  this.prefix + 'hidden_comment',
            "target_phrase_exist" :  this.prefix + 'target_phrase_exist',
            "highlighted_comment_text" : this.prefix + 'highlighted_comment_text',
            "filtered_comment" : this.prefix + 'filtered_comment',
            "subscriber_count_label" : this.prefix + 'subscriber_count_label',
            "highlighted_comment_class" : this.prefix + 'highlighted_comment_class',

        };

        this.filterMod = false;
        this.userName = false;
        this.timeLastTap = false;
        this.regexp = {
            correctInput : new RegExp("[<>]", "g")
        };
        this.channel_subscribers = {};
        this.minimalSubscribers = false;
    }



    Comments.prototype.executeFilterWithDelay = function(currentTime){
        setTimeout(function(){
            if(FUA_YT_COMMENTS.timeLastTap == currentTime) {
                FUA_YT_COMMENTS.clearFilteredClasses();
                FUA_YT_COMMENTS.commentFilter();
            }
        }, 500);
    };


    Comments.prototype.removeHighlighting = function(){
        $("." + this.class.highlighted_comment_text).each(function(){
            var text = $(this).html();
            $(this).replaceWith(text);
        });
    };


    Comments.prototype.getChannel = function(options){
        $.get(
            "https://www.youtube.com" + options.channelUrl,
            "",
            function(res){
                if(res) {
                    options.callback({res : res, channelUrl : options.channelUrl, comments : options.comments});
                }
            }
        );
    };


    Comments.prototype.filterBySubscribers = function(options){
        //var subscribers = $($.parseHTML(options.res))
        // .find("span.yt-subscription-button-subscriber-count-branded-horizontal").html();
        const json = JSON.parse(options.res.match(new RegExp('window\\["ytInitialData"\\][ ]*=[ ]*(.+}]}}})', 'i'))[1]);

        let subscribers = '0';
        if(json.header.c4TabbedHeaderRenderer.subscriberCountText){
            subscribers = json.header.c4TabbedHeaderRenderer
                .subscriberCountText.simpleText;
        }


        if(subscribers || subscribers === "0"){
            subscribers = parseInt(
                subscribers
                    .replace('тыс', '000')
                    .replace('млн', '000000')
                    .replace(new RegExp('[^0-9]+', 'gi'), '')
            );

            this.channel_subscribers[options.channelUrl] = subscribers;

            $('div.comment-header > a.user-name[href="'+ options.channelUrl +'"]').each(function(){
                FUA_YT_COMMENTS.addSubscribersCountLabel($(this));
            });

            if(this.filterMod !== "minimal_subscribers") return false;
            if(subscribers >= this.minimalSubscribers){
                for(var i in options.comments) {
                    var comment = options.comments[i];
                    comment
                        .addClass(this.class.target_phrase_exist)
                        .removeClass(this.class.hidden_comment);
                }
            }
            else {
                for(var i in options.comments) {
                    var comment = options.comments[i];
                    if(!comment.hasClass(this.class.target_phrase_exist)){
                        comment.addClass(this.class.hidden_comment);
                    }
                }
            }

        }

        //console.log("channel_subscribers", this.channel_subscribers);
    };


    Comments.prototype.addSelect = function(){
        if(!$("#" + this.id.comment_filter_select).length) {
            $('.options-bar').append(
                '<select id="' + this.id.comment_filter_select + '">' +
                    '<option value="all">'+ chrome.i18n.getMessage("all_comments") +'</option>' +
                    '<option value="with_replies">'+ chrome.i18n.getMessage("with_answer") +'</option>' +
                    '<option value="without_replies">'+ chrome.i18n.getMessage("without_answer") +'</option>' +
                    '<option value="i_replied">'+ chrome.i18n.getMessage("i_replied") +'</option>' +
                    '<option value="i_not_replied">'+ chrome.i18n.getMessage("i_not_replied") +'</option>' +
                    '<option value="by_user_name">'+ chrome.i18n.getMessage("by_user_name") +'</option>' +
                    '<option value="by_phrase">'+ chrome.i18n.getMessage("by_phrase") +'</option>' +
                    '<option value="minimal_subscribers">'+ chrome.i18n.getMessage("min_quantity_of_subscribers") +'</option>' +
                    '<option value="minimal_likes">'+ chrome.i18n.getMessage("min_quantity_of_likes") +'</option>' +
                '</select>' +

                '<div>' +
                    '<input type="text" id="'+ this.id.comment_filter_input+'" placeholder="'+ chrome.i18n.getMessage("word_filtrate") +'...">' +
                '</div>'
            );
        }

        var filterInput = document.getElementById(FUA_YT_COMMENTS.id.comment_filter_input);

        $("#" + this.id.comment_filter_select).change(function(){
            FUA_YT_COMMENTS.filterMod = $(this).val();
            FUA_YT_COMMENTS.clearFilteredClasses();
            FUA_YT_COMMENTS.commentFilter();

            if(
                FUA_YT_COMMENTS.filterMod == "by_user_name"
                || FUA_YT_COMMENTS.filterMod == "by_phrase"
                || FUA_YT_COMMENTS.filterMod == "minimal_subscribers"
                || FUA_YT_COMMENTS.filterMod == "minimal_likes"
            ){
                $(filterInput).show();
            }
            else $(filterInput).hide();
        });

        filterInput.addEventListener("input", function(){
            FUA_YT_COMMENTS.timeLastTap = (new Date()).getTime();
            FUA_YT_COMMENTS.executeFilterWithDelay(FUA_YT_COMMENTS.timeLastTap);
        });

        if(
            $('#yt-comments-list').length
            && !$("." + this.class.comment_observer).length
        ){
            var observeElement = document.getElementById('yt-comments-list');
            observeElement.classList.add(this.class.comment_observer);
            FUA_YT_COMMENTS.commentFilter();

            var observer = new MutationObserver(function(mutations) {
                //console.log("observerChange");
                FUA_YT_COMMENTS.commentFilter();
            });

            observer.observe(observeElement, {
                //attributes: true,
                childList: true,
                //subtree : true
            });
        }
    };


    Comments.prototype.addSubscribersCountLabel = function(userNameElement){
        var channelUrl = userNameElement.attr("href");
        var highlightClass = "";
        if(this.channel_subscribers[channelUrl] >= this.minimalSubscribers){
            highlightClass = this.class.highlighted_comment_class
        }

        var countLabel = userNameElement.siblings("." + this.class.subscriber_count_label);
        if(!countLabel.length){
            userNameElement.parent().append(
                '<span class="'+ this.class.subscriber_count_label +' ' + highlightClass + '">' +
                    this.channel_subscribers[channelUrl] + ' subscribers' +
                '</span>'
            );
        }
        else if(highlightClass) countLabel.addClass(highlightClass);
    };


    Comments.prototype.commentFilter = function(){
        if(!this.userName) this.userName = $('span.yt-user-name').html();
        var inputValue = $("#" + this.id.comment_filter_input).val().trim();

        var firstPartSelector = '#yt-comments-list > div.comment-entry:not(.'+ this.class.filtered_comment +')';
        var mod = this.filterMod;
        if(mod === "with_replies"){
            $(firstPartSelector + ' > div:nth-child(2):not(:has(>div))')
                .closest("div.comment-entry")
                .addClass(this.class.hidden_comment);
        }
        else if(mod === "without_replies"){
            $(firstPartSelector + ' > div:nth-child(2) > div')
                .closest("div.comment-entry")
                .addClass(this.class.hidden_comment);
        }
        else if(mod === "i_replied"){

            $(firstPartSelector + ' > div:nth-child(2):not(:has(>div[data-name="'+ this.userName +'"]))')
                .closest("div.comment-entry")
                .addClass(this.class.hidden_comment);
        }
        else if(mod === "i_not_replied"){
            $(firstPartSelector + ' > div:nth-child(2) > div[data-name="'+ this.userName +'"]')
                .closest("div.comment-entry")
                .addClass(this.class.hidden_comment);
        }
        else if(mod === "by_user_name" && inputValue.length > 2){
            $(firstPartSelector + ':not(:has(>div:first[data-name*="'+ inputValue +'"]))')
                .closest("div.comment-entry")
                .addClass(this.class.hidden_comment);
            $(firstPartSelector + ' > div:nth-child(2):has(>div[data-name*="'+ inputValue +'"])')
                .closest("div.comment-entry")
                .removeClass(this.class.hidden_comment);
        }
        else if(mod === "by_phrase" && inputValue.length > 2){
            inputValue = inputValue.replace(this.regexp.correctInput, "");
            var regexp = new RegExp('(' + inputValue + ')', "ig");
            var regexp2 = new RegExp(inputValue, "i");

            $(firstPartSelector + ' div.comment-text-content').each(function(){

                var textDiv = $(this);
                var html = textDiv.html();
                //console.log("yes", html);
                var comment = textDiv.closest("div.comment-entry");
                if (html.search(regexp2) != -1){
                    comment
                        .addClass(FUA_YT_COMMENTS.class.target_phrase_exist)
                        .removeClass(FUA_YT_COMMENTS.class.hidden_comment);

                    var newHtml = html.replace(regexp, '<span class="'+ FUA_YT_COMMENTS.class.highlighted_comment_text +'">$1</span>');
                    textDiv.html(newHtml);
                }
                else if(!comment.hasClass(FUA_YT_COMMENTS.class.target_phrase_exist)){
                    comment.addClass(FUA_YT_COMMENTS.class.hidden_comment);
                }
            });
        }
        else if(mod === "minimal_subscribers"){
            inputValue = parseInt(inputValue.replace(new RegExp("[^0-9]", "g"), ""));
            if(!inputValue) inputValue = 0;
            //$("#" + this.id.comment_filter_input).val(inputValue);
            var noSubscribersInfo = {};
            this.minimalSubscribers = inputValue;

            //console.log("channel_subscribers", FUA_YT_COMMENTS.channel_subscribers);
            //console.log("inputValue", inputValue);

            $(firstPartSelector + ' div.comment-header > a.user-name').each(function(){
                var channelUrl = $(this).attr("href");
                var comment = $(this).closest("div.comment-entry");
                if(FUA_YT_COMMENTS.channel_subscribers[channelUrl] !== undefined){

                    FUA_YT_COMMENTS.addSubscribersCountLabel($(this));

                    if(FUA_YT_COMMENTS.channel_subscribers[channelUrl] >= inputValue){
                        comment
                            .addClass(FUA_YT_COMMENTS.class.target_phrase_exist)
                            .removeClass(FUA_YT_COMMENTS.class.hidden_comment);
                    }
                    else if(!comment.hasClass(FUA_YT_COMMENTS.class.target_phrase_exist)){
                        comment.addClass(FUA_YT_COMMENTS.class.hidden_comment);
                    }
                }
                else{
                    if(!noSubscribersInfo[channelUrl]) noSubscribersInfo[channelUrl] = [];
                    noSubscribersInfo[channelUrl].push(comment);
                }
            });

            for(var i in noSubscribersInfo){
                this.getChannel({
                    channelUrl : i,
                    comments : noSubscribersInfo[i],
                    callback : function(options){
                        FUA_YT_COMMENTS.filterBySubscribers({
                            res : options.res,
                            comments : options.comments,
                            channelUrl : options.channelUrl
                        })
                    }
                })
            }
        }
        else if(mod === "minimal_likes"){
            inputValue = parseInt(inputValue.replace(new RegExp("[^0-9]", "g"), ""));
            if(!inputValue) inputValue = 0;
            $(firstPartSelector + ' td.mod-button[data-action="like"]').each(function(){
                var minus = 1;
                if($(this).hasClass("on")) minus = 0;
                var likesCount = $(this).closest("table.footer-button-bar")
                    .siblings("span.like-count:not(.off)").html();
                likesCount = parseInt(likesCount) - minus;

                var comment = $(this).closest("div.comment-entry");
                if(likesCount >= inputValue){
                    comment
                        .addClass(FUA_YT_COMMENTS.class.target_phrase_exist)
                        .removeClass(FUA_YT_COMMENTS.class.hidden_comment);
                    $(this).closest("table.footer-button-bar")
                        .siblings("span.like-count").addClass(FUA_YT_COMMENTS.class.highlighted_comment_class);
                }
                else if(!comment.hasClass(FUA_YT_COMMENTS.class.target_phrase_exist)){
                    comment.addClass(FUA_YT_COMMENTS.class.hidden_comment);
                }
            });
        }
        else{
            this.clearFilteredClasses();
        }

        $('#yt-comments-list > div.comment-entry').addClass(this.class.filtered_comment);


        if(
            $('#yt-comments-list > div.comment-entry:not(.'+ FUA_YT_COMMENTS.class.hidden_comment +')').length < 50
            && !$("#yt-comments-paginator").hasClass("hid")
        ){
            $("#yt-comments-paginator").click();
        }
    };


    Comments.prototype.clearFilteredClasses = function(){
        $('.' + this.class.hidden_comment)
            .removeClass(this.class.hidden_comment);
        $('.' + this.class.filtered_comment)
            .removeClass(this.class.filtered_comment);
        $('.' + this.class.target_phrase_exist)
            .removeClass(this.class.target_phrase_exist);
        $('.' + this.class.highlighted_comment_class)
            .removeClass(this.class.highlighted_comment_class);
        this.removeHighlighting();
    };


    return new Comments();
})();