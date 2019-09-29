// Wikigen
// This script contains all plotting related functions
//
/////////////////

var dashes = false;
var lines = false;
var bars = true;
var points = false;
var oldXPos = 0;
var oldYPos = 0;
var visualOverrideAllowed = true;

function onTimePlotHover(event, pos, item, month, decimal) {
	var xPos = pos.pageX;
	var yPos = pos.pageY;
	if (item && xPos === oldXPos && yPos === oldYPos) {
		oldXPos = xPos;
		oldYPos = yPos;
		var x = item.datapoint[0].toFixed(0);
		var	y;
		if(decimal) {
			y = item.datapoint[1].toFixed(2);
		} else {
			y = item.datapoint[1].toFixed(0);
		}		
		
		var date = new Date(item.datapoint[0]);
		var periodString;
		if(month) {
			periodString = getDateFromTime(x) /*getMonthName(date.getMonth())*/;
		} else {
			periodString = date.getFullYear();
		}
		showTooltip(item.pageX, item.pageY,
					item.series.label + " in " + periodString + ": " + y);
	}
	else {
		if(xPos !== oldXPos || yPos !== oldYPos)
			$("#tooltip").remove();
		oldXPos = xPos;
		oldYPos = yPos;				
	}
}

function delayedCloseTooltip(tooltip) {
	$(tooltip).remove();	
}

function onTimeRevisionMapPlotHover(event, pos, item, month, decimal) {
	var xPos = pos.pageX;
	var yPos = pos.pageY;
	if (item /*&& xPos == oldXPos && yPos == oldYPos*/) {
		oldXPos = xPos;
		oldYPos = yPos;
		var date = new Date(item.datapoint[0]);
		showTooltip(item.pageX + 10, item.pageY, date.getFullYear() + "-" + (parseInt(date.getUTCMonth()) + 1).toString() + "-" + parseInt(date.getUTCDate()) + ", " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() );
		setTimeout(function() {
			delayedCloseTooltip($("#tooltip"));
			}, 5000);
	}
	else {
		if(xPos !== oldXPos || yPos !== oldYPos)
			$("#tooltip").remove();
		oldXPos = xPos;
		oldYPos = yPos;				
	}
}

function showTooltip(x, y, contents) {
	$('<div id="tooltip">' + contents + '</div>').css( {
		position: 'absolute',
		display: 'none',
		top: y + 5,
		left: x + 5,
		border: '1px solid #fdd',
		padding: '2px',
		'background-color': '#fee',
		opacity: 0.80
	}).appendTo("body").fadeIn(200);
}

/*
function convertJsonToYearArray(json) {
	var resultArray = [];
	var currentYear = new Date().getFullYear();
	var newDate;// = new Date();
	for(var i = 2001; i <= currentYear; i++) {
		newDate = new Date(i, 0, 0, 0, 0, 0);
		if(json[i] && json[i]["count"]) {
			resultArray.push([newDate.getTime(), json[i]["count"]]);
		}
	}
	return resultArray;
}*/

function convertJsonToYearArrayForBars(json, callback) {
	var resultArray = [];
	var currentYear = new Date().getFullYear();
	var newDate;// = new Date();
	for(var i = 2001; i < currentYear; i++) {
		if(json[i] && json[i]["count"]) {
			newDate = new Date(i, 0, 1, 0, 0, 0);
			resultArray.push([newDate.getTime(), json[i]["count"]]);
		}
		/*} else {
			resultArray.push([newDate.getTime(), 0]);
		}*/
	}
	return resultArray;
}

function convertJsonToMonthArrayForBars(json, callback) {
	var resultArray = [];
	var currentYear = new Date().getFullYear();
	var newDate;// = new Date();
	var monthData;
	for(var i = 2001; i <= currentYear; i++) {
		if(json[i]) {
			for(var j = 0; j <= 11; j++) { // iterating over months
				monthData = json[i][j];
				if(monthData) { 
					newDate = new Date(i, j, 1, 0, 0, 0);
					if(monthData["count"]) {
						resultArray.push([newDate.getTime(), monthData["count"]]);
					} else {
						resultArray.push([newDate.getTime(), monthData]);
					}
				} else {
					//console.log("month " + newDate.getMonth());
					//resultArray.push([newDate.getTime(), 0]);
				}
			}	
		} else {
			//resultArray.push([newDate.getTime(), 0]);
		}
	}
	return resultArray;
}

