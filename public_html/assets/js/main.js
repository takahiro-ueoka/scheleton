$(() => {
    let id = get_datepicker_id();
    $('#'+id).datepicker({
        dateFormat: 'yy/mm/dd',
        beforeShow: function () {
            setTimeout(function () {
                $('.ui-datepicker').css('z-index', 99999999999999);
            }, 0);
        },
        altField: '#'+get_hidden_date_id(),
        altFormat: 'yy/mm/dd'
    });
});

function get_datepicker_id() {
    return 'datepicker';
}

function get_hidden_date_id() {
    return 'hidden_date';
}