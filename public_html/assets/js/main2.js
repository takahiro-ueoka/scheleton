var datepicker2 = null;

$(document).ready(() => {
    let id = 'date_edit';
    let element = $('#'+id)[0];
    let onApply = () => {
        let date = $('#'+id).val();
        console.log(date);
    };
    datepicker2 = new Datepicker2(element, onApply);
});
