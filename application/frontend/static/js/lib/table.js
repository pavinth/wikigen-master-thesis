var Table = {
    render: function (data, tableTitle, contentIdentifier) {
        return '<div id="' + contentIdentifier + '">' + tableTitle  +
            this.createHead(data.headers) + this.createBody(data.data) + this.createTail() + '</div>';
    },

    createBody: function (data) {
        var result = '<tbody>';

        data.map(datei => {
            var dataColumn = '';
            datei.dataColumns.map(row => {
                dataColumn += '<td><div class="list-group-item">' + row + '</div></td>';
            });

            if (typeof datei.actionColumn !== 'undefined' && datei.actionColumn.length > 0) {
                dataColumn += Table.createActionColumn(datei.actionColumn);
            }

            result += '<tr>' + dataColumn + '</tr>';
        });
        result += '</tbody>';

        return result;
    },

    createHead: function (headers) {
        var result = '<table class="table table-striped table-sm"><thead><tr>';

        headers.forEach(header => {
            result += '<th scope="col"><div class="list-group-item alert alert-info">' + header + '</div></th>';
        });

        result += "</tr></thead>";

        return result;
    },

    createTail: function () {
        return "</table>";
    },

    createActionColumn: function (actionItems) {
        var result = '<td><div class="list-group-item">';

        actionItems.forEach(actionItem => {
            result += Table.createActionLink(actionItem);
        });
        result += '</div></td>';

        return result;
    },

    createActionLink: function (column) {
        return '<a href="#" title="' + column.title + '" data ="' + column.data + '" class="' + column.class + '" id="' + column.identifier + '">' + column.content + '</a>';
    }
};