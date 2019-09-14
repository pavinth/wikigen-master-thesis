$(function () {
    $('#categoryTable').hide();
    $('#anchorTable').hide();
    $.getJSON("http://0.0.0.0:8000/api/v1/stats/article/", function (data) {

        renderArticlesList(data.results);

        $('.articleDetailInfo').click(function () {

            $('#anchor-list').html('');
            $('#anchorTable').hide();
            var articleId = $(this).attr("id");

            $.getJSON("http://0.0.0.0:8000/api/v1/stats/article/" + articleId + "/anchor/", function (data) {
                renderCategoryList(groupAnchorsByCategory(data.results));
                $('#categoryTable').show();
            });
        });
    });

    $("#wikigen-logo").click(function () {
        window.location.replace("http://0.0.0.0:8000/");
    });


    $("#change_article").click(function () {
        window.location.replace("http://0.0.0.0:8000/");
    });
});

function renderArticlesList(results) {
    var articlesListMarkup = '';
    $.each(results, function (key, value) {
        articlesListMarkup += '<tr>';
        articlesListMarkup += '<td><p class="articleDetailInfo" id="' + value.id + '">' + value.title + '</td>';
        articlesListMarkup += '<td><p>' + value.category_count + '</p></td>';
        articlesListMarkup += '<td>' + value.total_anchor_count + '</td>';
        articlesListMarkup += '</tr>';
    });
    $('#article-list').html(articlesListMarkup);
}

function renderCategoryList(result) {
    var categoryList = '';
    $.each(result, function (categoryName, anchors) {
        categoryList += '<tr>';
        categoryList += '<td><p class="category_name" id="' + categoryName + '">' + categoryName + '</p></td>';
        categoryList += '<td><p>' + anchors.length + '</p></td>';
        categoryList += '</tr>';
    });


    $('#category-list').html(categoryList);

    $(".category_name").click(function () {
        $("#anchorTable").show();

        var categoryName = $(this).attr("id");
        renderAnchors(flattenedAnchors(result[categoryName]));
    });
}

function renderAnchors(anchors) {
    var daysSurvived = [];
    var reIntroductions = [];
    var revisionSurvived = [];
    var strength = [];
    var earliestFirstSeen = anchors[0].first_seen;
    var latestLastSeen = anchors[0].last_seen;

    var anchorList = '';

    $.each(anchors, function (id, anchor) {
        daysSurvived.push(anchor.days_survived);
        reIntroductions.push(anchor.re_introductions);
        revisionSurvived.push(anchor.revision_survived);
        strength.push(anchor.strength);

        if (compareDates(earliestFirstSeen, anchor.first_seen)) {
            earliestFirstSeen = anchor.first_seen;
        }

        if (!compareDates(latestLastSeen, anchor.last_seen)) {
            latestLastSeen = anchor.last_seen;
        }

        anchorList += '<tr>';
        anchorList += '<td>' + anchor.category + '</td>';
        anchorList += '<td>' + anchor.anchor + '</td>';
        anchorList += '<td>' + anchor.days_survived + '</td>';
        anchorList += '<td>' + anchor.revision_survived + '</td>';
        anchorList += '<td>' + anchor.re_introductions + '</td>';
        anchorList += '<td>' + anchor.strength + '</td>';
        anchorList += '<td>' + anchor.first_seen + '</td>';
        anchorList += '<td>' + anchor.last_seen + '</td>';
        anchorList += '</tr>';
    });

    anchorList += '<tr>';
    anchorList += '<td><strong>Average</strong></td>';
    anchorList += '<td></td>';
    anchorList += '<td>' + calculateAverage(daysSurvived) + '</td>';
    anchorList += '<td>' + calculateAverage(revisionSurvived) + '</td>';
    anchorList += '<td>' + calculateAverage(reIntroductions) + '</td>';
    anchorList += '<td>' + calculateAverage(strength) + '</td>';
    anchorList += '<td>' + earliestFirstSeen + '</td>';
    anchorList += '<td>' + latestLastSeen + '</td>';
    anchorList += '</tr>';
    anchorList += '</tr>';

    $('#anchor-list').html(anchorList);
}

function compareDates(first, second) {
    return new Date(first).getTime() > new Date(second).getTime();
}

function calculateAverage(values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        sum += parseFloat(values[i]);
    }
    return (sum / values.length).toFixed(2);
}

function flattenedAnchors(grouped) {
    var flattened = [];
    $.each(grouped, function (id, anchors) {
        flattened.push(anchors['anchors']);
    });

    return flattened;
}

function groupAnchorsByCategory(unGroupedData) {
    var dataToDisplay = {};
    var final = {};

    var categories = [];

    $.each(unGroupedData, function (key, value) {
        categories.push({
            "category_name": value.category,
            "anchors": value
        });
        final[value.category] = [];
        dataToDisplay[value.category] = categories;
    });

    $.each(dataToDisplay, function (categoryName, anchors) {
        $.each(anchors, function (key, anchor) {
            if (anchor.category_name === categoryName) {
                final[categoryName].push(anchor);
            }
        });
    });

    return final;
}