function convert2JsonToInstabilityYearArray(json1, json2) {
	var resultArray = [];
	var currentYear = new Date().getFullYear();
	var newDate;
	var firstYear = true;
	for(var i = 2001; i < currentYear; i++) {
		if(json1[i] && json1[i]["count"]) {
			if(!firstYear) {
				newDate = new Date(i, 0, 1, 0, 0, 0);
				resultArray.push([newDate.getTime(), json1[i]["count"] / json2[i]["count"]]);
			}
			firstYear = false;
		} else {
			//resultArray.push([newDate.getTime(), 0]);
		}
		
	}
	return resultArray;
}

function convert2JsonToInstabilityMonthArray(json1, json2) {
	var resultArray = [];
	if(!json1 || !json2) {
		return resultArray;
	}
	
	var currentYear = new Date().getFullYear();
	var newDate;
	for(var i = 2001; i <= currentYear; i++) {
		if(json1[i]) {
			for(var month in json1[i]) {
				if(month !== "count") {
					newDate = new Date(i, month, 1, 0, 0, 0);
					if(isNaN(newDate.getTime())) {
						//console.log("got ya");
					}
					if(json2[i][month]["count"]) {
						resultArray.push([newDate.getTime(), json1[i][month] / json2[i][month]["count"]]);
					} else {
						resultArray.push([newDate.getTime(), json1[i][month] / json2[i][month]]);
					}
					
				}
			}
		}
	}
	return resultArray;
}

function convertArrayAndJsonToNoveltyYearArray(array, json) {
	console.log(array);

	var resultArray = [];
	var currentYear = new Date().getFullYear();
	var newDate;
	var i = 0;
	var anchorsCount;
	var introductions;
	var year;
	var firstYear = true;
	while(array[i]) {
		anchorsCount = array[i][1].length;
		year = array[i][0];
		if(currentYear !== year && !firstYear) {
			newDate = new Date(year, 0, 1, 0, 0, 0);
			if(typeof(json[year]) == 'undefined') {
				resultArray.push([newDate.getTime(), 0]);
			} else {
				introductions = json[year]["count"];
				resultArray.push([newDate.getTime(), introductions / anchorsCount]);
			}
		}
		firstYear = false;
		i++;
	}
	return resultArray;
}

function convertArrayAndJsonToNoveltyMonthArray(array, json) {
	var resultArray = [];
	var currentYear = new Date().getFullYear();
	var newDate;
	var i = 0;
	var j;
	var anchorsCount;
	var movements;
	var year;
	var month;
	while(array[i]) {
		year = array[i][0];
		j = 0;
		while(array[i][1][j]) {
			month = array[i][1][j][0];
			anchorsCount = array[i][1][j][1].length;
			newDate = new Date(year, month, 1, 0, 0, 0);
			if(typeof(json[year]) == 'undefined' || typeof(json[year][month]) == 'undefined') {
				resultArray.push([newDate.getTime(), 0]);
			} else {
				movements = json[year][month];
				resultArray.push([newDate.getTime(), movements / anchorsCount]);
			}
			j++;
		}
		i++;
	}
	return resultArray;
}

function getYearDataOptions(resultArray, color, graphLabel, visualOverride) {
	var barsVal;
	var dashesVal;
	var pointsVal;
	var linesVal;
	if(visualOverride) {
		barsVal = visualOverride["bars"];
		dashesVal = visualOverride["dashes"];
		pointsVal = visualOverride["points"];
		linesVal = visualOverride["lines"];
	} else {
		barsVal = bars;
		dashesVal = dashes;
		pointsVal = points;
		linesVal = lines;
	}
	return [
			{
				color: color,
				data: resultArray,
				bars: {show: barsVal,  barWidth : 60*60*1000*8000, align : "center"},
				dashes: {show : dashesVal},
				points: {show : pointsVal},
				lines : {show : linesVal},
				label: graphLabel
			}            
		];
}

function getMonthDataOptions(resultArray, color, graphLabel, visualOverride) {
	var barsVal;
	var dashesVal;
	var pointsVal;
	var linesVal;
	if(visualOverride) {
		barsVal = visualOverride["bars"];
		dashesVal = visualOverride["dashes"];
		pointsVal = visualOverride["points"];
		linesVal = visualOverride["lines"];
	} else {
		barsVal = bars;
		dashesVal = dashes;
		pointsVal = points;
		linesVal = lines;
	}
	return [
			{
				color: color,
				data: resultArray,
				bars: {show: barsVal,  barWidth : 60*60*1000*8000/20, align : "center"},
				dashes: {show : dashesVal},
				lines : {show : linesVal},
				points: {show : pointsVal},
				label: graphLabel
			}            
		];
}

