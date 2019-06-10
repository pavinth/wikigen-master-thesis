var CategoryPieChart = {
    canvases: [
        {
            identifier: 'daysSurvivedPie',
            label: 'Avg. Days Survived'
        },
        {
            identifier: 'revisionSurvivedPie',
            label: 'Avg. Revision Survived'
        },
        {
            identifier: 'anchorReIntroductionPie',
            label: "Avg. Re-Introduction"
        },
        {
            identifier: 'anchorStrengthPie',
            label: "Avg. Anchor Strength"
        },
    ],

    createMarkup: function () {
        var markup = '<div class="container"><div class="row">';
        CategoryPieChart.canvases.forEach(canvas => {
            markup += '<div class="col-sm">' + CategoryPieChart.createCanvas(canvas.identifier) + '</div>';
        });
        markup += '</div></div><br><br>';

        return markup;
    },

    createCanvas: function (identifier) {
        return '<canvas id="' + identifier + '" height="350" width="350"></canvas>';
    },

    createGraphs: function (categoryAverages) {

        var dataToRender = {
            daysSurvivedPie: [],
            revisionSurvivedPie: [],
            anchorReIntroductionPie: [],
            anchorStrengthPie: [],
        };

        var labels = [];
        categoryAverages.data.forEach(categoryAverage => {
            labels.push(categoryAverage.dataColumns[0]);
            dataToRender.daysSurvivedPie.push(categoryAverage.dataColumns[2]);
            dataToRender.revisionSurvivedPie.push(categoryAverage.dataColumns[3]);
            dataToRender.anchorReIntroductionPie.push(categoryAverage.dataColumns[4]);
            dataToRender.anchorStrengthPie.push(categoryAverage.dataColumns[5]);
        });

        CategoryPieChart.canvases.forEach(function (canvas) {
            var data = CategoryPieChart.createPieChartData(labels, dataToRender[canvas.identifier]);
            var options = CategoryPieChart.createPieChartOptions(canvas.label);
            CategoryPieChart.createPieChart(data, options, document.getElementById(canvas.identifier));
        });
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
    }
};
