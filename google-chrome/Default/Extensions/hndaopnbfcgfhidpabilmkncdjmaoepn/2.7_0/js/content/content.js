function copyToClipboard(text) {
    const input = document.createElement('input');
    input.style.position = 'fixed';
    input.style.opacity = 0;
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('Copy');
    document.body.removeChild(input);
};


function updateCircleProgress(chartObj){
    percent = parseInt(chartObj.data('percent'));
    deg = 360*percent/100;
    if (percent > 50) {
        chartObj.addClass('fua-circle-load-gt-50');
    }
    chartObj.find('.fua-circle-load-ppc-progress-fill').css('transform','rotate('+ deg +'deg) ');
    chartObj.find('.fua-circle-load-ppc-percents span').html(percent+'%');
}