function getRevisionMapDataOptionsOverview(resultArray, color, graphLabel) {
	return [
			{
				color: color,
				data: resultArray,
				bars: {show: false,  barWidth : 1, align : "center"},
				points: {show: true},
				label: graphLabel
			}            
		];
}

function getRevisionMapDataOptions(resultArray, color, graphLabel) {
	return [
			{
				color: color,
				data: resultArray,
				bars: {show: true,  barWidth : 1, align : "center"},
				points: {show: true},
				label: graphLabel
			}            
		];
}
		
function getYearOptions(maxHeight, multi, decimal) {
	var decimals;
	var minTickSize = 0;
	if(!decimal) {
		decimals = 0;
	} else {
		decimals = 2;
		//if(maxHeight < 50) {
		//	minTickSize	= maxHeight / 5;
		//}
	}
	return {
			selection: { mode: "xy" },
			grid: { hoverable: true, clickable: true },
			xaxis:{ mode: "time", tickSize:[1, "year"] },
			yaxis:{ min:0, max:maxHeight, tickDecimals:decimals, tickSize:minTickSize, minTickSize:0.25},
			multiplebars: multi
		};
}

function getMonthOptions(maxHeight) {
	var decimals;
	if(isInt(maxHeight)) {
		decimals = 0;
	} else {
		decimals = 2;
	}
	return {
			selection: { mode: "x" },
			grid: { hoverable: true, clickable: true },
			xaxis:{ mode: "time", minTickSize:[1, "month"] },
			yaxis:{ min:0, max:maxHeight, tickDecimals:decimals }
		};
}

function getRevisionMapOptions(maxHeight) {
	return {
			selection: { mode: "x" },
			grid: { hoverable: true, clickable: true },
			xaxis:{ mode: "time"},
			yaxis:{show:false }
		};
}

function applyHover(graph, decimal, month) {
	var hovered = $(graph).attr('hovered');
	if(typeof(hovered) == 'undefined') {
		$(graph).bind("plothover", function (event, pos, item) {
			onTimePlotHover(event, pos, item, month, decimal);
		});
		$(graph).attr('hovered', 1);
	}
}

function applyRevisionMapHover(graph, decimal, month) {
	var hovered = $(graph).attr('hovered');
	if(typeof(hovered) == 'undefined') {
		$(graph).bind("plothover", function (event, pos, item) {
			onTimeRevisionMapPlotHover(event, pos, item, month, decimal);
		});
		$(graph).attr('hovered', 1);
	}
} 

function plotYearDataGraph(graph, graphData, graphLabel, maxHeight, color, decimal, directArray, visualOverride) {
	var yearData;
	if(directArray) {
		yearData = graphData;
	} else {
		yearData = convertJsonToYearArrayForBars(graphData);
	}
	
	$.plot(graph, getYearDataOptions(yearData, color, graphLabel, visualOverride), getYearOptions(maxHeight, false, decimal));
	
	$(graph).bind('plotclick', function(event, pos, item) {
		var date = new Date(item.datapoint[0]);
		//alert("Year is: " + (parseInt(date.getFullYear()) + 1).toString());
	});
	
	applyHover(graph, decimal, false);
}

function plotMonthDataGraph(graph, graphData, graphLabel, maxHeight, color, decimal, directArray, visualOverride) {
	var monthData;
	if(directArray) {
		monthData = graphData;
	} else {
		monthData = convertJsonToYearArrayForBars(graphData);
	}
	
	$.plot(graph, getMonthDataOptions(monthData, color, graphLabel, visualOverride), getMonthOptions(maxHeight));
	
	$(graph).bind('plotclick', function(event, pos, item) {
		var date = new Date(item.datapoint[0]);
	});
	
	applyHover(graph, decimal, true);
}

function getOverviewOptions() {
	return {
				series: {
					bars  : { show: bars,  barWidth : 60*60*1000*8000/12 },
					lines : {show : lines},
					dashes: {show: dashes},
					points: {show: points},
					shadowSize: 0
				},
				xaxis: { ticks: [], mode: "time" },
				yaxis: { ticks: [], min: 0, autoscaleMargin: 0.1,  tickDecimals:0 },
				selection: { mode: "x" }
			};
}

