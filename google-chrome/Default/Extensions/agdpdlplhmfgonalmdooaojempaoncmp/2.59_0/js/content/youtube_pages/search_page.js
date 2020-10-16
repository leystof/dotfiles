chrome.runtime.onMessage.addListener(function(response) {
    var title = response.title;
    if(response.body) var body = response.body;

    /*******/
    if (title == 'addSearchViewButton') {
        //console.log('addSearchViewButton')''
        addSearchViewPanel();
    }
});


function addSearchViewPanel(time){
    var searchViewPanelId = 'fua_search_view_panel_id';
    if(!$('#' + searchViewPanelId).length){
        var targetElement = $('.search-header .filter-button-container'); // old design
       if(!targetElement.length) targetElement = $('#filter-menu ytd-toggle-button-renderer'); // new design

        targetElement.after(
            '<div id="'+ searchViewPanelId +'" class="yt-uix-menu-container feed-item-action-menu"> ' +
                '<ul class="yt-uix-menu-top-level-button-container"> ' +
                    '<li id="fua_grid_search_view_button_id" class="fua_search_view_button yt-uix-menu-top-level-button yt-uix-menu-top-level-flow-button"> ' +
                        '<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-empty yt-uix-button-has-icon yt-uix-tooltip" type="button" title="'+ C_WORD_GRID +'" aria-label="В виде сетки" data-tooltip-text="'+ C_WORD_GRID +'">' +
                            '<span class="yt-uix-button-icon-wrapper">' +
                                //'<span class="yt-uix-button-icon yt-uix-button-icon-view-module yt-sprite"></span>' +
                                '<img class="fua_current_image" src="'+ IMAGE_GRID +'">' +
                                '<img class="fua_active_image" style="display: none;" src="'+ IMAGE_ACTIVE_GRID +'">' +
                            '</span>' +
                        '</button> ' +
                    '</li> ' +
                    '<li id="fua_list_search_view_button_id" class="fua_search_view_button yt-uix-menu-top-level-button yt-uix-menu-top-level-flow-button"> ' +
                        '<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-empty yt-uix-button-has-icon yt-uix-tooltip" type="button" title="'+ C_WORD_LIST +'" aria-label="В виде списка" data-tooltip-text="'+ C_WORD_LIST +'">' +
                            '<span class="yt-uix-button-icon-wrapper">' +
                                //'<span class="yt-uix-button-icon yt-uix-button-icon-view-list yt-sprite"></span>' +
                                '<img class="fua_current_image" style="display: none;" src="'+ IMAGE_LIST +'">' +
                                '<img class="fua_active_image" src="'+ IMAGE_ACTIVE_LIST +'">' +
                            '</span>' +
                        '</button>' +
                    '</li> ' +
                '</ul> ' +
            '</div>'
        );

        $('#fua_grid_search_view_button_id').click(function(){
            chrome.runtime.sendMessage({
                'title': 'searchGridView'
            });
        });

        $('#fua_list_search_view_button_id').click(function(){
            chrome.runtime.sendMessage({
                'title': 'searchListView'
            });
        })
    }

    if(!time) var time = 0;
    if(time < 2000){
        setTimeout(function(){
            time = time + 300;
            addSearchViewPanel(time)
        }, 300);
    }
}