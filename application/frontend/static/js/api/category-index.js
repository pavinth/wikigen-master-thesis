var CategoryIndex = {
    collapses: [
        'daysSurvivedGraph',
        'revisionSurvivedGraph',
        'anchorStrengthGraph',
        'reIntroductionGraphHolder'
    ],
    buttonsToGenerate: [
        {
            href: 'daysSurvivedGraph',
            elementIdentifier: 'days-survived-graph-button',
            content: 'Days Survived',
            fieldToPlot: 'days_survived'
        },
        {
            href: 'anchorStrengthGraph',
            elementIdentifier: 'anchor-strength-graph-button',
            content: 'Anchor Strength',
            fieldToPlot: 'strength'
        },
        {
            href: 'revisionSurvivedGraph',
            elementIdentifier: 'revision-survived-graph-button',
            content: 'Revision Survived',
            fieldToPlot: 'revision_survived'
        },
        {
            href: 'reIntroductionGraphHolder',
            elementIdentifier: 're-introduction-graph-holder-button',
            content: 'Anchor Re-Introduction',
            fieldToPlot: 're_introductions'
        }
    ],
    renderCategories: function () {
        $('#dashboard-categories').click(function () {
            CategoryIndex.renderCategoriesTable();
        });
    },

    renderCategoriesTable: function () {
        $.getJSON("http://0.0.0.0:8000/api/v1/stats/category/", function (data) {
            var categoriesTableData = CategoryIndex.createCategoryTableData(data.results);
            $('#content-holder').html(
                Table.render(
                    categoriesTableData,
                    '<ol class="breadcrumb"><li class="breadcrumb-item active"> Categories </li></ol>',
                    "categories-dashboard"
                )
            );

            var tableMarkup = CategoryPieChart.createMarkup();

            CategoryIndex.collapses.map(collapse => {
                tableMarkup += ChartMarkup.createChart(collapse, 'canvas-' + collapse);
            });

            $('#categories-dashboard').append(tableMarkup);

            CategoryPieChart.createGraphs(categoriesTableData);
        });
    },

    hideCollapses: function (activeCollapse) {
        CategoryIndex
            .collapses
            .filter(value => value !== activeCollapse)
            .forEach(value => {
                $('#' + value).collapse('hide');
            });
    },

    renderGraphButtons: function () {
        return ChartButton.createMarkup(CategoryIndex.buttonsToGenerate);
    },

    createCategoryTableData: function (categories) {
        var storesArticles = JSON.parse(localStorage.getItem("allStoredArticles")).results;

        var anchorsToRender = categories.map(category => {
            var filteredAnchors = [];
            storesArticles.forEach(article => {
                article.anchors.forEach(anchor => {
                    if (anchor.category === category.name) {
                        filteredAnchors.push(anchor);
                    }
                });
            });

            return {
                name: category.name,
                anchorCount: filteredAnchors.length,
                averageDaysSurvived: CategoryIndex.calculateAverageDaysSurvived(filteredAnchors),
                averageRevisionSurvived: CategoryIndex.calculateAverageRevisionSurvived(filteredAnchors),
                averageReintroduction: CategoryIndex.calculateAverageReintroduction(filteredAnchors),
                averageStrength: CategoryIndex.calculateAverageAnchorStrength(filteredAnchors),
            };
        });
        return {
            "headers": [
                "Name",
                "Anchor Count",
                "Avg. Days Survived",
                "Avg. Revision Survived",
                "Avg. Re-Introduction",
                "Avg. Anchor Strength"
            ],
            "data": anchorsToRender
                .map(anchorToRender => {
                    return {
                        dataColumns: [
                            anchorToRender.name,
                            anchorToRender.anchorCount,
                            anchorToRender.averageDaysSurvived,
                            anchorToRender.averageRevisionSurvived,
                            anchorToRender.averageReintroduction,
                            anchorToRender.averageStrength
                        ],
                        actionColumn: []
                    }
                })
        };
    },

    calculateAverageAnchorStrength: function (anchors) {
        var sum = 0;
        anchors.forEach(function (anchor) {
            sum += parseFloat(anchor.strength);
        });

        return (sum / anchors.length).toFixed(2);
    },

    calculateAverageDaysSurvived: function (anchors) {
        var sum = 0;
        anchors.forEach(function (anchor) {
            sum += parseFloat(anchor.days_survived);
        });

        return (sum / anchors.length).toFixed(2);
    },
    calculateAverageRevisionSurvived: function (anchors) {
        var sum = 0;
        anchors.forEach(function (anchor) {
            sum += parseFloat(anchor.revision_survived);
        });

        return (sum / anchors.length).toFixed(2);
    },
    calculateAverageReintroduction: function (anchors) {
        var sum = 0;
        anchors.forEach(function (anchor) {
            sum += parseFloat(anchor.re_introductions);
        });

        return (sum / anchors.length).toFixed(2);
    },

    compareDates: function (first, second) {
        return new Date(first).getTime() > new Date(second).getTime();
    }
};
