var DateRangePicker = {
    dateFormat: "YYYY-MM-DD",

    setDefaultDates: function (collapse) {
        $('#' + collapse + '-from')
            .datepicker('setDate', moment('2001-01-01').format(DateRangePicker.dateFormat));

        $('#' + collapse + '-to').datepicker('setDate', moment().format(DateRangePicker.dateFormat));
    },

    setUserDefinedDefaultDates: function (collapse, fromDate, toDate) {
        $('#' + collapse + '-from')
            .datepicker('setDate', fromDate.format(DateRangePicker.dateFormat));

        $('#' + collapse + '-to').datepicker('setDate', toDate.format(DateRangePicker.dateFormat));
    },

    createDatePickers: function (fromId, toId) {
        var from = $('#' + fromId)
            .datepicker({
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                dateFormat: 'yy-mm-dd'
            }).on("change", function () {
                $('#' + fromId).attr('value', $(this).val());
                to.datepicker("option", "minDate", DateRangePicker.getDate(this));
            });

        var to = $('#' + toId).datepicker({
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            dateFormat: 'yy-mm-dd'
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