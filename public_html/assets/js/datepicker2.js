/**
 * jQuery datepicker 拡張機能
 * ・初期化時、input text 要素と、確定イベント処理の関数を設定します。
 * ・input text 要素がフォーカスされるとカレンダーが表示されます 
 * ・input text へのテキスト入力を補完して日付選択します（月/日 の入力を、現在年/月/日 とします）
 * ・選択された日付でOKならエンターキーを押して確定イベントを実行します（確定してもカレンダーは閉じません）
 * 　　※確定処理は、テキスト入力内容が 月/日 もしくは 年/月/日 のフォーマットにマッチしていなければ実行されません。
 * ・カレンダー上で日付をクリックすることでテキスト入力へ反映します
 * ・マウスがカレンダー上にないときにフォーカスが外れるとカレンダーを閉じます
 */
var Datepicker2 = class {

    /**
     * コンストラクタ
     * @param {*} element input text 要素 
     * @param {*} onApply 確定処理関数
     */
    constructor(element, onApply) {
        this.onApply = onApply;
        this.inputId = this.getValidatedId(element);
        this.datepickerId = this.createDatepicker();
        this.mouse = {
            pageX: 0,
            pageY: 0
        };
        this.setupInput();
        this.hide_datepicker();
    }

    /**
     * ランダム ID を取得します
     */
    getRandomId() {
        // 生成する文字列の長さ
        var l = 8;

        // 生成する文字列に含める文字セット
        var c = "abcdefghijklmnopqrstuvwxyz0123456789";

        var cl = c.length;
        var r = "datepicker2_";
        for (var i = 0; i < l; i++) {
            r += c[Math.floor(Math.random() * cl)];
        }

        return r;
    }


    /**
     * input text 要素の ID を検証（未設定の場合は自動設定）して取得します
     */
    getValidatedId(element) {
        let self = this;
        if (!element || element == undefined) throw "no element";

        let newElementId = $(element).attr('id');
        if (!newElementId || newElementId == undefined || newElementId.length < 1) {
            newElementId = self.getRandomId();
            $(element).attr('id', newElementId);
        }
        return newElementId;
    }

    /**
     * カレンダーを作成します（既に存在する場合は削除して再作成）
     * @returns 作成されたカレンダー要素の id
     */
    createDatepicker() {
        let self = this;
        let inputId = self.inputId;
        let id = inputId + "_datepicker";
        let datepickerDiv = $('#'+id);
        if (datepickerDiv.length > 0) {
            datepickerDiv.remove();
        }
        let element = $('#'+ inputId)[0];
        if (!element || element == undefined) throw "no date edit element";
        datepickerDiv = $('<div>');
        datepickerDiv.attr(id);
        $(element).after(datepickerDiv);
        datepickerDiv.datepicker({
            dateFormat: 'yy/mm/dd',
            beforeShow: function () {
                setTimeout(function () {
                    $('#'+id).find('.ui-datepicker').css('z-index', 99999999999999);
                }, 0);
            }
        });
        datepickerDiv.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day');
        datepickerDiv.val("");

        return id;
    }

    /**
     * カレンダーの日付を更新します
     * @param {*} inputDate 更新する日付文字列
     */
    updateDatepickerDate(inputDate) {
        let id = this.datepickerId;
        $('#'+id).datepicker('setDate', inputDate);
    }

    /**
     * カレンダーの日付を input text へ反映します
     */
    exportDatepickerDate() {
        let id = this.datepickerId;
        let date = $('#'+id).val();
        if (!date || date == undefined) return;
        let inputId = this.inputId;
        $('#'+inputId).val(date);
    }
    
    /**
     * 入力文字列をカレンダー用の日付文字列へ変換して返します
     * 変換できない場合は null を返します
     * @param {*} input_value 入力文字列
     * @returns 変換後の日付文字列（変換できない場合は　null ）
     */
    convertInputDate(input_value) {
        let self = this;
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
        let last_day = self.getLastDayOfMonth(year, month);
        if (day < 1) {
            day = 1;
        }
        if (day > last_day) {
            day = last_day;
        }
        let converted_date = ('0000' + year).substr(-4) + "/" + ('00' + month).substr(-2) + "/" + ('00' + day).substr(-2);
        return converted_date;
    }
    
    /**
     * 指定した年・月の最終日付を返します
     * @param {*} year 年
     * @param {*} month 月（1～12）
     * @returns 指定した年・月の最終日付
     */
    getLastDayOfMonth(year, month) {
        let date = new Date(year, (month - 1) + 1, 0);
        let day = date.getDate();
        return day;
    }
    
    /**
     * カレンダーを非表示にします
     */
    hide_datepicker() {
        let self = this;
        let id = self.inputId;
        let datepicker_id = self.datepickerId;
        let position = $('#'+id).offset();
        let height = $('#'+id).outerHeight(true);
        $('#'+datepicker_id).css({
            'display': 'none',
            'position': 'absolute',
            'left': position.left,
            'top': position.top + height
        });
    
        self.stop_watch_mouse();
    }
    
    /**
     * カレンダーを表示します
     */
    show_datepicker() {
        let self = this;
        let id = self.inputId;
        let datepicker_id = self.datepickerId;
    
        let position = $('#'+id).offset();
        let height = $('#'+id).outerHeight(true);
        $('#'+datepicker_id).css({
            'display': 'block',
            'position': 'absolute',
            'left': position.left,
            'top': position.top + height
        });
    
        self.start_watch_mouse();
    }

    /**
     * カレンダーが表示中かどうかを判定します
     * @returns 表示中の場合 true
     */
    is_datepicker_display() {
        let self = this;
        let datepicker_id = self.datepickerId;
        let datepicker_div = $('#'+datepicker_id);
        let display = datepicker_div.css('display');
        return (display != 'none');
    }
    
    /**
     * カレンダーにマウス座標が重なっているかどうかを判定します
     * @param {*} pageX document を基準とするマウス座標 X
     * @param {*} pageY document を基準とするマウス座標 Y
     * @returns 重なっている場合 true
     */
    is_datepicker_mouseover(pageX, pageY) {
        let self = this;
        let datepicker_id = self.datepickerId;
        let datepicker_div = $('#'+datepicker_id);
        let offset = datepicker_div.offset();
        let minX = offset.left;
        let minY = offset.top;
        let width = datepicker_div.outerWidth();
        let height = datepicker_div.outerHeight();
        let maxX = minX + width;
        let maxY = minY + height;
    
        // マウス X 座標がカレンダーの横幅の範囲内にないときは乗っていない
        if (pageX < minX|| pageX > maxX) return false;
        // マウス Y 座標がカレンダーの縦幅の範囲内にないときは乗っていない
        if (pageY < minY || pageY > maxY) return false;
    
        return true;
    }

    /**
     * カレンダー内の日付にマウス座標が重なっているかどうかを判定します
     * @param {*} pageX document を基準とするマウス座標 X
     * @param {*} pageY document を基準とするマウス座標 Y
     * @returns 重なっている場合 true
     */
    is_day_mouseover(pageX, pageY) {
        let self = this;
        let datepicker_id = self.datepickerId;
        let datepicker_div = $('#'+datepicker_id);
        let day_tds = datepicker_div.find('td');
        if (day_tds.length < 1) {
            console.log('no tds');
            return false;
        }
        let day_number_as = day_tds.find('a.ui-state-default');
        if (day_number_as.length < 1) {
            console.log('no as');
            return false;
        }
        let found = null;
        day_number_as.each((i, day_number_a) => {
            if (found) return;
            let day_td = $(day_number_a).parent();
            let offset = day_td.offset();
            let minX = offset.left;
            let minY = offset.top;
            let width = day_td.outerWidth();
            let height = day_td.outerHeight();
            let maxX = minX + width;
            let maxY = minY + height;
            // マウス X 座標がセルの横幅の範囲内にないときは乗っていない
            if (pageX < minX|| pageX > maxX) return;
            // マウス Y 座標がセルの縦幅の範囲内にないときは乗っていない
            if (pageY < minY || pageY > maxY) return;
            
            found = day_number_a;
        });
    
        let result = (found) ? true : false;
    
        return result;
    }

    /**
     * マウス座標を設定します
     * @param {*} e マウスイベントのパラメータ
     */
    set_mouse(e) {
        this.mouse.pageX = e.pageX;
        this.mouse.pageY = e.pageY;
    }
    
    /**
     * マウス座標を取得します
     * @returns マウス座標データ（pageX, pageY のプロパティを含む）
     */
    get_mouse() {
        return this.mouse;
    }
    
    /**
     * マウス監視処理を開始します
     */
    start_watch_mouse() {
        let self = this;
        let id = self.datepickerId;
        $(document).on('mousemove.since_datepicker_show_'+id, (e) => {
            self.set_mouse(e);
        });
        $(document).on('mouseup.since_datepicker_show_'+id, (e) => {
            if (self.is_day_mouseover(e.pageX, e.pageY)) {
                setTimeout(() => { self.export_datepicker_date(); }, 100);
            }
        });
    }

    /**
     * マウス監視処理を終了します
     */
    stop_watch_mouse() {
        let self = this;
        let id = self.datepickerId;
        $(document).off('mousemove.since_datepicker_show_'+id);
        $(document).off('mouseup.since_datepicker_show_'+id);
    }

    /**
     * input text の初期化処理
     */
    setupInput() {
        let self = this;
        let id = self.inputId;
    
        // イベント設定
        $('#'+id).focus(() => {
            if (!self.is_datepicker_display()) {
                self.show_datepicker();
            }
        });
        $('#'+id).blur(() => {
            let mouse = self.get_mouse();
            if (self.is_datepicker_mouseover(mouse.pageX, mouse.pageY)) {
                setTimeout(() => { $('#'+id).focus(); }, 100);
            } else {
                self.hide_datepicker();
            }
        });
        $('#'+id).keyup(() => {
            let input_value = $('#'+id).val();
            let input_date = self.convert_input_date(input_value);
            if (input_date) {
                self.update_datepicker_date(input_date);
            }
        });
    }
};

