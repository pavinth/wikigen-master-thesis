var Charts = {
    createDaysSurvivedChart(categories, fieldsToPlot, canvasId, dateRange) {
        new Chart(
            ChartUtils.createContext(canvasId),
            Charts.createChartOptions(
                Charts.prepareDataToRender(categories, fieldsToPlot, dateRange),
                fieldsToPlot
            )
        );
    },

    prepareDataToRender: function (categories, fieldsToPlot, dateRange) {
        var preparedData = [];
        categories.forEach(function (category) {
            preparedData.push({
                "categoryName": category.name,
                "anchors": Charts.extractAnchorsByCategory(category.name, fieldsToPlot, dateRange)
            });
        });

        return preparedData;
    },

    extractAnchorsByCategory: function (categoryName, fieldsToPlot, dateRange) {

        var allArticles = JSON.parse(localStorage.getItem("allStoredArticles")).results;

        var selectedAnchors = [];
        allArticles.forEach(function (anchors) {
            anchors.anchors.forEach(function (anchor) {
                if (categoryName === anchor.category) {
                    selectedAnchors.push({
                        "name": anchor.anchor,
                        "first_seen": anchor.first_seen,
                        [fieldsToPlot]: anchor[fieldsToPlot]
                    });
                }
            });
        });

        return Charts.filterByDateSelection(Charts.sortAnchorsByDate(selectedAnchors), dateRange);
    },

    filterByDateSelection: function (anchors, dateRange) {
        if (dateRange.fromDate && dateRange.toDate) {
            return anchors.filter(anchor => {
                var firstSeen = moment(anchor.first_seen);
                return moment(dateRange.fromDate).isBefore(firstSeen) && moment(dateRange.toDate).isAfter(firstSeen);
            });
        }
        return anchors;
    },

    sortAnchorsByDate: function (anchors) {
        anchors.sort(function (a, b) {
            return new Date(a.first_seen) - new Date(b.first_seen);
        });

        return anchors;
    },

    createLabel: function () {
        var currentYear = parseInt(moment().year());

        var labels = [];

        for (var i = 2010; i < currentYear; i++) {
            var dateString = i + "-01-01";
            labels.push(moment(dateString).format("YYYY-MM-DD"));
        }

        return labels;
    },

    createChartOptions: function (dataToRender, filedToPlot) {
        return {
            type: 'line',
            data: {
                labels: Charts.createLabel(),
                datasets: Charts.createDataSets(dataToRender, filedToPlot)
            },
            options: ChartUtils.createOptions(filedToPlot),
            tooltips: ChartUtils.createToolTip()
        };
    },

    createDataSets: function (dataToRender, filedToPlot) {
        var dataSets = [];

        dataToRender.forEach(function (data) {
            var dataSet = ChartUtils.createDataSet(
                {
                    "points": Charts.createPoints(data.anchors, filedToPlot),
                    "label": data.categoryName
                }
            );

            dataSets.push(dataSet);
        });

        return dataSets;
    },

    createPoints: function (anchors, filedToPlot) {
        var dataToRender = [];
        anchors.forEach(function (data) {
            dataToRender.push(ChartUtils.dataPoints(moment(data.first_seen, 'YYYY-MM-DD'), data[filedToPlot]));
        });

        return dataToRender;
    }
};