function encode64(input) {
	var output = "", i = 0, l = input.length,
	key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", 
	chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	while (i < l) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) enc3 = enc4 = 64;
		else if (isNaN(chr3)) enc4 = 64;
		output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
	}
    console.log("b64return");
	return output;
}


//var superTestString = '';

/*function asynchronousEncode64(input){
    //var input = options.input;



    var output = "", i = 0, l = input.length, n = 0,
        key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        chr1, chr2, chr3, enc1, enc2, enc3, enc4;

    var count = 0;

    console.log("input-length", l);

    function encode64(){
        while (n < l && count < 100000) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) enc3 = enc4 = 64;
            else if (isNaN(chr3)) enc4 = 64;
            output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
            count = count + 3;
            input = input.substr(3);
            i= 0;
            n = n + 3;
        }

        if(n < l){
            count = 0;
            setTimeout(function(){
                //superTestString += output;
                superTestArray.push(output);
                output = '';

                setTimeout(function(){
                    console.log("base64Break", n);
                    encode64();
                }, 200);
            }, 200);
        }
        else{
            console.log("Base64-Finish");
            chrome.downloads.download({
                url :'data:image/gif;base64,' + superTestString,
                filename : 'Gif-test.gif',
                saveAs:   true
            });
        }
    }

    encode64();
}*/


