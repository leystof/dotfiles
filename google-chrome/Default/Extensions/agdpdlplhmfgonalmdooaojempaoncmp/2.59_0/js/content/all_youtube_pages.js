chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;

    /*******/
    if (title == 'addAppIcon') {

        stopAutoPlayND();
        addBlackChannelButton();


        if(!$('#fua_plugin_blocker_set_interval_id').length){
            $('html').append(
                '<div id="fua_plugin_blocker_set_interval_id"></div>'
            );

            $('body').append(
                '<div id="app_tooltip_id" style="position: absolute; z-index: 2147483647;">' +
                    '<div class="yt-uix-tooltip-tip-content"></div>' +
                    '<div style="width: 1px; margin: 0px auto 0px;">' +
                        '<img style="margin-top: -0px; position: absolute; margin-left: -4px;" src="'+ IMAGE_BLACK_TRIANGLE + '"/>' +
                    '</div>' +
                '</div>'
            );



            setInterval(function(){
                addAppIcon($('div.yt-lockup-video div.yt-lockup-thumbnail:not(.fua_app_icon_box)'));
                addAppIcon($('li.related-list-item-compact-video div.thumb-wrapper:not(.fua_app_icon_box)'));
                addAppIcon($('div.watch-sidebar-body > ul.video-list li.related-list-item  > div.thumb-wrapper:not(.fua_app_icon_box)'));
                addAppIcon($('ytd-grid-video-renderer ytd-thumbnail:not(.fua_app_icon_box)'));
                addAppIcon($('ytd-video-renderer ytd-thumbnail:not(.fua_app_icon_box)'));
                addAppIcon($('ytd-compact-video-renderer ytd-thumbnail:not(.fua_app_icon_box)'));
                addPageMenu();
                toggleWatchedVideos();
            }, 1000);
        }
    }

    /*******/
    if (title == 'showCatsMsg') {
        FUA_BLOCKER_MW.createModalWindow({
            target : "cats_message",
            text_title : "Cats message",
            noTitle : true,
            noToggle : true,
            callback : function(){
                var content = $("#" + FUA_BLOCKER_MW.id.content);
                content.html(
                    "<div style='text-align: center;'>" +
                        "<div style='margin: 10px 0px 10px; color: grey; font-size: 20px; font-weight: bold;'>" +
                            FUA_BLOCKER_TRANSLATION.text.title_adv_msg_text +
                        "</div>" +
                        "<div>" +
                            "<img src='"+ chrome.extension.getURL("img/pictures/cats.png") +"'>" +
                        "</div>" +
                        "<div style='margin: 10px 0px 20px; font-weight: bold;'>" +
                            "<div>" +
                                FUA_BLOCKER_TRANSLATION.text.adv_msg_content_1 +
                            "</div>" +
                            "<div>" +
                                FUA_BLOCKER_TRANSLATION.text.adv_msg_content_2 +
                            "</div>" +
                        "</div>" +
                        "<div style='margin: 10px 0px 20px;'>" +
                            "<button id='fua_blocker_cat_button_off_id'>" +
                                FUA_BLOCKER_TRANSLATION.words_combinations.switch_off +
                            "</button>" +
                            "<button id='fua_blocker_cat_button_on_id'>" +
                                FUA_BLOCKER_TRANSLATION.words_combinations.switch_back +
                            "</button>" +
                        "</div>" +
                    "</div>"
                );

                $("#fua_blocker_cat_button_off_id").click(function(){
                    FUA_BLOCKER_MW.removeModalWindow();
                    chrome.runtime.sendMessage({'title': 'offRecommendVideo'});
                });

                $("#fua_blocker_cat_button_on_id").click(function(){
                    FUA_BLOCKER_MW.removeModalWindow();
                    chrome.runtime.sendMessage({'title': 'onRecommendVideo'});
                });
            }
        });
    }


    /*******/
    if (title == 'hideCatsMsg') {
        FUA_BLOCKER_MW.removeModalWindow({"target" : "cats_message"});
    }



    if (
        document.getElementsByClassName('fua_scrolled_video_player').length
        && window.location.href.search('^https://www.youtube.com/watch') == -1
    ) {
        document.getElementsByClassName('fua_scrolled_video_player')[0]
            .classList.remove('fua_scrolled_video_player');
        removeVideoJQueryUI();
        window.dispatchEvent(new Event("resize"));
    }
});


