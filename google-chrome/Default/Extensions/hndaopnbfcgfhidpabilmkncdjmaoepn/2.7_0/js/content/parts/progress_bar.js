var FUA_YT_PROGRESS_BAR = (function(){
    function Progress_bar(){
        this.prefix = 'fua_youtube_';
        this.class = {
            'progress_container' : this.prefix + 'progress_container',
            'progress_bar' : this.prefix + 'progress_bar',
            'progress_label' : this.prefix + 'progress_label'
        };
    }

    Progress_bar.prototype.createProgressBar = function(options){
        if(document.getElementById(options.progress_id)) return false;

        var progressContainer = document.createElement("div");
        progressContainer.setAttribute("id", options.progress_id);
        progressContainer.classList
            .add(FUA_YT_PROGRESS_BAR.class.progress_container);

        var progressBar = document.createElement("div");
        progressBar.classList.add(FUA_YT_PROGRESS_BAR.class.progress_bar);

        var progressLabel = document.createElement("span");
        progressLabel.classList.add(FUA_YT_PROGRESS_BAR.class.progress_label);
        progressLabel.textContent = "0%";


        progressBar.appendChild(progressLabel);
        progressContainer.appendChild(progressBar);
        options.target_element.appendChild(progressContainer);
    };

    Progress_bar.prototype.updateProgressBar = function(options){
        var pc = document.getElementById(options.progress_id);
        if(!pc) return false;

        if(!options.percentages) options.percentages = 0;
        else if(options.percentages > 100) options.percentages = 100;
        else options.percentages = Math.ceil(options.percentages);

        var bar = pc.getElementsByClassName(FUA_YT_PROGRESS_BAR.class.progress_bar)[0];
        var label = pc.getElementsByClassName(FUA_YT_PROGRESS_BAR.class.progress_label)[0];
        bar.style.width = options.percentages + "%";
        label.textContent = options.percentages + "%";

        if(options.percentages == 100 && options.finalCallback){
            options.finalCallback();
        }
    };

    return new Progress_bar();
})();