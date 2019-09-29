var ChartUtils = {
    createColors: function () {
        window.chartColors = {
            red: 'rgb(255, 99, 132)',
            orange: 'rgb(255, 159, 64)',
            yellow: 'rgb(255, 205, 86)',
            green: 'rgb(75, 192, 192)',
            blue: 'rgb(54, 162, 235)',
            purple: 'rgb(153, 102, 255)',
            grey: 'rgb(201, 203, 207)',
            olive: 'rgb(128,128,0)',
            navy: 'rgb(0,0,128)',
            magenta: 'rgb(255,0,255)',
            cyan: 'rgb(0,255,255)',
            sienna: 'rgb(160,82,45)'
        };
    },

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
            showLine: true,
            spanGaps: false,
            legend: {
                position: 'right'
            }
        };
    },

    createOptions: function (labelString) {
        return {
            legend: {
                display: true,
                position: 'right',
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
                            year: 'YYYY'
                        },
                        max: moment("2005-01-01").format('YYY-MM-DD'),
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
                        labelString: labelString,
                        fontSize: 20,
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