function getRevisionMapOverviewOptions() {
	return {
				series: {
					bars: { show: true,  barWidth : 1 },
					shadowSize: 0
				},
				xaxis: { ticks: [], mode: "time" },
				yaxis: { ticks: [], min: 0, max:1, autoscaleMargin: 0.1,  tickDecimals:0 },
				selection: { mode: "x" }
			};
}


function plotRevisionMapOverviewGraph(graph, overviewGraph, graphData, graphLabel, maxHeight, color) {
	// Plot main graph
	var plot = $.plot(graph, getRevisionMapDataOptions(graphData, color, graphLabel), getRevisionMapOptions(maxHeight));
	// Plot overview graph
	var anchor_overview = $.plot(overviewGraph, [{
				color: color,
				data: graphData}], getRevisionMapOverviewOptions());
	
	$(graph).bind("plotselected", function (event, ranges) {
		// do the zooming
		plot = $.plot(graph, getRevisionMapDataOptions(graphData, color, graphLabel),
					  $.extend(true, {}, getRevisionMapOptions(maxHeight), {
						  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
					  }));

		// don't fire event on the overview to prevent eternal loop
		anchor_overview.setSelection(ranges, true);
	});
	
	$(overviewGraph).bind("plotselected", function (event, ranges) {
		plot.setSelection(ranges);
	});	
	
	$(graph).bind('plotclick', function(event, pos, item) {
		var date = new Date(item.datapoint[0]);
		var revisionID = getRevisionIdByDate(date);
		$("#article_tab_link").click();
		$('#article_content').empty();
		$('#article_content').append("<object id='wikifrarevisionIDme' data='http://"+wikiLang+".wikipedia.org/w/index.php?title="+ localStorage.getItem('selected_article')+" &oldid=" +  +"' width='100%'>Error: Embedded data could not be displayed or requested article does not exist. </object>");
		$("#wikiframe").height(screen.height - 300);
		//alert("date is: " + date);
	});
	applyRevisionMapHover(graph, false, true);
}

function plotMonthDataOverviewGraph(graph, overviewGraph, graphData, graphLabel, maxHeight, color, decimal, directArray, visualOverride) {
	var monthData;
	if(directArray) {
		monthData = graphData;
	} else {
		monthData = convertJsonToMonthArrayForBars(graphData);
	}
	// Plot main graph
	var plot = $.plot(graph, getMonthDataOptions(monthData, color, graphLabel, visualOverride), getMonthOptions(maxHeight));
	// Plot overview graph
	var anchor_overview = $.plot(overviewGraph, getMonthDataOptions(monthData, color, "", visualOverride), getOverviewOptions());

	$(graph).bind("plotselected", function (event, ranges) {
		// do the zooming
		plot = $.plot(graph, getMonthDataOptions(monthData, color, graphLabel, visualOverride),
					  $.extend(true, {}, getMonthOptions(maxHeight), {
						  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
					  }));

		// don't fire event on the overview to prevent eternal loop
		anchor_overview.setSelection(ranges, true);
	});
	
	$(overviewGraph).bind("plotselected", function (event, ranges) {
		plot.setSelection(ranges);
	});	
	
	$(graph).bind('plotclick', function(event, pos, item) {
		//var date = new Date(item.datapoint[0]);
		//alert("Year is: " + (parseInt(date.getFullYear()) + 1).toString());
	});
	applyHover(graph, decimal, true);
}

function plotMultipleMonthDataOverviewGraph(graph, overviewGraph, graphData, graphLabel, maxHeight, color, decimal, directArray, visualOverride) {
	var monthData;
	if(directArray) {
		monthData = graphData;
	} else {
		monthData = convertJsonToMonthArrayForBars(graphData);
	}
	// Plot main graph
	var plot = $.plot(graph, getMonthDataOptions(monthData, color, graphLabel, visualOverride), getMonthOptions(maxHeight));
	// Plot overview graph
	var anchor_overview = $.plot(overviewGraph, getMonthDataOptions(monthData, color, "", visualOverride), getOverviewOptions());
	
	$(graph).bind("plotselected", function (event, ranges) {
		// do the zooming
		plot = $.plot(graph, getMonthDataOptions(monthData, color, graphLabel, visualOverride),
					  $.extend(true, {}, getMonthOptions(maxHeight), {
						  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
					  }));

		// don't fire event on the overview to prevent eternal loop
		anchor_overview.setSelection(ranges, true);
	});
	
	$(overviewGraph).bind("plotselected", function (event, ranges) {
		plot.setSelection(ranges);
	});	
	
	$(graph).bind('plotclick', function(event, pos, item) {
		//var date = new Date(item.datapoint[0]);
		//alert("Year is: " + (parseInt(date.getFullYear()) + 1).toString());
	});
	applyHover(graph, decimal, true);
}

