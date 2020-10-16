function getVideoIdFromVideoUrl(url){
    var m = url.match('(v|video_id)=([^\&]*)(&|$)');
    if(m && m[2]) return m[2];
    else return false;
}

function getVideoTagsFromHtml(html) {
    let tags = [];


    let kw = html.match('"keywords":"([^"]+)');
    if(kw && kw[1]) tags = kw[1].split(",");


    if(!tags.length){
        kw = html.match(new RegExp('"keywords":\\[([^\\]]+)'));
        if(kw && kw[1]) {
            tags = kw[1].replace(new RegExp('"', 'g'), '').split(",");
        }
    }

    if(!tags.length){
        kw = html.match(new RegExp('\\\\"keywords\\\\":\\[([^\\]]+)'));
        if(kw && kw[1]) {
            tags = kw[1].replace(new RegExp('["\\\\]+', 'g'), '').split(",");
        }
    }

    if(!tags.length){
        kw = html.match(new RegExp('<meta[ ]*name="keywords"[ ]*content="([^"]+)'));
        if(kw && kw[1]) tags = kw[1].split(",");
    }

    return tags;
}

function jsonToUrlEncoded(element, key, list){
    list = list || [];
    if(typeof(element)=='object'){
        for (let idx in element)
            this.jsonToUrlEncoded(element[idx],key?key+'['+idx+']':idx,list);
    } else {
        list.push(key+'='+encodeURIComponent(element));
    }
    return list.join('&');
}

function getXsrfToken(string){
    let token = string.match('XSRF_TOKEN[\'"][ ]*:[ ]*[\'"]([^"\']+)');
    if(token && token[1]) return token[1];
    return null;
}

function getIdentityToken(string){
    let token = string.match('ID_TOKEN[\'"][ ]*:[ ]*[\'"]([^"\']+)');
    if(token && token[1]) return token[1];
    return null;
}


function getImageMeta(url){
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.addEventListener("load", e => {
            resolve(img);
        });
        img.src = url;
    })
}


