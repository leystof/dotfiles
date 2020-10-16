var FUA_BLOCKER_TOOLTIP = (function(){
    function Tooltip(){
        this.prefix = "fua_blocker_";
        this.id = {
           "tooltip" : this.prefix + "tooltip_id"
        };
        this.class = {
            "hidden" : this.prefix + "hidden",
            "tooltip_text" : "yt-uix-tooltip-tip-content",
            "tooltip_div_img" : this.prefix + "tooltip_div_img",
            "tooltip_pointed_img" : this.prefix + "tooltip_pointed_img"
        };
    }

    Tooltip.prototype.createTooltip = function(){
        var body = document.body;
        var div = document.createElement("div");
        div.setAttribute("id", FUA_BLOCKER_TOOLTIP.id.tooltip);
        div.classList.add(FUA_BLOCKER_TOOLTIP.class.hidden);
        var divText = document.createElement("div");
        divText.classList.add(FUA_BLOCKER_TOOLTIP.class.tooltip_text);
        div.appendChild(divText);
        var divImg = document.createElement("div");
        divImg.classList.add(FUA_BLOCKER_TOOLTIP.class.tooltip_div_img);
        var pointedImg = document.createElement("img");
        pointedImg.classList.add(FUA_BLOCKER_TOOLTIP.class.tooltip_pointed_img);
        pointedImg.setAttribute("src", chrome.extension.getURL("img/navigation/black_triangle.png"));
        divImg.appendChild(pointedImg);
        div.appendChild(divImg);
        body.appendChild(div);
        return div;
    };


    Tooltip.prototype.showTooltip = function(options){
        var tooltip = document.getElementById(FUA_BLOCKER_TOOLTIP.id.tooltip);
        if(!tooltip) tooltip = FUA_BLOCKER_TOOLTIP.createTooltip();
        var targetObject = options.targetObject;

        if(options.textAttr){
            var tooltipText =
                tooltip.getElementsByClassName(FUA_BLOCKER_TOOLTIP.class.tooltip_text)[0];
            tooltipText.textContent= targetObject.getAttribute(options.textAttr);
        }

        tooltip.style.left = targetObject.getBoundingClientRect().left  + "px";
        tooltip.style.top = (targetObject.getBoundingClientRect().top + window.scrollY) + "px";
        tooltip.style.marginTop = options.marginTop || 0;

        if(options.toggle) tooltip.classList.toggle(FUA_BLOCKER_TOOLTIP.class.hidden);
        else tooltip.classList.remove(FUA_BLOCKER_TOOLTIP.class.hidden);

        tooltip.style.marginLeft = ((tooltip.clientWidth  - targetObject.clientWidth ) / 2 * (-1)) + "px";
    };


    Tooltip.prototype.hideTooltip = function(){
        var tooltip = document.getElementById(FUA_BLOCKER_TOOLTIP.id.tooltip);
        if(tooltip) tooltip.classList.add(FUA_BLOCKER_TOOLTIP.class.hidden);
    };


    return new Tooltip();
})();