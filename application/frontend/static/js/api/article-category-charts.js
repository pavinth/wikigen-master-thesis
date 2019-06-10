var ArticleCategoryChart = {
    canvases: [
        {
            identifier: 'averageDaysSurvivedPie',
            label: 'Avg. Days Survived'
        },
        {
            identifier: 'averageRevisionSurvivedPie',
            label: 'Avg. Revision Survived'
        },
        {
            identifier: 'averageAnchorReIntroductionPie',
            label: "Avg. Re-Introduction"
        },
        {
            identifier: 'averageAnchorStrengthPie',
            label: "Avg. Anchor Strength"
        },
        {
            identifier: 'totalDaysSurvivedPie',
            label: 'Total Days Survived'
        },
        {
            identifier: 'totalRevisionSurvivedPie',
            label: 'Total Revision Survived'
        },
        {
            identifier: 'totalAnchorReIntroductionPie',
            label: "Total Re-Introduction"
        },
        {
            identifier: 'totalAnchorStrengthPie',
            label: "Total Anchor Strength"
        },
    ],

    createGraphs: function (categoriesToPlot) {
        var dataToRender = {
            averageDaysSurvivedPie: [],
            averageRevisionSurvivedPie: [],
            averageAnchorReIntroductionPie: [],
            averageAnchorStrengthPie: [],
            totalDaysSurvivedPie: [],
            totalRevisionSurvivedPie: [],
            totalAnchorReIntroductionPie: [],
            totalAnchorStrengthPie: [],
        };

        var labels = [];
        categoriesToPlot.forEach(categoryAverage => {
            labels.push(categoryAverage.name);
            dataToRender.averageDaysSurvivedPie.push(categoryAverage.averageDaysSurvived);
            dataToRender.averageRevisionSurvivedPie.push(categoryAverage.averageRevisionSurvived);
            dataToRender.averageAnchorReIntroductionPie.push(categoryAverage.averageReIntroduction);
            dataToRender.averageAnchorStrengthPie.push(categoryAverage.averageStrength);

            dataToRender.totalDaysSurvivedPie.push(categoryAverage.totalDaysSurvived);
            dataToRender.totalRevisionSurvivedPie.push(categoryAverage.totalRevisionSurvived);
            dataToRender.totalAnchorReIntroductionPie.push(categoryAverage.totalReIntroduction);
            dataToRender.totalAnchorStrengthPie.push(categoryAverage.totalStrength);
        });
        console.log(labels);
        console.log(dataToRender);

        ArticleCategoryChart.canvases.forEach(function (canvas) {
            var data = ArticleCategoryChart.createPieChartData(labels, dataToRender[canvas.identifier]);
            var options = ArticleCategoryChart.createPieChartOptions(canvas.label);
            ArticleCategoryChart.createPieChart(data, options, document.getElementById(canvas.identifier));
        });
    },

    createMarkup: function () {
        var markup = '<div class="container"><div class="row">';
        ArticleCategoryChart.canvases.forEach(canvas => {
            markup += '<div class="col-sm">' + ArticleCategoryChart.createCanvas(canvas.identifier) + '</div>';
        });
        markup += '</div></div><br><br>';

        return markup;
    },

    createCanvas: function (identifier) {
        return '<canvas id="' + identifier + '" height="350" width="350"></canvas>';
    },

    createPieChartData: function (labels, data) {
        return {
            labels: labels,
            legend: {
                position: 'right',
                display: false
            },
            datasets: [
                {
                    fill: true,
                    data: data,
                    borderWidth: [2, 2],
                    backgroundColor: [
                        'rgba(145,73,24,0.51)',
                        'rgba(42,127,184,0.48)',
                        'rgba(103,25,98,0.5)',
                        'rgba(20,161,50,0.51)',
                        'rgba(39,39,39,0.59)',
                        'rgba(145,22,24,0.53)',
                        'rgba(55,20,138,0.52)',
                        'rgba(138,121,7,0.53)',
                        'rgba(44,139,140,0.54)'
                    ],
                    borderColor: [
                        'rgba(145,73,24,0.88)',
                        'rgba(42,127,184,0.9)',
                        'rgba(103,25,98,0.87)',
                        'rgba(20,161,50,0.8)',
                        'rgba(39,39,39,0.91)',
                        'rgba(145,22,24,0.85)',
                        'rgba(55,20,138,0.89)',
                        'rgba(138,121,7,0.58)',
                        'rgba(44,139,140,0.86)'
                    ]
                },
            ],

        };
    },

    createPieChartOptions: function (title) {
        return {
            title: {
                display: true,
                text: title,
                position: 'top'
            },
            responsive: false,
            defaultFontSize: 12,
        }
    },

    createPieChart: function (data, options, canvas) {
        var context = canvas.getContext('2d');
        context.height = 100;
        context.width = 100;
        new Chart(
            canvas.getContext('2d'),
            {
                type: 'doughnut',
                data: data,
                options: options
            }
        );
    },

    createChartContainers: function () {
        var markup = '<div class="container"><div class="row">';
        ArticleCategoryChart.canvases.forEach(canvas => {
                markup += '<div class="col-sm"><canvas id="' + canvas.identifier + '" height="350" width="350"></canvas></div>';
        });
        markup += '</div></div>';

        return markup;
    }
};