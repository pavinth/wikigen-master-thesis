var ChartUtils = {
    createDataSet: function (dataPoints) {
        var randomColor = ChartUtils.generateRandomColor();
        return {
            data: dataPoints.points,
            label: dataPoints.label,
            borderColor: randomColor,
            backgroundColor: randomColor,
            fill: false,
            pointRadius: 5,
            lineTension: 0,
            borderWidth: 2,
            showLine: false,
            spanGaps: false,
            legend: {
                position: 'right'
            }
        };
    },

    createOptions: function (labelString) {
        var label = labelString;
        CategoryIndex.buttonsToGenerate.map(function (button) {
            if (labelString === button.fieldToPlot) {
                label = button.content
            }
        });

        return {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: '#333',
                    fontSize: 20
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'series',
                    time: {
                        displayFormats: {
                            year: 'YYYY-MMMM',
                        },
                        max: moment("2001-01-01").format('YYY-MM-DD'),
                        min: moment().format('YYYY-DD-MM')
                    },
                    ticks: {
                        source: 'data',
                        autoSkip: true
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: label,
                        fontSize: 40,
                        fontFamily: "Times New Roman"
                    }
                }]
            }
        };
    },

    createToolTip: function () {
        return {
            intersect: false,
            mode: 'index',
            callbacks: {
                label: function (tooltipItem, myData) {
                    var label = myData.datasets[tooltipItem.datasetIndex].label || '';
                    if (label) {
                        label += ': ';
                    }
                    label += parseFloat(tooltipItem.value).toFixed(2);
                    return label;
                }
            }
        };
    },

    generateRandomColor: function () {
        return `rgb(${[1, 2, 3].map(x => Math.random() * 256 | 0)})`;
    },

    dataPoints: function (date, value) {
        return {
            t: date.valueOf(),
            y: value
        };
    },

    createContext: function (canvasId) {
        return document.getElementById(canvasId).getContext('2d');
    }
};