function addAppIcon(obj) {
    //$('div.yt-lockup-video div.yt-lockup-thumbnail:not(.fua_app_icon_box)')
    chrome.storage.local.get(['settings'], function(items){
        var settings = items.settings;
        var inNewWindow = '';
        if(!settings || !settings.openNewWindow || settings.openNewWindow == 2){
            inNewWindow =
                '<div show-tooltip="' + C_TEXT_TOOLTIP_IN_NEW_WINDOW + '" class="fua_app_open_icon">' +
                    '<img ' +
                        'src="' + IMAGE_IN_NEW_WINDOW_MAIN + '" ' +
                        'style="width: 14px;"' +
                    '>' +
                '</div>'
        }




        var deleteSubscribeVideoButton = '';
        if (window.location.href.match('^https://www.youtube.com/feed/subscriptions')) {
            deleteSubscribeVideoButton =
                '<div show-tooltip="'+ C_TEXT_TOOLTIP_DELETE_VIDEO_FROM_SUBSCRIPTION +'" class="fua_delete_subscribe_video">' +
                    '<img src="' + IMAGE_DELETE_VIDEO + '">' +
                '</div>';
        }


        var deleteChannelOfVideoButton = '';
        if (
            window.location.href.match('^https://www.youtube.com/([\?]|watch|$|feed/trending)')
            && (!settings || !settings.blackChannels || settings.blackChannels == 2)
        ) {
            deleteChannelOfVideoButton =
                '<div show-tooltip="'+ C_TEXT_TOOLTIP_CHANNEL_TO_BLACK_LIST +'" class="fua_delete_channel_of_video">' +
                    '<img src="' + IMAGE_DELETE_VIDEO + '">' +
                '</div>';
        }


        obj.append(
            '<div class="fua_blocker_video_slot_icons_box">' +
                inNewWindow +
                deleteSubscribeVideoButton +
                deleteChannelOfVideoButton +
            '</div>'
        )
            .addClass('fua_app_icon_box')
            .find('.fua_app_open_icon').click(function (e) {
                e.preventDefault();
                chrome.runtime.sendMessage({
                    'title': 'openAppWindow',
                    'body': {
                        'videoUrl': $(this).parent().parent().find('a:first').attr('href')
                    }
                });
                return false;
            }).hover(
            function (e) {
                showTooltip({
                    toolTipObject: $('#app_tooltip_id'),
                    targetObject: $(this),
                    marginTop: '-29px',
                    textAttr: 'show-tooltip'
                });

            },
            function (e) {
                hideTooltip({toolTipObject: $('#app_tooltip_id')});
            }
        );


        obj.find('.fua_delete_subscribe_video')
            .click(function () {
                var item = $(this).closest('.yt-shelf-grid-item');
                if(item.length) {
                    item.find('.dismiss-menu-choice').click();
                    item.remove();
                }
                else {
                    item = $(this).closest('ytd-grid-video-renderer');
                    if(item.length) {
                        var menu = item.find('div#details > div#menu > ytd-menu-renderer > yt-icon-button.dropdown-trigger > button');
                        menu.click();
                    }
                    else {
                        item = $(this).closest('ytd-expanded-shelf-contents-renderer');
                        var menu = itemitem.find('div#menu > ytd-menu-renderer > yt-icon-button.dropdown-trigger > button');
                        menu.click();
                    }

                    if(item.length){
                        var hiddenMenu = $('ytd-popup-container.ytd-app > iron-dropdown.ytd-popup-container');
                        hiddenMenu.addClass('fua_blocker_hidden');
                    }

                    function clickHideButton(count) {
                        if(!count) count = 0;
                        var hideBtn = $('ytd-popup-container > iron-dropdown > div#contentWrapper > ytd-menu-popup-renderer > paper-listbox#items > ytd-menu-service-item-renderer:last');

                        if(hideBtn.length){
                            hideBtn.click();

                            setTimeout(function () {
                                hiddenMenu.removeClass('fua_blocker_hidden');
                                hideBtn[0].dispatchEvent(new Event("click", {bubbles: true, cancelable: true}));
                                item.remove();
                            }, 100);
                            return true;
                        }
                        else if(count < 50){
                            count++;
                            setTimeout(function(){
                                clickHideButton(count);
                            }, 50);
                        }
                        else hiddenMenu.removeClass('fua_blocker_hidden');
                    }
                    clickHideButton(0);
                }
            })
            .hover(
            function (e) {
                showTooltip({
                    toolTipObject: $('#app_tooltip_id'),
                    targetObject: $(this),
                    marginTop: '-29px',
                    textAttr: 'show-tooltip'
                });

            },
            function (e) {
                hideTooltip({toolTipObject: $('#app_tooltip_id')});
            }
        );


        obj.find('.fua_delete_channel_of_video').click(function (event) {
                event.preventDefault();
                event.stopPropagation();



                var itemClass = 'yt-shelf-grid-item';
                var item = $(this).closest('.' + itemClass);
                if (!item.length) {
                    itemClass = 'related-list-item-compact-video';
                    item = $(this).closest('.' + itemClass);
                }

                if (!item.length) {
                    itemClass = 'expanded-shelf-content-item-wrapper';
                    item = $(this).closest('.' + itemClass);
                }


                if (!item.length) {
                    itemClass = 'video-list-item';
                    item = $(this).closest('.' + itemClass);
                }


                var itemTag = 'ytd-grid-video-renderer';
                if (!item.length) {
                    item = $(this).closest(itemTag);
                    if (!item.length) {
                        itemTag = 'ytd-video-renderer';
                        item = $(this).closest(itemTag);
                    }
                    if (!item.length) {
                        itemTag = 'ytd-compact-video-renderer';
                        item = $(this).closest(itemTag);
                    }
                    if (!item.length) {
                        itemTag = 'ytd-expanded-shelf-contents-renderer';
                        item = $(this).closest(itemTag);
                    }
                }


                if (!item.length) return false;

                var channelInfo = item.find('.g-hovercard:last');
                var channel_id = channelInfo.attr('data-ytid');
                var channel_url = false;


                function getBylineContainer(element) {
                    var c = element.find('ytd-video-meta-block div#metadata div#byline-container');
                    if(!c.length) c = element.find('div#metadata-container div#metadata div#byline-container');
                    return c;
                }


                function continuaParseBlackChannel(){
                    if(!channel_id) return false;

                    var channel_title = channelInfo.html();

                    if(item.hasClass('fua-plugin-blocker-our-video')){
                        chrome.runtime.sendMessage({
                            'title': 'addToNoRecommended',
                            'body': {
                                'channel_id': channel_id,
                                'channel_name': channel_title,
                                'channel_url' : channel_url
                            }
                        });

                        item.remove();
                        FUA_BLOCKER_GV.a_video = false;
                        return true;
                    }

                    chrome.runtime.sendMessage({
                        'title': 'addChannelToBlackList',
                        'body': {
                            'channel_id': channel_id,
                            'channel_name' : channel_title,
                            'channel_url' : channel_url
                        }
                    });

                    var blackList = JSON.parse(document.documentElement.dataset.channels_black_list || null);
                    if (!blackList) blackList = {};
                    blackList[channel_id] = channel_title;
                    document.documentElement.dataset.channels_black_list =
                        JSON.stringify(blackList);

                    var channelItems = $('.' + itemClass)
                            .find('div.yt-lockup-byline > a.yt-uix-sessionlink:contains("'+ channel_id+'")')


                    if(!channelItems.length){
                        channelItems = $('.' + itemClass)
                            .find('div.content-wrapper > a.yt-uix-sessionlink span.attribution > span:contains("'+ channel_id+'")')
                    }





                    if(!channelItems.length){
                        channelItems = getBylineContainer($(itemTag))
                            .find('a.yt-formatted-string:first[href="'+ channel_url +'"]')
                    }

                    if(!channelItems.length){
                        channelItems =  getBylineContainer($(itemTag))
                            .find('div#metadata-container div#metadata div#byline-container yt-formatted-string#byline:contains("'+ channel_title +'")');

                        if(!channelItems.length){
                            var decodeTitle = $('<textarea />').html(channel_title).text();
                            channelItems = getBylineContainer($(itemTag))
                                .find('yt-formatted-string#byline:contains("'+ decodeTitle +'")');
                        }
                    }

                    channelItems.each(function () {
                        item = $(this).closest('.' + itemClass);
                        if(!item.length) item = $(this).closest(itemTag);


                        var itemSection = item.closest('.item-section');
                        if(!itemSection.length) {
                            itemSection = item.closest('ytd-shelf-renderer.ytd-item-section-renderer');
                        }

                        item.remove();
                        if (
                            itemSection.length
                            && !itemSection.find('.' + itemClass).length
                            && !itemSection.find(itemTag).length
                        ) {
                            itemSection.remove();
                        }
                    });

                    window.dispatchEvent(new Event("resize"));
                    return false;
                }


                if(!channel_id){
                    channelInfo = item.find('div.yt-lockup-byline > a.yt-uix-sessionlink');
                    channel_url = channelInfo.attr("href");
                    channel_id = channelInfo.text();
                }

                if(!channel_id){
                    channelInfo = item.find('div.content-wrapper > a.yt-uix-sessionlink span.attribution > span');
                    channel_id = channelInfo.text();
                }

                if(!channel_id){
                    channelInfo = getBylineContainer(item).first().find('a.yt-formatted-string');

                    channel_url = channelInfo.attr("href");
                    channel_id = channelInfo.html();
                }

                if(!channel_id){
                    channelInfo = getBylineContainer(item)
                        .first().find('yt-formatted-string#byline').first();

                    if(channelInfo.length){
                        var videoUrl = channelInfo.closest("a.ytd-compact-video-renderer").attr("href");
                        if(videoUrl) {

                            videoUrl = "https://www.youtube.com" + videoUrl;

                            $.get("https://www.youtube.com/oembed?url="+ videoUrl +"&format=xml", '', function (res) {

                                if(res) {
                                    var author_url = $(res).find("oembed author_url").html();
                                    if (author_url){
                                        channel_url = author_url.replace("https://www.youtube.com", "");
                                        channel_id = channelInfo.html();
                                        continuaParseBlackChannel();
                                    }
                                }
                            }, 'xml').fail(function(info){
                                if(info && info.status == 401){
                                    $.get(videoUrl, '', function (res) {
                                        if(res){
                                            channel_url = res.match('videoOwnerRenderer[^\\]]*[\\]][^\\]]*webNavigationEndpointData[^\\]]*url"[ ]*:[ ]*"([^"]+)');
                                            if(channel_url) channel_url = channel_url[1];
                                            channel_id = channelInfo.html();
                                            continuaParseBlackChannel();
                                        }
                                    });
                                }
                            });
                        }
                    }
                }



                continuaParseBlackChannel();
                return false;
            })
            .hover(
            function (e) {
                showTooltip({
                    toolTipObject: $('#app_tooltip_id'),
                    targetObject: $(this),
                    marginTop: '-29px',
                    textAttr: 'show-tooltip'
                });

            },
            function (e) {
                hideTooltip({toolTipObject: $('#app_tooltip_id')});
            }
        );
    });
}



