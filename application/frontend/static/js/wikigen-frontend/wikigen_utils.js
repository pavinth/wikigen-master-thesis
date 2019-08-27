// Wikigen
// This script contains all statistics related functions

var oneDay = 24*60*60*1000; 
var measuredTime;
var tagYearJSON = {};
var tagMonthJSON = {};

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function updateTimeStats() {
	$("#time").html("Last analysis took: " + getMeasuredTime() + " seconds (including " + getNetworkDelay() + " seconds waiting for wikipedia to answer requests)");
}

function startMeasuringTime() {
	//console.log("Start measuring overall time with " + startTime);
	measuredTime = new Date().getTime();
}

function getMeasuredTime() {
	var returnTime = new Date().getTime() - measuredTime;
	//console.log("End measuring overall time at " + returnTime);
	return returnTime / 1000;
}

function clearLocalStorage() {

    localStorage.setItem('article_generated', '');
	localStorage.setItem('selected_article', '');
	localStorage.setItem('talk_selected_article', '');
    localStorage.setItem('edit_stats_generated', '');
	localStorage.setItem('talk_edit_stats_generated', '');
	localStorage.setItem('anchor_stats_generated', '');
	localStorage.setItem('blink_stats_generated', '');
	localStorage.setItem('comp_stats_generated', '');
	localStorage.setItem('anchor_count', '');
	revisionCount = 0;
	revisionsArray = [[],[],[]];
	talkRevisionsArray = [[],[],[]];
	revisionsTimeArray = [];
}

function generateCumulativeArray(inputArray, callback) {
 	var newArray = [];
	var current = 0;
	for (var i = 0; i < inputArray.length; i++) {
		var tempValue = inputArray[i][1] + current;
		current = current + inputArray[i][1];
		newArray.push([inputArray[i][0], tempValue]);
	}
	callback(newArray);
}