function constructYearDataObject(data, color, dataLabel, directArray, visualOverride, barParts) {
	var barsVal;
	var dashesVal;
	var pointsVal;
	var linesVal;
	if(visualOverride) {
		barsVal = visualOverride["bars"];
		dashesVal = visualOverride["dashes"];
		pointsVal = visualOverride["points"];
		linesVal = visualOverride["lines"];
	} else {
		barsVal = bars;
		dashesVal = dashes;
		pointsVal = points;
		linesVal = lines;
	}
	if(!directArray) {
		data = convertJsonToYearArrayForBars(data);
	}
	return {
		data: data ,
		color: color,
		label: dataLabel,
		//bars: { show: true, align:'center', barWidth:0.3 }
		bars: {show: barsVal,  barWidth :  60*60*1000*8000/barParts, align : "center"},
		dashes: {show: dashesVal},
		lines : {show : linesVal},
		points: {show: pointsVal},
	}
}

function constructMonthDataObject(data, color, dataLabel, directArray, visualOverride, barParts, studentize) {
	var barsVal;
	var dashesVal;
	var pointsVal;
	var linesVal;
	if(visualOverride) {
		barsVal = visualOverride["bars"];
		dashesVal = visualOverride["dashes"];
		pointsVal = visualOverride["points"];
		linesVal = visualOverride["lines"];
	} else {
		barsVal = bars;
		dashesVal = dashes;
		pointsVal = points;
		linesVal = lines;
	}
	if(!directArray) {
		data = convertJsonToMonthArrayForBars(data);
	}
	if(studentize) {
		studentizeData(data);
	}
	return {
		data: data ,
		color: color,
		label: dataLabel,
		//bars: { show: true, align:'center', barWidth:0.3 }
		bars: {show: barsVal,  barWidth : 60*60*1000*8000/13/barParts, align : "center"},
		dashes: {show: dashesVal},
		lines : {show : linesVal},
		points: {show: pointsVal},
	}
}

function constructVisualOverride(bars, dashes, lines, points) {
	var result = {"bars":bars, "dashes":dashes, "lines":lines, "points":points};
	if(visualOverrideAllowed) {
		return result;
	} else {
		return null;
	}
}

function plotYearMultiGraph3(graph, dataObject1, dataObject2, dataObject3, maxHeight, decimal) {
	$.plot(graph, [
			dataObject1,
			dataObject2,
			dataObject3
		], getYearOptions(maxHeight, true, decimal)
	);	
	
	$(graph).bind('plotclick', function(event, pos, item) {
		var date = new Date(item.datapoint[0]);
		//alert("Year is: " + (parseInt(date.getFullYear()) + 1).toString());
	});
	
	applyHover(graph, decimal, false);
}

function plotYearMultiGraph4(graph, dataObject1, dataObject2, dataObject3, dataObject4, maxHeight, decimal) {
	$.plot(graph, [
			dataObject1,
			dataObject2,
			dataObject3,
			dataObject4
		], getYearOptions(maxHeight, true, decimal)
	);	
	
	applyHover(graph, decimal, false);
}

function plotMonthMultiGraph2(graph, overviewGraph, dataObject1, dataObject2, maxHeight, decimal) {
	var plot = $.plot(graph, [
		dataObject1,
		dataObject2
	], getMonthOptions(maxHeight, true)
	);	
	
	var anchor_overview = $.plot(overviewGraph, [dataObject1], getOverviewOptions());
	
	$(graph).bind("plotselected", function (event, ranges) {
		// do the zooming
		plot = $.plot(graph,  [
						dataObject1,
						dataObject2
					],
					  $.extend(true, {}, getMonthOptions(maxHeight, true), {
						  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
					  }));

		// don't fire event on the overview to prevent eternal loop
		anchor_overview.setSelection(ranges, true);
	});

	$(overviewGraph).bind("plotselected", function (event, ranges) {
		plot.setSelection(ranges);
	});	
	
	$(graph).bind('plotclick', function(event, pos, item) {
		var date = new Date(item.datapoint[0]);
	});

	applyHover(graph, decimal, true);
}

