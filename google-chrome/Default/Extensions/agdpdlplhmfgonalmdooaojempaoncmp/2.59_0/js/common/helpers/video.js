function getScreenShot(videoObj){
    var canvas = document.createElement("canvas");
    var video = videoObj;
    video.pause();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    var base64dataUrl = canvas.toDataURL();
    return base64dataUrl;
}