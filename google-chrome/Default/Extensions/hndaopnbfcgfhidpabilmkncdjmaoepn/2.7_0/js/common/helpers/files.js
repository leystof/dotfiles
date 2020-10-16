var FUA_YOUTUBE_FILE_HELPER = (function () {
    function FileHelper() {

    }

    FileHelper.prototype.getBlobFromUrl = function (options) {
        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.onload = function() {
            options.callback(request.response);
        };
        request.open("GET", options.url);
        request.send();
    };

    return new FileHelper();
})();