/******* Validate IP Address IPv4 *********/
function fnValidateIPAddress(ipaddr) {
    var hiddenTest = ipaddr.substring(0, 7);
	if(hiddenTest === "hidden_") {
		return true;
	}
	//Remember, this function will validate only Class C IP.
    //change to other IP Classes as you need
    ipaddr = ipaddr.replace( /\s/g, "");//remove spaces for checking
    var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/; //regex. check for digits and in
                                          //all 4 quadrants of the IP
    if (re.test(ipaddr)) {
        //split into units with dots "."
        var parts = ipaddr.split(".");
        //if the first unit/quadrant of the IP is zero
        if (parseInt(parseFloat(parts[0])) === 0) {
            return false;
        }
        //if the fourth unit/quadrant of the IP is zero
        if (parseInt(parseFloat(parts[3])) === 0) {
            return false;
        }
        //if any part is greater than 255
        for (var i=0; i<parts.length; i++) {
            if (parseInt(parseFloat(parts[i])) > 255){
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

function convertJsonToTimeArray(json, callback) {
	var resultArray = [];
	var currentYear = new Date().getFullYear();
	new Date();
	for(var i = 2001; i <= currentYear; i++) {
		if(json[i] && json[i]["count"]) {
			resultArray.push([i, json[i]["count"]]);
		}
	}
	callback(resultArray);
}

function convertJsonToYearArray(json, callback) {
	var resultArray = [];
	var currentYear = new Date().getFullYear();
	var newDate;// = new Date();
	for(var i = 2001; i <= currentYear; i++) {
		newDate = new Date(i, 0, 1, 0, 0, 0);
		if(json[i] && json[i]["count"]) {
			resultArray.push([newDate.getTime(), json[i]["count"]]);
		} else {
			resultArray.push([newDate.getTime(), 0]);
		}
	}
	callback (resultArray);
}

function convertJsonToMonthArray(json, callback) {
	var resultArray = [];
	var currentYear = new Date().getFullYear();
	var newDate;// = new Date();
	for(var i = 2001; i <= currentYear; i++) {
		for(var j = 0; j <= 11; j++) { // iterating over months
			newDate = new Date(i, j + 1, 0, 0, 0, 0);
			if(json[i]) {
				if(json[i][j]) { 
					resultArray.push([newDate.getTime(), json[i][j]]);
				} else {
					resultArray.push([newDate.getTime(), 0]);
				}
			} else {
				resultArray.push([newDate.getTime(), 0]);
			}
		}	
	}
	callback (resultArray);
}

function removeTimeOffSet(date) {
	var timeOffSet = date.getTimezoneOffset();
	date.setHours(date.getHours() + (timeOffSet / 60));
	return date;
}

function getRevisionIdByDateString(searchString) {
	var revisionArray = getRevisionArray();
	var temp;
	for(var i = 0; i < revisionArray[0].length; i++) {
		temp = revisionArray[0][i];
		if(temp === searchString) {
			return revisionArray[2][i];
		}
	}
}

function getRevisionIdByDate(date, atable) {
	var revisionArray = getRevisionArray();
	var temp;
	for(var i = 0; i < revisionArray[0].length; i++) {
		temp = revisionArray[1][i];
		if(date < temp) {
			if(atable) {
				return revisionArray[2][i - 2];
			} else {
				return revisionArray[2][i - 1];
			}			
		}
	}	
}

function calculateOverallDaysFromPeriods2(anchorJSON, fromDate, untilDate, anchor) {
	var result = 0;
	var startTime;
	var endTime;
	var id = 0;
	var period = anchorJSON[id];
	var currentTime = new Date();
	while(period) {
		startTime = period["start"];
		endTime = period["end"];
		if(startTime > untilDate) { // meaning that the period starts after the end date of analysis
			break;
		}
		if(!endTime || endTime > fromDate) {
			if(startTime >= fromDate) { // meaning the period starts after the begining of analysis (and automatically before the end, so it means it starts in the middle of the period)
				if(endTime) { // if there is end time
					if(endTime > untilDate) {
						result += (untilDate.getTime() - startTime.getTime());
						if(result < 0) { 
							console.log("wrong result for " + anchor);
						}
						break;
					} else {
						result += (endTime.getTime() - startTime.getTime());
						if(result < 0) { 
							console.log("wrong result for " + anchor);
						}
					}
				} else { // if there is no endtime -> calculate all the remaining time
					if(currentTime > untilDate) { // if the analysis period not exceed the current time
						result += (untilDate.getTime() - startTime.getTime()); // add the time between the end of analysis and start of period
						if(result < 0) { 
							console.log("wrong result for " + anchor);
						}
						break;
					} else { // the analysis period exceed the current time like in case of the last year which is not completed
						//console.log("Attention adding time till current for " + anchor) + " in " + startTime.getFullYear();
						result += (currentTime.getTime() - startTime.getTime());
						if(result < 0) { 
							console.log("wrong result for " + anchor);
						}
					}
				}		
			} else { // meaning that the period starts before the beginning of analysis time BUT before the end of it ... so it is already there when the analysis period starts
				if(!endTime) {
					if(untilDate > currentTime) {
						result += (currentTime.getTime() - fromDate.getTime());
					} else {
						result += (untilDate.getTime() - fromDate.getTime());
					}
				} else {
					if(endTime > untilDate) {
						result += (untilDate.getTime() - fromDate.getTime());
					} else {
						result += (endTime.getTime() - fromDate.getTime());
					}
				}
			}
		}
		period = anchorJSON[++id]
	}
	result /= (1000*60*60*24);
	return result;
}

function calculateOverallDaysFromPeriods(anchorJSON) {
	var result = 0;
	var startTime;
	var endTime;
	var id = 0;
	var period = anchorJSON[id];
	var currentTime = new Date();
	while(period) {
		startTime = period["start"];
		endTime = period["end"];
		if(endTime) {
			result += (endTime.getTime() - startTime.getTime());
			if(result <= 0)
				console.log("test");
		} else {
			result += (currentTime.getTime() - startTime.getTime());
			if(result <= 0)
				console.log("test")
		}		
		period = anchorJSON[++id]
	}
	result /= (1000*60*60*24);
	return result;
}

function getMonthNumber(dateToDeriveFrom) {
	var month;
	if(dateToDeriveFrom.getMonth) {
		month = dateToDeriveFrom.getMonth() + 1;
	} else {
		month = parseInt(dateToDeriveFrom) + 1;
	}
	if(month < 10) 
		month = "0" + month.toString();	
	return month;	
}

function getDayNumber(dateToDeriveFrom) {
	var day = dateToDeriveFrom.getDate();
	if(day < 10) 
		day = "0" + day.toString();	
	return day;
}

function getIntroductionsInPeriod(anchorObject, fromDate, untilDate, save, anchor) {
	var i = 0;
	var result = 0;
	var startDate;
	var year;// = fromDate.getFullYear();
	var unique = false;
	var endDate;
	while (anchorObject[i]) {
		startDate = anchorObject[i]["start"];
		endDate = anchorObject[i]["end"];

		if (startDate >= fromDate && startDate <= untilDate) {
			if (fromDate.getFullYear() !== "2000") {
				//console.log("got ya!");
				if (save) {
					if (fromDate.getFullYear() === 2005 && fromDate.getMonth() === 3) {
						console.log("got ya!");
					}
					addUpToStats(fromDate.getFullYear(), totalAnchorIntroductions, fromDate.getMonth());
					// To count only one introduction in period decomment next line
					if (!unique) {
						addUpToStats(fromDate.getFullYear(), uniqueAnchorIntroductions, fromDate.getMonth());
						unique = true;
					}
					//break;
				}
			}

			result++;
		} else {
			/*if(!endDate || (startDate < fromDate && endDate > fromDate)) {
				if(fromDate.getFullYear() != "2000") {
					//console.log("got ya!");
					if(save) {
						addUpToStats(fromDate.getFullYear(), totalAnchorIntroductions, fromDate.getMonth());
					}
				}
				result++;
			}*/
		}
		i++;
	}
	return result;
}

// ANCHOR NAME  |  FIRST SEEN   |    LAST SEEN    |   ACCUMULATED TIME IN THE ARTICLE     |     #REINTRODUCTIONS     |    #Revisions SURVIVed 
function convertAnchorDataToArray(jsonData, fromDate, untilDate) {
	//console.log('convertAnchorDataToArray');

	//anchorRelevantRevisions = anchorRelevantRevisions;
	
	if(!fromDate) {
		fromDate = new Date("01/01/2000");
	}
	if(!untilDate) {
		untilDate = removeTimeOffSet(new Date());
		untilDate.setHours(untilDate.getHours() + 1);
	}
	
	var analysisTime = getNumberOfDaysBetween(fromDate, untilDate);
	//console.log("analysis time is " + analysisTime);
	
	var result = [];
	var survivals;
	var introductions;
	var recalculatedIntroductions;
	var row;
	var rank;
	var daysSurvived;
	var recalculatedDaysSurvived;
	var firstSeen;
	var lastSeen;
	var anchorObject;
	var survivalObject;
	var firstRevision;
	var lastRevision;
	var temp;
	var category;
	const GET_CAT_URL = 'http://0.0.0.0:8000/api/v1/stats/category/';
    $.ajax({
        async: false,
        url: GET_CAT_URL,
        method: 'GET',
        statusCode: {
            200: function(data) {
                //alert('Anchor with Category Created Successfully');
                var existing_category = '<datalist id="category-list">'
                $.each(data.results, function(key, value){
                    existing_category += '<option value="'+ value.name +'">'
                });

                existing_category += '</datalist>'

                for (var anchor in jsonData) {
                    if(anchor !== "count") {
                        anchorObject = jsonData[anchor]; // Get the object
                        // Preparing all the needed data for the table row
                        firstSeen = anchorObject[0].start; // Get the first seen date
                        introductions = anchorObject["count"];
                        recalculatedIntroductions = getIntroductionsInPeriod(anchorObject, fromDate, untilDate);
                        if(!anchorObject[introductions]) {
                            lastSeen = anchorObject[introductions - 1]["end"];
                        } else {
                            lastSeen = removeTimeOffSet(new Date());
                            introductions++;
                        }
                        daysSurvived = calculateOverallDaysFromPeriods(anchorObject);
                        recalculatedDaysSurvived = calculateOverallDaysFromPeriods2(anchorObject, fromDate, untilDate, anchor);
                        survivalObject = anchorObject["survivals"];
                        if(survivalObject) {
                            survivals = survivalObject["count"]
                        } else {
                            survivals = 0;
                        }
                        //survivals = anchorObject["survivals"];

                        if(fromDate > firstSeen || untilDate < lastSeen) {
                            survivals = null;
                        }

                        // create category

                        var category = "<div id='category-form'> " +
                            "  <input type='text' list='category-list' id='category-input' size='35' style='line-height:1.8;position:relative;top:18px; ' name='category'>\n" +
                            "  <input type=\"submit\" id=\'category-submit\' value='save' style='color:#ffffff;width:50px;height:30px;background:#343434;position:relative;bottom:13px;left:8px;text-align:center;-moz-margin-left:10px;moz-float:right;float:right;border-radius: 4px; border: 1px solid black; margin-left:15px; '>\n" +
                             "<i class=\"fas fa-edit\" id =\'edit-icon\' title='click to edit' style=\"font-size:20px;float:right;display:none;position:relative;top:-25px;\"></i>"
                            existing_category + "</div>"

                        // Writing the prepared data into the table row
                        // ToDo Restore
                        rank =  0.5 * (recalculatedDaysSurvived / analysisTime) +  0.5 * (survivals / anchorRelevantRevisions["count"]);
                        if(recalculatedDaysSurvived > 1) { // filter 0 values
                            firstRevision = getRevisionIdByDate(firstSeen, true);
                            lastRevision = getRevisionIdByDate(lastSeen, true);
                            row = [];
                            row.push("<a href='#anchor_chronology_part' class='anchor_element'>" + anchor + "</a>");
                            row.push(recalculatedDaysSurvived.toFixed(2));
                            row.push(survivals);
                            row.push(recalculatedIntroductions);
                            row.push(rank.toFixed(2));
                            row.push("<a href='http://"+wikiLang+".wikipedia.org/w/index.php?title=" + anchor + "&oldid=" + firstRevision +"' target='_blank'>" + firstSeen.getFullYear() + "-" + getMonthNumber(firstSeen) +  "-" + getDayNumber(firstSeen) + "</a>");
                            row.push("<a href='http://"+wikiLang+".wikipedia.org/w/index.php?title=" + anchor + "&oldid=" + lastRevision +"' target='_blank'>" + lastSeen.getFullYear() + "-" + getMonthNumber(lastSeen) +  "-" + getDayNumber(lastSeen) + "</a>");
                            //row.push("<div><a class='anchor-cat' href='#'>Add Category</a></div>");
                            row.push(category);
                            result.push(row);
                        }

                    }
	            }
	            localStorage.setItem('anchor_count', result.length);
            },
            400: function() {
                //  alert('Error in creating anchor!');
            },
            404: function() {
                //alert('Invalid URL! Is server running?');
            }
        }
    });
    window.result = result;
	return result;
}

function initializeTagArray(jsonData) {
	var result = [];
	var temp;
	for (var anchor in jsonData) {
		if(anchor !== "count") {
			result.push(anchor);	
		}
	}
	return result; start

}

function getNumberOfDaysBetween(firstDate, secondDate) {
	return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
}

function convertAnchorDataToSnapshotArray(jsonData, fromDate, untilDate, period, save, full) {
	if(typeof(full) == 'undefined') {
		full = false;
	} else {
		//console.log("got it");
	}
	//var totalIntroductions = 0;
	//var year = fromDate.getFullYear();
	if(period === "month") {
		//console.log('convertAnchorDataToSnapshotArray');
	}
	//var test = anchorRelevantRevisions;
	if(!fromDate) {
		fromDate = new Date("01/01/2000"); // before wiki started
	}
	if(!untilDate) {
		untilDate = removeTimeOffSet(new Date());
		untilDate.setHours(untilDate.getHours() + 1);
	}
	var result = [];
	var recalculatedIntroductions;
	var row;
	var recalculatedDaysSurvived;
	var anchorObject;
	var month;
	var rank;
	var survivals;
	var survivalObject;
	var tempYear;
	var totalPeriodRevisions;
	var tempMonth;
	var daysBetween;
	var tagJSON = {};
	for (var anchor in jsonData) {
		if(anchor !== "count") {
			//if(anchor == "russia") {
			//	console.log("got ya!");
			//}
			anchorObject = jsonData[anchor]; // Get the object
			recalculatedIntroductions = getIntroductionsInPeriod(anchorObject, fromDate, untilDate, save, anchor);
			recalculatedDaysSurvived = calculateOverallDaysFromPeriods2(anchorObject, fromDate, untilDate, anchor);
			
			//survivals = 
			//rank = (getNumberOfDaysBetween(fromDate, untilDate) / recalculatedDaysSurvived) + ();
			if(recalculatedDaysSurvived > 1 /*&& recalculatedIntroductions > 0*/ || (full === true && recalculatedDaysSurvived > 0)) { // filter 0 values
				// Calculate the survived revisions
				survivalObject = anchorObject["survivals"];
				if(period && survivalObject) {
					tempYear = fromDate.getFullYear().toString();
					tempMonth = fromDate.getMonth().toString();
					if(period === "month") {
						if(survivalObject[tempYear]&& survivalObject[tempYear][tempMonth]) {
							survivals = survivalObject[tempYear][tempMonth];
							totalPeriodRevisions = anchorRelevantRevisions[tempYear][tempMonth];
						} else {
							survivals = 0;
						}
					} else if (period === "year") {
						if(survivalObject[tempYear]&& survivalObject[tempYear]["count"]) {
							survivals = survivalObject[tempYear]["count"];
							totalPeriodRevisions = anchorRelevantRevisions[tempYear]["count"];
						} else {
							survivals = 0;
						}
					} else {
						survivals = "*";
					}
				} else {
					survivals = 0;
				}
				if(typeof(totalPeriodRevisions) == 'undefined') {
					totalPeriodRevisions = 1; // in case no revisions -> no survivals
				}
				// End calculating survived revisions
				
				/*
				console.log("Anchor: " + anchor);
				console.log("Days survived: " + recalculatedDaysSurvived);
				console.log("Days overall: " + getNumberOfDaysBetween(fromDate, untilDate));
				console.log("survivals: " + survivals);
				console.log("totalPeriodRevisions: " + totalPeriodRevisions);
				*/
				
				daysBetween = getNumberOfDaysBetween(fromDate, untilDate);
				rank =  0.5 * (recalculatedDaysSurvived / daysBetween) +  0.5 * (survivals / totalPeriodRevisions);
				if(period === "year") {
					if(!tagYearJSON[tempYear]) {
						tagYearJSON[tempYear] = {};
					} 
					tagYearJSON[tempYear][anchor] = parseInt(rank * 100) + 1;
				}
				if(period === "month") {
					if(!tagMonthJSON[tempYear]) {
						tagMonthJSON[tempYear] = {};
					}
					if(!tagMonthJSON[tempYear][tempMonth]) {
						tagMonthJSON[tempYear][tempMonth] = {};
					}					
					tagMonthJSON[tempYear][tempMonth][anchor] = parseInt(rank * 100) + 1
				}
				
				if(isNaN(rank)) {
					//console.log("haha!");
				}
				row = [];
				row.push("<a href='#anchor_chronology_part' class='anchor_element'>" + anchor + "</a>");

				row.push(recalculatedDaysSurvived.toFixed(2));
				row.push(survivals);
				row.push(recalculatedIntroductions);
				row.push(rank.toFixed(2));
				result.push(row);
			}
		}
	}
	//var test = $.parseJSON(tagJSON);
	return result;
}

/**
 * @return {number}
 */
function SortByName(a, b){
  var aName = a.name.toLowerCase();
  var bName = b.name.toLowerCase(); 
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function getTagYearJSON(){
	return tagYearJSON;
}

function constructFullTagMonthArray(anchorArray) {
	var result = [];
	var yearResult;
	var monthResult;
	var tempValue;
	var tempPair;
	var jsonData = tagMonthJSON;
	var anchor;
	anchorArray.sort();
	for (var year in jsonData) {
		yearResult = [year, []];
		for(var month in jsonData[year]) {
			monthResult = [month, []];
			for(var i = 0; i < anchorArray.length; i++) {
				anchor = anchorArray[i];
				if(jsonData[year][month][anchor]) {
					tempPair = [anchor, jsonData[year][month][anchor]];
				} else {
					tempPair = [anchor, 1];
				}
				monthResult[1].push(tempPair);
			}	
			yearResult[1].push(monthResult);
		}	
		result.push(yearResult);
	}
	return result;
}

function constructFullTagYearArray(anchorArray) {
	var result = [];
	var yearResult;
	var tempValue;
	var tempPair;
	var jsonData = tagYearJSON;
	var anchor;
	anchorArray.sort();
	for (var year in jsonData) {
		yearResult = [year, []];
		for(var i = 0; i < anchorArray.length; i++) {
			anchor = anchorArray[i];
			if(jsonData[year][anchor]) {
				tempPair = [anchor, jsonData[year][anchor]];
			} else {
				tempPair = [anchor, 1];
			}
			yearResult[1].push(tempPair);
		}
		result.push(yearResult);
	}
	return result;
}

function getAnchorLifeTimeFromJSON(anchorJSON) {
	var result = [];
	var startTime;
	var endTime;
	var id = 0;
	var period = anchorJSON[id];
	var currentTime = new Date().getTime();
	while(period) {
		startTime = period["start"];
		if(result.length !== 0) {
			result.push([startTime.getTime(), 0]);
		} else {
			result.push([startTime.getTime() - 1000000000, 0]);
			result.push([startTime.getTime(), 0]);
		}		
		result.push([startTime.getTime(), 1]);
		endTime = period["end"];
		if(endTime) {
			result.push([endTime.getTime(), 1]);
			result.push([endTime.getTime(), 0]);
		}
		period = anchorJSON[++id]
	}
	if(anchorJSON[--id]["end"]) { // Add finishing non exist line
		result.push([currentTime, 0]);
	} else { // add finishing exist line
		result.push([currentTime, 1]);
	}
	return result;
}

function getFirstAnchorInJSON(anchorJSON) {
	var firstProp;
	for(var key in anchorJSON) {
		if(anchorJSON.hasOwnProperty(key)) {
			firstProp = anchorJSON[key];
		if(firstProp[0])
			return key;
		}
	}
}

function getDateFromTime(time) {
	var date = new Date(parseInt(time));
	date = date.customFormat("#MMMM#/#YYYY#");
	return date;
}

Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    var dateObject = this;
    YY = ((YYYY=dateObject.getFullYear())+"").slice(-2);
    MM = (M=dateObject.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=dateObject.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dateObject.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)===1)?'st':(dMod===2)?'nd':(dMod===3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);

    h=(hhh=dateObject.getHours());
    if (h===0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=dateObject.getMinutes())<10?('0'+m):m;
    ss=(s=dateObject.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
};

function extractNameFromLink(link) {
	var temp = link;
	var foundStartPos = link.indexOf('>');
	var foundEndPos = link.substr(foundStartPos).indexOf('<');
	var result = link.substring(foundStartPos + 1, foundStartPos + foundEndPos);
	return result;
}

function getDissimilarityOfAnchorArrays(array1, array2) {
	if(array1.length === 0 || array2.length === 0) {
		return 0;
	}
	var i = 0;
	var totalScore = 0.0;
	var totalScore2 = 0.0;
	var secondMultiplier = 1;
	var tempAnchors = {};
	while(array2[i]) {
		totalScore += parseFloat(array2[i][1]);
		tempAnchors[extractNameFromLink(array2[i][0])] = parseFloat(array2[i][1]);
		i++;
	}
	var endScore = totalScore;
	i = 0;
	var tempName;
	while(array1[i]) {
		totalScore2 += parseFloat(array1[i][1]);
		tempName = extractNameFromLink(array1[i][0]);
		if(tempAnchors[tempName] > 0) {
			if(tempAnchors[tempName] > array1[i][1]) {
				endScore -= parseFloat(array1[i][1]);
			} else {
				endScore -=	tempAnchors[tempName];
			}
			if(endScore < 0) {
				endScore = 0;
			}
		}
		i++;
	}
	if(totalScore2 > totalScore) {
		secondMultiplier = totalScore / totalScore2;
	}
	if(totalScore > 0) {
		return 1 - ((1-(endScore / totalScore)) * secondMultiplier);
	} else {
		return 0;
	}
}


function getDissimilarityOfAnchorArrays2(array1, array2) {
	if(array1.length === 0 || array2.length === 0) {
		return 0;
	}
	var i = 0;
	var totalScore = 0.0;
	var jointScore = 0.0;
	var tempAnchors = {};
	var anchorsPrevious = {};
	var anchorsCurrent = {};
	var tempName;
	
	while(array1[i]) {
		//totalScore += parseFloat(array1[i][1]);
		tempName = extractNameFromLink(array1[i][0]);
		anchorsCurrent[tempName] = parseFloat(array1[i][1]);
		tempAnchors[tempName] = parseFloat(array1[i][1]);
		i++;
	}
	i = 0;
	while(array2[i]) {
		//totalScore += parseFloat(array2[i][1]);
		tempName = extractNameFromLink(array2[i][0]);
		anchorsPrevious[tempName] = parseFloat(array2[i][1]);
		tempAnchors[extractNameFromLink(array2[i][0])] = parseFloat(array2[i][1]);
		i++;
	}
	
	var tempCurrent;
	var tempPrevious;
	for(var anchor in tempAnchors) {
		tempCurrent = anchorsCurrent[anchor];
		if(!tempCurrent) {
			tempCurrent = 0.0;
		}
		tempPrevious = anchorsPrevious[anchor];
		if(!tempPrevious) {
			tempPrevious = 0.0;
		}
		totalScore += Math.max(tempCurrent, tempPrevious);
		jointScore += Math.min(tempCurrent, tempPrevious);
	}
	if(totalScore > 0 && jointScore > 0) {
		return 1 - (jointScore / totalScore);
	} else {
		return 0;
	}
}

function getNewAnchorsFromArrays(array1, array2) {
	//if(array1.length == 0 || array2.length == 0) {
	//	return 0;
	//}
	var anchorsPrevious = {};
	var anchorsCurrent = {};
	var tempName;
	var newCount = 0;
	var i = 0;
	while(array1[i]) {
		//totalScore += parseFloat(array1[i][1]);
		tempName = extractNameFromLink(array1[i][0]);
		anchorsPrevious[tempName] = parseFloat(array1[i][1]);
		//tempAnchors[tempName] = parseFloat(array1[i][1]);
		i++;
	}
	i = 0;
	while(array2[i]) {
		//totalScore += parseFloat(array2[i][1]);
		tempName = extractNameFromLink(array2[i][0]);
		anchorsCurrent[tempName] = parseFloat(array2[i][1]);
		//tempAnchors[extractNameFromLink(array2[i][0])] = parseFloat(array2[i][1]);
		i++;
	}

	var tempPrevious;
	for(var anchor in anchorsCurrent) {
		tempPrevious = anchorsPrevious[anchor];
		if(!tempPrevious) {
			newCount++;
		}
	}
	return newCount;
}

function getOldAnchorsFromArrays(array1, array2) {
	var anchorsPrevious = {};
	var anchorsCurrent = {};
	var tempName;
	var oldCount = 0;
	var i = 0;
	while(array1[i]) {
		tempName = extractNameFromLink(array1[i][0]);
		anchorsPrevious[tempName] = parseFloat(array1[i][1]);
		i++;
	}
	i = 0;
	while(array2[i]) {
		tempName = extractNameFromLink(array2[i][0]);
		anchorsCurrent[tempName] = parseFloat(array2[i][1]);
		i++;
	}
	
	var tempCurrent;
	
	for(var anchor in anchorsPrevious) {
		tempCurrent = anchorsCurrent[anchor];
		if(!tempCurrent) {
			oldCount++;
		}
	}
	return oldCount;
}

function getAnchorDissimilatyYearArray(anchorSnapshots) {
	var resultArray = [];
	var newDate;
	var i = 2;
	var currentYear = new Date().getFullYear();
	while(anchorSnapshots[i]) {
		if(currentYear !== anchorSnapshots[i][0]) {
			newDate = new Date(parseInt(anchorSnapshots[i][0]), 0, 1, 0, 0, 0);
			resultArray.push([newDate.getTime(), getDissimilarityOfAnchorArrays2(anchorSnapshots[i-1][1], anchorSnapshots[i][1])]); 	
		}
		i++;
	}
	return resultArray;
}

function getArrayForMonth(anchorSnapshots, yearInd, monthInd) {
	var result = [false];
	var savedMonth;
	var i = 0;
	if(anchorSnapshots[yearInd][1]) {
		while(anchorSnapshots[yearInd][1][i]) {
			savedMonth = anchorSnapshots[yearInd][1][i][0];	
			savedMonth = parseInt(savedMonth);
			if(savedMonth === monthInd) {
				result = anchorSnapshots[yearInd][1][i][1];
				break;
			}
			i++;
		}
	}
	return result;
}

function getAnchorDissimilatyMonthArray(anchorSnapshots) {
	var resultArray = [];
	var newDate;
	var i = 0;
	var j = 0;
	var currentMonth;
	var previousMonth;

	//var nextMonth;
	while(anchorSnapshots[i]) { // Assumin that in every year there is at least one edit
		j = 0;
		while(j < 12) {		//anchorSnapshots[i][1][j]
			if(!(i === 0 && j === 0)) {
				currentMonth = getArrayForMonth(anchorSnapshots, i, j);
				if(j === 0) {
					previousMonth = getArrayForMonth(anchorSnapshots, i - 1, 11);
				} else {
					previousMonth = getArrayForMonth(anchorSnapshots, i, j - 1);
				}
				newDate = new Date(parseInt(anchorSnapshots[i][0]), j, 1, 0, 0, 0);
				resultArray.push([newDate.getTime(), getDissimilarityOfAnchorArrays2(previousMonth, currentMonth)]); 	
			}
			j++;
			//console.log("j:" + j);
		}
				
		i++;
		//console.log("i:" + i);
	}
	return resultArray;
}

function getNewAnchorsMonthArray(anchorSnapshots) {
	var resultArray = [];
	var newDate;
	var i = 0;
	var j = 0;
	var currentMonth;
	var previousMonth;
	var month;
	var prevMonth;
	
	//var nextMonth;
	while(anchorSnapshots[i]) { // Assumin that in every year there is at least one edit
		j = 0;
		while (anchorSnapshots[i][1][j]) {
			month = anchorSnapshots[i][1][j][0];
			currentMonth = anchorSnapshots[i][1][j][1];
			newDate = new Date(parseInt(anchorSnapshots[i][0]), month, 1, 0, 0, 0);
			if(!(i === 0 && j === 0)) {
				if(j === 0) { // last available month in the year
					previousMonth = anchorSnapshots[i - 1][1][anchorSnapshots[i - 1][1].length - 1][1];
				} else {
					previousMonth = anchorSnapshots[i][1][j - 1][1];
				}
				resultArray.push([newDate.getTime(), getNewAnchorsFromArrays(previousMonth, currentMonth)]); 	
			} else {
				resultArray.push([newDate.getTime(), getNewAnchorsFromArrays([], currentMonth)]); 
			}
			j++;
		}
		i++;
	}
	return resultArray;
}

function getOldAnchorsMonthArray(anchorSnapshots) {
	var resultArray = [];
	var newDate;
	var i = 0;
	var j = 0;
	var currentMonth;
	var nextMonth;

	//var nextMonth;
	while(anchorSnapshots[i]) { // Assume that in every year there is at least one edit

		j = 0;
		while (anchorSnapshots[i][1][j]) {
			month = anchorSnapshots[i][1][j][0];
			currentMonth = anchorSnapshots[i][1][j][1];
			newDate = new Date(parseInt(anchorSnapshots[i][0]), month, 1, 0, 0, 0);
			if(!(i === (anchorSnapshots.length - 1) && j === (anchorSnapshots[i][1].length - 1))) {
				if(j === (anchorSnapshots[i][1].length - 1)) { // last available month in the year
					nextMonth = anchorSnapshots[i + 1][1][0][1];
				} else {
					nextMonth = anchorSnapshots[i][1][j + 1][1];
				}
				resultArray.push([newDate.getTime(), getOldAnchorsFromArrays(currentMonth, nextMonth)]); 	
			} else {
				//resultArray.push([newDate.getTime(), getNewAnchorsFromArrays([], currentMonth)]); 
			}
			j++;
		}
		i++;

	}
	return resultArray;
}

function calculateAvgAnchorPresenceTime(anchorArray) {
	var result = 0.0;
	var i = 0;
	while(anchorArray[1][i]) {
		result += parseFloat(anchorArray[1][i][1]);
		i++;
	}
	if(anchorArray[1].length) {
		return result / anchorArray[1].length;
	} else {
		return 0;
	}
}

function getAvgAnchorPresenceTimeYearArray(anchorSnapshots) {
	var resultArray = [];
	var newDate;
	var currentYear = new Date().getFullYear();
	var i = 0;
	var year;
	var firstYear = true;
	while(anchorSnapshots[i]) {
		year = anchorSnapshots[i][0];
		if(currentYear !== year && !firstYear) {
			newDate = new Date(parseInt(year), 0, 1, 0, 0, 0);
			resultArray.push([newDate.getTime(), calculateAvgAnchorPresenceTime(anchorSnapshots[i])]); 	
		}
		firstYear = false;
		i++;
	}
	return resultArray;
}

function getAvgAnchorPresenceTimeMonthArray(anchorSnapshots) {
	var resultArray = [];
	var newDate;
	var currentYear = new Date().getFullYear();
	var i = 0;
	var j;
	while(anchorSnapshots[i]) {
		j = 0;
		while(anchorSnapshots[i][1][j]) {
			newDate = new Date(parseInt(anchorSnapshots[i][0]), anchorSnapshots[i][1][j][0], 1, 0, 0, 0);
			resultArray.push([newDate.getTime(), calculateAvgAnchorPresenceTime(anchorSnapshots[i][1][j])]); 	
			j++;
		}
		i++;
	}
	return resultArray;
}

function getMonthName(month) {
	if(month.toString) {
		month = month.toString();
	}
	if(month === "0") {
		return "January";
	} 
	else if(month === "1") {
		return "February";
	}
	else if(month === "2") {
		return "March";
	}
	else if(month === "3") {
		return "April";
	}
	else if(month === "4") {
		return "May";
	}
	else if(month === "5") {
		return "June";
	}
	else if(month === "6") {
		return "July";
	}
	else if(month === "7") {
		return "August";
	}
	else if(month === "8") {
		return "September";
	}
	else if(month === "9") {
		return "October";
	}
	else if(month === "10") {
		return "November";
	}
	else if(month === "11") {
		return "December";
	} else {
		return "";
	}
}

function isInt(n) {
   return n % 1 === 0;
}

function constructColumnsFromAnchorCompareData(array, anchorYearSnapshots) {
	// URI REQUEST ADD YEARS
	//console.log("bla");
	// var firstYear = anchorYearSnapshots[1][0]; replaced
	var firstYear = anchorYearSnapshots[0][0];
	var lastYear = anchorYearSnapshots[anchorYearSnapshots.length - 1][0];
	var resultColumns = [];
	// var j = 1; changed 
	var j = 0;
	resultColumns.push({ "sTitle": "Anchor"});
	for(var i = firstYear; i <= lastYear; i++) {
		resultColumns.push({ "sTitle":  "Strength in " + anchorYearSnapshots[j][0]});
		j++;
	}
	resultColumns.push({ "sTitle": "Strength (sum)"});
	resultColumns.push({ "sTitle": "Strength (sum, adjusted)"});
	return resultColumns;
}


function findMax(array) {
	var max;
	var temp;
	for(var i = 0; i < array.length; i++) {
		temp = array[i][1];
		if(typeof(max) == 'undefined' || max < temp) {
			max = temp;
		}
	}
	return max;
}

function findMin(array) {
	var min;
	var temp;
	for(var i = 0; i < array.length; i++) {
		temp = array[i][1];
		if(typeof(min) == 'undefined' || temp < min) {
			min = temp;
		}
	}
	return min;
}

function studentizeData(array) {
	var max = findMax(array);
	var min = findMin(array);
	var temp;
	for(var i = 0; i < array.length; i++) {
		if((array[i][1] - min) / (max-min) < 0) {
			console.log("got it");
		}
		array[i][1] = (array[i][1] - min) / (max-min);

	}
	return array;
}

function testThis(test) {
	test = test;
}


function debugJump() {
	//console.log("jumped it");
}