function addPageMenu(){
    var menuId = 'fua_youtube_page_menu_id';
    var hideCheckboxId =  'checkbox_hide_watched_videos_id';
    var isSubscriptionsPage = window.location.href.match('^https://www.youtube.com/feed/subscriptions');

    if($('#' + menuId).length) {
        if($('#' + hideCheckboxId).length && !isSubscriptionsPage) {
            $('#' + menuId).remove();
        }
        else return false;
    }
    chrome.storage.local.get('settings', function(items) {
        if($('#' + menuId).length) return false;
        var settings = items.settings;

        var menuItems = [];

        if(isSubscriptionsPage){

            var htmlItem =  '<li class="guide-channel guide-notification-item overflowable-list-item" role="menuitem"> ' +
                                '<label style="cursor: pointer" class="guide-item yt-uix-sessionlink yt-valign spf-link" title=""> ' +
                                    '<span class="yt-valign-container"> ' +
                                        '<span class="display-name  no-count" > ' +
                                            '<span>' +
                                                '<input id="' + hideCheckboxId + '" type="checkbox" style="position: relative;vertical-align: middle; bottom: 1px;">' +
                                                '<span style="margin-left: 6px;" title="'+ C_TEXT_HIDE_VIEWED_VIDEOS +'">' +
                                                    C_TEXT_HIDE_VIEWED_VIDEOS +
                                                '</span>' +
                                            '</span>' +
                                        '</span> ' +
                                    '</span> ' +
                                '</label> ' +
                            '</li> ';

            if($('ytd-guide-renderer#guide-renderer > div#sections').length){
                htmlItem =
                    '<div is="ytd-guide-entry-renderer" role="option" tabindex="0" class="style-scope ytd-guide-section-renderer"> ' +
                        '<label id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" > ' +
                            '<span class="guide-icon style-scope ytd-guide-entry-renderer">' +
                                '<input id="' + hideCheckboxId + '" type="checkbox" style="position: relative;vertical-align: middle; bottom: 1px;">' +
                            '</span> ' +
                            '<yt-img-shadow height="24" width="24" class="style-scope ytd-guide-entry-renderer" disable-upgrade="" hidden=""> </yt-img-shadow> ' +
                            '<span class="title style-scope ytd-guide-entry-renderer" title="'+ C_TEXT_HIDE_VIEWED_VIDEOS +'">' +
                                C_TEXT_HIDE_VIEWED_VIDEOS +
                            '</span> ' +
                            '<span class="guide-entry-count style-scope ytd-guide-entry-renderer" hidden=""> </span> ' +
                        '</label> ' +
                    '</div> '
            }


            menuItems.push({
                html : htmlItem,
                action : function(){
                    if(settings && settings.hideWatchedVideo && settings.hideWatchedVideo == 2) {
                        $('#' + hideCheckboxId).prop("checked", true);
                    }
                    $('#' + hideCheckboxId).change(function () {
                        var value = 1;
                        if($(this).prop("checked")) value = 2;

                        chrome.runtime.sendMessage({
                            'title': 'setSpecialSetting',
                            'body': {
                                'name' : 'hideWatchedVideo',
                                'value' : value
                            }
                        });

                        toggleWatchedVideos();
                    });
                }
            })
        }



        if(menuItems.length) {
            if($('ytd-guide-renderer#guide-renderer > div#sections').length) {
                var menuHtml =
                    '<dov id="' + menuId + '" is="ytd-guide-section-renderer" class="style-scope ytd-guide-renderer"> ' +
                    '<yt-service api="ytd-guide-service" class="style-scope ytd-guide-section-renderer"> </yt-service> ' +
                    '<h3 class="style-scope ytd-guide-section-renderer"> ' +
                    '<div id="guide-section-title" class="style-scope ytd-guide-section-renderer">' +
                    '<span is="yt-endpoint" href="/channel/UC1A4LU-vNnaV77dEvaBDQ9Q/playlists" class="style-scope yt-formatted-string">' +
                    'YouBlock menu' +
                    '</span>' +
                    '</div> ' +
                    '</h3> ' +
                    '<div id="items" class="style-scope ytd-guide-section-renderer fua_youtube_menu_items">' +
                    '</div> ' +
                    '</dov>';


                $('ytd-guide-renderer#guide-renderer > div#sections')
                    .find('ytd-guide-section-renderer:first')
                    .after(menuHtml);
            }
            else {
                $('.guide-toplevel').find('li:first').after(
                    '<li class="guide-section" id="' + menuId + '">' +
                    '<div class="guide-item-container personal-item"> ' +
                    '<h3> ' +
                    '<span class="g-hovercard yt-uix-sessionlink spf-link">YouBlock menu</span> ' +
                    '</h3> ' +
                    '<ul class="guide-user-links yt-uix-tdl yt-box fua_youtube_menu_items" role="menu" id="fua_youtube_menu_items"> ' +
                    '</ul> ' +
                    '</div> ' +
                    '<hr class="guide-section-separator"> ' +
                    '</li>'
                );
            }


            for(var i in menuItems){
                $('#' + menuId).find('.fua_youtube_menu_items').first().append(
                    menuItems[i].html
                );
                menuItems[i].action();
            }
        }
    });
}


