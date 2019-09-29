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

    renderCategoryPieCharts: function (categoriesTableData) {
        console.log(categoriesTableData);
    },

    renderCategoriesTable: function () {
        $.getJSON("http://0.0.0.0:8000/api/v1/stats/category/", function (data) {
            var categoriesTableData = CategoryIndex.createCategoryTableData(data.results);
            $('#content-holder').html(
                Table.render(
                    categoriesTableData,
                    "Categories",
                    "categories-dashboard"
                )
            );

            var tableMarkup = CategoryPieChart.createMarkup() + CategoryIndex.renderGraphButtons();

            CategoryIndex.collapses.map(collapse => {
                tableMarkup += ChartMarkup.createChart(collapse, 'canvas-' + collapse);
            });

            $('#categories-dashboard').append(tableMarkup);

            CategoryIndex.collapses.forEach(collapse => {
                $('#' + collapse).on('show.bs.collapse', function () {
                    CategoryIndex.hideCollapses(collapse);
                });
            });

            CategoryIndex
                .collapses
                .forEach(collapse => {
                    DateRangePicker.createDatePickers(collapse + "-from", collapse + '-to');
                    DateRangePicker.setDefaultDates(collapse);
                });

            CategoryIndex
                .collapses
                .forEach(collapse => {
                    $('#refresh-' + collapse).click(function () {
                        var dateRange = {
                            fromDate: $('#' + collapse + '-from').datepicker('getDate'),
                            toDate: $('#' + collapse + '-to').datepicker('getDate')
                        };

                        var fieldToPlot = CategoryIndex.buttonsToGenerate.filter(button => button.href === collapse);
                        Charts.createDaysSurvivedChart(
                            data.results,
                            fieldToPlot[0].fieldToPlot,
                            'canvas-' + collapse,
                            dateRange
                        );
                    });
                });
            CategoryPieChart.createGraphs(categoriesTableData);
            $('#refresh-daysSurvivedGraph').trigger('click');
            $('#refresh-revisionSurvivedGraph').trigger('click');
            $('#refresh-anchorStrengthGraph').trigger('click');
            $('#refresh-reIntroductionGraphHolder').trigger('click');

            $('#days-survived-graph-button').trigger('click');
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
                firstSeen: CategoryIndex.calculateFirstSeen(filteredAnchors),
                lastSeen: CategoryIndex.calculateLastSeen(filteredAnchors)
            };
        });
        return {
            "headers": [
                "Name",
                "Anchor Count",
                "Avg. Days Survived",
                "Avg. Revision Survived",
                "Avg. Re-Introduction",
                "First Seen",
                "Last Seen"
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
                            anchorToRender.firstSeen,
                            anchorToRender.lastSeen,
                        ],
                        actionColumn: []
                    }
                })
        };
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

    calculateFirstSeen(anchors) {
        var earliestFirstSeen = anchors[0].first_seen;
        anchors.forEach(function (anchor) {
            if (CategoryIndex.compareDates(earliestFirstSeen, anchor.first_seen)) {
                earliestFirstSeen = anchor.first_seen;
            }
        });

        return earliestFirstSeen;
    },

    calculateLastSeen(anchors) {
        var latestLastSeen = anchors[0].last_seen;
        anchors.forEach(function (anchor) {
            if (CategoryIndex.compareDates(anchor.last_seen, latestLastSeen)) {
                latestLastSeen = anchor.last_seen;
            }
        });

        return latestLastSeen;
    },

    compareDates: function (first, second) {
        return new Date(first).getTime() > new Date(second).getTime();
    }
};
