var datepicker2 = null;

$(document).ready(() => {
    let id = 'date_edit';
    let element = $('#'+id)[0];
    let onApply = () => {
        console.log("test");
    };
    datepicker2 = new Datepicker2(element, onApply);
});