function toggleWatchedVideos(){
    if(window.location.href.match('^https://www.youtube.com/feed/subscriptions')){
        if($('#checkbox_hide_watched_videos_id').length) {
            if ($('#checkbox_hide_watched_videos_id').prop("checked")) {
                $('.watched-badge').closest('.yt-shelf-grid-item').addClass('fua_blocker_invisible');
                $('.watched-badge').closest('.expanded-shelf-content-item-wrapper').addClass('fua_blocker_invisible');

                $('div#overlays > ytd-thumbnail-overlay-playback-status-renderer')
                    .closest('ytd-grid-video-renderer').addClass('fua_blocker_invisible');

                $('div#overlays > ytd-thumbnail-overlay-playback-status-renderer')
                    .closest('ytd-expanded-shelf-contents-renderer')
                    .closest('ytd-item-section-renderer').addClass('fua_blocker_invisible');
            }
            else {
                $('.watched-badge').closest('.yt-shelf-grid-item')
                    .filter('.fua_blocker_invisible').removeClass('fua_blocker_invisible');
                $('.watched-badge').closest('.expanded-shelf-content-item-wrapper')
                    .filter('.fua_blocker_invisible').removeClass('fua_blocker_invisible');

                $('div#overlays > ytd-thumbnail-overlay-playback-status-renderer')
                    .closest('ytd-grid-video-renderer').removeClass('fua_blocker_invisible');

                $('div#overlays > ytd-thumbnail-overlay-playback-status-renderer')
                    .closest('ytd-expanded-shelf-contents-renderer')
                    .closest('ytd-item-section-renderer').removeClass('fua_blocker_invisible');
            }
        }
    }
}


