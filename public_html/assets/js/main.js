$(() => {
    setup_datepicker();
    setup_hidden_date();
});

function setup_datepicker() {
    let id = get_datepicker_id();
    $('#'+id).datepicker({
        dateFormat: 'yy/mm/dd',
        beforeShow: function () {
            setTimeout(function () {
                $('.ui-datepicker').css('z-index', 99999999999999);
            }, 0);
        },
        altField: '#'+get_hidden_date_id(),
        altFormat: 'yy/mm/dd',
        onSelect: () => {
            $('#'+get_hidden_date_id()).change();
        }
    });
    $('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
    $('#'+id).val("");
}

function setup_hidden_date() {
    let id = get_hidden_date_id();
    $('#'+id).change(() => {
        output_log();
    });
}

function output_log() {
    let datepicker_id = get_datepicker_id();
    let hidden_date_id = get_hidden_date_id();
    let log = {
        datepicker_value: $('#'+datepicker_id).val(),
        hidden_date_value: $('#'+hidden_date_id).val()
    };
    console.log(log);
}

function get_datepicker_id() {
    return 'datepicker';
}

function get_hidden_date_id() {
    return 'hidden_date';
}