function plotMonthMultiGraph3(graph, overviewGraph, dataObject1, dataObject2, dataObject3, maxHeight, decimal) {
	var plot = $.plot(graph, [
		dataObject1,
		dataObject2,
		dataObject3
	], getMonthOptions(maxHeight, true)
	);	
	
	var anchor_overview = $.plot(overviewGraph, [dataObject1], getOverviewOptions());
	
	$(graph).bind("plotselected", function (event, ranges) {
		// do the zooming
		plot = $.plot(graph,  [
						dataObject1,
						dataObject2,
						dataObject3
					],
					  $.extend(true, {}, getMonthOptions(maxHeight, true), {
						  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
					  }));

		// don't fire event on the overview to prevent eternal loop
		anchor_overview.setSelection(ranges, true);
	});
	
	$(overviewGraph).bind("plotselected", function (event, ranges) {
		plot.setSelection(ranges);
	});	
	
	$(graph).bind('plotclick', function(event, pos, item) {
		var date = new Date(item.datapoint[0]);
		//alert("Year is: " + (parseInt(date.getFullYear()) + 1).toString());
	});

	applyHover(graph, decimal, true);
}

function plotEditsMonthMultiGraph9(graph, overviewGraph, dataObject1, dataObject2, dataObject3, dataObject4, maxHeight, decimal) {
	var plot = $.plot(graph, [
		dataObject1,
		dataObject2,
		dataObject3,
		dataObject4,

	], getMonthOptions(maxHeight, true)
	);	

	var edit_overview = $.plot(overviewGraph, [dataObject1], getOverviewOptions());

	$(graph).bind("plotselected", function (event, ranges) {
		// do the zooming
		plot = $.plot(graph,  [
						dataObject1,
						dataObject2,
						dataObject3,
						dataObject4,

					],
					  $.extend(true, {}, getMonthOptions(maxHeight, true), {
						  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
					  }));

		// don't fire event on the overview to prevent eternal loop
		edit_overview.setSelection(ranges, true);
	});

	$(overviewGraph).bind("plotselected", function (event, ranges) {
		plot.setSelection(ranges);
	});

	$(graph).bind('plotclick', function(event, pos, item) {
		var date = new Date(item.datapoint[0]);
		//alert("Year is: " + (parseInt(date.getFullYear()) + 1).toString());
	});

	applyHover(graph, decimal, true);
}


function plotTalkMonthMultiGraph9(graph, overviewGraph, dataObject1, dataObject2, dataObject3, dataObject4, maxHeight, decimal) {
	var plot = $.plot(graph, [
			dataObject1,
			dataObject2,
			dataObject3,
			dataObject4,
		], getMonthOptions(maxHeight, true)
	);

	var talk_overview = $.plot(overviewGraph, [dataObject1], getOverviewOptions());

	$(graph).bind("plotselected", function (event, ranges) {
		// do the zooming
		plot = $.plot(graph,  [
				dataObject1,
				dataObject2,
				dataObject3,
				dataObject4,

			],
			$.extend(true, {}, getMonthOptions(maxHeight, true), {
				xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
			}));

		// don't fire event on the overview to prevent eternal loop
		talk_overview.setSelection(ranges, true);
	});

	$(overviewGraph).bind("plotselected", function (event, ranges) {
		plot.setSelection(ranges);
	});

	$(graph).bind('plotclick', function(event, pos, item) {
		var date = new Date(item.datapoint[0]);
		//alert("Year is: " + (parseInt(date.getFullYear()) + 1).toString());
	});

	applyHover(graph, decimal, true);
}
function plotAnchorMonthMultiGraph9(graph, overviewGraph, dataObject1, dataObject2, dataObject3, dataObject4, dataObject5, maxHeight, decimal) {
	var plot = $.plot(graph, [
			dataObject1,
			dataObject2,
			dataObject3,
			dataObject4,
		    dataObject5,

		], getMonthOptions(maxHeight, true)
	);

	var anchor_overview = $.plot(overviewGraph, [dataObject1], getOverviewOptions());

	$(graph).bind("plotselected", function (event, ranges) {
		// do the zooming
		plot = $.plot(graph,  [
				dataObject1,
				dataObject2,
				dataObject3,
				dataObject4,
				dataObject5,

			],
			$.extend(true, {}, getMonthOptions(maxHeight, true), {
				xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
			}));

		// don't fire event on the overview to prevent eternal loop
		anchor_overview.setSelection(ranges, true);
	});

	$(overviewGraph).bind("plotselected", function (event, ranges) {
		plot.setSelection(ranges);
	});

	$(graph).bind('plotclick', function(event, pos, item) {
		var date = new Date(item.datapoint[0]);
		//alert("Year is: " + (parseInt(date.getFullYear()) + 1).toString());
	});

	applyHover(graph, decimal, true);
}



