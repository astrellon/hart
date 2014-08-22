$(function() {
    $('.editable').focus(function() {
        $(this).data('initialValue', $(this).text());
    }).blur(function() {
        var text = $(this).text();
        if ($(this).data('initialValue') !== text) {
        }
    });
});
