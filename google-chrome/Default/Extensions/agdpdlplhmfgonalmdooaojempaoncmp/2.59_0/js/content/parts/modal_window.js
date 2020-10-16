var FUA_BLOCKER_MW = (function(){

    function Fua_modal_widow(){
        this.prefix = 'fua_blocker_';
        this.id = {
            'modal_bg' : this.prefix + 'modal_background_id',
            'modal_bg_cell' : this.prefix + 'modal_background_cell_id',
            'body' : this.prefix + 'modal_body_id',
            'title' : this.prefix + 'modal_title_id',
            'title_left' : this.prefix + 'modal_title_left_id',
            'title_right' : this.prefix + 'modal_title_right_id',
            'close' : this.prefix + 'modal_close_id',
            'content' : this.prefix + 'modal_content_id'
        };
        this.class = {
            'hidden' : 'fua_blocker_hidden'
        };
        this.attribute = {
            'target' : 'modal_target'
        }
    }

    Fua_modal_widow.prototype.createModalWindow = function(options){
        var bg = document.getElementById(this.id.modal_bg);

        if(bg && bg.getAttribute(this.attribute.target) != options.target) bg.remove();
        else if(bg && bg.getAttribute(this.attribute.target) == options.target) {
            if(!options.noToggle) bg.classList.toggle(this.class.hidden);
            return false;
        }

        bg = document.createElement('div');
        bg.setAttribute('id', this.id.modal_bg);
        bg.setAttribute(this.attribute.target, options.target);

        var bg_cell = document.createElement('div');
        bg_cell.setAttribute('id', this.id.modal_bg_cell);


        var body = document.createElement('div');
        body.setAttribute('id', this.id.body);


        if(!options.noTitle) {
            var title = document.createElement('div');
            title.setAttribute('id', this.id.title);

            var title_left = document.createElement('div');
            title_left.setAttribute('id', this.id.title_left);
            title_left.textContent = options.text_title;
            title.appendChild(title_left);

            var title_right = document.createElement('div');
            title_right.setAttribute('id', this.id.title_right);


            var close = document.createElement("img");
            close.setAttribute('id', this.id.close);
            close.setAttribute('src', chrome.runtime.getURL('img/close.png'));
            close.addEventListener('click', function () {
                bg.classList.toggle(FUA_BLOCKER_MW.class.hidden);
            });

            title_right.appendChild(close);
            title.appendChild(title_right);
            body.appendChild(title);
        }


        var content = document.createElement('div');
        content.setAttribute('id', this.id.content);

        body.appendChild(content);
        bg_cell.appendChild(body);
        bg.appendChild(bg_cell);
        document.documentElement.insertBefore(bg, document.body);
        options.callback();
        return true;
    };


    Fua_modal_widow.prototype.removeModalWindow = function(options){
        if(!options) options = {};
        var bg = document.getElementById(this.id.modal_bg);
        if(bg && !options.target) bg.remove();
        else if(bg && bg.getAttribute(this.attribute.target) == options.target) bg.remove();
    };



    // create instance
    return new Fua_modal_widow();
})();


