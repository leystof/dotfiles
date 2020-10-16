var FUA_YT_SIGNS = (function(){
    function Signs(){
        this.prefix = "fua_yt_";
        this.id = {
            "signs_window" : this.prefix + "text_formatter_signs_window_id",
            "signs_window_close" : this.prefix + "text_formatter_signs_window_close_id",
            "signs_window_content" : this.prefix + "text_formatter_signs_window_content_id",
            "sign_items_box" : this.prefix + "text_formatter_sign_items_box_id",
            "new_sign_input" : this.prefix + "text_formatter_new_sign_input_id",
            "new_sign_button" : this.prefix + "text_formatter_new_sign_button_id"
        };
        this.class = {
            "sign_button" : this.prefix + "sign_button",
            "remove_sign_button" : this.prefix + "remove_sign_button",
            "open_button" : this.prefix + "sign_open_button"
        };
        this.ctrl = false;
        this.signs = [
            //"☺", "☻", "★", "✪", "✧", "✦", "＄", "€", "�", "©", "❤", "＄", "❀", "✿", "←", "↑", "→", "↓", "↖", "↗", "↘", "↙", "&#64;", "❆",  "☃", "✎", "✐", "✍", "♠", "♣", "♥", "♦"
           // "☺", "☹", /*"😀",*/ "😍", "😡", "😢", /*"😯"*/, "🚽", "❤", "💔", "💖"
           // "☺", "☹", "❤"
            "«", "»", "„", "“", "《", "》", "—", "≡", "✓", "❤", "➔", "➤", "←", "↑", "→", "↓", "©", "®", "™", "☎", "✿", "❀", "★", "☆", "✡", "✧", "✦"
        ];

        this.tmpSigns = [
           // "←", "↑", "→", "↓", "«", "»", "©", "®", "™", "🌻", "✿", "❀", "★", "☆", "✡", "🔯", "✧", "✦", "♠", "♣", "♥", "♦"
            //"←", "↑", "→", "↓", "«", "»", "©", "®", "™", "✿", "❀", "★", "☆", "✡", "✧", "✦", "♠", "♣", "♥", "♦"
        ]
    }


    Signs.prototype.addNewSignInWindow = function(options){

        if(options.user || options.tmp) {
            $("#" + FUA_YT_SIGNS.id.sign_items_box).append(
                '<button real_value="'+ FUA_YT_SIGNS.encodeHtmlEntity(options.sign) +'" class="fua_yt_sign_item fua_blocker_text_formatter_button yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                    '<span class="' + FUA_YT_SIGNS.class.remove_sign_button + '">' +
                        '<img src="' + chrome.extension.getURL("img/delete_video.png") + '" style="width: 10px;">' +
                    '</span>' +
                    '<span class="fua_yt_sign_item_text">' + options.sign + '</span>' +
                '</button>'
            );

            var msgTitle = 'removeNewSign';
            if(options.tmp) msgTitle = 'removeTmpSign';

            $('.fua_yt_sign_item').last().find("." + FUA_YT_SIGNS.class.remove_sign_button).mousedown(function(event){
                event.preventDefault();
                event.stopPropagation();
                var item = $(this).closest(".fua_yt_sign_item");
                var value = item.attr("real_value");
                item.remove();
                chrome.runtime.sendMessage({
                    'title': msgTitle,
                    'body': { 'sign': value }
                });

                return false;
            });
        }
        else{
            $("#" + FUA_YT_SIGNS.id.sign_items_box).append(
                '<button class="fua_yt_sign_item fua_blocker_text_formatter_button yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                    '<span class="fua_yt_sign_item_text">' + options.sign + '</span>' +
                '</button>'
            );
        }

        $('.fua_yt_sign_item').last().mousedown(function(event){
            event.preventDefault();
            event.stopPropagation();
            FUA_YT_SIGNS.addSign({
                sign : $(this).find('.fua_yt_sign_item_text').html()
            });
            return false;
        });
    };


    Signs.prototype.createSignsWindow = function(){
       if($('#' + FUA_YT_SIGNS.id.signs_window).length){
           $('#' + FUA_YT_SIGNS.id.signs_window).show();
           return false;
       }

        $("body").prepend(
            '<div id="'+ FUA_YT_SIGNS.id.signs_window +'">' +
                '<span id="'+ FUA_YT_SIGNS.id.signs_window_close +'">' +
                    '<img src="'+ chrome.extension.getURL("img/delete_video.png") +'" style="width: 30px;">' +
                '</span>' +
                '<div id="'+ FUA_YT_SIGNS.id.signs_window_content +'">' +
                    '<div id="'+ FUA_YT_SIGNS.id.sign_items_box +'"></div>' +
                    '<div style="margin: 10px;">' +
                        '<input type="text" id="'+ FUA_YT_SIGNS.id.new_sign_input +'" placeholder="'+ chrome.i18n.getMessage("for_example") +' ❤">' +
                        '<button id="'+ FUA_YT_SIGNS.id.new_sign_button +'" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                            chrome.i18n.getMessage("word_add") +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );


        chrome.storage.local.get(['signs', 'removed_tmp_signs'], function(items) {
            var storageSigns = items.signs;
            var signs = FUA_YT_SIGNS.signs;
            for (var i in signs) {
                FUA_YT_SIGNS.addNewSignInWindow({
                    sign : signs[i]
                });
            }

            var removedTmpSigns = items.removed_tmp_signs;
            var tmpSigns = FUA_YT_SIGNS.tmpSigns;
            for (var i in tmpSigns) {
                if(!removedTmpSigns || removedTmpSigns.indexOf(tmpSigns[i]) === -1) {
                    FUA_YT_SIGNS.addNewSignInWindow({
                        sign: tmpSigns[i],
                        tmp: true
                    });
                }
            }

            if(storageSigns) {
                for (var i in storageSigns) {
                    FUA_YT_SIGNS.addNewSignInWindow({
                        sign : storageSigns[i],
                        user : true
                    });
                }
            }
        });


        $("#" + FUA_YT_SIGNS.id.signs_window_close).click(function(){
            $('#' + FUA_YT_SIGNS.id.signs_window).hide();
        });

        $("#" + FUA_YT_SIGNS.id.new_sign_button).click(function(){
            var value = $("#" + FUA_YT_SIGNS.id.new_sign_input).val();

            if(value && value.trim()) {
                value = value.trim();
                /*var encodedStr = value.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
                    return '&#' + i.charCodeAt(0) + ';';
                });*/



                encodedStr = FUA_YT_SIGNS.encodeHtmlEntity(value);
                //console.log("encodedStr", encodedStr);


                if(
                    (
                        encodedStr.trim().match("^(&(#[0-9]+|[a-zA-Z]+);)+$")
                        || value.match("^(&(#[0-9]+|[a-zA-Z]+);)+$")
                    )
                    && !value.match("^[0-9a-zA-Zа-яА-Я\-\+]*$")
                ){
                    chrome.runtime.sendMessage({
                        'title': 'addNewSign',
                        'body': { 'sign': value }
                    });

                    FUA_YT_SIGNS.addNewSignInWindow({
                        sign : value,
                        user : true
                    });
                }
            }

            $("#" + FUA_YT_SIGNS.id.new_sign_input).val(null);
        });
    };



    Signs.prototype.encodeHtmlEntity = function(str) {
        var buf = [];
        for (var i=str.length-1;i>=0;i--) {
            buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
        }
        return buf.join('');
    };



    Signs.prototype.addSign = function(options){
       //console.log("sign", options.sign);

        /*var targetElement = false;
        var titleInput = $("input.video-settings-title");
        if(titleInput.is(':focus')) targetElement = titleInput;
        else{
            var description = $("textarea.video-settings-description");
            if(description.is(':focus')) targetElement = description;
        }*/

        let targetElement = $(':focus');
        if(!targetElement) return false;
        let selectionPoint = targetElement[0].selectionStart;
        let textValue = targetElement.val();
        let firstPart = textValue.slice(0, selectionPoint);
        let lastPart = textValue.slice(selectionPoint);
        targetElement.val(firstPart + options.sign + lastPart);
        targetElement[0].selectionEnd = selectionPoint + 1;
        targetElement[0].dispatchEvent(new Event("input", {bubbles: true, cancelable: false}));
    };


    Signs.prototype.clickByOpenButton = function(){
        $("." + FUA_YT_SIGNS.class.open_button).click(function(){
            //FUA_YT_SIGNS.targetElement = $($(this).attr("data_selector"));
            FUA_YT_SIGNS.createSignsWindow();
        });
    };


    return new Signs();
})();


//FUA_YT_SIGNS.createSignsWindow();