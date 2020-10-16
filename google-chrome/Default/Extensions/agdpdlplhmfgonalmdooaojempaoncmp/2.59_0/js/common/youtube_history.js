class YoutubeHistory {

    constructor(){
        this.xsrf = null;
        this.version = null;
        this.email = null;
        this.requestLimit = 100;
        this.currentTime = (new Date()).getTime();
        this.oneDay = 1000 * 60 * 60 * 24;
        this.defaultTimeLimit = this.currentTime -  this.oneDay * 90;
        this.timeLimit = this.defaultTimeLimit;
        this.lastDayTime = null;
        this.videos = [];
        this.requestCount = 0;
        this.blakcList = {};
        this.viewsHistory = {};
        this.userHistory = {
            lastTime : this.defaultTimeLimit,
            channels : {}
        };
        this.times = [];
    }


    getPageData(){
        return new Promise((resolve, reject) => {
            $.get('https://myactivity.google.com/myactivity?restrict=ytw', res => {
                this.xsrf = res.match(new RegExp("window.HISTORY_xsrf[ ]*=[ ]*'([^']+)"));
                if(this.xsrf) this.xsrf = this.xsrf[1];

                this.version = res.match(new RegExp("var[ ]+version[ ]*=[ ]*'([^']+)"));
                if(this.version) this.version = this.version[1];

                this.email = res.match(new RegExp("window.HISTORY_account_email[ ]*=[ ]*'([^']+)"));
                if(this.email) this.email = this.email[1];

                let response =
                    res.match(new RegExp("window.HISTORY_response[ ]*=[ ]*'(.+\\])';"));


                if(this.xsrf && this.version && this.email && response) {
                    if (this.viewsHistory[this.email]) {
                        this.userHistory = this.viewsHistory[this.email];
                        this.timeLimit = this.userHistory.lastTime - this.oneDay;
                        if (this.timeLimit < this.defaultTimeLimit) this.timeLimit = this.defaultTimeLimit;

                        let deletingChannels = [];
                        for (let i in this.viewsHistory.channels) {
                            let channel = this.viewsHistory.channels[i]
                                .filter(time => time > this.defaultTimeLimit);
                            if (channel.length) this.viewsHistory.channels[i] = channel;
                            else deletingChannels.push(i);
                        }

                        for (let i of deletingChannels) delete this.viewsHistory.channels[i];
                    }


                    if (response) {
                        response = response[1]
                            .replace(new RegExp('\\\\x22', 'g'), '"')
                            .replace(new RegExp('\\\\x3d', 'g'), '=')
                            .replace(new RegExp('\\\\x27', 'g'), '\'')
                            .replace(new RegExp('\\\\\\\\', 'g'), '\\');

                        response = JSON.parse(response);

                        if (response[0] && response[0].length && response[1]) {
                            this.parseResponse(response).then(result => {
                                if (result) {
                                    this.nextResult({
                                        ct: response[1]
                                    }).then(result => {
                                        resolve(result);
                                    });
                                }
                            })
                        }
                        else resolve(result);
                    }
                }
                else resolve(false);
            }).fail((res) => {
                resolve(false);
            });
        });
    }

    nextResult(options){
        return new Promise((resolve, reject) => {
            let url = 'https://myactivity.google.com/myactivity?restrict=ytw&jspb=1&jsv=' + this.version;
            if(options.q) url += '&q=' + encodeURIComponent(options.q);
            if(options.min) url += '&min=' + options.min;
            if(options.max) url += '&max=' + options.max;

            const data = {};
            if(options.ct) data.ct= options.ct;
            if(options.sig) data.sig = options.sig;

            if (
                this.requestLimit > this.requestCount
                && (!this.lastDayTime || this.lastDayTime > this.timeLimit)
            ) {
                this.requestCount++;
                $.ajax({
                    type: 'POST',
                    url: url,
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    dataType: 'text',
                }).done((res) => {
                    res = res.replace(new RegExp('\\)\\]\\}\',\\s+'), '');
                    const response = JSON.parse(res);

                    if(
                        response[0]
                        && response[0].length
                        && response[1]
                    ) {
                        this.parseResponse(response).then(result => {
                            if (result) {
                                options.ct = response[1];
                                this.nextResult(options).then(result => {
                                    resolve(result);
                                });
                            }
                            else resolve(result);
                        });

                    }
                    else resolve(true);
                }).fail((res) => {
                    console.log('continuationError', res);
                });
            } else resolve(true);
        });
    }


    parseResponse(response,  index = 0){
        return new Promise((resolve, reject) => {
            const days = response[0];
            const day = days[index];
            if(day){
                this.lastDayTime = day[0] / 1000;
                if (this.lastDayTime > this.timeLimit) {
                    let blocks = day[1];
                    this.parseBlock(blocks).then(result => {
                        index++;
                        this.parseResponse(response, index).then(result => {
                            resolve(result);
                        })
                    });
                }
                else resolve(true);
            }
            else resolve(true);
        });
    }



    updateVideos(videos){
        for(let video of videos){
            if(video[13]) {
                this.videos.push({
                    channel: video[13][0][0],
                    deleteHash: video[5],
                    dayTime: this.lastDayTime
                });
            }
        }
    }


    parseBlock(blocks, index = 0){
        return new Promise((resolve, reject) => {
            const block = blocks[index];
            if(block) {
                let currentLength = block[1][2] ? block[1][2].length : 0;
                let totalLength = block[1][6];
                if (totalLength > currentLength) {
                    $.ajax({
                        type: 'POST',
                        url: 'https://myactivity.google.com/bundle-details?restrict=ytw&jspb=1&jsv=' + this.version,
                        contentType: 'application/json',
                        data: JSON.stringify({
                            bundle: block[1][3]
                        }),
                        dataType: 'text',
                    }).done((res) => {
                        res = res.replace(new RegExp('\\)\\]\\}\',\\s+'), '');
                        res = JSON.parse(res);

                        if(res[0] && res[0].length){
                            this.updateVideos(res[0]);
                            index++;
                            this.parseBlock(blocks, index).then(result => {
                                resolve(result);
                            });
                        }
                        else resolve(true);

                    }).fail((res) => {
                        console.log('parseBlockError', res);
                    });
                }
                else if (currentLength) {
                    this.updateVideos(block[1][2]);
                    index++;
                    this.parseBlock(blocks, index).then(result => {
                        resolve(result);
                    });
                }
            }
            else resolve(true);
        });
    }

    getStorageData(){
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["channels_black_list", "views_history"], items => {
                let count = 0;
                if(items.channels_black_list) {
                    this.blakcList = items.channels_black_list;
                    for(let i in this.blakcList) count++;
                }
                if(items.views_history) this.viewsHistory = items.views_history;
                let result = count > 0;
                resolve(result);
            });
        })
    }


    deleteBlackChannels(index = 0){
        const channels = this.userHistory.channels;
        return new Promise((resolve, reject) => {
            let video = this.videos[index];
            if (video) {
                if(this.blakcList[video.channel]) {
                    $.ajax({
                        type: 'POST',
                        url: 'https://myactivity.google.com/api/select-delete?restrict=ytw&numitemsdeleted=1&jsv=' + this.version,
                        contentType: 'application/json',
                        data: JSON.stringify({
                            "req": "[[[\"ytw\",null,false,[]],5],[\"" + video.deleteHash + "\"],[]]",
                            "sig": this.xsrf
                        }),
                        dataType: 'text',
                    }).done((res) => {
                        res = res.replace(new RegExp('\\)\\]\\}\',\\s+'), '');
                        res = JSON.parse(res);
                        console.log('deleteResult', res);
                        index++;
                        this.deleteBlackChannels(index).then(result => {
                            resolve(result);
                        });
                    }).fail((res) => {
                        console.log('deleteResultError', res);
                        resolve(false);
                    });
                }
                else{
                    let channel = video.channel;
                    let time = video.dayTime;
                    if(!channels[channel]) channels[channel] = [time];
                    else {
                        let lastTime = channels[channel].length
                            ? channels[channel][channels[channel].length - 1]
                            : 0;

                        if(time > lastTime) channels[channel].push(time);
                    }

                    index++;
                    this.deleteBlackChannels(index).then(result => {
                        resolve(result);
                    });
                }
            }
            else resolve(true);
        })
    }

    updateStorage(){
        return new Promise((resolve, reject) => {
            this.viewsHistory[this.email] = this.userHistory;
            chrome.storage.local.set({views_history: this.viewsHistory}, () => {
                resolve(true);
            });
        });
    }


    additionalParsing(index = 0){
        return new Promise((resolve, reject) => {
            let time = this.times[index];
            if(time){
                this.nextResult({
                    sig: this.xsrf,
                    min: time * 1000,
                    max: time * 1000 + this.oneDay * 1000 - 1
                }).then(result => {
                    index++;
                    this.additionalParsing(index).then(result => {
                        resolve(result);
                    });
                });
            }
            else resolve(true);
        });
    }


    parseHistory(){
        return new Promise((resolve, reject) => {
            this.getStorageData().then(result => {
                if(result) return this.getPageData();
                return false;
            }).then(result => {
                if(result) {
                    if (this.videos.length) {
                        this.userHistory.lastTime = this.videos[0].dayTime;
                        this.videos = this.videos.reverse();
                    }

                    return this.deleteBlackChannels();
                }
                return false;
            }).then(result => {
                if(result) return this.updateStorage();
                return false;
            }).then(result => {
                if(result) {
                    this.videos = [];
                    this.timeLimit = 0;
                    for (let channel in this.blakcList) {
                        if (this.userHistory.channels[channel]) {
                            for (let t of this.userHistory.channels[channel]) {
                                if (!this.times.includes(t)) this.times.push(t);
                            }
                        }
                    }

                    return this.additionalParsing();
                }
                return false;
            }).then(result => {
                if (result) return this.deleteBlackChannels();
                return false;
            }).then(result => {
                if(result){
                    for(let channel in this.blakcList){
                        delete this.userHistory.channels[channel];
                    }
                    return this.updateStorage();
                }
                return false;
            }).then(result => {
                resolve(result);
            });
        });
    }
}


setInterval(() => {
    chrome.storage.local.get(["settings", "last_clear_history_time"], items => {
        if(items.settings && items.settings.frequencyDeletingHistory > 0) {
            const currentTime = (new Date()).getTime();
            if(
                !items.last_clear_history_time
                || items.last_clear_history_time < currentTime - items.settings.frequencyDeletingHistory * 1000 * 60
            ){
                const history = new YoutubeHistory();
                history.parseHistory().then(result => {
                    //console.log('result', result);
                });

                chrome.storage.local.set({last_clear_history_time: currentTime}, () => {
                    //console.log('update', currentTime);
                });
            }
        }
    });
}, 1000 * 60);