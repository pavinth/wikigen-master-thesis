var ChartButton = {
    createMarkup: function (buttons) {
        var result = '<div class="card-group">';

        buttons.forEach(button => {
            result += ChartButton.button(button.href, button.elementIdentifier, button.content, button.fieldToPlot)
        });

        result += '</div>';

        return result;
    },

    wrap: function (button) {
        return '<div class="alert alert-dark" role="alert">' + button + '</div> &nbsp;&nbsp;&nbsp;';
    },

    button: function (href, elementIdentifier, content, data) {
        var attributes = [
            'class="btn btn-light"',
            'data-toggle="collapse"',
            'href="#' + href + '"',
            'data="' + data + '"',
            'id="' + elementIdentifier + '"',
            'role="button"',
            'aria-expanded="false"',
            'aria-controls="' + elementIdentifier + '"'
        ];
        var attribute = '';
        attributes.map(attr => {
            attribute += attr;
        });

        return ChartButton.wrap('<a ' + attribute + '><i class="fas fa-chart-line"></i>&nbsp;&nbsp;' + content + '</a>');
    }
};