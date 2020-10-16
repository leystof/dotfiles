function randomString(length, range) {
    var text = "";
    for( var i=0; i < parseInt(length); i++ ) {
        text += range.charAt(Math.floor(Math.random() * range.length));
    }
    return text;
}