function getVideoPageInfo(id) {
    return new Promise((resolve, reject) => {
        $.get('https://www.youtube.com/watch?v=' + id).done(res => {
            const info = {
                youOwner: false,
                subscribers: 0
            };

            const regexpNumber = new RegExp("[^0-9]*", "g");
            let ytInitialData = res.match(new RegExp('window\\["ytInitialData"\\][ ]*=[ ]*(.+}});', 'i'));

            if(ytInitialData){
                //console.log('ytInitialData', JSON.parse(ytInitialData[1]));
                ytInitialData = JSON.parse(ytInitialData[1]);
                if(ytInitialData.contents) {
                    info.ctoken =
                        ytInitialData.contents.twoColumnWatchNextResults
                            .results.results.contents[2].itemSectionRenderer
                            .continuations[0].nextContinuationData.continuation;

                    info.itct =
                        ytInitialData.contents.twoColumnWatchNextResults
                            .results.results.contents[2].itemSectionRenderer
                            .continuations[0].nextContinuationData.clickTrackingParams;

                    if(
                        ytInitialData.contents.twoColumnWatchNextResults
                        .results.results.contents[1].videoSecondaryInfoRenderer
                        .owner.videoOwnerRenderer.subscriberCountText
                    ){
                        info.subscribers =
                            ytInitialData.contents.twoColumnWatchNextResults
                                .results.results.contents[1].videoSecondaryInfoRenderer
                                .owner.videoOwnerRenderer.subscriberCountText.simpleText
                                .replace(regexpNumber, "");
                    }

                    info.likes =
                        ytInitialData.contents.twoColumnWatchNextResults
                            .results.results.contents[0].videoPrimaryInfoRenderer.videoActions
                            .menuRenderer.topLevelButtons[0].toggleButtonRenderer.accessibility.label
                            .replace(regexpNumber, "");

                    info.dislikes =
                        ytInitialData.contents.twoColumnWatchNextResults
                            .results.results.contents[0].videoPrimaryInfoRenderer.videoActions
                            .menuRenderer.topLevelButtons[1].toggleButtonRenderer.accessibility.label
                            .replace(regexpNumber, "");
                }
            }


            info.captions = null;
            let ytInitialPlayerResponse = res.match(new RegExp('window\\["ytInitialPlayerResponse"\\][ ]*=[ ]*\\([\\s]*(.+\\})\\);', 'i'));


            if(!ytInitialPlayerResponse) {
                ytInitialPlayerResponse = res.match(new RegExp('ytplayer.config[ ]*=[ ]*({.+});[ ]*ytplayer.load', 'i'));
                if(ytInitialPlayerResponse){
                    ytInitialPlayerResponse = JSON.parse(ytInitialPlayerResponse[1]);
                    if(ytInitialPlayerResponse.args && ytInitialPlayerResponse.args.player_response){
                        ytInitialPlayerResponse = [null, ytInitialPlayerResponse.args.player_response];
                    }
                    else ytInitialPlayerResponse = null;
                }
            }



            if(ytInitialPlayerResponse){
                //console.log('ytInitialPlayerResponse', JSON.parse(ytInitialPlayerResponse[1]));
                let json = JSON.parse(ytInitialPlayerResponse[1]);
                const details = json.videoDetails;
                if(details) {
                    info.title = details.title;
                    info.description = details.shortDescription;
                    info.public = !details.isPrivate;
                    info.tags = details.keywords ? details.keywords : [];
                    info.views = details.viewCount;
                    info.youOwner = details.isOwnerViewing;
                }

                if(
                    json.captions
                    && json.captions.playerCaptionsTracklistRenderer.captionTracks
                    && json.captions.playerCaptionsTracklistRenderer.captionTracks.length
                ) info.captions = true;
            }

            info.session_token = getXsrfToken(res);
            info.identityToken = getIdentityToken(res);
            //console.log('info', info);
            resolve(info)
        });
    });

}


function getNewStudioCommentsPageInfo(id) {
    return new Promise((resolve, reject) => {
        $.get('https://studio.youtube.com/video/'+ id).done(res => {
            const info = {};

            let apiKey = res.match(new RegExp('"innertube_api_key"[ ]*:[ ]*"([^"]+)', 'i'));
            if(apiKey) info.apiKey = apiKey[1];

            let clientName = res.match(new RegExp('"INNERTUBE_CONTEXT_CLIENT_NAME"[ ]*:[ ]*([0-9]+)'));
            if(clientName) info.clientName = clientName[1];

            let delegatedId = res.match(new RegExp('"DELEGATED_SESSION_ID"[ ]*:[ ]*"([^"]+)'));
            if(delegatedId) info.delegatedId = delegatedId[1];


            let channelId = res.match(new RegExp('"CHANNEL_ID"[ ]*:[ ]*"([^"]+)'));
            if(channelId) info.channelId = channelId[1];

            //console.log('getNewStudioCommentsPageInfo', info);
            resolve(info)
        });
    });
}


