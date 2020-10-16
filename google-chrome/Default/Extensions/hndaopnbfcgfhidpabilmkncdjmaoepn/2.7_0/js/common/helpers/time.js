function getMillisecondFromArray(array){
    var millisecond = 0;
    for(var i in array){
        switch (parseInt(i)) {
            case 0:
                millisecond = millisecond + (array[i] * MILLISECOND_IN.hour);
                break;
            case 1:
                millisecond = millisecond + (array[i] * MILLISECOND_IN.minute);
                break;
            case 2:
                millisecond = millisecond + (array[i] * MILLISECOND_IN.second);
                break;
            case 3:
                millisecond = millisecond + (array[i] * 100);
                break;
        }
    }
    return millisecond;
}

function getTimeStringFromMillisecond(millisecond){
    var timeString = '';
    var rest = millisecond % MILLISECOND_IN.hour;
    if(millisecond != rest) {
        var hours = (millisecond - rest) / (MILLISECOND_IN.hour);
        timeString +=  hours + ':';
        millisecond = rest;
    }

    rest = millisecond % (MILLISECOND_IN.minute);
    if(millisecond != rest) {
        var minutes = (millisecond - rest) / (MILLISECOND_IN.minute);
        if(minutes < 10) timeString += '0' + minutes + ':';
        else timeString += minutes + ':';
        millisecond = rest;
    }
    else timeString += '00:';

    rest = millisecond % MILLISECOND_IN.second;
    if(millisecond != rest) {
        var seconds = (millisecond - rest) / MILLISECOND_IN.second;
        if(seconds < 10) timeString += '0' + seconds + '.';
        else timeString += seconds + '.';
        millisecond = rest;
    }
    else timeString += '00.';

    if(rest) timeString += rest.toString();
    else timeString += '000';

    return timeString;
}

//var ms = getMillisecondFromArray([2, 0, 3, 5]);
//console.log(getTimeStringFromMillisecond(ms));