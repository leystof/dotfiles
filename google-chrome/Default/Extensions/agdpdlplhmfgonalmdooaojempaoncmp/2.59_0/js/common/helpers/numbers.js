function numberWithDelimiters(number, delimiter) {
    if(!delimiter) delimiter = '`';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
}

function rusNumbersEnd(number){
    if((number % 100 > 4 && number % 100 < 20) || number == 0) return 3;
    else if(number % 10 > 4 && number % 10 < 10) return 3;
    else if(number % 10 == 1) return 1;
    else return 2;
}