function getNewStudioAuth() {
    var eea = function(a) {
        if (!a)
            return "";
        a = a.split("#")[0].split("?")[0];
        a = a.toLowerCase();
        0 == a.indexOf("//") && (a = window.location.protocol + a);
        /^[\w\-]*:\/\//.test(a) || (a = window.location.href);
        var b = a.substring(a.indexOf("://") + 3)
            , c = b.indexOf("/");
        -1 != c && (b = b.substring(0, c));
        a = a.substring(0, a.indexOf("://"));
        if ("http" !== a && "https" !== a && "chrome-extension" !== a && "file" !== a && "android-app" !== a && "chrome-search" !== a && "app" !== a)
            throw Error("Invalid URI scheme in origin: " + a);
        c = "";
        var d = b.indexOf(":");
        if (-1 != d) {
            var f = b.substring(d + 1);
            b = b.substring(0, d);
            if ("http" === a && "80" !== f || "https" === a && "443" !== f)
                c = ":" + f
        }
        return a + "://" + b + c
    };

    var Da = this;

    var gd = String.prototype.trim ? function(a) {
            return a.trim()
        }
        : function(a) {
            return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1]
        };

    var df = function(a) {
        this.document_ = a || {
            cookie: ""
        }
    };

    var e = df.prototype;
    e.isEnabled = function() {
        return navigator.cookieEnabled
    }
    ;
    e.isValidName = function(a) {
        return !/[;=\s]/.test(a)
    }
    ;
    e.isValidValue = function(a) {
        return !/[;\r\n]/.test(a)
    }
    ;
    e.set = function(a, b, c, d, f, k) {
        if (!this.isValidName(a))
            throw Error('Invalid cookie name "' + a + '"');
        if (!this.isValidValue(b))
            throw Error('Invalid cookie value "' + b + '"');
        Ea(c) || (c = -1);
        f = f ? ";domain=" + f : "";
        d = d ? ";path=" + d : "";
        k = k ? ";secure" : "";
        c = 0 > c ? "" : 0 == c ? ";expires=" + (new Date(1970,1,1)).toUTCString() : ";expires=" + (new Date(fc() + 1E3 * c)).toUTCString();
        this.setCookie_(a + "=" + b + f + d + c + k)
    }
    ;
    e.get = function(a, b) {
        for (var c = a + "=", d = this.getParts_(), f = 0, k; f < d.length; f++) {
            k = gd(d[f]);
            if (0 == k.lastIndexOf(c, 0))
                return k.substr(c.length);
            if (k == a)
                return ""
        }
        return b
    }
    ;
    e.remove = function(a, b, c) {
        var d = this.containsKey(a);
        this.set(a, "", 0, b, c);
        return d
    }
    ;
    e.getKeys = function() {
        return this.getKeyValues_().keys
    }
    ;
    e.getValues = function() {
        return this.getKeyValues_().values
    }
    ;
    e.isEmpty = function() {
        return !this.getCookie_()
    }
    ;
    e.getCount = function() {
        return this.getCookie_() ? this.getParts_().length : 0
    }
    ;
    e.containsKey = function(a) {
        return Ea(this.get(a))
    }
    ;
    e.containsValue = function(a) {
        for (var b = this.getKeyValues_().values, c = 0; c < b.length; c++)
            if (b[c] == a)
                return !0;
        return !1
    }
    ;
    e.clear = function() {
        for (var a = this.getKeyValues_().keys, b = a.length - 1; 0 <= b; b--)
            this.remove(a[b])
    }
    ;
    e.setCookie_ = function(a) {
        this.document_.cookie = a
    }
    ;
    e.getCookie_ = function() {
        return this.document_.cookie
    }
    ;
    e.getParts_ = function() {
        return (this.getCookie_() || "").split(";")
    }
    ;
    e.getKeyValues_ = function() {
        for (var a = this.getParts_(), b = [], c = [], d, f, k = 0; k < a.length; k++)
            f = gd(a[k]),
                d = f.indexOf("="),
                -1 == d ? (b.push(""),
                    c.push(f)) : (b.push(f.substring(0, d)),
                    c.push(f.substring(d + 1)));
        return {
            keys: b,
            values: c
        }
    };

    var Mb = function(a) {
        var b = typeof a;
        if ("object" == b)
            if (a) {
                if (a instanceof Array)
                    return "array";
                if (a instanceof Object)
                    return b;
                var c = Object.prototype.toString.call(a);
                if ("[object Window]" == c)
                    return "object";
                if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice"))
                    return "array";
                if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call"))
                    return "function"
            } else
                return "null";
        else if ("function" == b && "undefined" == typeof a.call)
            return "object";
        return b
    }


    Qb = function(a) {
        return "array" == Mb(a)
    }

    var nc = Array.prototype.forEach ? function(a, b, c) {
            Array.prototype.forEach.call(a, b, c)
        }
        : function(a, b, c) {
            for (var d = a.length, f = Fa(a) ? a.split("") : a, k = 0; k < d; k++)
                k in f && b.call(c, f[k], k, a)
        }


    var fea = function() {
        function a() {
            f[0] = 1732584193;
            f[1] = 4023233417;
            f[2] = 2562383102;
            f[3] = 271733878;
            f[4] = 3285377520;
            u = t = 0
        }
        function b(a) {
            for (var b = l, c = 0; 64 > c; c += 4)
                b[c / 4] = a[c] << 24 | a[c + 1] << 16 | a[c + 2] << 8 | a[c + 3];
            for (c = 16; 80 > c; c++)
                a = b[c - 3] ^ b[c - 8] ^ b[c - 14] ^ b[c - 16],
                    b[c] = (a << 1 | a >>> 31) & 4294967295;
            a = f[0];
            var d = f[1]
                , k = f[2]
                , m = f[3]
                , r = f[4];
            for (c = 0; 80 > c; c++) {
                if (40 > c)
                    if (20 > c) {
                        var t = m ^ d & (k ^ m);
                        var u = 1518500249
                    } else
                        t = d ^ k ^ m,
                            u = 1859775393;
                else
                    60 > c ? (t = d & k | m & (d | k),
                        u = 2400959708) : (t = d ^ k ^ m,
                        u = 3395469782);
                t = ((a << 5 | a >>> 27) & 4294967295) + t + r + u + b[c] & 4294967295;
                r = m;
                m = k;
                k = (d << 30 | d >>> 2) & 4294967295;
                d = a;
                a = t
            }
            f[0] = f[0] + a & 4294967295;
            f[1] = f[1] + d & 4294967295;
            f[2] = f[2] + k & 4294967295;
            f[3] = f[3] + m & 4294967295;
            f[4] = f[4] + r & 4294967295
        }
        function c(a, c) {
            if ("string" === typeof a) {
                a = unescape(encodeURIComponent(a));
                for (var d = [], f = 0, l = a.length; f < l; ++f)
                    d.push(a.charCodeAt(f));
                a = d
            }
            c || (c = a.length);
            d = 0;
            if (0 == t)
                for (; d + 64 < c; )
                    b(a.slice(d, d + 64)),
                        d += 64,
                        u += 64;
            for (; d < c; )
                if (k[t++] = a[d++],
                    u++,
                64 == t)
                    for (t = 0,
                             b(k); d + 64 < c; )
                        b(a.slice(d, d + 64)),
                            d += 64,
                            u += 64
        }
        function d() {
            var a = []
                , d = 8 * u;
            56 > t ? c(m, 56 - t) : c(m, 64 - (t - 56));
            for (var l = 63; 56 <= l; l--)
                k[l] = d & 255,
                    d >>>= 8;
            b(k);
            for (l = d = 0; 5 > l; l++)
                for (var r = 24; 0 <= r; r -= 8)
                    a[d++] = f[l] >> r & 255;
            return a
        }
        for (var f = [], k = [], l = [], m = [128], r = 1; 64 > r; ++r)
            m[r] = 0;
        var t, u;
        a();
        return {
            reset: a,
            update: c,
            digest: d,
            digestString: function() {
                for (var a = d(), b = "", c = 0; c < a.length; c++)
                    b += "0123456789ABCDEF".charAt(Math.floor(a[c] / 16)) + "0123456789ABCDEF".charAt(a[c] % 16);
                return b
            }
        }
    };


    var eea = function(a) {
        if (!a)
            return "";
        a = a.split("#")[0].split("?")[0];
        a = a.toLowerCase();
        0 == a.indexOf("//") && (a = window.location.protocol + a);
        /^[\w\-]*:\/\//.test(a) || (a = window.location.href);
        var b = a.substring(a.indexOf("://") + 3)
            , c = b.indexOf("/");
        -1 != c && (b = b.substring(0, c));
        a = a.substring(0, a.indexOf("://"));
        if ("http" !== a && "https" !== a && "chrome-extension" !== a && "file" !== a && "android-app" !== a && "chrome-search" !== a && "app" !== a)
            throw Error("Invalid URI scheme in origin: " + a);
        c = "";
        var d = b.indexOf(":");
        if (-1 != d) {
            var f = b.substring(d + 1);
            b = b.substring(0, d);
            if ("http" === a && "80" !== f || "https" === a && "443" !== f)
                c = ":" + f
        }
        return a + "://" + b + c
    };


    var gea = function(a) {
        var b = fea();
        b.update(a);
        return b.digestString().toLowerCase()
    };

    var hea = function(a, b, c, d) {
        var f = [];
        if (1 == (Qb(c) ? 2 : 1))
            return f = [b, a],
                nc(d, function(a) {
                    f.push(a)
                }),
                gea(f.join(" "));
        var k = []
            , l = [];
        nc(c, function(a) {
            l.push(a.key);
            k.push(a.value)
        });
        c = Math.floor((new Date).getTime() / 1E3);
        f = 0 == k.length ? [c, b, a] : [k.join(":"), c, b, a];
        nc(d, function(a) {
            f.push(a)
        });
        a = gea(f.join(" "));
        a = [c, a];
        0 == l.length || a.push(l.join(""));
        return a.join("_")
    }

    var iea = function(a) {
        var b = eea(String(Da.location.href))
            , c = Da.__OVERRIDE_SID;
        null == c && (c = (new df(document)).get("SID"));
        if (c) {
            var d = (c = 0 == b.indexOf("https:") || 0 == b.indexOf("chrome-extension:")) ? Da.__SAPISID : Da.__APISID;
            null == d && (d = (new df(document)).get(c ? "SAPISID" : "APISID"));
            if (d)
                return b = String(Da.location.href),
                    c = c ? "SAPISIDHASH" : "APISIDHASH",
                    b && d && c ? [c, hea(eea(b), d, a || null, [])].join(" ") : null
        }
        return null
    };

    return iea([]);
}




