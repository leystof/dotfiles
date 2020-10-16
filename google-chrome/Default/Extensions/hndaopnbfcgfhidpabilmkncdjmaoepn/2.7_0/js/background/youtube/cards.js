function getCardsById(options){
    var videos = options.videos;
    var index = 0;
    if(options.index) index = options.index;
    var callback = options.callback;

    $.get(
        'https://www.youtube.com/annotations_invideo?video_id=' + videos[index].id,
        '',
        function(res){

            //console.log(res);
            var isAnnotation = false;
            videos[index]['annotations'] = {};
            $(res).find('annotations annotation').each(function(){
                if(
                    C_CARDS.allowType[$(this).attr('type')]
                    || C_CARDS.allowStyle[$(this).attr('style')]
                ) {
                    //console.log($(this)[0].outerHTML);
                    var annotationId = $(this).attr('id').replace('video:', '');

                    videos[index]['annotations'][annotationId] = {};
                    videos[index]['annotations'][annotationId]['type'] = $(this).attr('type');
                    videos[index]['annotations'][annotationId]['style'] = $(this).attr('style');

                    var data = $.parseJSON($(this).find('data').html());
                    //console.log(data);
                    videos[index]['annotations'][annotationId]['data'] = data;
                    videos[index]['annotations'][annotationId]['text'] = data.title;
                    videos[index]['annotations'][annotationId]['timeFrom'] = data.start_ms;
                    videos[index]['annotations'][annotationId]['timeTo'] = data.end_ms;
                    videos[index]['annotations'][annotationId]['xml'] = $(this)[0].outerHTML;
                    videos[index]['annotations'][annotationId]['videoDuration'] = videos[index].duration;

                    isAnnotation = true;
                }
            });

            if(!isAnnotation) videos[index] = false;

            if(videos[index + 1]){
                getCardsById({
                    videos : videos,
                    index : index + 1,
                    callback : callback
                })
            }
            else callback(videos);
        }
    ).fail(function (info) {
        if(videos[index + 1]){
            getCardsById({
                videos : videos,
                index : index + 1,
                callback : callback
            })
        }
        else callback(videos);
    });
}