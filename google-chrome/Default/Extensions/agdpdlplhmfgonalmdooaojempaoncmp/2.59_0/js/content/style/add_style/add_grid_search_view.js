if(!document.getElementById('fua_grid_search_style_id')) {
    var styleString =  'ytd-item-section-renderer ytd-channel-renderer a.ytd-channel-renderer{display: block} #fua_list_search_view_button_id button .fua_active_image, #fua_grid_search_view_button_id button .fua_current_image { display: none; } #fua_grid_search_view_button_id button .fua_active_image, #fua_list_search_view_button_id button .fua_current_image { display: inline-block !important; } #fua_grid_search_view_button_id button { opacity: 1; } .yt-lockup-description { display: none !important; } .yt-lockup-thumbnail { float: none !important; } .yt-uix-pager, .search-pager { clear: both; } #results ol.item-section > li { width: 220px !important; height: 250px !important; overflow: hidden; float: left; } .ytd-two-column-search-results-renderer ytd-item-section-renderer.ytd-section-list-renderer { /*text-align: center; */} .ytd-two-column-search-results-renderer ytd-video-renderer.ytd-item-section-renderer, .ytd-two-column-search-results-renderer ytd-search-pyv-renderer.ytd-item-section-renderer, .ytd-two-column-search-results-renderer ytd-channel-renderer.ytd-item-section-renderer, .ytd-two-column-search-results-renderer ytd-playlist-renderer.ytd-item-section-renderer{ text-align: left; } .ytd-two-column-search-results-renderer ytd-video-renderer.ytd-item-section-renderer, .ytd-two-column-search-results-renderer ytd-search-pyv-renderer.ytd-item-section-renderer, .ytd-two-column-search-results-renderer ytd-channel-renderer.ytd-item-section-renderer, .ytd-two-column-search-results-renderer ytd-playlist-renderer.ytd-item-section-renderer{ width: 245px !important; margin: 10px 10px 10px; text-align: left; overflow: hidden; display: inline-block !important; } .ytd-two-column-search-results-renderer ytd-video-renderer.ytd-item-section-renderer #dismissable { display: inline-block; } .ytd-two-column-search-results-renderer ytd-video-renderer.ytd-item-section-renderer div#content { display: block !important; } .ytd-two-column-search-results-renderer ytd-video-renderer.ytd-item-section-renderer ytd-thumbnail { display: block !important; } #results ol.item-section > li div.yt-lockup-thumbnail{ width: 200px !important; }';
    var css = styleString,
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    style.id = 'fua_grid_search_style_id';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
    window.dispatchEvent(new Event("resize"));
}