function getCommentsInfo(itemSection) {
    const info= {
        owner: false,
        pinned: false,
        count: 0,
        noOwnerCount: 0,
        hearts: 0,
        comments: [],
        noOwnerComments: [],
        sortCredentials: {
            popular : null,
            newest : null
        },
        pinnedLink: false,
        replyCount: 0
    };

    let comments = itemSection.contents;
    if (comments) {
        comments.map(comment => {
            if(comment.commentThreadRenderer) {
                info.comments.push(comment.commentThreadRenderer);
                if (comment.commentThreadRenderer.renderingPriority) {
                    if (comment.commentThreadRenderer.renderingPriority === 'RENDERING_PRIORITY_PINNED_COMMENT') {
                        info.pinned = true;
                        if (comment.commentThreadRenderer.comment.commentRenderer.authorIsChannelOwner) {
                            info.owner = true;
                        }


                        let commentText = null;
                        if (comment.commentThreadRenderer.comment.commentRenderer.contentText.simpleText) {
                            commentText = comment.commentThreadRenderer.comment.commentRenderer.contentText.simpleText;
                        }
                        else {
                            commentText = comment.commentThreadRenderer
                                .comment.commentRenderer.contentText.runs
                                .reduce((accumulator, currentValue) => accumulator + currentValue.text, '');
                        }

                        if (commentText.match('http(s|)://')) info.pinnedLink = true;
                    }
                }

                if (!comment.commentThreadRenderer.comment.commentRenderer.authorIsChannelOwner) {
                    info.noOwnerCount++;
                    info.noOwnerComments.push(comment.commentThreadRenderer);
                    let heartButton = comment.commentThreadRenderer.comment.commentRenderer.actionButtons.commentActionButtonsRenderer.creatorHeart;

                    if (heartButton && heartButton.creatorHeartRenderer.isHearted) {
                        info.hearts++;
                    }

                    if(
                        comment.commentThreadRenderer.replies
                        && comment.commentThreadRenderer.replies.commentRepliesRenderer.contents
                    ){
                        let replied = false;
                        comment.commentThreadRenderer.replies.commentRepliesRenderer.contents.map(reply => {
                            if(!replied && reply.commentRenderer.authorIsChannelOwner){
                                replied = true;
                                info.replyCount++;
                            }
                        });
                    }
                }
            }
        });
    }


    let countText =  itemSection.header.commentsHeaderRenderer.countText.simpleText;
    if(!countText){
        countText =  itemSection.header.commentsHeaderRenderer.countText.runs
            .reduce((accumulator, currentValue) => accumulator + currentValue.text, '');
    }
    info.count = countText.replace(new RegExp("[^0-9]*", "g"), "");


    info.sortCredentials.popular =
        itemSection.header.commentsHeaderRenderer
            .sortMenu.sortFilterSubMenuRenderer.subMenuItems[0]
            .continuation.reloadContinuationData;

    info.sortCredentials.newest =
        itemSection.header.commentsHeaderRenderer
            .sortMenu.sortFilterSubMenuRenderer.subMenuItems[1]
            .continuation.reloadContinuationData;

    return info;
}



