function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function morpherAggregator(options){
    var aggregatedWords = { 'one' : {}, 'multiple' : {}, 'noMorpher' : {} };
    if(options.aggregatedWords) aggregatedWords = options.aggregatedWords;
    var word = false;
    for(var i in options.onlyRussianWords){
        if(
            i.length < 2
            || ( i.length == 2 && i.slice(-1).match('[ауоыиэяюёеьъй]') )
            || ( i.length == 2 && i.charAt(0).match('[^ауоыиэяюёе]') )
            || i.slice(-1).match('[уэюёъ]')
        ) {
            aggregatedWords['noMorpher'][i] = true;
            delete options.onlyRussianWords[i];
        }
        else{
            word = i;
            delete options.onlyRussianWords[i];
            break;
        }
    }


    if(word){
        console.log('word', word);
        $.get('http://ws3.morpher.ru/russian/declension?s=' + word, '', function(res){
            var multiple = $(res).find('множественное');
            var multipleSelector = 'xml';
            var multipleString = '';
            if(multiple.length > 0){
                multipleSelector = 'множественное';
                $(res).find('xml').children().each(function(){
                    if(
                        this.tagName != multipleSelector
                        && this.tagName != 'ФИО'
                    ) {
                        if (multipleString) multipleString += '|';
                        multipleString += $(this).html();
                    }
                });
            }
            $(res).find(multipleSelector).children().each(function(){
                if(this.tagName != 'ФИО') {
                    if (multipleString) multipleString += '|';
                    multipleString += $(this).html();
                }
            });


            for(var i in options.onlyRussianWords){
                if(i.match('^('+ multipleString +')$')) delete options.onlyRussianWords[i];
            }


            for(var i in aggregatedWords['multiple']){
                if(i.match('^('+ multipleString +')$')) {
                    delete aggregatedWords['multiple'][i];
                }
            }
            for(var i in aggregatedWords['noMorpher']){
                if(i.match('^('+ multipleString +')$')) {
                    delete aggregatedWords['noMorpher'][i];
                }
            }


            if(multiple.length > 0){
                for(var i in aggregatedWords['one']){
                    if(i.match('^('+ multipleString +')$')) {
                        delete aggregatedWords['one'][i];
                    }
                }
                aggregatedWords['one'][word] = multipleString;
            }
            else aggregatedWords['multiple'][word] = multipleString;


            morpherAggregator({
                onlyRussianWords : options.onlyRussianWords,
                aggregatedWords : aggregatedWords,
                callback : options.callback
            });


        }).fail(function(info){
            aggregatedWords['noMorpher'][word] = true;
            morpherAggregator({
                onlyRussianWords : options.onlyRussianWords,
                aggregatedWords : aggregatedWords,
                callback : options.callback
            });
        });
    }
    else {
        console.log(aggregatedWords);
        options.callback(aggregatedWords);
    }
}