function getTitleById(id, callback){
    var titles = {};
    var durations = {};

    $.get(
        'https://www.youtube.com/edit?video_id=' + id,
        '',
        function(res){
            var html = document.createElement('html');
            html.innerHTML = res;
            html = $(html);
            if(html.find('h1.creator-editor-title a').length > 0) {
                titles[id] = html.find('h1.creator-editor-title a').html().trim();

                durations[id] =
                    getMillisecondDuration(html.find('div#video-info dl dd').eq(2).html().trim());

            }
            else{
                titles = 'findNothing';
                durations = 'findNothing';
            }

            callback(titles, durations);
        }
    );
}

function getVideosByQuery(options){
    var callback = options.callback;
    var videos= [];


    var url = 'https://www.youtube.com/my_videos?ar=3&o=U';
    if(options.text) url += '&sq=' + options.text;

    //console.log('url', url);

    $.get(url, '', function(res){
        var regexp = res.match('VIDEO_LIST_DISPLAY_OBJECT.*}]');
        if(regexp) {
            var videosObj = $.parseJSON('{"' + regexp[0] + '}');
            for (var i in videosObj.VIDEO_LIST_DISPLAY_OBJECT) {
                var item = videosObj.VIDEO_LIST_DISPLAY_OBJECT[i];
                var html = $($.parseHTML(item.html.replace(/<img[^>]*>/gi, '')));
                var videoInformation = {
                    'id': item.id,
                    'title': html.find('.vm-video-title-content').html().trim(),
                    'duration': getMillisecondDuration(html.find('.video-time').html().trim())
                };
                videos.push(videoInformation);
            }
        }

        callback(videos);
    });
}


function getMillisecondDuration(string){
    var duration = string.split(':');
    if (duration.length < 3) duration.unshift(0);
    duration.push(0);
    return getMillisecondFromArray(duration);
}



function decodeLikeUrl(string){
    if(string) {
        try {
            var x = string;
            var r = /\\u([\d\w]{4})/gi;
            x = x.replace(r, function (match, grp) {
                return String.fromCharCode(parseInt(grp, 16)); } );
            x = unescape(x);
            return x;
        }
        catch (err) {
            return string;
        }
    }
    else return string;
}


function getOneChanelTags(options){
    var chanelTags = [];

    if(options.url) var url = options.url;
    else var url = 'https://www.youtube.com/channel/' + options.id;

    $.get(url, '', function(res){

        var keywords = res.match(RegExp('"keywords":"[^,]+', 'g'));
        if(keywords){
            if(keywords[2]) keywords = keywords[2];
            else if(keywords[1]) keywords = keywords[1];
            else keywords = keywords[0];

            keywords = keywords.match('^"keywords":"([^,]+)"$');
            if(keywords){
                var d = '%%%%%%%';
                keywords = decodeLikeUrl(keywords[1]);
                var phrases = keywords.match(RegExp('\\\\"[^"]+\\\\"', 'gi'));

                if(phrases){
                    keywords = keywords.replace(RegExp('\\\\"[^"]+\\\\"', 'gi'), d).split(' ');
                    var count = 0;
                    var tmpRegexp = RegExp('\\\\"', 'gi');
                    for(var i in keywords){
                        if(keywords[i] == d){
                            keywords[i] = phrases[count].replace(tmpRegexp, '');
                            count++;
                        }
                    }
                }
                else keywords = keywords.split(' ');

                chanelTags = keywords;
            }
        }
        else {
            var html = document.createElement('html');
            html.innerHTML = res.replace(new RegExp('s2.googleusercontent.com[^\'\"]*', 'g'), '');
            $(html).find('head meta[property="og:video:tag"]').each(function(){
                chanelTags.push($(this).attr('content'));
            });
        }


        var tmpRegexp2 = new RegExp('[\(\)\+\-\,\.\-\?]', 'g');
        var tmpRegexp3 = new RegExp('[ ]{2,}', 'g');
        for(var i in chanelTags){
            chanelTags[i] = chanelTags[i]
                .toLowerCase().replace(tmpRegexp2, ' ').replace(tmpRegexp3, ' ').trim();
        }

        options.callback(chanelTags);
    });
}

function getOneListTags(options){
    var listTags = [];
    $.get('https://www.youtube.com/playlist?list=' + options.id, '', function(res){
        var html = document.createElement('html');
        html.innerHTML = res;
        html = $(html);

        var tags = html.find('head meta[name="keywords"]').attr('content');
        if(tags) listTags = tags.split(', ');

        /*html.find('head meta[name="keywords"]').each(function(){
            var tag = $(this).attr('content')
                .toLowerCase().replace(new RegExp('[\(\)\+\-\,\.\-\?]', 'g'), ' ')
                .replace(new RegExp('[ ]{2,}', 'g'), ' ').trim();

            chanelTags.push(tag);
        });*/


        options.callback(listTags);
    });
}


function getChannelIdByVideoId(options){
    $.ajax({
        method : 'GET',
        url : 'https://www.youtube.com/watch?v=' + options.video_id,
        contentType : 'html'
    }).done(function(response) {
        var html = document.createElement('html');
        html.innerHTML = response.replace(/<img[^>]*>/gi, '');
        html = $(html);

        var channel_id = html.find('meta[itemprop="channelId"]').attr('content');

        if(options.callback) options.callback(channel_id);

    }).fail(function(info) {});
}


function getFavoritesChannels(options){
    var favoritesChannels = [];
    $.get(
        'https://www.youtube.com/channel/'
        + options.channel_id + '/channels?view=60',
        '',
        function (res) {
            var html = $($.parseHTML(res));
            html.find('ul#channels-browse-content-grid').children('li.channels-content-item').each(function () {
                var channel_id = $(this).find('span.g-hovercard').attr('data-ytid');
                if(channel_id) favoritesChannels.push(channel_id);
            });

            var moreHref = html.find('button.browse-items-load-more-button')
                .attr('data-uix-load-more-href');

            if (moreHref) getMoreFavoritesChannels(moreHref);
            else options.callback(favoritesChannels);
        }
    );

    function getMoreFavoritesChannels(url) {
        $.get('https://www.youtube.com' + url, '', function (res) {
            var html = document.createElement('html');
            html.innerHTML = res.content_html;
            html = $(html);

            html.find('li.channels-content-item').each(function () {
                var channel_id = $(this).find('span.g-hovercard').attr('data-ytid');
                favoritesChannels.push(channel_id);
            });


            if (res.load_more_widget_html) {
                html = document.createElement('html');
                html.innerHTML = res.load_more_widget_html;
                html = $(html);

                var moreHref = html.find('button.browse-items-load-more-button')
                    .attr('data-uix-load-more-href');
                getMoreFavoritesChannels(moreHref);
            }
            else options.callback(favoritesChannels);
        });
    }
}