function getNewStudioVideoInfo(id, apiKey, clientName, delegatedId){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: 'https://studio.youtube.com/youtubei/v1/creator/get_creator_videos?alt=json&key=' + apiKey,
            contentType : 'application/json',
            data: JSON.stringify(
                {
                    "context": {
                        "client": {
                            "clientName": clientName,
                            "clientVersion": "creator_latest",
                            "experimentIds": []
                        },
                        "request": {},
                        "user": {"onBehalfOfUser": delegatedId}
                    },
                    "failOnError": true,
                    "videoIds": [id],
                    "mask": {
                        "monetizationDetails": {"all": true}
                    }
                }
            ),
            headers: {
                authorization: getNewStudioAuth()
            }
        }).done((res) => {
            //console.log('getNewStudioVideoInfo', res);
            const info = {
                monetization: false
            };


            if(
                res.videos
                && res.videos.length
                && res.videos[0].monetizationDetails
                && res.videos[0].monetizationDetails.status === 'MONETIZATION_STATUS_ON'
            ) info.monetization = true;

            resolve(info);
        }).fail((res) => {
            console.log('getNewStudioVideoInfoError', res);
        });
    });
}



function getNewStudioVideoPlayLists(id, apiKey, clientName, delegatedId, channelId){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: 'https://studio.youtube.com/youtubei/v1/creator/list_creator_playlists?alt=json&key=' + apiKey,
            contentType : 'application/json',
            data: JSON.stringify(
                {
                    "channelId": channelId,
                    "memberVideoIds": [id],
                    "pageSize": 100,
                    "mask": {"playlistId": true, "title": true},
                    "context": {
                        "client": {
                            "clientName": clientName,
                            "clientVersion": "creator_latest",
                            "experimentIds": []
                        },
                        "request": {
                        },
                        "user": {"onBehalfOfUser": delegatedId}
                    }
                }
            ),
            headers: {
                authorization: getNewStudioAuth()
            }
        }).done((res) => {
            //console.log('getNewStudioVideoPlayLists', res);
            const info = {
                playListsCount: 0
            };

            if(res.playlistMemberships && res.playlistMemberships.length){
                res.playlistMemberships.map(p => {
                    if(p.containsRequestedVideos === 'CONTAINS_REQUESTED_VIDEOS_ALL'){
                        info.playListsCount++;
                    }
                });
            }

            resolve(info);
        }).fail((res) => {
            console.log('getNewStudioVideoPlayListsError', res);
        });
    });
}




