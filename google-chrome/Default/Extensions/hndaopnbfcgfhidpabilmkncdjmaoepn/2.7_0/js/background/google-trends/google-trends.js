var FUA_GOOGLE_TRENDS = (function () {

    function GoogleTrends() {

    }

    GoogleTrends.prototype.getRequestData = function (options) {

        function returnData(res) {
            var requestData = false;
            if(res) {
                try {
                    var json = $.parseJSON(res.replace('\)\]\}\'', ''));
                    if (json.widgets){
                        requestData = {};
                        for (var i in json.widgets){
                            if(json.widgets[i].id) requestData[json.widgets[i].id] = json.widgets[i];
                        }
                    }
                }
                catch (e) {
                }
            }
            options.callback(requestData);
        }

        var obj = {
            hl: "ru",
            tz: "-120",
            req: '{"comparisonItem": [{"keyword": "'+ options.word +'", "geo": "", "time": "today 12-m"}], "category": 0, "property": ""}'
            //tz: "-120"
        };

        $.get('https://www.google.com/trends/api/explore', $.param(obj),
            function (res) {
                returnData(res);
            }
        ).fail(function (info) {
            returnData(info.responseText);
        });
    };



    GoogleTrends.prototype.getGoogleTrends = function (options) {
        var callback = options.callback;
        var trends = {};

        var completed = {
            RELATED_TOPICS : 1,
            RELATED_QUERIES : 1
        };

        function getTrends(requestData) {
            var obj = {
                req: JSON.stringify(requestData.request),
                token: requestData.token
            };

            function parseResponse(res) {
                if(res) {
                    try {
                        var json = $.parseJSON(res.replace('\)\]\}\',', ''));
                        if(
                            json.default
                            && json.default.rankedList
                            && json.default.rankedList[1]
                            && json.default.rankedList[1].rankedKeyword
                        ){
                            var rankedKeyword = json.default.rankedList[1].rankedKeyword;
                            for(var i in rankedKeyword){
                                var trend = rankedKeyword[i].query;
                                if(!trend && rankedKeyword[i].topic) {
                                    trend = rankedKeyword[i].topic.title;
                                }
                                if(trend){
                                    var tmpPhrase = decodeLikeUrl(trend).trim().toLowerCase();
                                    trends[tmpPhrase] = {};
                                    trends[tmpPhrase]['year rate'] =  rankedKeyword[i].formattedValue;
                                }
                            }
                        }
                    }
                    catch (e) {

                    }
                }

                completed[requestData.id] = 2;
                var isComplete = true;
                for (var i in completed){
                    if(completed[i] == 1){
                        isComplete = false;
                        break;
                    }
                }

                if(isComplete) {
                    //console.log("trends", trends);
                    callback(trends);
                }
            }

            $.get(
                'https://www.google.com/trends/api/widgetdata/relatedsearches',
                $.param(obj),
                function (res) {
                    parseResponse(res);
                }
            ).fail(function (info) {
                parseResponse(info.responseText);
            });
        }

        this.getRequestData({
            word : options.word,
            callback : function (requestData) {
                for(var i in requestData){
                   if(completed[i]) getTrends(requestData[i]);
                }
            }
        })
    };


    return new GoogleTrends();

})();