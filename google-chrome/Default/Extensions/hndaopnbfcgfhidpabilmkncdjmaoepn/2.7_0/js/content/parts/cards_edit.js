var FUA_YT_CARDS_EDIT = (function(){
    function CardsEdit(){
        this.ourPatterns = false;
        this.copyPatterns = false;
    }


    CardsEdit.prototype.createHtmlAnnotationsList = function(saveAnnotations){
        var annotationsChannelsStrings = {};
        var noChannelString = '';

        for (var j in saveAnnotations) {
            if(saveAnnotations[j].text) var text = saveAnnotations[j].text;
            else if(saveAnnotations[j].link) var text = saveAnnotations[j].link;
            else var text = j.split('%%%')[1];

            var strAnnotation =
                '<div class="fua-plagin-youtube-annotation-item">' +
                    '<input ' +
                        'title="' + text + '" ' +
                        'type="checkbox" ' +
                        'class="' + CLASS_OUR_ANNOTATION_ITEM_ANNOTATION_CHECKBOX + '" ' +
                        'annotation-id="' + j + '" ' +
                    '/>' +
                    '<div style="display: inline-block;">' +
                        '<div style="display: inline-block; width: 175px; height: 14px;" class="fua-plagin-youtube-three-dots">' +
                            '(' + saveAnnotations[j].style + ') ' + text +
                        '</div>' +
                        '<div style="display: inline-block;">' +
                            '<div class="fua-plagin-youtube-remove-saved-annotation">' +
                                '&times;' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            var cId = saveAnnotations[j].channel_id;
            if(cId){
                if(!annotationsChannelsStrings[cId]) {
                    annotationsChannelsStrings[cId] = { str : "", name :  saveAnnotations[j].channel_name};
                }
                annotationsChannelsStrings[cId].str += strAnnotation;
            }
            else noChannelString += strAnnotation;
        }

        var annotationString = '';
        for(var i in annotationsChannelsStrings){
            var tmpObj = annotationsChannelsStrings[i];
            annotationString += '<div style="font-weight: bold;">'+ tmpObj.name +':</div>' + tmpObj.str;
        }


        if(noChannelString) {
            annotationString += '<div style="font-weight: bold;">'+ chrome.i18n.getMessage("channel_not_determined") +':</div>' + noChannelString;
        }


        return annotationString;
    };


    return new CardsEdit();
})();