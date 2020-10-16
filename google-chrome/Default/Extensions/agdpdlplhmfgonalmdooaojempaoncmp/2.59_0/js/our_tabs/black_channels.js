document.addEventListener('DOMContentLoaded', function() {


    chrome.storage.local.get('channels_black_list', function(items){
        var blackChannels = items.channels_black_list;
        if(blackChannels){
            for(var i in blackChannels){

                var channelTitle = blackChannels[i];
                var channelUrl = 'https://www.youtube.com';

                var newDesignClass = "";
                if(typeof channelTitle !== 'string'){
                    channelTitle = blackChannels[i].name;
                    channelUrl += blackChannels[i].url;
                    newDesignClass = "new_design_black_item";
                }
                else channelUrl += '/channel/'+ i;

                var encode_id = i.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
                    return '&#'+i.charCodeAt(0)+';';
                });


                $('#black_channels_block_id').append(
                    '<div class="black_channel '+ newDesignClass +'">' +
                        '<span class="channel_name" href="'+ channelUrl +'" target="_blank">' +
                            channelTitle +
                        '</span>' +
                        '<span class="delete_from_black_list" channel_id="'+ encodeURIComponent(i) +'">' +
                            '<img src="img/navigation/delete_video.png" style="width: 18px;">' +
                        '</span>' +
                    '</div>'
                );
            }

            $('.delete_from_black_list').click(function(){
                chrome.extension.getBackgroundPage().removeBlackChannel({
                    channel_id : $(this).attr('channel_id')
                });
                $(this).closest('.black_channel').remove();
                blackChannelsCount();
            });

            blackChannelsCount();
        }
    });



    $('#filter_input_id')[0].addEventListener("input", function(e){
        filterBlackChannel();
    });


    $('#filter_select_id').change(function(){
        filterBlackChannel();
    });

    $('#delete_all_id').click(function() {
        $('.delete_from_black_list').click();
    });



    $('#delete_selected_id').click(function() {
        $('#delete_channel_count').text($('.black_channel:not(.hide_channel)').length);
    });

    $('#delete_channel_modal_button').click(function() {
        $('.black_channel').each(function(){
            if(!$(this).hasClass('hide_channel')){
                $(this).find('.delete_from_black_list').click();
            }
        });
        blackChannelsCount();
    });


    $('#black_channels_title_id').html(C_TEXT_SETTINGS_CHECKBOX_BLACKCHANNELS_TOGGLE + ':');
    $('#filter_input_id').attr('placeholder', C_WORD_FILTER + '...');
    $('#delete_selected_id').html(chrome.i18n.getMessage("delete_all"));
    $('#close_button').text(chrome.i18n.getMessage("word_close"));
    $('#delete_channel_modal_button').text(chrome.i18n.getMessage("word_delete"));
    $('#delete_modal_title').text(chrome.i18n.getMessage("do_you_want_to_delete_this_channels_from_black_list"));



    function filterBlackChannel(){
        var value = $('#filter_input_id').val().trim();
        if(value){
            var filterBy = $('#filter_select_id').val();
            var regexp = new RegExp(value, 'i');

            $('.black_channel').each(function(){
                var pattern = $(this).find('.channel_name').html();
                if(pattern.match(regexp)) $(this).removeClass('hide_channel');
                else $(this).addClass('hide_channel');
            });
            $('#delete_selected_id').html(chrome.i18n.getMessage("delete_selected"));
        }
        else {
            $('.black_channel').removeClass('hide_channel');
            $('#delete_selected_id').html(chrome.i18n.getMessage("delete_all"));
        }
        blackChannelsCount();
    }


    function blackChannelsCount(){
        $('#visible_number_id').html($('.black_channel').not('.hide_channel').length);
        $('#all_number_id').html($('.black_channel').length);
        if($('.black_channel:not(.hide_channel)').length) $('#delete_selected_id').show();
        else $('#delete_selected_id').hide();
    }



    function copyToClipboard(text) {
        const input = document.createElement('input');
        input.style.position = 'fixed';
        input.style.opacity = 0;
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy');
        document.body.removeChild(input);
    };



    function clearMsg(){
        $("#msg_box_id").html(null);
    }


    function addMsg(msg){
        $("#msg_box_id").append(msg);
    }





    function addJsonStringChannels(options){
        let channels = {};
        if(!options.channels || !options.channels.length) return false;
        for (let i of options.channels) {
            channels[i] = i;
        }

        if(channels) {
            var addData = [];
            for(var i in channels){
                var ch = { channel_id : i};

                if(channels[i].url) {
                    ch.channel_name = channels[i].name;
                    ch.channel_url = channels[i].url;
                }
                else if(typeof channels[i] == 'string'){
                    ch.channel_name = channels[i];
                }
                else{
                    addMsg('<span style="color: red;">Произошла ошибка #2</span>');
                    return false;
                }

                addData.push(ch);
            }

            if(addData.length) {
                if (options.change) {
                    chrome.extension.getBackgroundPage().STORAGE_SINGLETON.saveToStorage({
                        propertyName: 'channels_black_list',
                        value: {},
                    });
                }

                for(var i in addData){
                    chrome.extension.getBackgroundPage().addNewBlackChannel(addData[i]);
                }

                $("#copy_channels_input_id").val(null);
                window.location.reload();
            }

            console.log("addData", addData);
        }
    }



    $("#copy_channels_input_id").attr('placeholder', chrome.i18n.getMessage("insert_string_of_copied_channels"));


    $("#copy_channels_button_id").html(chrome.i18n.getMessage("word_copy"));
    $("#copy_channels_button_id").click(function(){
        clearMsg();
        let blackChannels = chrome.extension.getBackgroundPage().getBlackChannels();
        if(blackChannels){
            let string = '';
            for (let i in blackChannels){
                if(string) string += ', ';
                string += i;
            }

            copyToClipboard(string);
        }
    });

    $("#change_channels_button_id").html(chrome.i18n.getMessage("word_replace"));
    $("#change_channels_button_id").click(function(){
        /*clearMsg();
        addJsonStringChannels({
            jsonString : $("#copy_channels_input_id").val().trim(),
            change : true
        });*/



        parseInputArray(parseInputString()).then(result => {
            console.log('result', result);
            addJsonStringChannels({
                channels : result,
                change : true
            });
        });
    });

    $("#add_channels_button_id").html(chrome.i18n.getMessage("add_unique_channels"));
    $("#add_channels_button_id").click(function(){
        /*clearMsg();
        addJsonStringChannels({
            jsonString : $("#copy_channels_input_id").val().trim(),
        });*/

        parseInputArray(parseInputString()).then(result => {
            console.log('result', result);
            addJsonStringChannels({
                channels : result,
            });
        });
    });


    function parseInputString(){
        let value = $("#copy_channels_input_id").val().trim();
        if(!value) return [];
        return value.split(new RegExp('[ ]*,[ ]*'));
    }

    function parseInputArray(array, index = 0){
        $('#spinner').show();
        $('#main').hide();

        return new Promise((resolve, reject) => {
            let value = array[index];
            if(value){
                let match = value.match(new RegExp('user/[^\\?&/]+|channel/[^\\?&/]+', 'i'));
                if(match) {
                    let url = 'https://www.youtube.com/' + match[0];
                    $.get(url, res => {
                        let title = null;
                        let ytInitialData = res.match(new RegExp('window\\["ytInitialData"\\][ ]*=[ ]*(.+}}|.+]});', 'i'));
                        if(ytInitialData){
                            ytInitialData = JSON.parse(ytInitialData[1]);
                            console.log('ytInitialData', ytInitialData);
                            if(ytInitialData.metadata && ytInitialData.metadata.channelMetadataRenderer){
                                title = ytInitialData.metadata.channelMetadataRenderer.title;
                            }
                        }

                        if(title) array[index] = title;
                        else {
                            addMsg('<div style="color: red;">Не получилось найти название канала: '+ url +'</div>');
                            array[index] = null;
                        }

                        index++;
                        parseInputArray(array, index).then(result => {
                            resolve(result);
                        });
                    }).fail(err => {
                        addMsg('<div style="color: red;">Не получилось открыть: '+ url +'</div>');
                        array[index] = null;
                        index++;
                        parseInputArray(array, index).then(result => {
                            resolve(result);
                        });
                    })
                }
                else {
                    index++;
                    parseInputArray(array, index).then(result => {
                        resolve(result);
                    });
                }
            }
            else {
                $('#spinner').hide();
                $('#main').show();
                resolve(array);
            }
        });
    }
});

//Test channel,https://www.youtube.com/user/fotosua, https://www.youtube.com/channel/UCiMhD4jzUqG-IgPzUmmytRQ, Game Channel
//FergieVEVO, NoDoubtTV, PatefonChannel, Test channel, F.ua — О девайсах понятным языком, Queen Official, Game Channel