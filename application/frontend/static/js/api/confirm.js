var ConfirmBox = {
    handleModel: function () {
        $('.delete-anchor').click(function () {
            $("#mi-modal").modal('show');
        });

        $("#modal-btn-yes").on("click", function () {
            console.log('confirmed');
            $("#mi-modal").modal('hide');
        });

        $("#modal-btn-no").on("click", function () {
            $("#mi-modal").modal('hide');
        });
    },

    createMarkup: function () {
        return ConfirmBox.createConfirmWrapper()
            + '<div class="modal-dialog modal-sm">'
            + ConfirmBox.createModelContent()
            + '</div></div>';
    },

    createConfirmWrapper: function () {
        return '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" id="mi-modal">';
    },

    createModelContent: function () {
        return '<div class="modal-content">' + ConfirmBox.createModelHeader() + ConfirmBox.createModelFooter();
    },

    createModelHeader: function () {
        return '<div class="modal-header">'
            + ConfirmBox.createCloseButton()
            + ConfirmBox.createModelTitle('Confirm Delete')
            + '</div>';
    },

    createModelTitle: function (content) {
        return '<h4 class="modal-title" id="myModalLabel">' + content + '</h4>';
    },

    createCloseButton: function () {
        return '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    },

    createModelFooter: function () {
        var yesButton = ConfirmBox.createButton('modal-btn-yes', "Yes");
        var noButton = ConfirmBox.createButton('modal-btn-no', "No");
        return '<div class="modal-footer">' + yesButton + noButton + '</div>';
    },
    createButton: function (identifier, content) {
        return '<button type="button" class="btn btn-default" id="' + identifier + '">' + content + '</button>';
    }
};