function getNewStudioComments(id, apiKey, clientName, delegatedId, ordered = "BEST"){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: 'https://studio.youtube.com/youtubei/v1/comment/get_comments?alt=json&key=' + apiKey,
            contentType : 'application/json',
            data: JSON.stringify({
                "context": {
                    "client": {
                        "clientName": clientName,
                        "clientVersion": "creator_latest",
                        "experimentIds": []
                    },
                    "request": {},
                    "user": {"onBehalfOfUser": delegatedId}
                },
                "videoId": id,
                "moderationState": "PUBLISHED",
                "searchQuery": "",
                "sortOrder": ordered,
                "maxReplies": 500
            }),
            headers: {
                authorization: getNewStudioAuth()
            }
        }).done((res) => {
            //console.log('testComments', res);

            if (res.contents.itemSectionRenderer) {
                let info = getCommentsInfo(res.contents.itemSectionRenderer);
                //console.log('testCommentsInfo', info);
                resolve(info);
            }
        }).fail((res) => {
            console.log('testCommentsError', res);
        });
    });
}


function getComments(session_token, identityToken, ctoken, itct, newest){
    return new Promise((resolve, reject) => {
        const url = 'https://www.youtube.com/comment_service_ajax?action_get_comments=1&pbj=1' +
            '&ctoken=' + ctoken +
            (!newest ? '&continuation=' + ctoken : '') +
            '&itct=' + itct;

        const headers = {
            "x-youtube-client-name": 1,
            "x-youtube-client-version": 2.20181220,
            //"x-youtube-identity-token": identityToken,
        };

        if(identityToken){
            headers["x-youtube-identity-token"] = identityToken;
        }

        $.ajax({
            type: 'POST',
            url: url,
            processData: false,
            contentType : 'application/x-www-form-urlencoded',
            data: jsonToUrlEncoded({session_token: session_token}),
            headers: headers
        }).done((res) => {
            //console.log('rudeComments', res);

            if(res.response.continuationContents) {
                if (res.response.continuationContents.itemSectionContinuation) {
                    let info = getCommentsInfo(res.response.continuationContents.itemSectionContinuation);
                    //console.log('comments', info);
                    resolve(info);
                }
            }

        }).fail((res) => {
            console.log(res);
        });
    });
}




