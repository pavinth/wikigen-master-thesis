var DateRangePicker = {
    dateFormat: "dd-mm-yy",

    setDefaultDates: function (collapse) {
        $('#' + collapse + '-from')
            .datepicker('setDate', moment().subtract(10, "years").format(DateRangePicker.dateFormat));

        $('#' + collapse + '-to').datepicker('setDate', moment().format(DateRangePicker.dateFormat));
    },

    createDatePickers: function (fromId, toId) {
        var from = $('#' + fromId)
            .datepicker({
                defaultDate: "-10y",
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1
            }).on("change", function () {
                $('#' + fromId).attr('value', $(this).val());
                to.datepicker("option", "minDate", DateRangePicker.getDate(this));
            });

        var to = $('#' + toId).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1
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