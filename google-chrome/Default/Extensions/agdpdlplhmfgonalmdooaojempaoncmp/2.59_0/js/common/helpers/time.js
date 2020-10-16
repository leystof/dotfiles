function timeAgo(time){
    var videoTime = (new Date(time)).getTime();
    var currentTime = (new Date()).getTime();
    var timeAgo = currentTime - videoTime;
    var hour = 3600000;
    var day = 86400000;
    var agoText = 'назад';
    if(timeAgo < hour) return '1 час ' + agoText;
    else if(timeAgo < day){
        var h = Math.floor(timeAgo / hour);
        return h + ' час' + rusViewsEnd(h) + ' ' + agoText;
    }
    else if(timeAgo < day * 7){
        var d = Math.floor(timeAgo / day);
        return d + ' д' + rusDaysEnd(d) + ' ' + agoText;
    }
    else if(timeAgo < day * 30){
        var w = Math.floor(timeAgo / (day * 7));
        return w + ' недел' + rusWeeksEnd(w) + ' ' + agoText;
    }
    else if(timeAgo < day * 365){
        var m = Math.floor(timeAgo / (day * 30));
        return m + ' месяц' + rusMonthsEnd(m) + ' ' + agoText;
    }
    else {
        var y = Math.floor(timeAgo / (day * 365));
        return y + ' год' + rusViewsEnd(y) + ' ' + agoText;
    }
}

function transformVideoDuration(duration){
    duration = duration
        .replace(new RegExp('[HM]', 'g'), ':')
        .replace(new RegExp('[^0-9\:]', 'g'), '');
    duration = duration.split(':');
    if(duration.length < 2) duration.unshift(0);
    for(var i in duration){
        if(i != 0 && parseInt(duration[i]) < 10) duration[i] = '0' + duration[i];
    }
    return duration.join(':');
}

//console.log(transformVideoDuration('PT55S'));