function plotMonthMultiGraph4(graph, overviewGraph, dataObject1, dataObject2, dataObject3, dataObject4, maxHeight, decimal) {
	var plot = $.plot(graph, [
		dataObject1,
		dataObject2,
		dataObject3,
		dataObject4
	], getMonthOptions(maxHeight, true)
	);	
	
	var anchor_overview = $.plot(overviewGraph, [dataObject1], getOverviewOptions());
	
	$(graph).bind("plotselected", function (event, ranges) {
		// do the zooming
		plot = $.plot(graph,  [
						dataObject1,
						dataObject2,
						dataObject3,
						dataObject4
					],
					  $.extend(true, {}, getMonthOptions(maxHeight, true), {
						  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
					  }));

		// don't fire event on the overview to prevent eternal loop
		anchor_overview.setSelection(ranges, true);
	});
	
	$(overviewGraph).bind("plotselected", function (event, ranges) {
		plot.setSelection(ranges);
	});	
	
	$(graph).bind('plotclick', function(event, pos, item) {
		//var date = new Date(item.datapoint[0]);
		//alert("Year is: " + (parseInt(date.getFullYear()) + 1).toString());
	});

	applyHover(graph, decimal, true);
}

// ToDo rewrite in a more general manner
function convert2JsonToYearArray(json1, json2, callback) {
	var resultArray = [];
	var currentYear = new Date().getFullYear();
	var newDate;
	for(var i = 2001; i <= currentYear; i++) {
		newDate = new Date(i, 0, 1, 0, 0, 0);
		if(json1[i] && json1[i]["count"]) {
			resultArray.push([newDate.getTime(), json1[i]["count"] / json2[i]["count"]]);
		} else {
			//resultArray.push([newDate.getTime(), 0]);
		}
	}
	return resultArray;
}

function convert2JsonToMonthArray(json1, json2, callback) {
	var resultArray = [];
	var currentYear = new Date().getFullYear();
	var newDate;
	for(var i = 2001; i <= currentYear; i++) {
		for(var j = 0; j <= 11; j++) { // iterating over months
			newDate = new Date(i, j + 1 , 1, 0, 0, 0); // +1 since there was a bug
			if(json1[i]) {
				if(json1[i][j]) { 
					resultArray.push([newDate.getTime(), json1[i][j] / json2[i][j]["count"]]);
			
			} else {
					//resultArray.push([newDate.getTime(), 0]);
				}
			} else {
				//resultArray.push([newDate.getTime(), 0]);
			}
		}	
	}
	return resultArray;
}

function replotEditEditorsGraph(graph, overviewGraph, data1, data2) {
	var dataArray_1 = convert2JsonToYearArray(data1, data2);
	var dataArray_2 = convert2JsonToMonthArray(data1, data2);
	
	var options = {
		mode: "time",
		selection: { mode: "x" },
		grid: { hoverable: true, clickable: true },
		xaxis:{ mode: "time", minTickSize:[1, "month"]},
		yaxis:{ min:0, max:getMaxHeightFromArray(dataArray_2), tickDecimals:2, tickSize:0.25 }, // 2 array is month array
		multiplebars: true
	};
	
	var dataArray = [
			{
				color: '#343434',
				data: dataArray_1,
				label: 'Major distinct edits per non-bot editors per one year',
				bars: {show: bars},
				dashes: {show: dashes},
				lines : {show : lines},
				points: {show: points}
			},
			{
				color: "#343434",
				data: dataArray_2,
				label: 'Major distinct edits per non-bot editors per one month',
				bars: {show: bars},
				dashes: {show: dashes},
				lines : {show : lines},
				points: {show: points},
			}
		];
	
	var plot = $.plot(graph, dataArray, options);	
	
	var anchor_overview = $.plot(overviewGraph, [dataArray_1], {
		series: {
			bars: {show: false},
			dashes: {show: dashes},
			lines : {show : lines},
			points: {show: points},
			shadowSize: 0
		},
		xaxis: { ticks: [], mode: "time" },
		yaxis: { ticks: [], min: 0, autoscaleMargin: 0.1,  tickDecimals:0 },
		selection: { mode: "x" }
	});
	
	// now connect the two
	$(graph).bind("plotselected", function (event, ranges) {
		// do the zooming
		plot = $.plot(graph, dataArray,
					  $.extend(true, {}, options, {
						  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
					  }));

		// don't fire event on the overview to prevent eternal loop
		anchor_overview.setSelection(ranges, true);
	});
	
	$(overviewGraph).bind("plotselected", function (event, ranges) {
		plot.setSelection(ranges);
	});	

	applyHover(graph, true, false);	
}
// End rewrite

