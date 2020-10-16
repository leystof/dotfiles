function startEvent(){
    $('.what_block').click(function(){
        var anchor = $(this).attr('what_anchor');
        window.open('info_page.html#' + anchor);
    });

    $('#show_black_channels_id').click(function(){
        window.open('black_channels.html');
    });

    $('#fua_personal_link').click(function(){
        window.open('https://f.ua/');
    });


    $('#dropdown_menu_logourl_id .dropdown_menu_item').click(function(){
        var value = $(this).attr('value');
        var title = $(this).html();
        setLogoUrl(title, value);
    });

    $('.select_input_label_item').click(function(event){
        event.stopPropagation();
        $(this).hide().siblings().show();
        return false;
    });

    $('#input-logourl-id')[0].addEventListener("input", function(){
        var value = $(this).val();
        setLogoUrl(value, value)
    });

    $('#dropdown_menu_logourl_id').on('hidden.bs.dropdown', function () {
        var logoValue = $('#dropdown_logourl_button_id').attr('value');
        if(!logoValue || logoValue.trim() == '') {
            setLogoUrl(gv_logo_url_options[gv_default_logo_url], gv_default_logo_url);
        }
        hideLogoUrlInput();
    });


    $("#checkbox-recommendation-toggle-id").change(function(){
        if (!$(this).prop('checked')) {
            chrome.extension.getBackgroundPage().showCatsMsg();
            window.close();
        }
        else chrome.extension.getBackgroundPage().hideCatsMsg();
    });




    $("#set_default_scroll_video_position_id").click(function(){
        chrome.extension.getBackgroundPage().setDefaultScrollVideoPosition();
        $(this).hide();
    });


    $('#dropdown_menu_blocked_annotation_id li').click(function(event){
        event.stopPropagation();
    });


    function timeBlockedAnnotationsLimit(whatChange){
        var selectFrom = $("#select-blocked-annotations-from-id");
        var selectTo = $("#select-blocked-annotations-to-id");

        if(selectFrom.val() >= selectTo.val()){
            if(whatChange == "from") {
                selectTo.val(parseInt(selectFrom.val()) + 10);
                chrome.extension.getBackgroundPage().setSpecialSetting({
                    name: "bAnnotationTo", value: selectTo.val()
                });
            }
            if(whatChange == "to") {
                selectFrom.val(parseInt(selectTo.val()) - 10);
                chrome.extension.getBackgroundPage().setSpecialSetting({
                    name: "bAnnotationFrom", value: selectFrom.val()
                });
            }
        }
    }


    $("#select-blocked-annotations-from-id").change(function(){
        timeBlockedAnnotationsLimit("from");
    });

    $("#select-blocked-annotations-to-id").change(function(){
        timeBlockedAnnotationsLimit("to");
    });


    $("#blocked_video_msg_input_id")[0].addEventListener("input", function(e){
        var value = $(this).val().trim();
        chrome.extension.getBackgroundPage().setSpecialSetting({
            name : "blockedVideoMsg",
            value :value
        });
    });


    $("#blocked_video_tags_id")[0].addEventListener("input", function(e){
        var value = $(this).val().trim();
        var tmpRegexp = new RegExp('[a-zа-я0-9]', 'i');
        if(value.search(tmpRegexp) == -1) value = '';

        if(value){
            var nv = value.split(',');
            value = [];
            for(var i in nv){
                nv[i] = nv[i].trim();
                if(nv[i] && nv[i].search(tmpRegexp) != -1) value.push(nv[i]);
            }
            value = value.join(', ');
        }

        chrome.extension.getBackgroundPage().setSpecialSetting({
            name : "blockedVideoTags",
            value :value
        });
    });
}