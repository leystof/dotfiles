//https://studio.youtube.com/video/m09FYefYzLE/comments
class CommentFilter {
    constructor(){
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
        this.timeLastTap = false;
        this.regexp = {
            correctInput : new RegExp("[<>]", "g")
        };
        this.channel_subscribers = {};
        this.minimalSubscribers = false;
        this.commentObserver = null;
        this.commentUrlRegexp = new RegExp('https://studio.youtube.com/video/([^/]+)/comments');
    }



    executeFilterWithDelay(currentTime){
        setTimeout(() => {
            if(this.timeLastTap === currentTime) {
                this.clearFilteredClasses();
                this.commentFilter();
            }
        }, 500);
    };


    removeHighlighting(){
        $("." + this.class.highlighted_comment_text).each((index, element) =>{
            const text = $(element).html();
            $(element).replaceWith(text);
        });
    };


    clearFilteredClasses(){
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


    addSubscribersCountLabel(userNameElement){
        let channelUrl = userNameElement.attr("href");
        let highlightClass = "";
        if(this.channel_subscribers[channelUrl] >= this.minimalSubscribers){
            highlightClass = this.class.highlighted_comment_class
        }

        let countLabel = userNameElement.siblings("." + this.class.subscriber_count_label);
        if(!countLabel.length){
            userNameElement.parent().append(
                '<span class="'+ this.class.subscriber_count_label +' ' + highlightClass + '">' +
                    this.channel_subscribers[channelUrl] + ' subscribers' +
                '</span>'
            );
        }
        else if(highlightClass) countLabel.addClass(highlightClass);
    };


    addSelect(){
        if(
            !$("#" + this.id.comment_filter_select).length
            && $('paper-tabs#tabs > div#tabsContainer > div#tabsContent').length
        ) {
            $('paper-tabs#tabs > div#tabsContainer > div#tabsContent').append(
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
                '</select>'
            );

            this.filterMod = null;
            $("#" + this.id.comment_filter_select).change(e => {
                this.filterMod = e.target.value;
                this.clearFilteredClasses();
                this.commentFilter();

                let filterInput = document.getElementById(this.id.comment_filter_input);

                if(
                    this.filterMod === "by_user_name"
                    || this.filterMod === "by_phrase"
                    || this.filterMod === "minimal_subscribers"
                    || this.filterMod === "minimal_likes"
                ){
                    $(filterInput).show();
                }
                else $(filterInput).hide();
            });
        }


        if(
            !$("#" + this.id.comment_filter_input).length
            && $('#sort-menu-container').length
        ) {
            $('#sort-menu-container').prepend(
                '<div>' +
                    '<input style="height: 25px;" type="text" id="'+ this.id.comment_filter_input+'" placeholder="'+ chrome.i18n.getMessage("word_filtrate") +'...">' +
                '</div>'
            );

            let filterInput = document.getElementById(this.id.comment_filter_input);

            filterInput.addEventListener("input", () => {
                this.timeLastTap = (new Date()).getTime();
                this.executeFilterWithDelay(this.timeLastTap);
            });
        }


        if(
            $('#comments-section > #comments-section > #contents').length
            && !$("." + this.class.comment_observer).length
        ){
            if(  this.commentObserver) this.commentObserver.disconnect();
            let observeElement = document.querySelector('#comments-section > #comments-section > #contents');
            observeElement.classList.add(this.class.comment_observer);
            this.commentFilter();

            console.log('addObserver');

            this.commentObserver = new MutationObserver(mutations => {
                console.log("observerChange");
                this.commentFilter();
            });

            this.commentObserver.observe(observeElement, {
                //attributes: true,
                childList: true,
                //subtree : true
            });
        }
    };


    getChannel(options){
        $.get(
            options.channelUrl,
            "",
            function(res){
                if(res) {
                    options.callback({res : res, channelUrl : options.channelUrl, comments : options.comments});
                }
            }
        );
    };


    filterBySubscribers(options){
        const json = JSON.parse(options.res.match(new RegExp('window\\["ytInitialData"\\][ ]*=[ ]*(.+}]}}})', 'i'))[1]);
        //console.log("filterBySubscribers", json);

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


            $('ytcp-comment a#name[href="'+ options.channelUrl + '"]').each((index, element) =>{
                this.addSubscribersCountLabel($(element));
            });

            if(this.filterMod !== "minimal_subscribers") return false;
            if(subscribers >= this.minimalSubscribers){
                for(let i in options.comments) {
                    let comment = options.comments[i];
                    comment
                        .addClass(this.class.target_phrase_exist)
                        .removeClass(this.class.hidden_comment);
                }
            }
            else {
                for(let i in options.comments) {
                    let comment = options.comments[i];
                    if(!comment.hasClass(this.class.target_phrase_exist)){
                        comment.addClass(this.class.hidden_comment);
                    }
                }
            }

        }

        //console.log("channel_subscribers", this.channel_subscribers);
    };


