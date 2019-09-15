$(function () {
    var selectedArticle = localStorage.getItem("selected_article");

    $.ajax({
        async: false,
        url: 'http://0.0.0.0:8000/api/v1/stats/article/',
        method: 'GET',
        statusCode: {
            200: function (data) {
                $.each(data.results, function (idx, article) {
                    if (article.title === selectedArticle) {
                        localStorage.setItem("selected_article_id", article.id);
                    }
                });
            }
        }
    });
});

var AnchorStorage = {
    store: function (anchorList) {
        $.each(anchorList, function (idx, anchor) {
            anchor.first_seen = anchor.first_seen.toJSON().slice(0, 10);
            anchor.last_seen = anchor.last_seen.toJSON().slice(0, 10);

            console.log(anchor);

            $.ajax({
                url: 'http://0.0.0.0:8000/api/v1/stats/article/',
                headers: {"X-CSRFToken": getCookie('csrftoken')},
                method: 'POST',
                data: anchor,
                statusCode: {
                    201: function (data) {
                        console.log(data);
                    }
                }
            });
        });
    },
    fetchAnchors: function (convertedData) {
        $.ajax({
            async: false,
            url: 'http://0.0.0.0:8000/api/v1/stats/article/' + localStorage.getItem("selected_article_id") + '/anchor',
            method: 'GET',
            statusCode: {
                200: function (data) {
                    if (data.count > 0) {
                        console.log(data);
                        AnchorStorage.renderStoredAnchors(data.result, data.count);
                    } else {
                        AnchorStorage.renderStoredAnchors(AnchorStorage.cleanUpData(convertedData));
                    }
                }
            }
        });
    },

    cleanUpData: function (rawData) {
        var cleaned = [];
        $.each(rawData, function (idx, data) {
            var anchor = data[0].replace(/<[^>]+>/g, '');
            var storableAnchor = {
                "anchor": anchor,
                "title": anchor,
                "days_survived": data[1],
                "revision_survived": data[2],
                "re_introductions": data[3],
                "strength": data[4],
                "first_seen": new Date(data[5]),
                "last_seen": new Date(data[6]),
                //"category": "not_categorized",
                "article": localStorage.getItem('selected_article')
            };

            cleaned.push(storableAnchor);
        });

        return cleaned;
    },

    renderStoredAnchors: function (anchors, anchorCount) {
        var result = [];

        $.each(anchors, function (ixd, anchor) {
            var row = [];
            row.push("<a href='#anchor_chronology_part' class='anchor_element'>" + anchor.title + "</a>");
            row.push(anchor.days_survived);
            row.push(anchor.revision_survived);
            row.push(anchor.re_introductions);
            row.push(anchor.strength);
            row.push(anchor.first_seen.toJSON().slice(0, 10));
            row.push(anchor.last_seen.toJSON().slice(0, 10));
            row.push('<span id="category-select-container-' + anchor.title + '"></span>');
            result.push(row);
        });

        $('#anchor_table').dataTable(
            {
                "responsive": true,
                "aaData": result,
                "aaSorting": [[4, "desc"]],
                "bAutoWidth": false,
                "aoColumns": [
                    {"sTitle": "Anchor", "sClass": "center", "sWidth": "20%"},
                    {"sTitle": "Days Survived", "sClass": "left", "sWidth": "10%"},
                    {"sTitle": "Revisions Survived", "sClass": "left", "sWidth": "10%"},
                    {"sTitle": "(Re)Introductions", "sClass": "left", "sWidth": "10%"},
                    {"sTitle": "Anchor Strength", "sClass": "left", "sWidth": "10%"},
                    {"sTitle": "First Seen", "sClass": "left", "sWidth": "10%"},
                    {"sTitle": "Last Seen", "sClass": "left", "sWidth": "10%"},
                    {"sTitle": "Category", "sClass": "center", "sWidth": "40%"}
                ]
            }
        );

        localStorage.setItem('anchor_count', anchorCount);
        AnchorStorage.createCategoryForm(anchors);
    },

    createCategoryForm: function (anchors) {
        $.each(anchors, function (ixd, anchor) {
            AnchorStorage.createCategoryDropDown(anchor.category, anchor.title);
            if ('not_categorized' === anchor.category) {
                var markup = $('category-select-' + anchor.title).html();
                markup += '<a href="#"><i class="fas fa-save"></i></a>';

                $('#category-select-container-' + anchor.title).html(markup);
            }
        });
    },

    createCategoryDropDown: function (selectedCategory, anchorTitle) {
        var GET_CAT_URL = 'http://0.0.0.0:8000/api/v1/stats/category/';

        $.ajax({
            async: false,
            url: GET_CAT_URL,
            method: 'GET',
            statusCode: {
                200: function (data) {
                    AnchorStorage.getCategorySelectMarkup(data.results, selectedCategory, anchorTitle);
                }
            }
        });
    },

    getCategorySelectMarkup: function (categoryList, selected, anchorTitle) {
        var markup = '<select id="category-select-' + anchorTitle + '">';

        markup += '<option>Select Category </option>';
        markup += '<option> add new </option>';
        $.each(categoryList, function (ixd, category) {
            markup += '<option>' + category.name + '</option>';
        });

        markup += '</select></span>';

        $('.category-list').append(markup);
    }
};
