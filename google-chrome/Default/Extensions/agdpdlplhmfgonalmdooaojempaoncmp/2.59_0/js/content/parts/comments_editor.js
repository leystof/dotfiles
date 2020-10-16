var FUA_BLOCKER_COMMENTS_EDITOR = (function(){
    function Comments_editor(){
        this.prefix = "fua_blocker_";
        this.id = {
            "signs_window" : this.prefix + "text_formatter_signs_window_id",
            "signs_window_close" : this.prefix + "text_formatter_signs_window_close_id",
            "signs_window_content" : this.prefix + "text_formatter_signs_window_content_id",
            "sign_items_box" : this.prefix + "text_formatter_sign_items_box_id",
            "new_sign_input" : this.prefix + "text_formatter_new_sign_input_id",
            "new_sign_button" : this.prefix + "text_formatter_new_sign_button_id",
        };
        this.class = {
            "disable_button" : this.prefix + "text_formatter_button_disable",
            "active_button" : this.prefix + "text_formatter_button_active",
            "begin_formatter" : this.prefix + "begin_formatter",
            "bold_button" : this.prefix + "bold_button",
            "italic_button" : this.prefix + "italic_button",
            "line_through_button" : this.prefix + "line_through_button",
            "sign_button" : this.prefix + "sign_button",
            "remove_sign_button" : this.prefix + "remove_sign_button",
        };
        this.ctrl = false;
        this.signs = [
            //"☺", "☻", "★", "✪", "✧", "✦", "＄", "€", "�", "©", "❤", "＄", "❀", "✿", "←", "↑", "→", "↓", "↖", "↗", "↘", "↙", "&#64;", "❆",  "☃", "✎", "✐", "✍", "♠", "♣", "♥", "♦"
           // "☺", "☹", /*"😀",*/ "😍", "😡", "😢", /*"😯"*/, "🚽", "❤", "💔", "💖"
            "☺", "☹", "❤"
        ];

        this.tmpSigns = [
           // "←", "↑", "→", "↓", "«", "»", "©", "®", "™", "🌻", "✿", "❀", "★", "☆", "✡", "🔯", "✧", "✦", "♠", "♣", "♥", "♦"
            "←", "↑", "→", "↓", "«", "»", "©", "®", "™", "✿", "❀", "★", "☆", "✡", "✧", "✦", "♠", "♣", "♥", "♦"
        ];

        this.newDesignBox = false;
    }


    Comments_editor.prototype.addNewSignInWindow = function(options){

        if(options.user || options.tmp) {
            $("#" + FUA_BLOCKER_COMMENTS_EDITOR.id.sign_items_box).append(
                '<button real-value="'+ FUA_BLOCKER_COMMENTS_EDITOR.encodeHtmlEntity(options.sign) +'" class="fua_blocker_sign_item fua_blocker_text_formatter_button yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                    '<span class="' + FUA_BLOCKER_COMMENTS_EDITOR.class.remove_sign_button + '">' +
                        '<img src="' + IMAGE_DELETE_VIDEO + '" style="width: 10px;">' +
                    '</span>' +
                    '<span class="fua_blocker_sign_item_text">' + options.sign + '</span>' +
                '</button>'
            );

            var msgTitle = 'removeNewSign';
            if(options.tmp) msgTitle = 'removeTmpSign';

            $('.fua_blocker_sign_item').last().find("." + FUA_BLOCKER_COMMENTS_EDITOR.class.remove_sign_button).mousedown(function(event){
                event.preventDefault();
                event.stopPropagation();
                var item = $(this).closest(".fua_blocker_sign_item");
                var value = item.attr("real-value");
                item.remove();
                chrome.runtime.sendMessage({
                    'title': msgTitle,
                    'body': { 'sign': value }
                });

                return false;
            });
        }
        else{
            $("#" + FUA_BLOCKER_COMMENTS_EDITOR.id.sign_items_box).append(
                '<button class="fua_blocker_sign_item fua_blocker_text_formatter_button yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                    '<span class="fua_blocker_sign_item_text">' + options.sign + '</span>' +
                '</button>'
            );
        }

        $('.fua_blocker_sign_item').last().mousedown(function(event){
            event.preventDefault();
            event.stopPropagation();
            FUA_BLOCKER_COMMENTS_EDITOR.addSign({
                sign : $(this).find('.fua_blocker_sign_item_text').html()
            });
            return false;
        });
    };


    Comments_editor.prototype.createSignsWindow = function(){
       if($('#' + FUA_BLOCKER_COMMENTS_EDITOR.id.signs_window).length){
           $('#' + FUA_BLOCKER_COMMENTS_EDITOR.id.signs_window).show();
           return false;
       }

        $("body").prepend(
            '<div id="'+ FUA_BLOCKER_COMMENTS_EDITOR.id.signs_window +'">' +
                '<span id="'+ FUA_BLOCKER_COMMENTS_EDITOR.id.signs_window_close +'">' +
                    '<img src="'+ IMAGE_DELETE_VIDEO +'" style="width: 30px;">' +
                '</span>' +
                '<div id="'+ FUA_BLOCKER_COMMENTS_EDITOR.id.signs_window_content +'">' +
                    '<div id="'+ FUA_BLOCKER_COMMENTS_EDITOR.id.sign_items_box +'"></div>' +
                    '<div style="margin: 10px;">' +
                        '<input type="text" id="'+ FUA_BLOCKER_COMMENTS_EDITOR.id.new_sign_input +'" placeholder="'+ FUA_BLOCKER_TRANSLATION.words_combinations.for_example +' ❤">' +
                        '<button id="'+ FUA_BLOCKER_COMMENTS_EDITOR.id.new_sign_button +'" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default">' +
                            FUA_BLOCKER_TRANSLATION.words.add +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );


        chrome.storage.local.get(['signs', 'removed_tmp_signs'], function(items) {
            var storageSigns = items.signs;
            var signs = FUA_BLOCKER_COMMENTS_EDITOR.signs;
            for (var i in signs) {
                FUA_BLOCKER_COMMENTS_EDITOR.addNewSignInWindow({
                    sign : signs[i]
                });
            }

            var removedTmpSigns = items.removed_tmp_signs;
            var tmpSigns = FUA_BLOCKER_COMMENTS_EDITOR.tmpSigns;
            for (var i in tmpSigns) {
                if(!removedTmpSigns || removedTmpSigns.indexOf(tmpSigns[i]) === -1) {
                    FUA_BLOCKER_COMMENTS_EDITOR.addNewSignInWindow({
                        sign: tmpSigns[i],
                        tmp: true
                    });
                }
            }

            if(storageSigns) {
                for (var i in storageSigns) {
                    FUA_BLOCKER_COMMENTS_EDITOR.addNewSignInWindow({
                        sign : storageSigns[i],
                        user : true
                    });
                }
            }
        });


        $("#" + FUA_BLOCKER_COMMENTS_EDITOR.id.signs_window_close).click(function(){
            $('#' + FUA_BLOCKER_COMMENTS_EDITOR.id.signs_window).hide();
        });

        $("#" + FUA_BLOCKER_COMMENTS_EDITOR.id.new_sign_button).click(function(){
            var value = $("#" + FUA_BLOCKER_COMMENTS_EDITOR.id.new_sign_input).val();

            if(value && value.trim()) {
                value = value.trim();
                /*var encodedStr = value.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
                    return '&#' + i.charCodeAt(0) + ';';
                });*/


                encodedStr = FUA_BLOCKER_COMMENTS_EDITOR.encodeHtmlEntity(value);
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

                    FUA_BLOCKER_COMMENTS_EDITOR.addNewSignInWindow({
                        sign : value,
                        user : true
                    });
                }
            }

            $("#" + FUA_BLOCKER_COMMENTS_EDITOR.id.new_sign_input).val(null);
        });
    };


    Comments_editor.prototype.encodeHtmlEntity = function(str) {
        var buf = [];
        for (var i=str.length-1;i>=0;i--) {
            buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
        }
        return buf.join('');
    };


    Comments_editor.prototype.getStartAndEndNodes = function(options){
        var textArea = this.getCommentTextArea();
        var end = options.end;
        var start = options.start;

        var children = textArea.childNodes;
        var nodeArray = [];
        var childrenCount = children.length;
        var count = 0;
        for (var i = 0; i < childrenCount; i++) {
            var node = children[i];
            var nodeText = node.textContent;
            var nodeTextLength = nodeText.length;

            if (count + nodeTextLength <= start) {
                count = count + nodeTextLength;
                continue;
            }
            else if (count >= end) break;

            var nodeStart = start - count;
            var nodeEnd = end - count - nodeTextLength;
            if (nodeEnd >= 0) nodeEnd = nodeTextLength;
            else nodeEnd = end - count;

            if(node.nodeName.toLowerCase() === "span") node = node.firstChild;
            nodeArray.push({node : node, nodeStart : nodeStart, nodeEnd : nodeEnd});
            count = count + nodeTextLength;
        }

        return { startNode : nodeArray[0], endNode : nodeArray[nodeArray.length - 1]};
    };


    Comments_editor.prototype.setNewSelection = function(options){
        var limitedNodes = FUA_BLOCKER_COMMENTS_EDITOR.getStartAndEndNodes(options);
        var selection = window.getSelection();
        if (selection.rangeCount > 0) selection.removeAllRanges();
        var range = document.createRange();
        range.setStart(limitedNodes.startNode.node, limitedNodes.startNode.nodeStart);
        range.setEnd(limitedNodes.endNode.node, limitedNodes.endNode.nodeEnd);
        selection.addRange(range);
        FUA_BLOCKER_COMMENTS_EDITOR.changeTextButtonsStatus({action : "click"});
    };


    Comments_editor.prototype.changeTextButtonsStatus = function(options){

        if(options.action === "focusout"){
            //console.log("action", options.action);
            FUA_BLOCKER_COMMENTS_EDITOR.parseTextButtons(function(button){
                button.setAttribute("disabled", true);
                button.classList.remove(FUA_BLOCKER_COMMENTS_EDITOR.class.active_button);
            });
        }
        else if(options.action === "click" || options.action === "keyup" || options.action === "focusin"){
            //console.log("action", options.action);
            var endSelectionNode = FUA_BLOCKER_COMMENTS_EDITOR.getEndSelectionNode();
            FUA_BLOCKER_COMMENTS_EDITOR.parseTextButtons(function(button){
                button.removeAttribute("disabled");
                var btnValue = button.getAttribute("value");
                if(btnValue && endSelectionNode.parentNode.classList.contains(btnValue)){
                    button.classList.add(FUA_BLOCKER_COMMENTS_EDITOR.class.active_button);
                }
                else {
                    button.classList.remove(FUA_BLOCKER_COMMENTS_EDITOR.class.active_button);
                }
            });
        }
    };



    Comments_editor.prototype.parseTextButtons = function(callback){
        var buttons = document.getElementsByClassName("fua_blocker_text_formatter_button");
        var length = buttons.length;
        if(length < 1) return false;
        for(var i=0; i < length; i++) callback(buttons[i]);
    };



    Comments_editor.prototype.getEndSelectionNode = function(){
        var r = document.getSelection().getRangeAt(0);
        if (r.endContainer !== document.getSelection().anchorNode) {
            return {"node": r.endContainer, "parentNode": r.endContainer.parentNode};
        }
        else {
            return {"node": r.startContainer, "parentNode": r.startContainer.parentNode};
        }

    };



    Comments_editor.prototype.getCaretCharacterOffsetWithin = function(element) {
        var caretOffset = 0;

        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    };


    Comments_editor.prototype.clearSelection = function() {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }
    };


    Comments_editor.prototype.createStandardButton = function(options) {
        var button = document.createElement("button");
        button.classList.add("fua_blocker_text_formatter_button");
        button.classList.add(options.button_class);
        button.classList.add("yt-uix-button");
        button.classList.add("yt-uix-button-size-default");
        button.classList.add("yt-uix-button-default");
        button.textContent = options.button_text;
        if(options.targetClass) button.setAttribute("value", options.targetClass);
        button.addEventListener("mousedown", function(event){
            event.preventDefault();
            event.stopPropagation();
            options.button_callback(event);
            return false;
        });

        if(options.tooltip){
            button.setAttribute("tooltip_text", options.tooltip);
            button.addEventListener("mouseover", function(event){
                FUA_BLOCKER_TOOLTIP.showTooltip({
                    targetObject : button,
                    textAttr : "tooltip_text",
                    marginTop : "-30px"
                });
            });

            button.addEventListener("mouseout", function(event){
                FUA_BLOCKER_TOOLTIP.hideTooltip();
            });
        }

        return button;
    };

    
    Comments_editor.prototype.isCommentFocused = function () {
        var commentSimpleBox = document.getElementById("comment-simplebox");
        if (commentSimpleBox && !commentSimpleBox.classList.contains("focus")) return false;
        else {
            if(this.getCommentTextArea() !== document.activeElement) return false;
        }
        return true;
    };
    

    Comments_editor.prototype.changeTextRegister = function(options){
        if(!this.isCommentFocused()) return false;

        var textArea = this.getCommentTextArea();
        var currentText = textArea.textContent;
        var selectionText = window.getSelection().getRangeAt(0).toString();
        var end = FUA_BLOCKER_COMMENTS_EDITOR.getCaretCharacterOffsetWithin(textArea);
        var start = end - selectionText.length;

        var children = textArea.childNodes;
        var changeArray = [];
        var childrenCount = children.length;
        var count = 0;

        for (var i = 0; i < childrenCount; i++) {
            var node = children[i];
            var nodeText = node.textContent;
            var nodeTextLength = nodeText.length;

            if (count + nodeTextLength <= start) {
                count = count + nodeTextLength;
                continue;
            }
            else if (count >= end) break;

            var nodeStart = start - count;
            var nodeEnd = end - count - nodeTextLength;
            if (nodeEnd >= 0) nodeEnd = nodeTextLength;
            else nodeEnd = end - count;

            firstPart = nodeText.slice(0, nodeStart);
            lastPart = nodeText.slice(nodeEnd);
            subStr = nodeText.slice(nodeStart, nodeEnd);

            if(options.target === "lower") subStr = subStr.toLowerCase();
            else if(options.target === "upper") subStr = subStr.toUpperCase();

            node.textContent = firstPart + subStr + lastPart;
            count = count + nodeTextLength;
        }

        FUA_BLOCKER_COMMENTS_EDITOR.clearSelection();
        FUA_BLOCKER_COMMENTS_EDITOR.setNewSelection({
            start : start,
            end : end
        });
    };


    Comments_editor.prototype.spanCleaner = function(){
        var textArea = this.getCommentTextArea();
        var spans = textArea.getElementsByTagName("span");
        for(var i=0; i < spans.length; i++){
            if(!spans[i].textContent) spans[i].remove();
        }
    };




    Comments_editor.prototype.setCursorInOneSpan = function(options){
        FUA_BLOCKER_COMMENTS_EDITOR.clearSelection();
        var selection = window.getSelection();
        if (selection.rangeCount > 0) selection.removeAllRanges();
        var range = document.createRange();
        range.setStart(options.node.firstChild, options.position);
        selection.addRange(range);
        FUA_BLOCKER_COMMENTS_EDITOR.changeTextButtonsStatus({action : "click"});
    };



    Comments_editor.prototype.setCursorInSpan = function(options){
        FUA_BLOCKER_COMMENTS_EDITOR.spanCleaner();
        var targetClass = options.targetClass;
        var endSelectionNode = FUA_BLOCKER_COMMENTS_EDITOR.getEndSelectionNode();
        var doAddClass = true;
        if(endSelectionNode.parentNode.classList.contains(targetClass)) doAddClass = false;

        var textArea = this.getCommentTextArea();
        var end = FUA_BLOCKER_COMMENTS_EDITOR.getCaretCharacterOffsetWithin(textArea);
        var start = end;

        var beginClassName = false;
        var beginFormatter = textArea.getElementsByClassName(FUA_BLOCKER_COMMENTS_EDITOR.class.begin_formatter);
        for(var i=0; i < beginFormatter.length; i++){
            var text = beginFormatter[i].firstChild.textContent;
            beginClassName = beginFormatter[i].className;
            if(text.match("^[ ]$")) beginFormatter[i].remove();
            else beginFormatter[i].classList.remove(FUA_BLOCKER_COMMENTS_EDITOR.class.begin_formatter);
        }

        var children = textArea.childNodes;
        var childrenCount = children.length;
        var count = 0;

        var span = document.createElement("span");

        if(childrenCount < 1){
            if(beginClassName) span.className = beginClassName;
            if(doAddClass) span.classList.add(targetClass);
            else span.classList.remove(targetClass);
            span.appendChild(document.createTextNode(" "));
            span.classList.add(FUA_BLOCKER_COMMENTS_EDITOR.class.begin_formatter);
            textArea.appendChild(span);
            FUA_BLOCKER_COMMENTS_EDITOR.setCursorInOneSpan({
                node : span,
                position : 0
            });
        }

        for (var i = 0; i < childrenCount; i++) {

            var node = children[i];
            var nodeText = node.textContent;
            var nodeTextLength = nodeText.length;

            if (count + nodeTextLength <  start) {
                count = count + nodeTextLength;
                continue;
            }
            else if (count > end) break;

            var nodeStart = start - count;
            if(nodeStart < 0) nodeStart = 0;
            var nodeEnd = end - count - nodeTextLength;
            if (nodeEnd >= 0) nodeEnd = nodeTextLength;
            else nodeEnd = end - count;


            var nodeName = node.nodeName.toLowerCase();


            var additionalChar = 1;
            var additionalGap = "";
            if(nodeText.charAt(nodeStart - additionalChar).match("[\\n\\t\\r]")){
                additionalChar = 0;
                additionalGap = " ";
                if(beginClassName) span.className = beginClassName;
                span.classList.add(FUA_BLOCKER_COMMENTS_EDITOR.class.begin_formatter);
            }
            else  if (nodeName === "span") span.className = node.className;


            firstPart = nodeText.slice(0, nodeStart - additionalChar);
            lastPart = nodeText.slice(nodeEnd);
            subStr = nodeText.slice(nodeStart - additionalChar, nodeEnd) + additionalGap;

            var newNodes = {};
            var nodePart = false;

            if (firstPart) {
                if (nodeName === "span") {
                    nodePart = document.createElement("span");
                    nodePart.className = node.className;
                    nodePart.textContent = firstPart;
                }
                else nodePart = document.createTextNode(firstPart);
                newNodes.fp = nodePart;
            }


            if(doAddClass) span.classList.add(targetClass);
            else span.classList.remove(targetClass);
            span.appendChild(document.createTextNode(subStr));
            newNodes.ss = span;

            if (lastPart) {
                if (nodeName === "span") {
                    nodePart = document.createElement("span");
                    nodePart.className = node.className;
                    nodePart.textContent = lastPart;
                }
                else nodePart = document.createTextNode(lastPart);
                newNodes.lp = nodePart;
            }

            for (var j in newNodes) textArea.insertBefore(newNodes[j], node);
            node.remove();
            FUA_BLOCKER_COMMENTS_EDITOR.setCursorInOneSpan({
                node : newNodes.ss,
                position : additionalChar
            });
            break;
        }


    };


    Comments_editor.prototype.getCommentTextArea = function () {
        var textArea = document.getElementsByClassName("comment-simplebox-text")[0];
        if(!textArea) {
            //textArea = document.getElementById('fua_blocker_comment_alternative_textarea');
            textArea = this.newDesignBox.find('#contenteditable-textarea')[0];
        }
        return textArea;
    };


    Comments_editor.prototype.addTextFormatting = function(options) {
        if(!this.isCommentFocused()) return false;

        var targetClass = options.targetClass;
        var endSelectionNode = this.getEndSelectionNode();
        var doAddClass = true;
        if(endSelectionNode.parentNode.classList.contains(targetClass)) doAddClass = false;

        var textArea = this.getCommentTextArea();
        var currentText = textArea.textContent;
        var selectionText = window.getSelection().getRangeAt(0).toString();
        var end = this.getCaretCharacterOffsetWithin(textArea);
        var start = end - selectionText.length;


        /*console.log("firstStart", start);
        console.log("firstEnd", end);*/


        var firstPart = currentText.slice(0, start);
        var lastPart = currentText.slice(end);
        var subStr = currentText.slice(start, end);

        var tmpSubString = subStr.match("^[\\s]+");
        if (tmpSubString) {
            start = start + tmpSubString[0].length;
        }
        else if (
            firstPart !== ""
            && !firstPart.match("[\\s]$")
            && !subStr.match("^[\\s]")
        ) {
            var additional = firstPart.match(new RegExp("[^\\s]*$", "i"));
            if (additional) start = start - additional[0].length;
        }

        tmpSubString = subStr.match("[\\s]+$");
        if (tmpSubString) {
            end = end - tmpSubString[0].length;
        }
        else if (
            lastPart !== ""
            && !lastPart.match("^[\\s]")
            && !subStr.match("[\\s]$")
        ) {
            var additional = lastPart.match(new RegExp("^[^\\s]*", "i"));
            if (additional) end = end + additional[0].length;
        }


        //console.log("start", start);
        //console.log("end", end);
        //console.log("firstSubStr", subStr);


        if(start == end || start > end){
            FUA_BLOCKER_COMMENTS_EDITOR.setCursorInSpan(options);
            return true;
        }


        var children = textArea.childNodes;
        var changeArray = [];
        var childrenCount = children.length;
        var count = 0;


        for (var i = 0; i < childrenCount; i++) {
            var node = children[i];
            var nodeText = node.textContent;
            var nodeTextLength = nodeText.length;

            if (count + nodeTextLength <= start) {
                count = count + nodeTextLength;
                continue;
            }
            else if (count >= end) break;

            //console.log("nodeText", nodeText);
            //console.log("nodeTextLength", nodeTextLength);
            //console.log("count", count);

            var nodeStart = start - count;
            if(nodeStart < 0) nodeStart = 0;
            var nodeEnd = end - count - nodeTextLength;
            if (nodeEnd >= 0) nodeEnd = nodeTextLength;
            else nodeEnd = end - count;

            //console.log("nodeStart", nodeStart);
            //console.log("nodeEnd", nodeEnd);

            firstPart = nodeText.slice(0, nodeStart);
            lastPart = nodeText.slice(nodeEnd);
            subStr = nodeText.slice(nodeStart, nodeEnd);


            if(!doAddClass) {
                tmpSubString = firstPart.match("[\\s]+$");
                if (tmpSubString) nodeStart = nodeStart - tmpSubString[0].length;
                tmpSubString = lastPart.match("^[\\s]+");
                if (tmpSubString) nodeEnd = nodeEnd + tmpSubString[0].length;
                firstPart = nodeText.slice(0, nodeStart);
                lastPart = nodeText.slice(nodeEnd);
                subStr = nodeText.slice(nodeStart, nodeEnd);
            }



            //console.log("firstPart", firstPart);
            //console.log("lastPart", lastPart);
            //console.log("subStr", "%" + subStr + "%");

            var newNodes = [];
            var nodeName = node.nodeName.toLowerCase();
            var nodePart = false;

            if (firstPart) {
                if (nodeName === "span") {
                    nodePart = document.createElement("span");
                    nodePart.className = node.className;
                    nodePart.textContent = firstPart;
                }
                else nodePart = document.createTextNode(firstPart);
                newNodes.push(nodePart);
            }

            var span = document.createElement("span");
            if (nodeName === "span") span.className = node.className;

            if(doAddClass) span.classList.add(targetClass);
            else span.classList.remove(targetClass);

            span.textContent = subStr;
            newNodes.push(span);

            if (lastPart) {
                if (nodeName === "span") {
                    nodePart = document.createElement("span");
                    nodePart.className = node.className;
                    nodePart.textContent = lastPart;
                }
                else nodePart = document.createTextNode(lastPart);
                newNodes.push(nodePart);
            }

            changeArray.push({
                targetNode: node,
                newNodes: newNodes
            });

            count = count + nodeTextLength;
        }

        for (var i in changeArray) {
            for (var j in changeArray[i].newNodes) {
                textArea.insertBefore(
                    changeArray[i].newNodes[j],
                    changeArray[i].targetNode
                );
            }
            changeArray[i].targetNode.remove();
        }

        FUA_BLOCKER_COMMENTS_EDITOR.clearSelection();
        FUA_BLOCKER_COMMENTS_EDITOR.setNewSelection({
            start : start,
            end : end
        });
    };


    Comments_editor.prototype.addSign = function(options) {
        console.log('options', options);
        if (!this.isCommentFocused()) return false;

        var textArea = this.getCommentTextArea();
        var end = FUA_BLOCKER_COMMENTS_EDITOR.getCaretCharacterOffsetWithin(textArea);

        var children = textArea.childNodes;
        var childrenCount = children.length;
        var count = 0;

        console.log("end", end);

        if(!children.length){
            var mainText = textArea.textContent;
            firstPart = mainText.slice(0, end);
            lastPart = mainText.slice(end);
            textArea.textContent = firstPart + options.sign + lastPart;
        }
        else {
            for (var i = 0; i < childrenCount; i++) {
                var node = children[i];
                var nodeText = node.textContent;
                var nodeTextLength = nodeText.length;

                if (count + nodeTextLength < end) {
                    count = count + nodeTextLength;
                    continue;
                }
                else if (count > end) break;

                var nodeCursor = end - count;
                firstPart = nodeText.slice(0, nodeCursor);
                lastPart = nodeText.slice(nodeCursor);
                node.textContent = firstPart + options.sign + lastPart;

                count = count + nodeTextLength;
            }
        }

        FUA_BLOCKER_COMMENTS_EDITOR.clearSelection();

        if(end > 0) {
            FUA_BLOCKER_COMMENTS_EDITOR.setNewSelection({
                start: end,
                end: end
            });
        }
    };


    Comments_editor.prototype.parseCommentText = function() {
        var textArea = this.getCommentTextArea();
        var textAreaContent = textArea.textContent;
        var textAreaContentLength = textAreaContent.length;
        var children = textArea.childNodes;
        var childrenCount = children.length;
        var changeArray = [];
        var count = 0;

        for (var i = 0; i < childrenCount; i++) {
            var node = children[i];
            var nodeText = node.textContent;
            var nodeTextLength = nodeText.length;
            var nodeName = node.nodeName.toLowerCase();

            if (nodeName === "span" && !nodeText.match("^[\\s]+$")) {
                var symbols = "";
                var classList = node.classList;
                if (classList.contains("fua_blocker_text_bold")) symbols += "*";
                if (classList.contains("fua_blocker_text_italic")) symbols += "_";
                if (classList.contains("fua_blocker_text_line_through")) symbols += "-";


                if (symbols) {
                    var span = document.createElement("span");
                    span.classList.add("fua_blocker_text_hidden_symbol");
                    span.textContent = symbols;
                    var spanClone = span.cloneNode(true);

                    var spaces = nodeText.match("^[\\s]+");
                    if (spaces) span.textContent = spaces[0] + symbols;
                    else if (count - 1 > 0 && !textAreaContent.charAt(count - 1).match("[\\s]")) {
                        span.textContent = " " + symbols;
                    }

                    spaces = nodeText.match("[\\s]+$");
                    if (spaces) spanClone.textContent = symbols + spaces[0];
                    else if (
                        count + nodeTextLength < textAreaContentLength
                        && !textAreaContent.charAt(count + nodeTextLength).match("[\\s]")
                    ) {
                        spanClone.textContent = symbols + " ";
                    }
                    node.textContent = nodeText.trim();

                    changeArray.push({
                        targetNode: node,
                        before: span,
                        after: spanClone
                    });
                }

            }

            count = count + nodeTextLength;
        }

        for (var i in changeArray) {
            changeArray[i].targetNode.insertBefore(changeArray[i].before, changeArray[i].targetNode.firstChild);
            changeArray[i].targetNode.appendChild(changeArray[i].after);
        }
    };


    Comments_editor.prototype.addFormattingButtons = function(time){
        if (!document.getElementById("fua_blocker_comment_buttons_block_id")) {
            var target_block =
                document.getElementsByClassName("comment-simplebox-controls")[0];
            if(!target_block){
                target_block = document.querySelector('ytd-comment-dialog-renderer ytd-commentbox#commentbox > div#main > div#footer >div#footer-text');
            }

            var buttons_box = document.createElement("div");
            buttons_box.setAttribute("id", "fua_blocker_comment_buttons_block_id");


            buttons_box.appendChild(FUA_BLOCKER_COMMENTS_EDITOR.createStandardButton({
                button_class : FUA_BLOCKER_COMMENTS_EDITOR.class.sign_button,
                button_text : "☺",
                targetClass: "fua_blocker_text_signs",
                tooltip: "YouClever: HTML " + FUA_BLOCKER_TRANSLATION.words.symbols.toLowerCase(),
                button_callback : function(event){
                    FUA_BLOCKER_COMMENTS_EDITOR.createSignsWindow();
                }
            }));



            buttons_box.appendChild(FUA_BLOCKER_COMMENTS_EDITOR.createStandardButton({
                button_class : FUA_BLOCKER_COMMENTS_EDITOR.class.bold_button,
                button_text : "B",
                targetClass: "fua_blocker_text_bold",
                tooltip: "YouClever: "+ FUA_BLOCKER_TRANSLATION.words.bold +" Ctrl-B",
                button_callback : function(event){
                    FUA_BLOCKER_COMMENTS_EDITOR.addTextFormatting({
                        targetClass: "fua_blocker_text_bold"
                    });
                }
            }));

            buttons_box.appendChild(FUA_BLOCKER_COMMENTS_EDITOR.createStandardButton({
                button_class : FUA_BLOCKER_COMMENTS_EDITOR.class.italic_button,
                button_text : "I",
                targetClass: "fua_blocker_text_italic",
                tooltip: "YouClever: "+ FUA_BLOCKER_TRANSLATION.words.italic +" Ctrl-I",
                button_callback : function(event){
                    FUA_BLOCKER_COMMENTS_EDITOR.addTextFormatting({
                        targetClass: "fua_blocker_text_italic"
                    });
                }
            }));

            buttons_box.appendChild(FUA_BLOCKER_COMMENTS_EDITOR.createStandardButton({
                button_class : FUA_BLOCKER_COMMENTS_EDITOR.class.line_through_button,
                button_text : "T",
                targetClass: "fua_blocker_text_line_through",
                tooltip: "YouClever: "+ FUA_BLOCKER_TRANSLATION.words.crossed +" Ctrl-Space",
                button_callback : function(event){
                    FUA_BLOCKER_COMMENTS_EDITOR.addTextFormatting({
                        targetClass: "fua_blocker_text_line_through"
                    });
                }
            }));

            target_block.insertBefore(
                buttons_box,
                target_block.getElementsByClassName("comment-simplebox-buttons")[0]
            );

            var submitButton = document.getElementsByClassName("comment-simplebox-submit")[0];
            var ndSubmitButton = document.querySelector("ytd-comment-dialog-renderer ytd-button-renderer#submit-button");
            if(submitButton) {
                submitButton.addEventListener("mousedown", function (event) {
                    //submitButton.style.display = "none";
                    if ($('.fua_blocker_comment_text_listener > span').length) {
                        //console.log('fua_blocker_comment_text_listener');
                        event.preventDefault();
                        event.stopPropagation();
                        FUA_BLOCKER_COMMENTS_EDITOR.parseCommentText();
                        return false;
                    }
                });
            }
            else if(ndSubmitButton){
                ndSubmitButton.addEventListener("mousedown", function (event) {
                    if(ndSubmitButton.hasAttribute('disabled')) return false;
                    event.preventDefault();
                    event.stopPropagation();
                    FUA_BLOCKER_COMMENTS_EDITOR.parseCommentText();



                    var value = FUA_BLOCKER_COMMENTS_EDITOR.getCommentTextArea()
                        .innerHTML.replace(/<\/?[^>]+>/gi, '').replace(/[ ]{2}/gi, ' ');

                    FUA_BLOCKER_COMMENTS_EDITOR.getCommentTextArea()
                        .innerHTML = value;

                    /*var ata = $('#fua_blocker_comment_alternative_textarea');
                    var value = ata.html().replace(/<\/?[^>]+>/gi, '').replace(/[ ]{2}/gi, ' ');
                    if(!value.length) return false;
                    ata.remove();
                    var ta = FUA_BLOCKER_COMMENTS_EDITOR.newDesignBox
                        .find('iron-autogrow-textarea#textarea textarea#textarea');
                    var mirror = FUA_BLOCKER_COMMENTS_EDITOR.newDesignBox
                        .find('iron-autogrow-textarea#textarea div#mirror');
                    ta.show();
                    mirror.show();
                    ta.parent().css('position', 'absolute');
                    ta.html(value);
                    ta.val(value);
                    var inputEvent = new Event("input", {bubbles: true, cancelable: true});
                    ta[0].dispatchEvent(inputEvent);
                    console.log('fua_blocker_comment_text_listener');*/
                    return false;
                });
            }


        }


        var textArea = this.getCommentTextArea();
        if(textArea && !textArea.classList.contains("fua_blocker_comment_text_listener")){
            textArea.classList.add("fua_blocker_comment_text_listener");
            textArea.addEventListener("click", function (event) {
                FUA_BLOCKER_COMMENTS_EDITOR.changeTextButtonsStatus({
                    "action" : "click"
                });
            });
            textArea.addEventListener("keydown", function (event) {

                //event.preventDefault();
                event.stopPropagation();

                //console.log("event.which", event.which);
                if(event.which == 17){
                    FUA_BLOCKER_COMMENTS_EDITOR.ctrl = true;
                }

                if(FUA_BLOCKER_COMMENTS_EDITOR.ctrl === true) {
                    if (event.which == 66) {
                        document.getElementsByClassName(FUA_BLOCKER_COMMENTS_EDITOR.class.bold_button)[0]
                            .dispatchEvent(new Event("mousedown"));
                    }
                    else if (event.which == 73) {
                        document.getElementsByClassName(FUA_BLOCKER_COMMENTS_EDITOR.class.italic_button)[0]
                            .dispatchEvent(new Event("mousedown"));
                    }
                    else if (event.which == 32) {

                        document.getElementsByClassName(FUA_BLOCKER_COMMENTS_EDITOR.class.line_through_button)[0]
                            .dispatchEvent(new Event("mousedown"));
                    }
                }

                return false;
            });
            textArea.addEventListener("keyup", function (event) {
                if(ndSubmitButton = document.querySelector("ytd-comment-dialog-renderer ytd-button-renderer#submit-button")){
                    if(textArea.innerText.trim()) ndSubmitButton.removeAttribute('disabled');
                    else ndSubmitButton.setAttribute('disabled', true);
                }

                if(event.which == 17){
                    FUA_BLOCKER_COMMENTS_EDITOR.ctrl = false;
                }
                FUA_BLOCKER_COMMENTS_EDITOR.changeTextButtonsStatus({
                    "action" : "keyup"
                });
            });
            textArea.addEventListener("focusout", function (event) {
                FUA_BLOCKER_COMMENTS_EDITOR.ctrl = false;
                FUA_BLOCKER_COMMENTS_EDITOR.changeTextButtonsStatus({
                    "action" : "focusout"
                });
            });
            textArea.addEventListener("focusin", function (event) {
                FUA_BLOCKER_COMMENTS_EDITOR.changeTextButtonsStatus({
                    "action" : "focusin"
                });
            });
        }

        //console.log("addFormattingButtons");

        if(!time) time = 0;
        if(time < 3000){
            time = time + 150;
            setTimeout(function(){
                FUA_BLOCKER_COMMENTS_EDITOR.addFormattingButtons(time);
            }, 150);
        }
    };


    /*Comments_editor.prototype.robustAddAlternativeTextAreaND = function (time) {
        console.log('robustAddAlternativeTextAreaND');
        if(!time) time = 0;
        var ata = document.getElementById('fua_blocker_comment_alternative_textarea');
        if(!ata) {
            var ta = FUA_BLOCKER_COMMENTS_EDITOR.newDesignBox
                .find('iron-autogrow-textarea#textarea textarea#textarea');
            ta.parent().append('<div id="fua_blocker_comment_alternative_textarea" contenteditable="plaintext-only"></div>');
            ata = document.getElementById('fua_blocker_comment_alternative_textarea');
            $(ata).focus();
        }

        if(time < 2100){
            time += 300;
            setTimeout(function () {
                FUA_BLOCKER_COMMENTS_EDITOR.robustAddAlternativeTextAreaND(time);
            }, 300);
        }
    };*/


    return new Comments_editor();
})();


