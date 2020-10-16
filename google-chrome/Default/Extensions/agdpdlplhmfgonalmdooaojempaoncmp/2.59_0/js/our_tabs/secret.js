document.addEventListener('DOMContentLoaded', function() {
    var settings = chrome.extension.getBackgroundPage().getSettings();
    if(settings){
        if(settings.recommendation && settings.recommendation == 2){
            $('#checkbox-recommendation-toggle-id').prop('checked', true);
        }
    }
    else{

    }


    function setSettingViaCheckbox(options){
        if(options.id.match('input')){
            $('#' + options.id)[0].addEventListener("input", function(){
                chrome.extension.getBackgroundPage().setSpecialSetting({
                    name: options.name, value: $(this).val().trim()
                });
            });
        }
        else {
            $('#' + options.id).change(function () {
                if ($(this).attr('id').match('select')) {
                    chrome.extension.getBackgroundPage().setSpecialSetting({
                        name: options.name, value: $(this).val()
                    });
                }
                else {
                    if ($(this).prop('checked')) {
                        chrome.extension.getBackgroundPage().setSpecialSetting({
                            name: options.name, value: 2
                        });
                    }
                    else {
                        chrome.extension.getBackgroundPage().setSpecialSetting({
                            name: options.name, value: 1
                        });
                    }
                }
            });
        }
    }


    function setSettingViaCheckboxLoop(array){
        for(var i in array){
            setSettingViaCheckbox({id : array[i].id, name : array[i].name});
        }
    }

    setSettingViaCheckboxLoop([
        {id : 'checkbox-recommendation-toggle-id', name : 'recommendation'}
    ]);
});