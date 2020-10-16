var FUA_GET_VALUE = (function(){

    function Fua_get_youtube_value(){
        this.getAllVideoProcess = {
            videos : [],
            page : false,
            action : false
        };
    }

    Fua_get_youtube_value.prototype.getVideoIdFromUrl = function(url){
        var id = url.match('(v|video_id)=([^\&\#]*)(&|$|#)');
        if(id) return id[2];
        return false;
    };

    Fua_get_youtube_value.prototype.getXsrfToken = function(string){
        var auth_token = string.match('XSRF_TOKEN[\'"][ ]*:[ ]*[\'"]([^"\']+)');
        if(auth_token && auth_token[1]) return auth_token[1];
        return false;
    };


    Fua_get_youtube_value.prototype.getAllYourChannelVideos = function(options){
        if(!options.page) options.page = 1;
        if(!options.videos) options.videos = [];
        $.get("https://www.youtube.com/my_videos?ar=1&o=U&pi=" + options.page, "", function(res){
            if(res){
                var html = $($.parseHTML(res));
                /*html.find('#vm-video-list-container input.video-checkbox').each(function(){
                    console.log("checkbox");
                    options.videos.push($(this).val());
                });*/

                var nextPage =
                    html.find(
                        '#vm-pagination a.yt-uix-pager-button[data-page="'+ (options.page + 1) +'"]'
                    );


                var htmlList = res.match("\"VIDEO_LIST_DISPLAY_OBJECT\"[^\\]]*[\\]]");
                if(htmlList && htmlList[0]){
                    htmlList = $.parseJSON("{" + htmlList[0] + "}").VIDEO_LIST_DISPLAY_OBJECT;
                    //console.log("htmlList", htmlList);
                    if(htmlList && htmlList.length){
                        for(var i in htmlList){
                            options.videos.push(htmlList[i].id);
                        }
                    }
                }



                //console.log("nextPage", nextPage.attr('data-page'));
                if(nextPage.length){
                    options.page++;
                    FUA_GET_VALUE.getAllYourChannelVideos(options);
                }
                else{
                    //console.log("videos", options.videos);
                    options.successCallback(options.videos);
                }

            }
        });
    };


    Fua_get_youtube_value.prototype.getCheckedVideosInManager = function(){
        var videos_array = [];
        var allVideoCheckboxes = true;
        $('#vm-video-list-container input.video-checkbox').each(function(){
            if($(this).prop('checked')) videos_array.push($(this).val());
            else allVideoCheckboxes = false;
        });

        return {
            "videos_array" : videos_array,
            "allVideoCheckboxes" : allVideoCheckboxes
        };
    };



    Fua_get_youtube_value.prototype.getExternalChannelId = function(){
        var channel_id = $('html').html().match('channel_external_id"[ ]*:[ ]*"([^"]+)');
        if(!channel_id) return false;
        return channel_id[1];
    };


    // create instance
    return new Fua_get_youtube_value();
})();