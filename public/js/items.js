$(function() {
    $('.editable').focus(function() {
        $(this).data('initialValue', $(this).html());
    }).blur(function() {
        var text = $(this).html();
        if ($(this).data('initialValue') !== text) {
            $.ajax({
                type: 'PUT',
                url: '/item/' + $(this).attr('for-item'),
                contentType: 'application/json; charset=uft-8',
                data: JSON.stringify({
                    text: text.replace(/^\s+|\s+$/g, '')
                }),
                success: function(result) {
                    console.info('Success: ', result);
                },
                error: function(result) {
                    console.error('Error: ', result);
                }
            });
        }
    });
});
