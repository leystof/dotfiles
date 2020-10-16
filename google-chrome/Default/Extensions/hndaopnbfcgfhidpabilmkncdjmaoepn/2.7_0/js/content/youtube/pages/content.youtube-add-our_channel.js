chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;


    /*******/
    if (title == 'addOurChannel') {
        if($('#plugin-youtube-addOurChannel-test').length < 1) {
                console.log('addOurChannel');
            $('html').append('<div id="plugin-youtube-addOurChannel-test"></div>');

            setTimeout(function() {
                $('#other-channels-sidebar-button').trigger('click');
                var targetMenuItem =
                    $('ul#other-channels-sidebar-menu li div.featured-content-picker-overlay')
                        .parent();

                targetMenuItem.prepend(
                    '<div style="margin-left: -220px; padding: 5px; width: 200px; position: absolute; background-color: yellow;">' +
                        '<div style="float: left; width: 160px;">' +
                            C_TEXT_ADD_OUR_CHANNEL_FIRST_HINT +
                        '</div>' +
                        '<div style="text-align: right; font-weight: bold; float: left; width: 30px;">' +
                            '&#8658;' +
                        '</div>' +
                        '<div style="clear: both"></div>' +
                    '</div>'
                );



                function addOurChannelsToDialog(count){
                    if(!count) var count = 0;
                    setTimeout(function () {
                        var dialogTitleText = C_TEXT_ADD_OUR_CHANNEL_PANEL_TITLE;

                        var dialogHeader =
                            $('div.yt-uix-overlay-default div.yt-dialog-show-content div.yt-dialog-header');

                        if(dialogHeader.find('.yt-dialog-title').html() != dialogTitleText) {
                            dialogHeader.find('.yt-dialog-title').html(dialogTitleText);
                        }

                        if(
                            $('#fua-plugin-youtube-offering-channels-block-id').length < 1
                        ) {
                            var channels_string = '';
                            for(var i in C_ADV_OFFERING_CHANNELS){
                                var channel = C_ADV_OFFERING_CHANNELS[i];
                                channels_string +=
                                    '<div class="fua-plugin-youtube-offering-channel-item" channel_id="'+ channel.id +'">' +
                                        '<div style="float: left; padding: 5px 0px 0px 5px;">' +
                                            '<img style="width: 40px;" src="'+ channel.icon +'">' +
                                        '</div>' +
                                        '<div style="height: 50px; float: left; max-width: 150px; margin-left: 10px;">' +
                                            '<div style="height: 50px; display: table;">' +
                                                '<div style="display: table-cell; vertical-align: middle;">' +
                                                    channel.title +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div style="clear: both;"></div>' +
                                    '</div>'
                            }

                            dialogHeader.append(
                                '<div style="margin-top: -17px; width: 630px;" id="fua-plugin-youtube-offering-channels-block-id">' +
                                    channels_string +
                                    '<div style="clear: both"></div>' +
                                '</div>'
                            );

                            $('div.fua-plugin-youtube-offering-channel-item').click(function(){
                                var channel_id = $(this).attr('channel_id');
                                $('div.yt-dialog-content div.channel-content-picker span.yt-uix-form-input-fluid-container input.content-picker-text-input')
                                    .val('https://www.youtube.com/channel/' + channel_id);
                            });
                        }


                        if(
                            $('button.fua-plugin-youtube-offering-channels-save-button').length < 1
                        ) {
                            $('button.content-picker-save-button')
                                .addClass('fua-plugin-youtube-offering-channels-save-button');

                            $('button.fua-plugin-youtube-offering-channels-save-button').click(function(){
                                var redirectUrl = window.location.href.match('previous_page=(.*)')[1];
                                if(redirectUrl) location.replace(redirectUrl);
                            });
                        }


                        if(count < 30) addOurChannelsToDialog(++count);
                    }, 100);
                }


                targetMenuItem.click(function(){
                    console.log('targetMenuItemClick');
                    addOurChannelsToDialog();
                });

                console.log('targetMenuItem', targetMenuItem.length);
            }, 1500);
        }
    }
});