function addBlackChannelButton(time) {

    if (window.location.href.match('^https://www.youtube.com/(user|channel)')) {


        if (
            !$('#fua_channel_to_black_list_button_id').length
            && !$('.yt-uix-button-icon-settings-material').length
        ) {

            var channel_id_1 = $('.yt-uix-subscription-button').attr('data-channel-external-id');

            if (channel_id_1) {
                chrome.storage.local.get(['settings', 'channels_black_list'], function (items) {
                    var settings = items.settings;

                    if (
                        (!settings || !settings.blackChannels || settings.blackChannels == 2)
                        && (!items.channels_black_list || !items.channels_black_list[channel_id_1])
                        && $('.primary-header-actions').length
                        && !$('#fua_channel_to_black_list_button_id').length
                    ) {


                        $('.primary-header-actions').prepend(
                            '<span style="margin-top: -3px; margin-left: -40px;" show-tooltip="' + C_TEXT_TOOLTIP_CHANNEL_TO_BLACK_LIST + '" id="fua_channel_to_black_list_button_id">' +
                            '<img src="' + IMAGE_DELETE_VIDEO + '">' +
                            '</span>'
                        );


                        $('#fua_channel_to_black_list_button_id')
                            .click(function () {
                                var channel_id = $('.yt-uix-subscription-button').attr('data-channel-external-id');
                                chrome.runtime.sendMessage({
                                    'title': 'addChannelToBlackList',
                                    'body': {
                                        'channel_id': channel_id,
                                        'channel_name': $('.qualified-channel-title-text a').html()
                                    }
                                });

                                var blackList = JSON.parse(document.documentElement.dataset.channels_black_list || null);
                                if (!blackList) blackList = {};
                                blackList[channel_id] = $('.qualified-channel-title-text a').html();
                                document.documentElement.dataset.channels_black_list =
                                    JSON.stringify(blackList);

                                $(this).remove();
                                hideTooltip({toolTipObject: $('#app_tooltip_id')});
                            })
                            .hover(
                                function (e) {
                                    showTooltip({
                                        toolTipObject: $('#app_tooltip_id'),
                                        targetObject: $(this),
                                        marginTop: '-29px',
                                        textAttr: 'show-tooltip'
                                    });

                                },
                                function (e) {
                                    hideTooltip({toolTipObject: $('#app_tooltip_id')});
                                }
                            );
                    }
                });
            }
        }


        let channelNameBlock = $("#channel-title-container > #channel-title");
        let channelName = channelNameBlock.text().trim();


        if (
            (
                !$('#fua_channel_to_black_list_button_id[channelUrl="' + window.location.href + '"]').length
                && !$('#fua_channel_to_black_list_button_id[channelName="' + channelName + '"]').length
            )
            && channelNameBlock.length
        ) {

            chrome.storage.local.get(['settings', 'channels_black_list'], items => {
                let settings = items.settings;

                $('#fua_channel_to_black_list_button_id').remove();

                if (
                    !settings || !settings.blackChannels || settings.blackChannels == 2
                ) {

                    let actionMessage = 'addChannelToBlackList';
                    let src = IMAGE_DELETE_VIDEO;
                    let toolTip = C_TEXT_TOOLTIP_CHANNEL_TO_BLACK_LIST;
                    if (items.channels_black_list && items.channels_black_list[channelName]) {
                        actionMessage = 'removeChannelFromBlackList';
                        src = chrome.runtime.getURL('img/navigation/restore.png');
                        toolTip = "Restore this channel from black list";
                    }

                    channelNameBlock.after(
                        '<span actionMessage="' + actionMessage + '" channelName="' + channelName + '" channelUrl="' + window.location.href + '" style=" margin-left: 40px;" show-tooltip="' + toolTip + '" id="fua_channel_to_black_list_button_id">' +
                            '<img src="' + src + '">' +
                        '</span>'
                    );

                    $('#fua_channel_to_black_list_button_id')
                        .click(function () {
                            hideTooltip({toolTipObject: $('#app_tooltip_id')});
                            let channelName = $("#channel-title-container > #channel-title").text().trim();

                            let actionMessage = $(this).attr('actionMessage');
                            chrome.runtime.sendMessage({
                                'title': actionMessage,
                                'body': {
                                    'channel_id': channelName,
                                    'channel_name': channelName
                                }
                            });

                            let blackList = JSON.parse(document.documentElement.dataset.channels_black_list || null);
                            if (!blackList) blackList = {};

                            if (actionMessage === 'addChannelToBlackList') {
                                blackList[channelName] = channelName;
                                $(this).attr('actionMessage', 'removeChannelFromBlackList');
                                $(this).attr('show-tooltip', "Restore this channel from black list");
                                $(this).find('img').attr('src', chrome.runtime.getURL('img/navigation/restore.png'));
                            } else {
                                delete blackList[channelName];
                                $(this).attr('actionMessage', 'addChannelToBlackList');
                                $(this).attr('show-tooltip', C_TEXT_TOOLTIP_CHANNEL_TO_BLACK_LIST);
                                $(this).find('img').attr('src', IMAGE_DELETE_VIDEO);
                            }
                            document.documentElement.dataset.channels_black_list =
                                JSON.stringify(blackList);
                        })
                        .hover(
                            function (e) {
                                showTooltip({
                                    toolTipObject: $('#app_tooltip_id'),
                                    targetObject: $(this),
                                    marginTop: '-29px',
                                    textAttr: 'show-tooltip'
                                });

                            },
                            function (e) {
                                hideTooltip({toolTipObject: $('#app_tooltip_id')});
                            }
                        );
                }
            });


        }

        if (!time) time = 0;
        if (time < 5000) {
            time = time + 500;
            setTimeout(function () {
                addBlackChannelButton(time);
            }, 500);
        }
    }
}



