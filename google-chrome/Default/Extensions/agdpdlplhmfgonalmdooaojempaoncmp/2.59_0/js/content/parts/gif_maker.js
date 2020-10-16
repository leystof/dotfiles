var FUA_BLOCKER_GIF = (function(){
    function Gif_maker(){
        this.prefix = "fua_blocker_";

        this.video = false;
        this.width = 400;
        this.height = 225;
        //this.width = 1080;
        //this.height = 607;
        this.gifInterval = 0.1;
        this.intervalTime = 100;
        this.collectInterval = false;
        this.canvasArray = [];
        this.base64Array = [];
        this.framesLimit = 100;
        this.pause = false;
        this.emulateGifTimeout = true;
        this.emulateGifPause = false;
        this.checkedFrames = [];
        this.unCheckedFrames = [];

        this.topText = false;
        this.bottomText = false;
        this.square = false;

        this.firstSquareLineWidth = 0;


        this.text = {
            "all" : "все"
        };

        this.id = {
            "gif_icon" : this.prefix + "gif_icon_id",
            "close" : this.prefix + "gif_close_id",
            "gif_modal_window" : this.prefix + "gif_modal_window_id",
            "gif_modal_content" : this.prefix + "gif_modal_content_id",
            "gif_img_box" : this.prefix + "gif_img_box_id",
            "top_text" : this.prefix + "gif_top_text_id",
            "bottom_text" : this.prefix + "gif_bottom_text_id",

            "after_img_buttons" : this.prefix + "gif_after_img_buttons_id",
            "stop" : this.prefix + "gif_stop_id",
            "play" : this.prefix + "gif_play_id",
            "try_again" :  this.prefix + "gif_try_again_id",
            "frames_count" : this.prefix + "gif_frames_count_id",
            "frames_line" : this.prefix + "gif_frames_line_id",
            "frames_action_buttons" : this.prefix + "gif_frames_action_buttons_id",
            "frames_action_buttons_info" : this.prefix + "gif_frames_action_buttons_info_id",
            "count_selected_frames" : this.prefix + "gif_count_selected_frames_id",

            "delete_selected_frames" : this.prefix + "gif_delete_selected_frames_id",
            "leave_selected_frames" : this.prefix + "gif_leave_selected_frames_id",
            "unchecked_selected_frames" : this.prefix + "gif_unchecked_selected_frames_id",
            "create_gif_from_selected_frames" : this.prefix + "gif_create_gif_from_selected_frames_id",

            "text_inputs_box" : this.prefix + "gif_text_inputs_box_id",
            "top_text_input" : this.prefix + "gif_top_text_input_id",
            "bottom_text_input" : this.prefix + "gif_bottom_text_input_id",

            "footer_buttons" : this.prefix + "gif_footer_buttons_id",
            "continue_captured" : this.prefix + "gif_continue_captured_id",
            "stop_captured" : this.prefix + "gif_stop_captured_id",
            "again" : this.prefix + "gif_again_id",
            "create" : this.prefix + "gif_create_id",
            "save" : this.prefix + "gif_save_id",

            "gif_loading" : this.prefix + "gif_loading_id",
            "gif_final_result_img" : this.prefix + "gif_final_result_img_id",
            "square_form_checkbox" : this.prefix + "square_form_checkbox",
            "speed_capture" : this.prefix + "speed_capture_gif_frames",
            "speed_playback" : this.prefix + "speed_playback_gif_frames",
            "delete_some_frames" : this.prefix + "delete_some_frames",
            "select_count_frames_for_delete" : this.prefix + "select_count_frames_for_delete",
            "gif_center_circle" : this.prefix + "gif_center_circle",
            "show_additional_options" : this.prefix + "gif_show_additional_options",
            "hide_additional_options" : this.prefix + "gif_hide_additional_options",
            "additional_options_box" : this.prefix + "gif_additional_options_box",
        };
        this.class = {
            "gif_img" : this.prefix + "gif_img",

            "first_step" : this.prefix + "gif_first_step",
            "second_step" : this.prefix + "gif_second_step",
            "last_step" : this.prefix + "gif_last_step",

            "frame" : this.prefix + "gif_frame",
            "frame_lighter" : this.prefix + "gif_frame_lighter",
            "checked_frame" : this.prefix + "gif_frame_checked_frame",
            "checked_frame_1" : this.prefix + "gif_frame_checked_frame_1",
            "unchecked_frame_1" : this.prefix + "gif_frame_unchecked_frame_1",
            "frames_action_button" : this.prefix + "gif_frames_action_button",
            "footer_button" : this.prefix + "gif_footer_button",
            "disable_button" : this.prefix + "gif_disable_button",
            "square_line" : this.prefix + "square_line"
        };
        this.img = {
            'gif' : chrome.runtime.getURL('img/navigation/gif/gif.png'),
            'gif_active' : chrome.runtime.getURL('img/navigation/gif/gif_active.png'),
            'gif_loading' : chrome.runtime.getURL('img/pictures/loading_128.png')
        }
    }




    Gif_maker.prototype.interval = function () {
        if(FUA_BLOCKER_GIF.collectInterval) clearTimeout(FUA_BLOCKER_GIF.collectInterval);
        FUA_BLOCKER_GIF.collectInterval = setTimeout(function () {
            if(!FUA_BLOCKER_GIF.pause) FUA_BLOCKER_GIF.collectVideoCanvases();
            if(FUA_BLOCKER_GIF.collectInterval) FUA_BLOCKER_GIF.interval();
        }, FUA_BLOCKER_GIF.intervalTime);
    };



    Gif_maker.prototype.createModalWindow = function(){
        if(!$("#" + FUA_BLOCKER_GIF.id.gif_modal_window).length){
            $("body").prepend(
                '<div id="'+ FUA_BLOCKER_GIF.id.gif_modal_window +'">' +
                    '<span id="'+ FUA_BLOCKER_GIF.id.close +'">' +
                        '<img src="'+ IMAGE_DELETE_VIDEO +'" style="width: 30px;">' +
                    '</span>' +
                    '<div id="'+ FUA_BLOCKER_GIF.id.gif_modal_content +'"></div>' +
                '</div>'
            );

            $("#" + FUA_BLOCKER_GIF.id.close).click(function(){
                FUA_BLOCKER_GIF.stopCollectCanvases();
                FUA_BLOCKER_GIF.canvasArray = [];
                FUA_BLOCKER_GIF.base64Array = [];
                FUA_BLOCKER_GIF.emulateGifTimeout = false;
                $("#" + FUA_BLOCKER_GIF.id.gif_modal_window).remove();
                $('#' + FUA_BLOCKER_GIF.id.gif_icon).show();
            });
        }
        return $("#" + FUA_BLOCKER_GIF.id.gif_modal_window);
    };


    Gif_maker.prototype.addModalContent = function(options){
        var modal = FUA_BLOCKER_GIF.createModalWindow();
        modal.find("#" + FUA_BLOCKER_GIF.id.gif_modal_content).html(options.content);
        if(options.callback) options.callback();
    };



    Gif_maker.prototype.showOneFrame = function(options){
        if($("#" + FUA_BLOCKER_GIF.id.gif_img_box).find("canvas").length > options.index ){
            $("#" + FUA_BLOCKER_GIF.id.gif_img_box + " canvas").hide();
            $("#" + FUA_BLOCKER_GIF.id.gif_img_box).find("canvas").eq(options.index).show()
        }
    };



    Gif_maker.prototype.checkFrames = function(){
        var framesCount = $("#" + FUA_BLOCKER_GIF.id.frames_line)
            .find("." + FUA_BLOCKER_GIF.class.frame).length;

        var selectedFrames = $("#" + FUA_BLOCKER_GIF.id.frames_line)
            .find("." + FUA_BLOCKER_GIF.class.checked_frame).length;

        if(selectedFrames){
            $("#" + FUA_BLOCKER_GIF.id.frames_action_buttons)
                .removeClass(FUA_BLOCKER_CLASSES.class.hidden);
            $("#" + FUA_BLOCKER_GIF.id.frames_action_buttons_info)
                .addClass(FUA_BLOCKER_CLASSES.class.hidden);
            $("#" + FUA_BLOCKER_GIF.id.count_selected_frames).html(selectedFrames);
        }
        else {
            $("#" + FUA_BLOCKER_GIF.id.frames_action_buttons)
                .addClass(FUA_BLOCKER_CLASSES.class.hidden);
            $("#" + FUA_BLOCKER_GIF.id.frames_action_buttons_info)
                .removeClass(FUA_BLOCKER_CLASSES.class.hidden);
        }

        if(!framesCount){
            $("#" + FUA_BLOCKER_GIF.id.create)
                .addClass(FUA_BLOCKER_GIF.class.disable_button);
        }

        FUA_BLOCKER_GIF.setFrameCountInfo(
            {frames_count : framesCount}
        );
    };


    Gif_maker.prototype.removeCheckedFrames = function(){
        while($("#" + FUA_BLOCKER_GIF.id.frames_line).find("." + FUA_BLOCKER_GIF.class.checked_frame).first().length){
            //console.log("removeFrame");
            var el = $("#" + FUA_BLOCKER_GIF.id.frames_line)
                .find("." + FUA_BLOCKER_GIF.class.checked_frame).first();
            var index = el.index();
            //console.log("index", index);
            FUA_BLOCKER_GIF.canvasArray.splice(index, 1);
            $("#" + FUA_BLOCKER_GIF.id.gif_img_box).find("canvas").eq(index).remove();
            el.remove();
        }

        //console.log("canvasArray",  FUA_BLOCKER_GIF.canvasArray);
        FUA_BLOCKER_GIF.checkFrames();
        FUA_BLOCKER_GIF.continueCollectCanvases();

        this.setMaxDeletedSpeed();
    };

    Gif_maker.prototype.removeNoCheckedFrames = function(){
        while(
            $("#" + FUA_BLOCKER_GIF.id.frames_line)
                .find("." + FUA_BLOCKER_GIF.class.frame)
                .not("." + FUA_BLOCKER_GIF.class.checked_frame)
                .first().length
        ){
            //console.log("removeFrame");
            var el = $("#" + FUA_BLOCKER_GIF.id.frames_line)
                .find("." + FUA_BLOCKER_GIF.class.frame)
                .not("." + FUA_BLOCKER_GIF.class.checked_frame)
                .first();
            var index = el.index();
            //console.log("index", index);
            FUA_BLOCKER_GIF.canvasArray.splice(index, 1);
            $("#" + FUA_BLOCKER_GIF.id.gif_img_box).find("canvas").eq(index).remove();
            el.remove();
        }

        //console.log("canvasArray",  FUA_BLOCKER_GIF.canvasArray);
        FUA_BLOCKER_GIF.checkFrames();
        FUA_BLOCKER_GIF.continueCollectCanvases();

        this.setMaxDeletedSpeed();
    };



    Gif_maker.prototype.getMinSpeedCapture = function () {
        var minSpeed = 100;
        $("#" + this.id.frames_line).find("." + this.class.frame).each(function () {
            var speed = this.getAttribute('speed');
            if(speed > minSpeed) minSpeed = speed;
        });

        return minSpeed;
    };


    Gif_maker.prototype.setMaxDeletedSpeed = function () {
        var minSpeed = this.getMinSpeedCapture();
        $("#" + FUA_BLOCKER_GIF.id.select_count_frames_for_delete).find('option').each(function () {
            if(parseFloat(this.value) < minSpeed) {
                $(this).attr('disabled', 'disabled');
                $(this).hide();
            }
            else {
                $(this).removeAttr('disabled');
                $(this).show();
            }
        });
        $("#" + FUA_BLOCKER_GIF.id.select_count_frames_for_delete).val(minSpeed);
    };


    Gif_maker.prototype.leadToSpeed = function(){
        console.log('leadToSpeed');
        var targetSpeed = parseFloat($("#" + FUA_BLOCKER_GIF.id.select_count_frames_for_delete).val());
        console.log('targetSpeed', targetSpeed);
        var count = {};

        $("#" + this.id.frames_line).find("." + this.class.frame).each(function () {
            var speed = parseFloat(this.getAttribute('speed'));
            if(!count[speed]) count[speed] = 0;
            count[speed] += ((targetSpeed - speed ) / targetSpeed);


            if(targetSpeed > speed) {
                if(count[speed] >= 1 ){
                    count[speed] = count[speed] - 1;
                    var index = $(this).index();
                    FUA_BLOCKER_GIF.canvasArray.splice(index, 1);
                    $("#" + FUA_BLOCKER_GIF.id.gif_img_box).find("canvas").eq(index).remove();
                    $(this).remove();
                }
            }
        });

        FUA_BLOCKER_GIF.checkFrames();
        FUA_BLOCKER_GIF.continueCollectCanvases();

        $("#" + this.id.frames_line).find("." + this.class.frame).attr('speed', targetSpeed);
        $("#" + this.id.speed_capture).val(targetSpeed);
        $("#" + this.id.speed_capture).change();
        $("#" + this.id.speed_playback).val(targetSpeed / 1000);
        $("#" + this.id.speed_playback).change();
        this.setMaxDeletedSpeed();
    };

    Gif_maker.prototype.unCheckFrames = function(){
        $("#" + FUA_BLOCKER_GIF.id.frames_line)
            .find("." + FUA_BLOCKER_GIF.class.checked_frame)
            .removeClass(FUA_BLOCKER_GIF.class.checked_frame);
        FUA_BLOCKER_GIF.checkFrames();
    };


    Gif_maker.prototype.emulateGif = function(options){
        //console.log("emulateGif");
        if(FUA_BLOCKER_GIF.emulateGifTimeout){
            if(!options.index) options.indexs = 0;
            if(
                !FUA_BLOCKER_GIF.emulateGifPause
                && FUA_BLOCKER_GIF.pause
            ) {
                $("#" + FUA_BLOCKER_GIF.id.gif_img_box + " canvas").hide();
                if (FUA_BLOCKER_GIF.canvasArray.length) {
                    if (!FUA_BLOCKER_GIF.canvasArray[options.index]) options.index = 0;
                    $("#" + FUA_BLOCKER_GIF.id.gif_img_box).find("canvas").eq(options.index).show()
                }
            }

            setTimeout(function(){
                options.index++;
                FUA_BLOCKER_GIF.emulateGif(options)
            }, FUA_BLOCKER_GIF.gifInterval * 1000);
        }
    };



    Gif_maker.prototype.clearCanvasArray = function(options){
        if(FUA_BLOCKER_GIF.canvasArray.length){
            if(!options.index) options.index = 0;
            console.log("clearCanvasArray", options.index);
            if(FUA_BLOCKER_GIF.canvasArray[options.index]){
                $(FUA_BLOCKER_GIF.canvasArray[options.index]).remove();
                setTimeout(function(){
                    options.index++;
                    FUA_BLOCKER_GIF.clearCanvasArray(options)
                }, 10);
            }
            else{
                FUA_BLOCKER_GIF.canvasArray = [];
                options.callback();
            }
        }
    };



    /*Gif_maker.prototype.massFramesSelect = function(options){
        if(FUA_BLOCKER_GV.keys_press[options.keyPress]){
            var startFrame =
                $("#" + FUA_BLOCKER_GIF.id.frames_line)
                    .find("." + FUA_BLOCKER_GIF.class[options.className]);
            if(!startFrame.length){
                $(options.eventElement)
                    .addClass(FUA_BLOCKER_GIF.class[options.className]);
            }
            else{
                var startIndex = startFrame.index();
                var currentIndex = $(options.eventElement).index();

                var start = startIndex;
                var end = currentIndex;
                if(startIndex > currentIndex){
                    start = currentIndex;
                    end = startIndex;
                }

                startFrame.removeClass(FUA_BLOCKER_GIF.class[options.className]);

                if(end !== undefined) {
                    while (start <= end) {
                        console.log("start", start);
                        var el = $("#" + FUA_BLOCKER_GIF.id.frames_line)
                            .find("." + FUA_BLOCKER_GIF.class.frame).eq(start);

                        if(options.action == "addChecked"){
                            el.addClass(FUA_BLOCKER_GIF.class.checked_frame);
                        }
                        else if(options.action == "removeChecked"){
                            el.removeClass(FUA_BLOCKER_GIF.class.checked_frame);
                        }

                        start++;
                    }
                }
            }
        }
        else{
            $("#" + FUA_BLOCKER_GIF.id.frames_line)
                .find("." + FUA_BLOCKER_GIF.class[options.className])
                .removeClass(FUA_BLOCKER_GIF.class[options.className]);
        }
    };*/



    /*Gif_maker.prototype.massFramesSelect = function(options){
        if(FUA_BLOCKER_GV.keys_press[options.keyPress]){
            var startFrame =
                $("#" + FUA_BLOCKER_GIF.id.frames_line)
                    .find("." + FUA_BLOCKER_GIF.class[options.className]);
            if(!startFrame.length){
                $(options.eventElement)
                    .addClass(FUA_BLOCKER_GIF.class[options.className]);
            }
            else{
                var startIndex = startFrame.index();
                var currentIndex = $(options.eventElement).index();

                var start = startIndex;
                var end = currentIndex;
                if(startIndex > currentIndex){
                    start = currentIndex;
                    end = startIndex;
                }

                startFrame.removeClass(FUA_BLOCKER_GIF.class[options.className]);


                if(end !== undefined) {
                    var startBefore = start;
                    var frameCount = 0;
                    var checkedFrameCount = 0;


                    while (startBefore <= end) {
                        console.log("start", start);
                        var el = $("#" + FUA_BLOCKER_GIF.id.frames_line)
                            .find("." + FUA_BLOCKER_GIF.class.frame).eq(startBefore);

                        if(el.hasClass(FUA_BLOCKER_GIF.class.checked_frame)){
                            checkedFrameCount++;
                        }
                        frameCount++;
                        startBefore++;
                    }


                    while (start <= end) {
                        console.log("start", start);
                        var el = $("#" + FUA_BLOCKER_GIF.id.frames_line)
                            .find("." + FUA_BLOCKER_GIF.class.frame).eq(start);

                        if(
                            (checkedFrameCount && frameCount - checkedFrameCount > checkedFrameCount)
                            || !(frameCount - checkedFrameCount)
                        ){
                            el.removeClass(FUA_BLOCKER_GIF.class.checked_frame);
                        }
                        else el.addClass(FUA_BLOCKER_GIF.class.checked_frame);
                        start++;
                    }
                }
            }
        }
        else{
            $("#" + FUA_BLOCKER_GIF.id.frames_line)
                .find("." + FUA_BLOCKER_GIF.class[options.className])
                .removeClass(FUA_BLOCKER_GIF.class[options.className]);
        }
    };*/


    Gif_maker.prototype.massFramesSelect = function(options){

        if(FUA_BLOCKER_GV.keys_press[options.keyPress]){
            var startFrame =
                $("#" + FUA_BLOCKER_GIF.id.frames_line)
                    .find("." + FUA_BLOCKER_GIF.class[options.className]);

            if(startFrame.length){
                var startIndex = startFrame.index();
                var currentIndex = $(options.eventElement).index();

                var start = startIndex;
                var end = currentIndex;
                if(startIndex > currentIndex){
                    start = currentIndex;
                    end = startIndex;
                }

                startFrame.removeClass(FUA_BLOCKER_GIF.class[options.className]);


                if(end !== undefined) {
                    var startBefore = start;
                    var frameCount = 0;
                    var checkedFrameCount = 0;


                    while (startBefore <= end) {
                        console.log("start", start);
                        var el = $("#" + FUA_BLOCKER_GIF.id.frames_line)
                            .find("." + FUA_BLOCKER_GIF.class.frame).eq(startBefore);

                        if(el.hasClass(FUA_BLOCKER_GIF.class.checked_frame)){
                            checkedFrameCount++;
                        }
                        frameCount++;
                        startBefore++;
                    }


                    while (start <= end) {
                        console.log("start", start);
                        var el = $("#" + FUA_BLOCKER_GIF.id.frames_line)
                            .find("." + FUA_BLOCKER_GIF.class.frame).eq(start);

                        if(
                            (checkedFrameCount && frameCount - checkedFrameCount < checkedFrameCount)
                            || !(frameCount - checkedFrameCount)
                        ){
                            el.removeClass(FUA_BLOCKER_GIF.class.checked_frame);
                        }
                        else el.addClass(FUA_BLOCKER_GIF.class.checked_frame);
                        start++;
                    }
                }


            }

            $("#" + FUA_BLOCKER_GIF.id.frames_line)
                .find("." + FUA_BLOCKER_GIF.class[options.className])
                .removeClass(FUA_BLOCKER_GIF.class[options.className]);
        }
        else{
            $("#" + FUA_BLOCKER_GIF.id.frames_line)
                .find("." + FUA_BLOCKER_GIF.class[options.className])
                .removeClass(FUA_BLOCKER_GIF.class[options.className]);

            $(options.eventElement)
                .addClass(FUA_BLOCKER_GIF.class[options.className]);
        }
    };


    Gif_maker.prototype.collectVideoCanvases = function(){

        if(!FUA_BLOCKER_GIF.video.paused && !FUA_BLOCKER_GIF.video.ended) {


            var canvas = document.createElement("canvas");
            canvas.width = FUA_BLOCKER_GIF.width;
            canvas.height = FUA_BLOCKER_GIF.height;
            var context = canvas.getContext('2d');
            context.drawImage(
                FUA_BLOCKER_GIF.video, 0, 0, FUA_BLOCKER_GIF.width, FUA_BLOCKER_GIF.height
            );


            if (FUA_BLOCKER_GIF.canvasArray.length) {
                $("#" + FUA_BLOCKER_GIF.id.create)
                    .removeClass(FUA_BLOCKER_GIF.class.disable_button);
            }


            if (FUA_BLOCKER_GIF.framesLimit <= FUA_BLOCKER_GIF.canvasArray.length) {
                console.log("framesLimit");
                $("#" + FUA_BLOCKER_GIF.id.try_again).show();
                FUA_BLOCKER_GIF.stopCollectCanvases();
                return false;
            }

            FUA_BLOCKER_GIF.canvasArray.push(context);

            var imgBox = document.getElementById(FUA_BLOCKER_GIF.id.gif_img_box);
            imgBox.appendChild(context.canvas);

            FUA_BLOCKER_GIF.setFrameCountInfo(
                {frames_count: FUA_BLOCKER_GIF.canvasArray.length}
            );

            $("#" + FUA_BLOCKER_GIF.id.frames_line).append(
                '<div class="' + FUA_BLOCKER_GIF.class.frame + '" speed="'+ FUA_BLOCKER_GIF.intervalTime +'">' +
                '<span><span>' +
                '</div>'
            );

            $("#" + FUA_BLOCKER_GIF.id.frames_line)
                .find("." + FUA_BLOCKER_GIF.class.frame).last().click(function () {

                    if (FUA_BLOCKER_GIF.pause) {
                        if (!FUA_BLOCKER_GV.keys_press.shift) {
                            $(this).toggleClass(FUA_BLOCKER_GIF.class.checked_frame);
                        }


                        /*FUA_BLOCKER_GIF.massFramesSelect({
                         keyPress: "ctrl",
                         className: "checked_frame_1",
                         eventElement: this,
                         action: "addChecked"
                         });

                         FUA_BLOCKER_GIF.massFramesSelect({
                         keyPress: "shift",
                         className: "unchecked_frame_1",
                         eventElement: this,
                         action: "removeChecked"
                         });*/


                        FUA_BLOCKER_GIF.massFramesSelect({
                            keyPress: "shift",
                            className: "checked_frame_1",
                            eventElement: this
                        });

                        FUA_BLOCKER_GIF.checkFrames();
                    }
                }).hover(
                function () {
                    if (FUA_BLOCKER_GIF.pause) {
                        FUA_BLOCKER_GIF.showOneFrame({index: $(this).index()});
                    }
                },
                function () {
                }
            );

            var lastIndex = $("#" + FUA_BLOCKER_GIF.id.frames_line)
                .find("." + FUA_BLOCKER_GIF.class.frame).last().index();
            $("#" + FUA_BLOCKER_GIF.id.gif_img_box + " canvas").hide();
            $("#" + FUA_BLOCKER_GIF.id.gif_img_box + " canvas").eq(lastIndex).show();
        }
    };


    Gif_maker.prototype.setFrameCountInfo = function(options){
        if(!options.frames_count) options.frame_count = 0;
        $("#" + FUA_BLOCKER_GIF.id.frames_count).html(
            options.frames_count + "/" + FUA_BLOCKER_GIF.framesLimit
        );
    };


    Gif_maker.prototype.addFirstStep = function(){
        $("#" + FUA_BLOCKER_GIF.id.gif_modal_window)
            .addClass(FUA_BLOCKER_GIF.class.first_step)
            .removeClass(FUA_BLOCKER_GIF.class.second_step)
            .removeClass(FUA_BLOCKER_GIF.class.last_step);
    };

    Gif_maker.prototype.addSecondStep = function(){
        $("#" + FUA_BLOCKER_GIF.id.gif_modal_window)
            .removeClass(FUA_BLOCKER_GIF.class.first_step)
            .addClass(FUA_BLOCKER_GIF.class.second_step)
            .removeClass(FUA_BLOCKER_GIF.class.last_step);
        FUA_BLOCKER_GIF.setMaxDeletedSpeed();
    };


    Gif_maker.prototype.addLastStep = function(){
        $("#" + FUA_BLOCKER_GIF.id.gif_modal_window)
            .removeClass(FUA_BLOCKER_GIF.class.first_step)
            .removeClass(FUA_BLOCKER_GIF.class.second_step)
            .addClass(FUA_BLOCKER_GIF.class.last_step);
    };


    Gif_maker.prototype.toggleSquareLine = function () {
        if(this.square) {
            $('.' + this.class.square_line).show();
            $('#' + this.id.gif_center_circle).show();
        }
        else {
            $('.' + this.class.square_line).hide();
            $('#' + this.id.gif_center_circle).hide();
        }
    };



    Gif_maker.prototype.setSquareLineStyle = function () {
        var left = $('#' + this.id.gif_center_circle).css("left").replace('px', '');

        var width1 = left - 20;
        var width2 = 175 - width1;
        this.firstSquareLineWidth = width1;
        //console.log('width1', width1);
        //console.log('width2', width2);

        $('.' + this.class.square_line).first().css('width', width1 + 'px');

        $('.' + this.class.square_line).last()
            .css('width', width2 + 'px')
            .css('margin-left', (400 - width2) + 'px');
    };


    Gif_maker.prototype.setCollectInterval = function(){
        var squareLineWidth = (this.width - this.height) / 2;



        FUA_BLOCKER_GIF.addModalContent({
            content :
                '<div id="'+ FUA_BLOCKER_GIF.id.gif_img_box +'">' +
                    '<div id="'+ FUA_BLOCKER_GIF.id.gif_center_circle +'" ></div>' +
                    '<div class="'+ this.class.square_line +'" style="width: '+ squareLineWidth +'px; height: '+ this.height +'px;"></div>' +
                    '<div class="'+ this.class.square_line +'" style="margin-left: '+ (squareLineWidth + this.height) +'px; width: '+ squareLineWidth +'px; height: '+ this.height +'px;"></div>' +
                    '<div id="'+ FUA_BLOCKER_GIF.id.top_text +'"></div>' +
                    '<div id="'+ FUA_BLOCKER_GIF.id.bottom_text +'"></div>' +
                '</div>' +
                '<div id="'+ FUA_BLOCKER_GIF.id.after_img_buttons +'">' +
                    '<span id="'+ FUA_BLOCKER_GIF.id.stop +'">' +
                        FUA_BLOCKER_TRANSLATION.words.stop +
                    '</span>' +
                    '<span id="'+ FUA_BLOCKER_GIF.id.play +'">' +
                        FUA_BLOCKER_TRANSLATION.words_combinations.continue_recording +
                    '</span>' +
                    '<span id="'+ FUA_BLOCKER_GIF.id.try_again +'">' +
                        FUA_BLOCKER_TRANSLATION.words_combinations.limit_of_frames +
                    '</span>' +
                '</div>' +
                '<div style="text-align: center; font-size: 18px; font-weight: bold; margin-top: 16px; color: darkslategray;">' +
                    FUA_BLOCKER_TRANSLATION.words_combinations.left_frames +
                    ': <span id="'+ FUA_BLOCKER_GIF.id.frames_count +'">0/100</span>' +
                '</div>' +
                '<div id="'+ FUA_BLOCKER_GIF.id.frames_line +'"></div>' +
                '<div id="'+ FUA_BLOCKER_GIF.id.frames_action_buttons +'">' +
                    '<span>' + FUA_BLOCKER_TRANSLATION.words_combinations.selected_frames + ': </span>' +
                    '<span id="'+ FUA_BLOCKER_GIF.id.count_selected_frames +'">' +
                        FUA_BLOCKER_GIF.text.all +
                    '</span>' +
                    '<div>' +
                        '<span id="'+ FUA_BLOCKER_GIF.id.delete_selected_frames +'" class="' + FUA_BLOCKER_GIF.class.frames_action_button + '">' +
                            FUA_BLOCKER_TRANSLATION.words.delete +
                        '</span>' +
                        '<span id="'+ FUA_BLOCKER_GIF.id.leave_selected_frames +'" class="' + FUA_BLOCKER_GIF.class.frames_action_button + '">' +
                            FUA_BLOCKER_TRANSLATION.words.trim +
                        '</span>' +
                        '<span id="'+ FUA_BLOCKER_GIF.id.unchecked_selected_frames +'" class="' + FUA_BLOCKER_GIF.class.frames_action_button + '">' +
                            FUA_BLOCKER_TRANSLATION.words_combinations.remove_selection +
                        '</span>' +
                        /*'<span id="'+ FUA_BLOCKER_GIF.id.create_gif_from_selected_frames +'" class="' + FUA_BLOCKER_GIF.class.frames_action_button + '">' +
                            'Создать GIF' +
                        '</span>' +*/
                    '</div>' +
                '</div>' +
                '<div id="'+ FUA_BLOCKER_GIF.id.frames_action_buttons_info +'">' +
                    FUA_BLOCKER_TRANSLATION.text.about_gif_selected_frames +
                '</div>' +


                '<div id="'+ FUA_BLOCKER_GIF.id.text_inputs_box +'">' +
                    '<div id="'+ FUA_BLOCKER_GIF.id.show_additional_options+'">Показать доп. опции</div>' +
                    '<div id="'+ FUA_BLOCKER_GIF.id.additional_options_box+'">' +
                        '<input type="text" id="'+ FUA_BLOCKER_GIF.id.top_text_input +'" placeholder="'+ FUA_BLOCKER_TRANSLATION.words_combinations.text_on_top +'">' +
                        '<input type="text" id="'+ FUA_BLOCKER_GIF.id.bottom_text_input +'" placeholder="'+ FUA_BLOCKER_TRANSLATION.words_combinations.text_on_bottom +'">' +
                        '<div style="padding: 5px 20px; font-size: 14px;">' +
                            '<label>' +
                                '<input type="checkbox" id="'+ FUA_BLOCKER_GIF.id.square_form_checkbox +'">' +
                                'Квадрат' +
                            '</label>' +

                            '<span style="margin-left : 20px;">' +
                                'Захват' +
                            '</span>' +
                            '<select style="margin-left : 10px;" id="'+ FUA_BLOCKER_GIF.id.speed_capture +'">' +
                                '<option value="1000">1 к/с</option>' +
                                '<option value="500">2 к/с</option>' +
                                '<option value="333">3 к/с</option>' +
                                '<option value="250">4 к/с</option>' +
                                '<option value="200">5 к/с</option>' +
                                '<option value="125">8 к/с</option>' +
                                '<option value="100">10 к/с</option>' +
                            '</select>' +

                            '<span style="margin-left : 20px;">' +
                                'Воспр.' +
                            '</span>' +
                            '<select style="margin-left : 10px;" id="'+ FUA_BLOCKER_GIF.id.speed_playback +'">' +
                                '<option value="1">1 к/с</option>' +
                                '<option value="0.5">2 к/с</option>' +
                                '<option value="0.333">3 к/с</option>' +
                                '<option value="0.25">4 к/с</option>' +
                                '<option value="0.2">5 к/с</option>' +
                                '<option value="0.125">8 к/с</option>' +
                                '<option value="0.1">10 к/с</option>' +
                            '</select>' +


                            '<div style="margin-top: 20px;">' +
                                '<span id="'+ FUA_BLOCKER_GIF.id.delete_some_frames +'" style="display: inline-block; padding: 3px; border: 1px solid black; border-radius: 2px; cursor : pointer;">' +
                                    'Адaптировать к' +
                                '</span>' +
                                '<select id="'+ FUA_BLOCKER_GIF.id.select_count_frames_for_delete +'" style="margin-left : 10px;" id="">' +
                                    '<option value="1000">1 к/с</option>' +
                                    '<option value="500">2 к/с</option>' +
                                    '<option value="333">3 к/с</option>' +
                                    '<option value="250">4 к/с</option>' +
                                    '<option value="200">5 к/с</option>' +
                                    '<option value="125">8 к/с</option>' +
                                    '<option value="100">10 к/с</option>' +
                                '</select>' +

                                '<span id="'+ FUA_BLOCKER_GIF.id.hide_additional_options+'">Скрыть</span>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                '<div id="'+ FUA_BLOCKER_GIF.id.footer_buttons +'">' +
                    '<span id="'+ FUA_BLOCKER_GIF.id.continue_captured +'" class="'+ FUA_BLOCKER_GIF.class.footer_button +'">' +
                        FUA_BLOCKER_TRANSLATION.words_combinations.continue_recording +
                    '</span>' +
                    '<span id="'+ FUA_BLOCKER_GIF.id.stop_captured +'" class="'+ FUA_BLOCKER_GIF.class.footer_button +'">' +
                        FUA_BLOCKER_TRANSLATION.words_combinations.stop_recording +
                    '</span>' +
                    '<span id="'+ FUA_BLOCKER_GIF.id.again +'" class="'+ FUA_BLOCKER_GIF.class.footer_button +'">' +
                        FUA_BLOCKER_TRANSLATION.words_combinations.restart +
                    '</span>' +
                    '<span id="'+ FUA_BLOCKER_GIF.id.create +'" class="'+ FUA_BLOCKER_GIF.class.footer_button +'">' +
                        FUA_BLOCKER_TRANSLATION.words_combinations.create_gif +
                    '</span>' +
                '</div>',

            callback : function(){

                FUA_BLOCKER_GIF.addFirstStep();
                $("#" + FUA_BLOCKER_GIF.id.try_again).hide();

                $("#" + FUA_BLOCKER_GIF.id.frames_action_buttons)
                    .addClass(FUA_BLOCKER_CLASSES.class.hidden);

                $("#" + FUA_BLOCKER_GIF.id.delete_selected_frames).click(function(){
                    FUA_BLOCKER_GIF.removeCheckedFrames();
                });


                $("#" + FUA_BLOCKER_GIF.id.leave_selected_frames).click(function(){
                    FUA_BLOCKER_GIF.removeNoCheckedFrames();
                });

                $("#" + FUA_BLOCKER_GIF.id.unchecked_selected_frames).click(function(){
                    FUA_BLOCKER_GIF.unCheckFrames();
                });

                $("#" + FUA_BLOCKER_GIF.id.create_gif_from_selected_frames).click(function(){
                    FUA_BLOCKER_GIF.stopCollectCanvases();
                    FUA_BLOCKER_GIF.emulateGifTimeout = false;
                    FUA_BLOCKER_GIF.removeNoCheckedFrames();
                    FUA_BLOCKER_GIF.createGif();
                });



                $("#" + FUA_BLOCKER_GIF.id.frames_line).hover(
                    function(e){ FUA_BLOCKER_GIF.emulateGifPause = true; },
                    function(e){ FUA_BLOCKER_GIF.emulateGifPause = false; }
                );



                document.getElementById(FUA_BLOCKER_GIF.id.top_text_input)
                    .addEventListener("input", function(e){
                        var value = $(this).val();
                        $("#" + FUA_BLOCKER_GIF.id.top_text).html(value);
                        FUA_BLOCKER_GIF.topText = value;
                    });

                document.getElementById(FUA_BLOCKER_GIF.id.bottom_text_input)
                    .addEventListener("input", function(e){
                        var value = $(this).val();
                        $("#" + FUA_BLOCKER_GIF.id.bottom_text).html(value);
                        FUA_BLOCKER_GIF.bottomText = value;
                    });




                function stopClick(e){
                    FUA_BLOCKER_GIF.addSecondStep();
                    $("#" + FUA_BLOCKER_GIF.id.stop).hide();
                    $("#" + FUA_BLOCKER_GIF.id.stop_captured).hide();
                    $("#" + FUA_BLOCKER_GIF.id.play).show();
                    $("#" + FUA_BLOCKER_GIF.id.continue_captured).show();
                    FUA_BLOCKER_GIF.pause = true;
                    FUA_BLOCKER_GIF.video = $('video')[0];
                    FUA_BLOCKER_GIF.video.pause();
                }


                $("#" + FUA_BLOCKER_GIF.id.stop).click(stopClick);
                $("#" + FUA_BLOCKER_GIF.id.stop_captured).click(stopClick);


                function playClick(e){
                    FUA_BLOCKER_GIF.addFirstStep();
                    $("#" + FUA_BLOCKER_GIF.id.try_again).hide();
                    $("#" + FUA_BLOCKER_GIF.id.play).hide();
                    $("#" + FUA_BLOCKER_GIF.id.continue_captured).hide();
                    $("#" + FUA_BLOCKER_GIF.id.stop).show();
                    $("#" + FUA_BLOCKER_GIF.id.stop_captured).show();
                    FUA_BLOCKER_GIF.pause = false;
                    FUA_BLOCKER_GIF.video = $('video')[0];
                    FUA_BLOCKER_GIF.video.play();
                    $("." + FUA_BLOCKER_GIF.class.frame).addClass(
                        FUA_BLOCKER_GIF.class.frame_lighter
                    )
                }


                $("#" + FUA_BLOCKER_GIF.id.play).hide().click(playClick);
                $("#" + FUA_BLOCKER_GIF.id.continue_captured).hide().click(playClick);


                $("#" + FUA_BLOCKER_GIF.id.again).hide().click(function(){
                    FUA_BLOCKER_GIF.removeCheckedFrames();
                    FUA_BLOCKER_GIF.removeNoCheckedFrames();
                    $("#" + FUA_BLOCKER_GIF.id.continue_captured).click();
                });


                $("#" + FUA_BLOCKER_GIF.id.create).click(function(){
                    if(!$(this).hasClass(FUA_BLOCKER_GIF.class.disable_button)) {
                        FUA_BLOCKER_GIF.stopCollectCanvases();
                        FUA_BLOCKER_GIF.emulateGifTimeout = false;
                        FUA_BLOCKER_GIF.createGif();
                    }
                });


                FUA_BLOCKER_GIF.toggleSquareLine();
                $('#' + FUA_BLOCKER_GIF.id.square_form_checkbox).prop('checked', FUA_BLOCKER_GIF.square);
                $('#' + FUA_BLOCKER_GIF.id.square_form_checkbox).change(function () {
                    FUA_BLOCKER_GIF.square = $(this).prop('checked');
                    FUA_BLOCKER_GIF.toggleSquareLine();
                });


                $('#' + FUA_BLOCKER_GIF.id.speed_capture).val(FUA_BLOCKER_GIF.intervalTime);
                $('#' + FUA_BLOCKER_GIF.id.speed_capture).change(function () {
                    FUA_BLOCKER_GIF.intervalTime = this.value;
                });

                $('#' + FUA_BLOCKER_GIF.id.speed_playback).val(FUA_BLOCKER_GIF.gifInterval);
                $('#' + FUA_BLOCKER_GIF.id.speed_playback).change(function () {
                    FUA_BLOCKER_GIF.gifInterval = this.value;
                });


                $("#" + FUA_BLOCKER_GIF.id.delete_some_frames).click(function(){
                    FUA_BLOCKER_GIF.leadToSpeed();
                });


                FUA_BLOCKER_GIF.setSquareLineStyle();

                $("#" + FUA_BLOCKER_GIF.id.gif_center_circle).draggable({
                    axis: "x",
                    containment: "parent",
                    drag: function( event, ui ) {
                        FUA_BLOCKER_GIF.setSquareLineStyle();
                    }
                });


                $("#" + FUA_BLOCKER_GIF.id.show_additional_options).click(function(){
                    $("#" + FUA_BLOCKER_GIF.id.additional_options_box).show();
                    $(this).hide();
                    $("." + FUA_BLOCKER_GIF.class.second_step)
                        .css('height', '690px')
                        .css('margin-top', '-705px');
                });

                $("#" + FUA_BLOCKER_GIF.id.hide_additional_options).click(function(){
                    $("#" + FUA_BLOCKER_GIF.id.additional_options_box).hide();
                    $("#" + FUA_BLOCKER_GIF.id.show_additional_options).show();
                    $("." + FUA_BLOCKER_GIF.class.second_step)[0].style = null;
                });
            }
        });

        FUA_BLOCKER_GIF.topText = false;
        FUA_BLOCKER_GIF.bottomText = false;

        if(FUA_BLOCKER_GIF.collectInterval){
            //clearInterval(FUA_BLOCKER_GIF.collectInterval);
            clearTimeout(FUA_BLOCKER_GIF.collectInterval);
            FUA_BLOCKER_GIF.collectInterval = false;
        }
        FUA_BLOCKER_GIF.canvasArray = [];
        FUA_BLOCKER_GIF.video = $('video')[0];
        FUA_BLOCKER_GIF.video.play();

        FUA_BLOCKER_GIF.canvasArray = [];
        FUA_BLOCKER_GIF.base64Array = [];
        $('#' + FUA_BLOCKER_GIF.id.gif_icon).hide();

        FUA_BLOCKER_GIF.pause = false;

        FUA_BLOCKER_GIF.emulateGifTimeout = true;
        FUA_BLOCKER_GIF.emulateGifPause = false;
        FUA_BLOCKER_GIF.emulateGif({});

        /*FUA_BLOCKER_GIF.collectInterval = setInterval(function(){
            if(!FUA_BLOCKER_GIF.pause) {
                FUA_BLOCKER_GIF.collectVideoCanvases();
                //console.log("collectInterval");
            }
        }, FUA_BLOCKER_GIF.intervalTime);*/
        FUA_BLOCKER_GIF.interval();
    };


    Gif_maker.prototype.stopCollectCanvases = function(){
        $("#" + FUA_BLOCKER_GIF.id.gif_icon).removeClass(FUA_BLOCKER_GIF.class.gif_active).hide();
        //clearInterval(FUA_BLOCKER_GIF.collectInterval);
        clearTimeout(FUA_BLOCKER_GIF.collectInterval);
        FUA_BLOCKER_GIF.collectInterval = false;
        FUA_BLOCKER_GIF.pause = true;

        FUA_BLOCKER_GIF.addSecondStep();
        $("#" + FUA_BLOCKER_GIF.id.stop).hide();
        $("#" + FUA_BLOCKER_GIF.id.stop_captured).hide();
        $("#" + FUA_BLOCKER_GIF.id.play).hide();
        $("#" + FUA_BLOCKER_GIF.id.continue_captured).hide();
        $("#" + FUA_BLOCKER_GIF.id.again).show();

        FUA_BLOCKER_GIF.video = $('video')[0];
        FUA_BLOCKER_GIF.video.pause();
    };


    Gif_maker.prototype.continueCollectCanvases = function(){
        if(
            !FUA_BLOCKER_GIF.collectInterval
            && FUA_BLOCKER_GIF.framesLimit > FUA_BLOCKER_GIF.canvasArray.length
        ){
            FUA_BLOCKER_GIF.pause = true;
            $("#" + FUA_BLOCKER_GIF.id.play).show();
            $("#" + FUA_BLOCKER_GIF.id.continue_captured).show();
            $("#" + FUA_BLOCKER_GIF.id.again).hide();
            $("#" + FUA_BLOCKER_GIF.id.try_again).hide();
            /*FUA_BLOCKER_GIF.collectInterval = setInterval(function(){
                if(!FUA_BLOCKER_GIF.pause) {
                    FUA_BLOCKER_GIF.collectVideoCanvases();
                }
            }, FUA_BLOCKER_GIF.intervalTime);*/
            FUA_BLOCKER_GIF.interval();
        }
    };



    Gif_maker.prototype.getSquareBase64 = function (options) {
        var ctx = options.ctx;
        var canvas = document.createElement("canvas");
        canvas.width = this.height;
        canvas.height = this.height;
        var context = canvas.getContext('2d');
        var imageDate = ctx.getImageData(
            this.firstSquareLineWidth, 0, this.height, this.height
        );
        context.putImageData(imageDate,0,0);
        return context.canvas.toDataURL();
    };


    Gif_maker.prototype.transformToBase64 = function(options){
        if(!options.index) options.index = 0;
        console.log("transformToBase64", options.index);
        if(FUA_BLOCKER_GIF.canvasArray[options.index]) {
            /*FUA_BLOCKER_GIF.base64Array[options.index] =
                FUA_BLOCKER_GIF.canvasArray[options.index].canvas.toDataURL();*/

            FUA_BLOCKER_GIF.base64Array[options.index] =
                options.square
                    ? this.getSquareBase64({ctx : FUA_BLOCKER_GIF.canvasArray[options.index]})
                    : FUA_BLOCKER_GIF.canvasArray[options.index].canvas.toDataURL();

            setTimeout(function () {
                options.index++;
                FUA_BLOCKER_GIF.transformToBase64(options);
            }, 25);
        }
        else {
            options.callback(options);
        }
    };


    Gif_maker.prototype.createGifFinal = function(options){
        console.log("createGifFinal");
        if(!options) options = {};

        var gifData = {
            'gifWidth': options.square ? FUA_BLOCKER_GIF.height : FUA_BLOCKER_GIF.width,
            'gifHeight': FUA_BLOCKER_GIF.height,
            'interval': FUA_BLOCKER_GIF.gifInterval,
            'images': FUA_BLOCKER_GIF.base64Array,
            //'text': 'YouClever TEST button',
            'fontSize': '24px',
            //'fontWeight': 'bold',
            'fontFamily' : 'Impact',
            //'textBaseline' : 'top',
            //'textTop' : 'My top text for GIF',
            //'textBottom' : 'My bottom text GIF',
            'progressCallback': function(captureProgress) {
                //console.log("captureProgress", captureProgress);
            },
            'completeCallback': function() {
                //console.log("completeCallback");
            }
        };


        if(FUA_BLOCKER_GIF.topText) gifData.textTop = FUA_BLOCKER_GIF.topText;
        if(FUA_BLOCKER_GIF.bottomText) {
            gifData.textBottom = FUA_BLOCKER_GIF.bottomText;
        }


        gifshot.createGIF(gifData, function (obj) {
            if (!obj.error) {
                console.log("createGifFinalImageDone");
                var base64 = obj.image;
                //console.log('base64-url', base64);

                FUA_BLOCKER_GIF.addModalContent({
                    content :
                    '<div id="'+ FUA_BLOCKER_GIF.id.gif_img_box +'">' +
                        '<img src="' + base64 + '" id="'+ FUA_BLOCKER_GIF.id.gif_final_result_img +'">' +
                    '</div>' +

                    '<div id="'+ FUA_BLOCKER_GIF.id.footer_buttons +'">' +
                        '<span id="'+ FUA_BLOCKER_GIF.id.again +'" class="'+ FUA_BLOCKER_GIF.class.footer_button +'">' +
                            FUA_BLOCKER_TRANSLATION.words_combinations.restart +
                        '</span>' +
                        '<span id="'+ FUA_BLOCKER_GIF.id.save +'" class="'+ FUA_BLOCKER_GIF.class.footer_button +'">' +
                            FUA_BLOCKER_TRANSLATION.words_combinations.save_gif +
                        '</span>' +
                    '</div>',

                    callback : function(){
                        FUA_BLOCKER_GIF.addLastStep();

                        $("#" + FUA_BLOCKER_GIF.id.again).click(function(){
                            FUA_BLOCKER_GIF.setCollectInterval();
                        });

                        $("#" + FUA_BLOCKER_GIF.id.save).click(function(){
                            chrome.runtime.sendMessage({
                                'title': 'downloadGif',
                                'body': {
                                    'base64': $("#" + FUA_BLOCKER_GIF.id.gif_final_result_img).attr("src"),
                                    'video_id': getVideoIdFromVideoUrl(window.location.href)
                                }
                            });


                            /*function dataURIToBlob(dataURI) {

                                var binStr = atob(dataURI.split(',')[1]),
                                    len = binStr.length,
                                    arr = new Uint8Array(len),
                                    mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

                                for (var i = 0; i < len; i++) {
                                    arr[i] = binStr.charCodeAt(i);
                                }

                                return new Blob([arr], {
                                    type: mimeString
                                });

                            }*/


                            /*var element = document.createElement('a');
                            element.setAttribute('href', dataURIToBlob(base64));
                            element.setAttribute('download', 'test.gif');

                            element.style.display = 'none';
                            document.body.appendChild(element);

                            element.click();

                            document.body.removeChild(element);*/
                        });
                    }
                });


                FUA_BLOCKER_GIF.canvasArray = [];
                FUA_BLOCKER_GIF.base64Array = [];
                //$('#' + FUA_BLOCKER_GIF.id.gif_icon).show();
            }
        });
    };


    Gif_maker.prototype.createGif = function(){
        if(FUA_BLOCKER_GIF.video) {
            FUA_BLOCKER_GIF.video.pause();
            FUA_BLOCKER_GIF.video = false;
        }
        if(!FUA_BLOCKER_GIF.canvasArray.length) return false;


        FUA_BLOCKER_GIF.addModalContent({
            content :
                '<div style="display: table-row">' +
                    '<div style="display: table-cell; width: 440px; height: 330px; text-align: center; vertical-align: middle;">' +
                        '<img src="'+ FUA_BLOCKER_GIF.img.gif_loading +'" id="'+ FUA_BLOCKER_GIF.id.gif_loading +'"> ' +
                    '</div>' +
                '</div>',
            callback : function(){
                FUA_BLOCKER_GIF.addLastStep();
            }
        });


        setTimeout(function() {

            console.log('square', $('#' + FUA_BLOCKER_GIF.id.square_form_checkbox).length);

            FUA_BLOCKER_GIF.transformToBase64({
                square : FUA_BLOCKER_GIF.square,
                callback : function(options){
                    /*FUA_BLOCKER_GIF.clearCanvasArray({
                        callback : function(){
                            FUA_BLOCKER_GIF.createGifFinal();
                        }
                    });*/

                    FUA_BLOCKER_GIF.createGifFinal(options);
                }
            });

            /*var encoder = new GIFEncoder();
            encoder.setRepeat(0);
            encoder.setDelay(100);
            encoder.start();

            var count = 0;
            for(var i in FUA_BLOCKER_GIF.canvasArray){
                console.log("FUA_BLOCKER_GIF.canvasArray", count++);
                encoder.addFrame(FUA_BLOCKER_GIF.canvasArray[i]);
            }
            console.log("encoder.finish");
            encoder.finish();
            console.log("encoder.finish2");
            encoder.stream().getData();*/
        }, 100);
    };



    return new Gif_maker();
})();