var DateRangePicker = {
    dateFormat: "DD-MM-YYYY",

    setDefaultDates: function (collapse) {
        $('#' + collapse + '-from')
            .datepicker('setDate', moment('01-01-2001').format(DateRangePicker.dateFormat));

        $('#' + collapse + '-to').datepicker('setDate', moment().format(DateRangePicker.dateFormat));
    },

    createDatePickers: function (fromId, toId) {
        var from = $('#' + fromId)
            .datepicker({
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                dateFormat: 'dd-mm-yy'
            }).on("change", function () {
                $('#' + fromId).attr('value', $(this).val());
                to.datepicker("option", "minDate", DateRangePicker.getDate(this));
            });

        var to = $('#' + toId).datepicker({
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            dateFormat: 'dd-mm-yy'
        }).on("change", function () {
            $('#' + toId).attr('value', $(this).val());
            from.datepicker("option", "maxDate", DateRangePicker.getDate(this));
        });
    },
    getDate: function (element) {
        var date;
        try {
            date = moment(element.value).format(DateRangePicker.dateFormat);
        } catch (error) {
            date = null;
        }

        return date;
    }
};