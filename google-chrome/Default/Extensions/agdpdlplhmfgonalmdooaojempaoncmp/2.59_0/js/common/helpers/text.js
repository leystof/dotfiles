function rusViewsEnd(number){
    var endIndex = rusNumbersEnd(number);
    if(endIndex == 1) return '';
    else if(endIndex == 2) return 'а';
    else return 'ов';
}

function rusWeeksEnd(number){
    var endIndex = rusNumbersEnd(number);
    if(endIndex == 1) return 'я';
    else if(endIndex == 2) return 'и';
    else return 'ь';
}

function rusDaysEnd(number){
    var endIndex = rusNumbersEnd(number);
    if(endIndex == 1) return 'ень';
    else if(endIndex == 2) return 'ня';
    else return 'ней';
}

function rusMonthsEnd(number){
    var endIndex = rusNumbersEnd(number);
    if(endIndex == 1) return '';
    else if(endIndex == 2) return 'а';
    else return 'ев';
}