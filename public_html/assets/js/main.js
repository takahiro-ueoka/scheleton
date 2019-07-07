$(document).ready(() => {
    setup_datepicker();
    // setup_hidden_date();
    setup_date_edit();
    hide_datepicker();
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
        // altField: '#'+get_hidden_date_id(),
        // altFormat: 'yy/mm/dd',
        // onSelect: () => {
        //     $('#'+get_hidden_date_id()).change();
        // }
    });
    $('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
    $('#'+id).val("");
}

function update_datepicker_date(input_date) {
    let id = get_datepicker_id();
    $('#'+id).datepicker('setDate', input_date);
}

function export_datepicker_date() {
    let id = get_datepicker_id();
    let date = $('#'+id).val();
    if (!date || date == undefined) return;
    let date_edit_id = get_date_edit_id();
    $('#'+date_edit_id).val(date);
}

function setup_hidden_date() {
    let id = get_hidden_date_id();
    $('#'+id).change(() => {
        output_log();
    });
}

function convert_input_date(input_value) {
    if (input_value.trim == undefined) {
        console.log("no method:trim");
        return null;
    }
    input_value = input_value.trim();
    if (input_value.match == undefined) {
        console.log("no method:match");
        return null;
    }
    if (input_value.split == undefined) {
        console.log("no method:split");
        return null;
    }
    let regexp_full = /^\d{4}\/{1}\d{1,2}\/{1}\d{1,2}$/;
    if (input_value.match(regexp_full)) return input_value;
    let regexp_month_day = /^\d{1,2}\/{1}\d{0,2}$/;
    if (!input_value.match(regexp_month_day)) {
        console.log("no match");
        return null;
    }
    let items = input_value.split('/', 2);
    let default_date = new Date();
    let year = default_date.getFullYear();
    let month = items[0] || 0;
    let day = items[1] || 0;
    if (month < 1 || month > 12) {
        console.log("invalid month:" + month);
        return null;
    }
    let last_day = get_last_day_of_month(year, month);
    if (day < 1) {
        day = 1;
    }
    if (day > last_day) {
        day = last_day;
    }
    let converted_date = ('0000' + year).substr(-4) + "/" + ('00' + month).substr(-2) + "/" + ('00' + day).substr(-2);
    return converted_date;
}

function get_last_day_of_month(year, month) {
    let date = new Date(year, (month - 1) + 1, 0);
    let day = date.getDate();
    return day;
}

function hide_datepicker() {
    let id = get_date_edit_id();
    let datepicker_id = get_datepicker_id();
    let position = $('#'+id).offset();
    let height = $('#'+id).outerHeight(true);
    $('#'+datepicker_id).css({
        'display': 'none',
        'position': 'absolute',
        'left': position.left,
        'top': position.top + height
    });

    stop_watch_mouse();
}

function show_datepicker() {
    let id = get_date_edit_id();
    let datepicker_id = get_datepicker_id();

    let position = $('#'+id).offset();
    let height = $('#'+id).outerHeight(true);
    $('#'+datepicker_id).css({
        'display': 'block',
        'position': 'absolute',
        'left': position.left,
        'top': position.top + height
    });

    start_watch_mouse();
}

function is_datepicker_display() {
    let datepicker_id = get_datepicker_id();
    let datepicker_div = $('#'+datepicker_id);
    let display = datepicker_div.css('display');
    console.log({display: display});
    return (display != 'none');
}

function is_datepicker_mouseover(pageX, pageY) {
    let datepicker_id = get_datepicker_id();
    let datepicker_div = $('#'+datepicker_id);
    let offset = datepicker_div.offset();
    let minX = offset.left;
    let minY = offset.top;
    let width = datepicker_div.outerWidth();
    let height = datepicker_div.outerHeight();
    let maxX = minX + width;
    let maxY = minY + height;

    console.log({
        pageX: pageX,
        pageY: pageY,
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
    });

    // マウス X 座標がカレンダーの横幅の範囲内にないときは乗っていない
    if (pageX < minX|| pageX > maxX) return false;
    // マウス Y 座標がカレンダーの縦幅の範囲内にないときは乗っていない
    if (pageY < minY || pageY > maxY) return false;

    return true;
}

function is_day_mouseover(pageX, pageY) {
    let datepicker_id = get_datepicker_id();
    let datepicker_div = $('#'+datepicker_id);
    let day_tds = datepicker_div.find('td');
    if (day_tds.length < 1) {
        return false;
    }
    let day_number_as = day_tds.children('a.ui_state_default');
    if (day_number_as.length < 1) {
        return false;
    }
    let day_td = $(day_number_as[0]).parent();
    let offset = day_td.offset();
    let minX = offset.left;
    let minY = offset.top;
    let width = day_td.outerWidth();
    let height = day_td.outerHeight();
    let maxX = minX + width;
    let maxY = minY + height;

    console.log({
        pageX: pageX,
        pageY: pageY,
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
    });

    // マウス X 座標がセルの横幅の範囲内にないときは乗っていない
    if (pageX < minX|| pageX > maxX) return false;
    // マウス Y 座標がセルの縦幅の範囲内にないときは乗っていない
    if (pageY < minY || pageY > maxY) return false;

    return true;
}

var g_mouse = {
    pageX: 0,
    pageY: 0
};

function set_mouse(e) {
    g_mouse.pageX = e.pageX;
    g_mouse.pageY = e.pageY;
}

function get_mouse() {
    return g_mouse;
}

function start_watch_mouse() {
    $(document).on('mousemove.since_datepicker_show', (e) => {
        set_mouse(e);
    });
    $(document).on('mouseup.since_datepicker_show', (e) => {
        if (is_day_mouseover(e.pageX, e.pageY)) {
            setTimeout(() => { export_datepicker_date(); }, 100);
        }
    });
}

function stop_watch_mouse() {
    $(document).off('mousemove.since_datepicker_show');
    $(document).off('mouseup.since_datepicker_show');
}

function setup_date_edit() {
    let id = get_date_edit_id();

    // イベント設定
    $('#'+id).focus(() => {
        if (!is_datepicker_display()) {
            show_datepicker();
        }
    });
    $('#'+id).blur(() => {
        let mouse = get_mouse();
        if (is_datepicker_mouseover(mouse.pageX, mouse.pageY)) {
            setTimeout(() => { $('#'+id).focus(); }, 100);
        } else {
            hide_datepicker();
        }
    });
    $('#'+id).keyup(() => {
        let input_value = $('#'+id).val();
        let input_date = convert_input_date(input_value);
        if (input_date) {
            update_datepicker_date(input_date);
        }
    });
}

function output_log() {
    let datepicker_id = get_datepicker_id();
    // let hidden_date_id = get_hidden_date_id();
    let log = {
        datepicker_value: $('#'+datepicker_id).val(),
        // hidden_date_value: $('#'+hidden_date_id).val()
    };
    console.log(log);
}

function get_datepicker_id() {
    return 'datepicker';
}

function get_hidden_date_id() {
    return 'hidden_date';
}

function get_date_edit_id() {
    return 'date_edit';
}