function getCards(id, session_token){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: 'https://www.youtube.com/annotations_invideo?cap_hist=1&video_id='+ id +'&client=1',
            processData: false,
            contentType : 'application/x-www-form-urlencoded',
            data: jsonToUrlEncoded({session_token: session_token}),
        }).done((res) => {
            //console.log('annotations_invideo', res);
            const xml = $(res);
            //console.log('annotations_invideo', xml.find('annotations > annotation[type="card"]'));
            resolve(xml.find('annotations > annotation[type="card"]'));
        }).fail((res) => {
            console.log(res);
        });
    });
}


function getEndScreens(id, session_token){
    return new Promise((resolve, reject) => {
        $.ajax({
            type: 'POST',
            url: 'https://www.youtube.com/get_endscreen?client=1&v=' + id,
            processData: false,
            contentType : 'application/x-www-form-urlencoded',
            data: jsonToUrlEncoded({session_token: session_token}),
        }).done((res) => {
            //console.log('getEndScreens', res);
            let json = null
            if(res.indexOf('{') !== -1) {
                json = JSON.parse(res.replace(new RegExp('^\\)\\]\\}'), '').trim());
            }
            //console.log('json', json);
            resolve(json);
        }).fail((res) => {
            console.log(res);
        });
    });
}




function getTagsCuntInText(text, tags) {
    if(!text || !text.length || !tags) return 0;
    text = text.toLowerCase();
    let count = 0;
    tags.map(tag => {
        if(text.indexOf(tag.toLowerCase()) !== -1) count++;
    });
    return count;
}


//comment_service_ajax