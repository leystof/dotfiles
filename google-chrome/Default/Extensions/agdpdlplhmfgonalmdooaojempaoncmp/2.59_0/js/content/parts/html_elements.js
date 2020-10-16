var FUA_BLOCKER_HTML_ELEMENTS = (function(){
    function Html_elements(){

    }


    Html_elements.prototype.getPlayerBlock = function(){
        var playerBlock = $("#player-container"); // new design
        if(!playerBlock.length) playerBlock = $("#player-api"); // old design
        return playerBlock;
    };


    return new Html_elements();
})();