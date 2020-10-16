document.addEventListener('DOMContentLoaded', function() {
    var log = chrome.extension.getBackgroundPage().BG_LOGGING.getLastLog({
        logs_name : "massEditDescriptionLogs"
    });

    if(!log){
        $("body").html("<h1>" + chrome.i18n.getMessage("log_has_not_been_created") +"</h1>");
    }
    else{
        var title =
            "<h3>"+ chrome.i18n.getMessage("log_of_last_mass_update_of_meta_data") +"  (" + (new Date(log.log_id)) + ")</h3>";

        var channel = chrome.i18n.getMessage("word_channel") + ": "+ log.channel_id;
        var mod = chrome.i18n.getMessage("type_of_update") + ": " + log.mod;
        var text = chrome.i18n.getMessage("text_of_update") + ": " + log.text;
        var regexp = "";
        if(log.regexp) regexp = chrome.i18n.getMessage("regular_expression") + ": " + log.regexp;
        var finish =
            "<span style='color: #ff0000; font-weight: bold;'>" + chrome.i18n.getMessage("the_operation_has_not_finished_updated")  + " " +
            log.parsed.length + "/" + log.videos_array.length + " "+ chrome.i18n.getMessage("word_video").toLowerCase() +"." +
            "</span>";
        if(log.finish_data) {
            finish =
                "<span style='color: #008000; font-weight: bold;'>" + chrome.i18n.getMessage("operation_has_been_finished_updated")  + " " +
                log.finish_data.edited_count +
                "/"  + log.finish_data.parsed_count +
                " "+ chrome.i18n.getMessage("word_video").toLowerCase() + " </span>";
        }

        var parsedVideosString = '';
        var parsedVideos = log.parsed;

        for(var i in parsedVideos){
            var v = parsedVideos[i];

            var col1 = "<div>ID: "+ v.video_id +"</div>";
            if(v.video_title) col1 += "<div>Title: "+ v.video_title +"</div>";
            var result = "<div style='color: #008000; font-weight: bold;'>"+ chrome.i18n.getMessage("updated_successfully") +"</div>";

            if(v.error) result = "<div style='color: #ff0000; font-weight: bold;'>"+ chrome.i18n.getMessage("error_occurred") +": "+ v.error_type +"</div>";
            col1 += result;

            var col2 = "";
            //if(v.text_before) col2 = v.text_before;

            var col3 = "";
            //if(v.text_after) col3 = v.text_after;

            var previousMetaData = parsedVideos[i].previous_meta_data;
            var newMetaData = parsedVideos[i].new_meta_data;
            for(var j in newMetaData){
                col2 += '<div><strong>'+ j +':</strong> '+ previousMetaData[j] +'</div>'
                col3 += '<div><strong>'+ j +':</strong> '+ newMetaData[j] +'</div>'
            }


            parsedVideosString +=
                '<div class="row" style="margin: 10px 0px 10px; padding: 10px 0px 10px; border: 1px dotted grey">' +
                    '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">'+ col1 +'</div>' +
                    '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">'+ col2 +'</div>' +
                    '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">'+ col3 +'</div>' +
                '</div>';

        }


        var buttons = "";
        if(log.parsed.length){
            buttons =
                '<button class="btn btn-xs btn-success"id="'+ FUA_MD_EDIT.id.recover_log_btn +'">' +
                    chrome.i18n.getMessage("word_recover") +
                '</button>';
        }


        $("body").html(
            title +
            '<div>'+ channel +'</div>' +
            '<div>'+ mod +'</div>' +
            '<div>'+ text +'</div>' +
            '<div>'+ regexp +'</div>' +
            '<div>'+ finish +'</div>' +
            '<div>'+ buttons +'</div>' +

            '<h4 style="font-weight: bold;">' + chrome.i18n.getMessage("parsed_videos") +' :</h4>' +
            '<div class="row" style="font-weight: bold; margin: 10px 0px 10px; padding: 10px 0px 10px; border-bottom: 3px double grey">' +
                '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">'+ chrome.i18n.getMessage("common_data") +'</div>' +
                '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">'+ chrome.i18n.getMessage("initial_variant") +'</div>' +
                '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">'+ chrome.i18n.getMessage("final_variant") +'</div>' +
            '</div>' +

            parsedVideosString
        );



        $("#" + FUA_MD_EDIT.id.recover_log_btn).click(function(){
            FUA_MW.createModalWindow({
                target : 'mass-description-edit',
                text_title : chrome.i18n.getMessage("recovering_last_log"),
                callback : function(){
                    var content = document.getElementById(FUA_MW.id.content);

                    var info = document.createElement('div');
                    info.setAttribute('id', FUA_MD_EDIT.id.info);
                    content.appendChild(info);

                    var additional_block = document.createElement("div");
                    additional_block.setAttribute("id", FUA_MD_EDIT.id.additional_block);
                    additional_block.style.clear = "both";
                    content.appendChild(additional_block);
                }
            });

            setTimeout(function(){
                var newLog = chrome.extension.getBackgroundPage().BG_LOGGING.getLastLog({
                    logs_name : "massEditDescriptionLogs"
                });

                if(newLog.log_id != log.log_id){
                    FUA_MW.addToInfo({
                        'text' : chrome.i18n.getMessage("log_deprecated_reload_page"),
                        'class' : FUA_MW.class.error_info_line,
                        'info' : document.getElementById(FUA_MD_EDIT.id.info)
                    });

                    return false;
                }

                FUA_MD_EDIT.clickByRecoverLogButton({
                    log : log
                });
            }, 150);
        });
    }
});