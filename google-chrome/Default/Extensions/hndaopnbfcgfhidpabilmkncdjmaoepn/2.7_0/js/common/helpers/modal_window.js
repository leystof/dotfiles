var FUA_MW = (function(){

    function Fua_modal_widow(){
        this.prefix = 'fua_youtube_';
        this.id = {
            'modal_bg' : this.prefix + 'modal_background_id',
            'body' : this.prefix + 'modal_body_id',
            'title' : this.prefix + 'modal_title_id',
            'title_left' : this.prefix + 'modal_title_left_id',
            'title_right' : this.prefix + 'modal_title_right_id',
            'close' : this.prefix + 'modal_close_id',
            'content' : this.prefix + 'modal_content_id'
        };
        this.class = {
            'hidden' : 'fua_youtube_hidden',
            'disable' : 'fua-plugin-youtube-disable-button',
            'modal_bg_left' : this.prefix + 'modal_background_left',
            'modal_bg_center' : this.prefix + 'modal_background_center',
            'body_left' : this.prefix + 'modal_body_left',
            'body_center' : this.prefix + 'modal_body_center',
            'success_info_line' : this.prefix + 'success_info_line',
            'finish_info_line' : this.prefix + 'finish_info_line',
            'error_info_line' : this.prefix + 'error_info_line',
            'loading_img' : this.prefix + 'loading_img'
        };
        this.attribute = {
            'target' : 'modal_target'
        }
    }

    Fua_modal_widow.prototype.createModalWindow = function(options){
        var bg = document.getElementById(this.id.modal_bg);

        if(bg && bg.getAttribute(this.attribute.target) != options.target) bg.remove();
        else if(bg && bg.getAttribute(this.attribute.target) == options.target) {
            bg.classList.toggle(this.class.hidden);
            return false;
        }

        bg = document.createElement('div');
        bg.setAttribute('id', this.id.modal_bg);
        bg.setAttribute(this.attribute.target, options.target);

        if(options.left) bg.classList.add(FUA_MW.class.modal_bg_left);
        else bg.classList.add(FUA_MW.class.modal_bg_center);


        var body = document.createElement('div');
        body.setAttribute('id', this.id.body);
        if(options.left) body.classList.add(FUA_MW.class.body_left);
        else body.classList.add(FUA_MW.class.body_center);


        var title = document.createElement('div');
        title.setAttribute('id', this.id.title);

        var title_left = document.createElement('div');
        title_left.setAttribute('id', this.id.title_left);
        title_left.textContent = options.text_title;

        var title_right = document.createElement('div');
        title_right.setAttribute('id', this.id.title_right);


        var close = document.createElement("img");
        close.setAttribute('id', this.id.close);
        close.setAttribute('src', chrome.runtime.getURL('img/close.png'));
        close.addEventListener('click', function(){
            bg.classList.toggle(FUA_MW.class.hidden);
        });


        var content = document.createElement('div');
        content.setAttribute('id', this.id.content);


        title.appendChild(title_left);
        title_right.appendChild(close);
        title.appendChild(title_right);
        body.appendChild(title);
        body.appendChild(content);
        bg.appendChild(body);
        document.documentElement.insertBefore(bg, document.body);
        options.callback();
        return true;
    };


    Fua_modal_widow.prototype.addToInfo = function(options){
        var info = options.info;
        if(info){
            var info_line = document.createElement('div');
            if(options.class) info_line.classList.add(options.class);
            info_line.textContent = options.text;
            info.appendChild(info_line);
        }
        info.scrollTop = info.scrollHeight;
    };


    Fua_modal_widow.prototype.addLoadingWindow = function (options) {
        var bg = document.getElementById(this.id.modal_bg);

        if(bg && bg.getAttribute(this.attribute.target) != options.target) bg.remove();
        else if(bg && bg.getAttribute(this.attribute.target) == options.target) return false;

        bg = document.createElement('div');
        bg.setAttribute('id', this.id.modal_bg);
        bg.setAttribute(this.attribute.target, options.target);
        bg.classList.add(FUA_MW.class.modal_bg_center);
        bg.style.display = 'table';

        var body = document.createElement('div');
        body.style.display = 'table-cell';
        body.style.width = '100vw';
        body.style.height = '100vh';
        body.style.textAlign = 'center';
        body.style.verticalAlign = 'middle';

        var img = document.createElement('img');
        img.setAttribute('src', chrome.runtime.getURL('img/loading.png'));
        img.classList.add(FUA_MW.class.loading_img);

        body.appendChild(img);
        bg.appendChild(body);
        document.documentElement.insertBefore(bg, document.body);
        options.callback();
        return true;
    };

    // create instance
    return new Fua_modal_widow();
})();