function numberWithDelimiters(number, delimiter) {
    if(!delimiter) delimiter = '`';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
}


