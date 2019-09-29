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
        }
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
        return '<canvas id="' + identifier + '" height="300" width="300"></canvas>';
    },

    createGraphs: function (categoryAverages) {

        var dataToRender = {
            daysSurvivedPie: [],
            revisionSurvivedPie: [],
            anchorReIntroductionPie: []
        };

        var labels = [];
        categoryAverages.data.forEach(categoryAverage => {
            labels.push(categoryAverage.dataColumns[0]);
            dataToRender.daysSurvivedPie.push(categoryAverage.dataColumns[2]);
            dataToRender.revisionSurvivedPie.push(categoryAverage.dataColumns[3]);
            dataToRender.anchorReIntroductionPie.push(categoryAverage.dataColumns[4]);
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
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
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