window.addEventListener("keydown", function(e){
    if(e.which == 17){
        FUA_BLOCKER_GV.keys_press.ctrl = true;
    }
    else if(e.which == 18){
        FUA_BLOCKER_GV.keys_press.alt = true;
    }
    else if(e.which == 16){
        FUA_BLOCKER_GV.keys_press.shift = true;
    }
});

window.addEventListener("keyup", function(e){
    if(e.which == 17){
        FUA_BLOCKER_GV.keys_press.ctrl = false;
    }
    else if(e.which == 18){
        FUA_BLOCKER_GV.keys_press.alt = false;
    }
    else if(e.which == 16){
        FUA_BLOCKER_GV.keys_press.shift = false;
    }
});


function stopAutoPlayND(count) {
    if(!count) count = 0;
    //if(document.getElementsByTagName('ytd-watch').length) {
    var script = document.getElementById('fua_blocker_every_time_script_id');
    if (!script) return false;
    var stopSetting = script.getAttribute('auto_play');
    if (stopSetting === '0') {
        var video = document.querySelector('video.html5-main-video');
        if(video && !video.paused && video.duration > 1
        //&& document.querySelector('span.ytp-time-current')
        //&& document.querySelector('div.ytp-cued-thumbnail-overlay')
        //&& document.querySelector('button.ytp-play-button')
        ) {
            var src = video.getAttribute('src');
            var isStopped = video.getAttribute('fua_nd_stop_auto_play');
            if (src && (!isStopped || isStopped !== src)) {
                video.play();
                video.pause();
                video.setAttribute('fua_nd_stop_auto_play', src);
                var overlay = $('div.ytp-cued-thumbnail-overlay');
                overlay.show().css('z-index', 200);
                overlay.find('div.ytp-cued-thumbnail-overlay-image')
                    .css('background-image', 'url("https://i1.ytimg.com/vi/'+ getVideoIdFromVideoUrl(window.location.href) +'/hqdefault.jpg');
                overlay.click(function () {
                    $(this).hide();
                });
            }
        }
    }
    //}
    count++;
    if(count < 25){
        setTimeout(function () {
            stopAutoPlayND(count);
        }, 100)
    }
}