function getMaxHeightForStats(highestJSON, month) {
	var tempValue = 0;
	var tempDistinct;
	var tempDistinctMajor;
	var result = 0;
	var currentYear = new Date().getFullYear();
	var monthData;
	for(var i = 2001; i <= currentYear; i++) {
		if(highestJSON[i]) {
			if(typeof(month) == 'undefined' || !month) {
				tempValue = highestJSON[i]["count"];
				if(tempValue && result < tempValue)
					result = tempValue;	
			} else {
				for(var j = 0; j <= 11; j++) { // iterating over months
					monthData = highestJSON[i][j];
					if(monthData && monthData["count"]) {
						tempValue = monthData["count"];
					} else {
						tempValue = monthData;
					}
					if(tempValue && result < tempValue)
						result = tempValue;
				}
			}
		}
	}
	if(isInt(result) && result !== 1) {
		return (result + result / 10).toFixed(0);
	} else {
		return (result + result / 10)
	}	
}

function getMaxHeightFromArray(array) {
	var result = 0;
	var tempValue;
	for (var i = 0; i < array.length; i++) {
		tempValue = array[i][1];
		
		if(tempValue && tempValue > result) {
			result = tempValue;
		}
	}
	if(isInt(result) && result !== 1) {
		return (result + result / 10).toFixed(0);
	} else {
		return (result + result / 10)
	}
}

function getAnchorDissimilatyArrayForYear(anchorSnapshots, year) {
	var resultArray = [];
	var newDate;
	var i = 0;
	var yearToCompareWith = anchorSnapshots[year];
	/*var tempYear;
	while(anchorSnapshots[i]) {
		tempYear = anchorSnapshots[i][0];
		if(tempYear)
	}*/
	var firstYear = true;
	var currentYear = new Date().getFullYear();
	while(anchorSnapshots[i]) {
		if(!firstYear && currentYear !== anchorSnapshots[i][0]) {
			newDate = new Date(parseInt(anchorSnapshots[i][0]), 0, 1, 0, 0, 0);
			resultArray.push([newDate.getTime(), getDissimilarityOfAnchorArrays2(yearToCompareWith[1], anchorSnapshots[i][1])]); 	
		}
		firstYear = false;
		i++;
	}
	return resultArray;
}

function getAnchorDissimilatyArrayForMonth(anchorMonthSnapshots, year, month) {
	var resultArray = [];
	var newDate;
	var i = 0;
	var monthToCompareWith = anchorMonthSnapshots[year][1][month][1];
	/*var tempYear;
	while(anchorMonthSnapshots[i]) {
		tempYear = anchorMonthSnapshots[i][0];
		if(tempYear)
	}*/
	while(anchorMonthSnapshots[year][1][i]) {
		newDate = new Date(parseInt(anchorMonthSnapshots[year][0]), parseInt(anchorMonthSnapshots[year][1][i][0]), 1, 0, 0, 0);
		resultArray.push([newDate.getTime(), getDissimilarityOfAnchorArrays2(monthToCompareWith, anchorMonthSnapshots[year][1][i][1])]); 	
		i++;
	}
	return resultArray;
}

//configuration for graphs

function initializeChartDisplayOptions() {
	if(bars) {
		$("#bars").prop("checked", 'checked');
	} else {
		console.log("no bars is checked ");
		$("#no_bars").prop("checked", 'checked');
	}
	$("#bars_cb").buttonset();

	if(lines) {
		$("#lines").prop("checked", 'checked');
	} else {
		$("#no_lines").prop("checked", 'checked');
	}

	$("#lines_cb").buttonset();

	}
initializeChartDisplayOptions();

