var ChartMarkup = {
    createChart: function (holderId, canvasId) {
        var fromInput = ChartMarkup.createInputGroup(ChartMarkup.createDatePickerInput(holderId + 'From', holderId +'-from', 'From', '01/01/2001'));
        var toInput = ChartMarkup.createInputGroup(ChartMarkup.createDatePickerInput(holderId + 'To', holderId + '-to', 'To', moment().format(DateRangePicker.dateFormat)));
        var refreshButton = ChartMarkup.createRefreshButton('refresh-' + holderId);

        var form = ChartMarkup.createDatePicker(fromInput + toInput, refreshButton);

        return ChartMarkup.createCanvasHolder(holderId, ChartMarkup.createCanvas(canvasId), form);
    },

    createCanvasHolder: function (holderId, canvas, form) {
        return '<div class="collapse" id="' + holderId + '"><div class="card card-body">' + form + canvas + '</div></div><br>';
    },

    createCanvas: function (canvasId) {
        return '<canvas id="' + canvasId + '" width="100" height="100" class="graph-canvas"></canvas>';
    },

    createInputGroup: function (input) {
        return '<div class="col-auto">' + input + '</div>';
    },

    createDatePicker: function (inputFields, refreshButton) {
        return '<div class="form-row align-items-center"> ' + inputFields + refreshButton + '</div>';
    },

    createRefreshButton: function (buttonId) {
        return '<div class="col-auto"><button type="button" id="' + buttonId + '" class="btn btn-primary mb-2">Update Graph</button></div>';
    },

    createDatePickerInput: function (name, id, label, defaultDate) {
        return ChartMarkup.createDatePickerInputLabel(label) + ChartMarkup.createDatePickerInputField(name, id, defaultDate);
    },

    createDatePickerInputLabel: function (label) {
        return '<div class="input-group mb-2"><div class="input-group-prepend"><div class="input-group-text">' + label + '</div></div>';
    },

    createDatePickerInputField: function (name, id, defaultDate) {
        return '<input class="form-control" type="text" id="' + id + '" name="' + name + '" value="' + defaultDate +'"/></div>';
    }
};