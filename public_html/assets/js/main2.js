var datepicker2array = [];

$(document).ready(() => {
    let ids = [
        'date_edit',
        'date_edit_2',
        'date_edit_3',
    ];
    $(ids).each((i, id) => {
        let element = $('#'+id)[0];
        let onApply = () => {
            let date = $('#'+id).val();
            console.log("" + id + " => " + date);
        };
        let datepicker2 = new Datepicker2(element, onApply); 
        datepicker2array.push(datepicker2); 
    });
});