//FUA_BLOCKER_COMMENTS_EDITOR.createSignsWindow();


window.addEventListener("click", function (event) {
    var srcElement = event.srcElement;

    //console.log('srcElement', srcElement);

    if (srcElement.classList.contains("comment-simplebox-renderer-collapsed-content")) {
        FUA_BLOCKER_COMMENTS_EDITOR.addFormattingButtons();
    }
    else if(
        srcElement.classList.contains("comment-renderer-reply")
        || srcElement.parentNode.classList.contains("comment-renderer-reply")
    ){
        FUA_BLOCKER_COMMENTS_EDITOR.addFormattingButtons();
    }
    else if (srcElement.id == 'simplebox-placeholder' || srcElement.id == 'placeholder-area'){
        setTimeout(function () {
            FUA_BLOCKER_COMMENTS_EDITOR.newDesignBox =
                $(srcElement).closest('ytd-comment-simplebox-renderer');

            /*var ta = FUA_BLOCKER_COMMENTS_EDITOR.newDesignBox
                .find('iron-autogrow-textarea#textarea textarea#textarea');
            var mirror = FUA_BLOCKER_COMMENTS_EDITOR.newDesignBox
                .find('iron-autogrow-textarea#textarea div#mirror');
            ta.hide();
            mirror.hide();
            ta.parent().css('position', 'relative');*/

            //FUA_BLOCKER_COMMENTS_EDITOR.robustAddAlternativeTextAreaND(0);
            FUA_BLOCKER_COMMENTS_EDITOR.addFormattingButtons();
        }, 300);
    }
});