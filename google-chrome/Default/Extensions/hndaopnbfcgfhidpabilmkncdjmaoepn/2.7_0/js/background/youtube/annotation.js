function getAnnotationById(options){
    var videos = options.videos;

    var index = 0;
    if(options.index) index = options.index;

    var callback = options.callback;

    $.get(
        'https://www.youtube.com/annotations_invideo?video_id=' + videos[index].id,
        '',
        function(res){

            //console.log(res);
            videos[index]['annotations'] = {};
            var isAnnotation = false;

            $(res).find('annotations annotation').each(function(){
                if(
                    C_ANNOTATION.allowType[$(this).attr('type')]
                    || C_ANNOTATION.allowStyle[$(this).attr('style')]
                ) {
                    if($(this).find('TEXT').html()) isAnnotation = true;

                    //console.log($(this)[0].outerHTML);

                    var annotationId = $(this).attr('id');

                    videos[index]['annotations'][annotationId] = {};
                    videos[index]['annotations'][annotationId]['text'] = $(this).find('TEXT').html();
                    videos[index]['annotations'][annotationId]['type'] = $(this).attr('type');
                    videos[index]['annotations'][annotationId]['style'] = $(this).attr('style');
                    videos[index]['annotations'][annotationId]['link'] = $(this).find('action url').attr('value');

                    function getTimeArray(string) {
                        var array = string.split(':');
                        if (array.length < 3) array.unshift(0);

                        if(array.length > 2) {
                            var tmp = array[2].split('.');
                            array[2] = tmp[0];
                            if(tmp[1]) array[3] = tmp[1].charAt(0);
                            else array[3] = 0;
                        }
                        else array[3] = 0;

                        for (var i in array) array[i] = parseInt(array[i]);
                        return getMillisecondFromArray(array);
                    }



                    if($(this).attr('style') == 'highlightText'){
                        videos[index]['annotations'][annotationId]['timeFrom'] = 'never';
                        videos[index]['annotations'][annotationId]['timeTo'] = 'never';
                        videos[index]['annotations'][annotationId]['trigger'] =
                            $(this).find('trigger condition').attr('ref');


                    }
                    else {
                        videos[index]['annotations'][annotationId]['timeFrom'] =
                            getTimeArray($(this).find('segment movingRegion')
                                .children().first().attr('t'));

                        videos[index]['annotations'][annotationId]['timeTo'] =
                            getTimeArray($(this).find('segment movingRegion')
                                .children().last().attr('t'));
                    }

                    videos[index]['annotations'][annotationId]['xml'] = $(this)[0].outerHTML;
                }


            });

            if(!isAnnotation) videos[index] = false;

            if(videos[index + 1]){
                getAnnotationById({
                    videos : videos,
                    index : index + 1,
                    callback : callback
                })
            }
            else callback(videos);
        }
    ).fail(function (info) {
            videoAnnotations = 'findNothing';
            callback(videoAnnotations);
        });
}