    commentFilter(){
        if(
            !$("#" + this.id.comment_filter_input).length
            || !$("#" + this.id.comment_filter_select).length
        ) return false;


        let inputValue = $("#" + this.id.comment_filter_input).val();
        inputValue = inputValue ? inputValue.trim() : '';
        let firstPartSelector = '#comments-section > #comments-section > #contents > ytcp-comment-thread:not(.'+ this.class.filtered_comment +')';
        let mod = this.filterMod;


        if(mod === "with_replies"){
            $(firstPartSelector + ' > ytcp-comment-replies:not(:has(>ytcp-comment))')
                .closest("ytcp-comment-thread")
                .addClass(this.class.hidden_comment);
        }
        else if(mod === "without_replies"){
            $(firstPartSelector + ' > ytcp-comment-replies > ytcp-comment')
                .closest("ytcp-comment-thread")
                .addClass(this.class.hidden_comment);
        }
        else if(mod === "i_replied"){
            $(firstPartSelector + ' > ytcp-comment-replies:not(:has(ytcp-author-comment-badge))')
                .closest("ytcp-comment-thread")
                .addClass(this.class.hidden_comment);
        }
        else if(mod === "i_not_replied"){
            $(firstPartSelector + ' > ytcp-comment-replies:has(ytcp-author-comment-badge)')
                .closest("ytcp-comment-thread")
                .addClass(this.class.hidden_comment);
        }
        else if(mod === "by_user_name" && inputValue.length > 2){
            $(firstPartSelector + ' ytcp-comment yt-formatted-string.author-text:not(:contains('+ inputValue +'))')
                .closest("ytcp-comment-thread")
                .addClass(this.class.hidden_comment);

            $(firstPartSelector + ' ytcp-comment yt-formatted-string.author-text:contains('+ inputValue +')')
                .closest("ytcp-comment-thread")
                .removeClass(this.class.hidden_comment);
        }
        else if(mod === "by_phrase" && inputValue.length > 2){
            inputValue = inputValue.replace(this.regexp.correctInput, "");
            let regexp = new RegExp('(' + inputValue + ')', "ig");
            let regexp2 = new RegExp(inputValue, "i");

            $(firstPartSelector + ' yt-formatted-string#content-text').each((index, element) => {
                let textDiv = $(element);
                let html = textDiv.html();
                //console.log("yes", html);
                let comment = textDiv.closest("ytcp-comment-thread");
                if (html.search(regexp2) != -1){
                    comment
                        .addClass(this.class.target_phrase_exist)
                        .removeClass(this.class.hidden_comment);

                    let newHtml = html.replace(regexp, '<span class="'+ this.class.highlighted_comment_text +'">$1</span>');
                    textDiv.html(newHtml);
                }
                else if(!comment.hasClass(this.class.target_phrase_exist)){
                    comment.addClass(this.class.hidden_comment);
                }
            });
        }
        else if(mod === "minimal_subscribers"){
            inputValue = parseInt(inputValue.replace(new RegExp("[^0-9]", "g"), ""));
            if(!inputValue) inputValue = 0;
            //$("#" + this.id.comment_filter_input).val(inputValue);
            let noSubscribersInfo = {};
            this.minimalSubscribers = inputValue;

            //console.log("channel_subscribers", FUA_YT_COMMENTS.channel_subscribers);
            //console.log("inputValue", inputValue);

            $(firstPartSelector + ' ytcp-comment yt-formatted-string.author-text').each((index, element) =>{
                let channelUrl = $(element).parent().attr("href");
                let comment = $(element).closest("ytcp-comment-thread");
                if(this.channel_subscribers[channelUrl] !== undefined){

                    this.addSubscribersCountLabel($(element).parent());

                    if(this.channel_subscribers[channelUrl] >= inputValue){
                        comment
                            .addClass(this.class.target_phrase_exist)
                            .removeClass(this.class.hidden_comment);
                    }
                    else if(!comment.hasClass(this.class.target_phrase_exist)){
                        comment.addClass(this.class.hidden_comment);
                    }
                }
                else{
                    if(!noSubscribersInfo[channelUrl]) noSubscribersInfo[channelUrl] = [];
                    noSubscribersInfo[channelUrl].push(comment);
                }
            });

            for(let i in noSubscribersInfo){
                this.getChannel({
                    channelUrl : i.replace('http', 'https'),
                    comments : noSubscribersInfo[i],
                    callback : options => {
                        this.filterBySubscribers({
                            res : options.res,
                            comments : options.comments,
                            channelUrl : i
                        })
                    }
                })
            }
        }
        else if(mod === "minimal_likes"){
            inputValue = parseInt(inputValue.replace(new RegExp("[^0-9]", "g"), ""));
            if(!inputValue) inputValue = 0;
            $(firstPartSelector + ' #like-button').each((index, element) =>{
                let likesCount = $(element).siblings("#vote-count").text();
                let comment = $(element).closest("ytcp-comment-thread");
                if(likesCount >= inputValue){
                    comment
                        .addClass(this.class.target_phrase_exist)
                        .removeClass(this.class.hidden_comment);
                    $(element).siblings("#vote-count")
                        .addClass(this.class.highlighted_comment_class);
                }
                else if(!comment.hasClass(this.class.target_phrase_exist)){
                    comment.addClass(this.class.hidden_comment);
                }
            });
        }
        else{
            this.clearFilteredClasses();
        }

        $('#comments-section > #comments-section > #contents > ytcp-comment-thread')
            .addClass(this.class.filtered_comment);


        if(
            $('#comments-section > #comments-section > #contents > ytcp-comment-thread:not(.'+ this.class.hidden_comment +')').length < 19
            && $('yt-next-continuation > paper-button.yt-next-continuation').length
            && $('yt-next-continuation > paper-button.yt-next-continuation').css('display') !== 'none'
        ){
            $("yt-next-continuation > paper-button.yt-next-continuation").click();
        }
    };
}

let commentFilter = new CommentFilter();
setInterval(() => {
    if(window.location.href.match(edit.commentUrlRegexp)){
        commentFilter.addSelect();
    }
}, 1500);