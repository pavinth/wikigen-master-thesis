// Wikigen
// This script contains all statistics related functions


var overallEditData = {};
var overallTalkEditData = {};
var distinctEditData = {};
var distinctTalkEditData = {};
var distinctMajorEditData = {};
var distinctMajorTalkEditData = {};

var nonBotEditData = {};
var nonBotTalkEditData = {};
var nonBotDistinctEditData = {};
var nonBotDistinctTalkEditData = {};
var nonBotDistinctMajorEditData = {};
var nonBotDistinctMajorTalkEditData = {};

var registeredEditData = {};
var registeredTalkEditData = {};
var registeredDistinctEditData = {};
var registeredDistinctTalkEditData = {};
var registeredNonBotDistinctMajorEditData = {};
var registeredNonBotDistinctMajorTalkEditData = {};


var anonymousEditData = {};
var anonymousTalkEditData = {};
var anonymousDistinctEditData = {};
var anonymousDistinctTalkEditData = {};
var anonymousDistinctMajorEditData = {};
var anonymousDistinctMajorTalkEditData = {};


var editorsData = {};
var talkEditorsData = {};
var registeredEditorsData = {};
var registeredTalkEditorsData = {};
var botEditorsData = {};
var botTalkEditorsData = {};
var anonymEditorsData = {};
var anonymTalkEditorsData = {};
var nonBotDistinctMajorEditorsData = {};
var nonBotDistinctMajorTalkEditorsData = {};
var registeredNonBotDistinctMajorEditorsData = {};
var registeredNonBotDistinctMajorTalkEditorsData = {};
var foundHiddenUsers = 0;


var botUsers = {};

var backlinksCount = 0;
var doneBacklinks = 0;
var skippedBacklinks = 0;
var strangeBacklinks = 0;
var firstOccurrenceData = {};

// To remember what year was for the first revision
//var lastRevisionYear = 0;
// To remember where was the link found in the first revision
var lastReferenceType = "";
var interruptReferenceStatGeneration = 0;

var overallOccurencesData = {};
var categoryOccurencesData = {};
var definitionOccurencesData = {};
var restOccurencesData = {};
var indirectOccurencesData = {};
var allWoIndirectOccurencesData = {};
var backLinkArrayData = [];



var anchorData = {};
var lastAnchors = {};
var currentAnchors = {};
var anchorRelevantRevisions = {};
var anchorMovements = {};
var lastAPIResultYear;
var anchorYearEvolutionData = [];
var anchorMonthEvolutionData = [];
var anchorFullMonthEvolutionData = [];
var totalAnchorIntroductions = {};
var uniqueAnchorIntroductions = {};
var anchorCompareTable = [];


var lastRev;
var lastMajChg = 0;

var networkDelay = 0;

var revisionCount = 0;
var revisionsArray = [[],[],[]];
var talkRevisionsArray = [[],[],[]];
var revisionsTimeArray = [];
var talkRevisionsTimeArray = [];
var revisionsCountCalculated = false;

// Progress bars part
var editAnalysisCounter = 0;
var talkEditAnalysisCounter = 0;
var anchorAnalysisCounter = 0;
var blinkAnalysisCounter = 0;

function setRevisionCountCalculated() {
	revisionsCountCalculated = true;
}

function updateEditProgressbar() {
	var setPBValue = (editAnalysisCounter/ revisionCount)  * 100;
	$("#edit_progressbar").progressbar('value', setPBValue);
	if(setPBValue > 100) {
		$("#edit_progressbar_div span").text("100%");
	} else {
		$("#edit_progressbar_div span").text(setPBValue.toFixed(0) + "%");
	}
}

function recursiveAnchorPBUpdate(inc, times) {
	//console.log("recursiveAnchorPBUpdate called!");
	if(times > 0) {
		var curValue = $("#anchor_progressbar").progressbar('value');
		curValue += inc;
		$("#anchor_progressbar").progressbar('value', curValue);
		if(curValue > 100) {
			$("#anchor_progressbar_div span").text("100%");
		} else {
			$("#anchor_progressbar_div span").text(curValue.toFixed(0) + "%");
		}

		setTimeout(function() {
			recursiveAnchorPBUpdate(inc, --times);
		}, 1000);
	}
}

function updateBlinkProgressbar() {
	var setPBValue = (blinkAnalysisCounter / backlinksCount) * 100;
	$("#blink_progressbar").progressbar('value', setPBValue);
	$("#blink_progressbar_div span").text(setPBValue.toFixed(0) + "%");
}

var lastAnchorPBUpdateTime;
var lastAnchorPBUpdateValue;

function updateAnchorProgressbar() {
	var setPBValue = (anchorAnalysisCounter / revisionCount) * 100;
	var curTime = new Date().getTime() / 1000; // in seconds
	if(lastAnchorPBUpdateTime) {
		var tDiff = curTime - lastAnchorPBUpdateTime;
		if(tDiff > 3) {
			var vDiff = setPBValue - lastAnchorPBUpdateValue;
			var inc = (vDiff / tDiff) * 0.7;
			var times = parseInt(tDiff);
			$("#anchor_progressbar").progressbar('value', setPBValue);
			if(setPBValue > 100) {
				$("#anchor_progressbar_div span").text("100%");
			} else {
				$("#anchor_progressbar_div span").text(setPBValue.toFixed(0) + "%");
			}

			lastAnchorPBUpdateTime = curTime;
			lastAnchorPBUpdateValue = setPBValue;
			recursiveAnchorPBUpdate(inc, times + 1);
		}
	} else {
		$("#anchor_progressbar").progressbar('value', setPBValue);
	}
}

function getRevisionCount() {
	return revisionCount;
}

function getRevisionDates() {
	return revisionsArray[0];
}

function getRevisionArray() {
	return revisionsArray;
}

function getRevisionTimeArray() {
	return revisionsTimeArray;
}

function getTalkRevisionsTimeArray() {
	return talkRevisionsTimeArray;
}

function getAnchorCompareTable() {
	return anchorCompareTable;
}

function addRevision(revId, revTime, articleType) {
	var date = removeTimeOffSet(new Date(revTime.toLocaleString()));
	var cleanDate = revTime.replace(/[^\d.]/g, "");
	var revisionTime = date.getTime();

	if('talk' === articleType) {
		talkRevisionsArray[0].push(cleanDate);
		talkRevisionsArray[1].push(date);
		talkRevisionsArray[2].push(revId);

		talkRevisionsTimeArray.push([revisionTime, 1]);

	} else {
		revisionsArray[0].push(cleanDate);
		revisionsArray[1].push(date);
		revisionsArray[2].push(revId);

		revisionsTimeArray.push([revisionTime, 1]);
	}
}

function precalculateRevisionCountProcedure(
	title,
	nextPartPointer,
	newNextPartPointer,
	callbackSuccess,
	callbackError,
	articleType
) {
	var url = wikiAPIEndPoint + actionQuery + propRevisions + jsonFormat + rvpropPrefix + "ids|timestamp" + rvlimitMax + titlePrefix + title + newerRevisionDir + callbackJsonp;
	//console.log(url);
	retrieveDataBulk(url, "rvcontinue", nextPartPointer, newNextPartPointer,
		function(data) { // success in recieving data
			checkForNextBulk(data, "revisions", "rvcontinue",
				function(newNextPartPointer) { // More data
					if(data && data.query && data.query.pages) {
						var pages = data.query.pages;
						for (var id in pages) { // look for all pages
							var revisions = pages[id].revisions;
							for(var revid in revisions) {
								addRevision(revisions[revid]["revid"], revisions[revid]["timestamp"], articleType);
								revisionCount++;
							}
						}
					}

					//console.log('There are still more data' + nextPartPointer);
					//revisionCount = revisionCount + 500;
					precalculateRevisionCountProcedure(
						title,
						nextPartPointer,
						newNextPartPointer,
						callbackSuccess,
						callbackError,
						articleType
					);
				},
				function() { // No more data
					//console.log('No more data -> add remaining revisions');
					//here  data must be transferred as an argument if I switch to server architecture
					if(data && data.query && data.query.pages) {
						var pages = data.query.pages;
						for (var id in pages) { // look for all pages
							var revisions = pages[id].revisions;
							for(var revid in revisions) {
								addRevision(revisions[revid]["revid"], revisions[revid]["timestamp"], articleType);
								revisionCount++;
							}
						}
					}
					callbackSuccess();
				}
			);
		}, function() { // error in recieving data
			//console.log('Could not recieve backlinks bulk');
			callbackError();
		}
	);
}

function precalculateRevisionCount(title, callbackSuccess, callbackError) {
	revisionsArray = [[],[],[]];

	var successCallback = function(data) { // success
		callbackSuccess(revisionCount);
	};

	var errorCallback = function(data) { // error
		//console.log('failed to count revisions');
		callbackError();
	};

	// for article page
	precalculateRevisionCountProcedure(
		title,
		"",
		"",
		successCallback,
		errorCallback,
		''
	);

	// for talk page
	precalculateRevisionCountProcedure(
		'Talk:' + title,
		"",
		"",
		successCallback,
		errorCallback,
		'talk'
	);
}

function startMeasuringNetworkDelay() {
	//console.log("Network measured time is reseted")
	networkDelay = 0;
}

function getNetworkDelay() {
	return (networkDelay / 1000);
}

function getBackLinksCount() {
	return(backlinksCount);
}

//Edits related  functions
function getOverallEdits() {
	return(overallEditData["count"]);
}

function getOverallTalkEdits() {
	return(overallTalkEditData["count"]);
}

function getDistinctEdits() {
	return(distinctEditData["count"]);
}

function getDistinctTalkEdits() {
	return(distinctTalkEditData["count"]);
}

function getDistinctMajorEdits() {
	return(distinctMajorEditData["count"]);
}
function getDistinctMajorTalkEdits() {
	return(distinctMajorTalkEditData["count"]);
}

function getNonBotEdits() {
	return(nonBotEditData["count"]);
}

function getNonBotTalkEdits() {
	return(nonBotTalkEditData["count"]);
}

function getNonBotDistinctEdits() {
	return(nonBotDistinctEditData["count"]);
}

function getNonBotDistinctTalkEdits() {
	return(nonBotDistinctTalkEditData["count"]);
}


function getNonBotDistinctMajorEdits() {
	return(nonBotDistinctMajorEditData["count"]);
}

function getNonBotDistinctMajorTalkEdits() {
	return(nonBotDistinctMajorTalkEditData["count"]);
}

function getRegisteredEdits() {
	return(registeredEditData["count"]);
}

function getRegisteredTalkEdits() {
	return(registeredTalkEditData["count"]);
}

function getRegisteredDistinctMajorEdits() {
	return(registeredNonBotDistinctMajorEditData["count"]);
}

function getRegisteredDistinctMajorTalkEdits() {
	return(registeredNonBotDistinctMajorTalkEditData["count"]);
}


function getAnonymousEdits() {
	return(anonymousEditData["count"]);
}

function getAnonymousTalkEdits() {
	return(anonymousTalkEditData["count"]);
}


function getAnonymousDistinctEdits() {
	return(anonymousDistinctEditData["count"]);
}
function getAnonymousDistinctTalkEdits() {
	return(anonymousDistinctTalkEditData["count"]);
}

function getAnonymousDistinctMajorEdits() {
	return(anonymousDistinctMajorEditData["count"]);
}
function getAnonymousDistinctMajorTalkEdits() {
	return(anonymousDistinctMajorTalkEditData["count"]);
}

//Editors related functions
function getEditors() {
	return(editorsData["count"]);
}

function getTalkEditors() {
	return(talkEditorsData["count"]);
}

function getRegisteredEditors() {
	return(registeredEditorsData["count"]);
}

function getRegisteredTalkEditors() {
	return(registeredTalkEditorsData["count"]);
}

function getBotEditors() {
	return(botEditorsData["count"]);
}
function getBotTalkEditors() {
	return(botTalkEditorsData["count"]);
}

function getAnonymEditors() {
	return(anonymEditorsData["count"]);
}

function getAnonymTalkEditors() {
	return(anonymTalkEditorsData["count"]);
}

function getNonBotDistinctMajorEditors() {
	return(nonBotDistinctMajorEditorsData["count"]);
}


function getNonBotDistinctMajorTalkEditors() {
	return(nonBotDistinctMajorTalkEditorsData["count"]);
}

function getRegisteredNonBotMajorEditors() {
	return(registeredNonBotDistinctMajorEditorsData["count"]);
}

function getRegisteredNonBotMajorTalkEditors() {
	return(registeredNonBotDistinctMajorTalkEditorsData["count"]);
}


function getDistinctEditData() {
    return(distinctEditData);
}

function getDistinctTalkEditData() {
	return(distinctTalkEditData);
}


function getDistinctMajorEditData() {
    return(distinctMajorEditData);
}

function getDistinctMajorTalkEditData() {
	return(distinctMajorTalkEditData);
}

function getOverallEditData() {
    return(overallEditData);
}
function getOverallTalkEditData() {
	return(overallTalkEditData);
}

function getNonBotEditData() {
    return(nonBotEditData);
}

function getNonBotTalkEditData() {
	return(nonBotTalkEditData);
}

function getNonBotDistinctEditData() {
    return(nonBotDistinctEditData);
}

function getNonBotDistinctTalkEditData() {
	return(nonBotDistinctTalkEditData);
}

function getNonBotDistinctMajorEditData() {
    return(nonBotDistinctMajorEditData);
}

function getNonBotDistinctMajorTalkEditData() {
    return(nonBotDistinctMajorTalkEditData);
}

function getRegisteredNonBotDistinctMajorEditData() {
    return(registeredNonBotDistinctMajorEditData);
}

function getRegisteredNonBotDistinctMajorTalkEditData() {
	return(registeredNonBotDistinctMajorTalkEditData);
}

function doInterruptReferenceStatGeneration() {
	interruptReferenceStatGeneration = 1;
}

function checkForNextBulk(data, dt, continuePrefix, callbackMoreData, callbackNoMoreData) {
	//console.log('checkForNextBulk');
	if(data && data["query-continue"] && data["query-continue"][dt][continuePrefix])
	{
		callbackMoreData(data["query-continue"][dt][continuePrefix]);
	} else {
		callbackNoMoreData();
	}
}

function retrieveDataBulk(mainUrl, continuePrefix, prevNextPartPointer, nextPartPointer, callbackSuccess, callbackError) {
	var continuePart;
	// Verify next revision and construct corresponding argument if needed
	if(nextPartPointer === "") {
		continuePart = "";
	} else if (typeof(nextPartPointer) == 'undefined' || nextPartPointer == null || prevNextPartPointer === nextPartPointer) {
		//console.log("bad next part pointer");
		callbackError();
	} else {
		//console.log("It is a continue request");
		continuePart = "&" + continuePrefix + "=" + nextPartPointer;
		//console.log("start revision for next bulk is" + continuePart);
	}
	//console.log('retrieveDataBulk from: ' + mainUrl + continuePart);
	// Make request
	//console.log("url: "+ mainUrl + continuePart);
	var startTime = new Date().getTime();
	$.ajax({
		timeout: requestTimeout,
		url: mainUrl + continuePart,
		dataType: 'jsonp',
		jsonp: 'callback',
		success: function(data) {
			var tempTime = new Date().getTime() - startTime;
			networkDelay += tempTime;
			//console.log("adding to network delay " + tempTime);
			if(data.length !== "0"){
				//console.log('request returned: ' + data);
				callbackSuccess(data);
			} else {
				//console.log('request failed');
				callbackError();
			}
		},
		error: function() {
			//console.log('request failed');
			callbackError();
		}
	});
}

// Editors related functions
function getEditorsData() {
	return(editorsData);
}

function getTalkEditorsData() {
    return(talkEditorsData);
}

function getRegisteredEditorsData () {
	return(registeredEditorsData);
}

function getRegisteredTalkEditorsData () {
	return(registeredTalkEditorsData);
}
//
function getAnonymEditorsData () {
	return(anonymEditorsData);
}

function getAnonymTalkEditorsData () {
	return(anonymTalkEditorsData);
}


function getBotEditorsData () {
	return(botEditorsData);
}

function getBotTalkEditorsData () {
	return(botTalkEditorsData);
}


function getNonBotDistinctMajorEditorsData () {
	return(nonBotDistinctMajorEditorsData);
}

function getNonBotDistinctMajorTalkEditorsData () {
    return(nonBotDistinctMajorTalkEditorsData);
}


function getRegisteredNonBotDistinctMajorEditorsData () {
	return(registeredNonBotDistinctMajorEditorsData);
}

function getRegisteredNonBotDistinctMajorTalkEditorsData () {
	return(registeredNonBotDistinctMajorTalkEditorsData);
}

//Blink related functions
function getOverallOccurencesData () {
	return(overallOccurencesData);
}

function getCategoryOccurencesData () {
	return(categoryOccurencesData);
}

function getDefinitionOccurencesData () {
	return(definitionOccurencesData);
}

function getRestOccurencesData () {
	return(restOccurencesData);
}

function getIndirectOccurencesData () {
	return(indirectOccurencesData);
}

function getAllWoIndirectOccurencesData () {
	return(allWoIndirectOccurencesData);
}

function getBackLinkArrayData() {
	return backLinkArrayData;
}


//Anchor related functions
function getAnchorMovements() {
	return anchorMovements;
}

function getAnchorRelevantRevisions() {
	return anchorRelevantRevisions;
}


function getAnchorYearEvolutionData() {
	return anchorYearEvolutionData;
}


function getAnchorMonthEvolutionData() {
	 return anchorMonthEvolutionData;
}

function getAnchorFullMonthEvolutionData() {
	return anchorFullMonthEvolutionData;
}

function getTotalAnchorIntroductions() {
	return totalAnchorIntroductions;
}

function getUniqueAnchorIntroductions() {
	return uniqueAnchorIntroductions;
}


// EDITS RELATED PART (+bots\nonbots)
function addUpToStats(year, statType, month) {
	if(!statType[year]) {
		statType[year] = {"count" : 1};
		statType[year][month] = 1;
	} else {
		var savedYearCounter = statType[year]["count"];
		savedYearCounter++;
		statType[year]["count"] = savedYearCounter;
		var savedMonthCounter = statType[year][month];
		if(!savedMonthCounter) {
			statType[year][month] = 1;
		} else {
			savedMonthCounter++;
			statType[year][month] = savedMonthCounter;
		}
	}
	if(!statType["count"]) {
		statType["count"] = 1;
	}
	else {
		statType["count"] = statType["count"] + 1;
	}
}

// EDITORS related stats
function addUpToEditorsStats(user, year, statType, month) {
	var savedUser;
	var savedYearCounter;
	var savedMonthCounter;
	if(!statType[year]) {
		statType[year] = {"count" : 1};
		statType[year][user] = true;
		// month part
		statType[year][month] = {"count" : 1};
		statType[year][month][user] = true;
	} else {
		savedYearCounter = statType[year]["count"];
		savedUser = statType[year][user];
		if(!savedUser) {
			savedYearCounter++;
			statType[year][user] = true;
			statType[year]["count"] = savedYearCounter;
		}
		//month part
		if(!statType[year][month]) {
			statType[year][month] = {"count" : 1};
			statType[year][month][user] = true;
		} else {
			savedMonthCounter = statType[year][month]["count"];
			savedUser = statType[year][month][user];
			if(!savedUser) {
				savedMonthCounter++;
				statType[year][month]["count"] = savedMonthCounter;
				statType[year][month][user] = true;
			}
		}
	}
	if(!statType["count"]) {
		statType["count"] = 1;
		statType[user] = true;
	}
	else {
		savedUser = statType[user];
		savedYearCounter = statType["count"];
		if(!savedUser) {
			savedYearCounter++;
			statType[user] = true;
			statType["count"] = savedYearCounter;
		}
	}
}

function getUserIsABot(user) {
	var isABot = botUsers[user];
	if(typeof(isABot) == 'undefined') {
		isABot = false;
	}
	return isABot;
}

function getUserIsAnonym(user) {
	return fnValidateIPAddress(user);
}

function userPartOfEditStatistics(user, year, month, callback) {
	//console.log('userPartOfEditStatistics');
	var isABot = getUserIsABot(user);
	var isAnonym = fnValidateIPAddress(user);
	addUpToEditorsStats(user, year, editorsData, month);
	if(isABot) {
		addUpToEditorsStats(user, year, botEditorsData, month);
		addUpToEditorsStats(user, year, registeredEditorsData, month);
	} else {
		if(isAnonym) {
			addUpToEditorsStats(user, year, anonymEditorsData, month);
		} else {
			addUpToEditorsStats(user, year, registeredEditorsData, month);
		}
	}
	callback(isABot, isAnonym);
}

function talkUserPartOfEditStatistics(user, year, month, callback) {
	var isABot = getUserIsABot(user);
	var isAnonym = fnValidateIPAddress(user);
	addUpToEditorsStats(user, year, talkEditorsData, month);
	if(isABot) {
		addUpToEditorsStats(user, year, botTalkEditorsData, month);
		addUpToEditorsStats(user, year, registeredTalkEditorsData, month);
	} else {
		if(isAnonym) {
			addUpToEditorsStats(user, year, anonymTalkEditorsData, month);
		} else {
			addUpToEditorsStats(user, year, registeredTalkEditorsData, month);
		}
	}
	callback(isABot, isAnonym);
}

function parseAndSaveBots(data, callbackSuccess, callbackError) {
	//console.log('parseBulkForOverallEditStats');
	if(data && data.query && data.query.allusers) {
		var allusers = data.query.allusers;
		var botName;
		for (var id in allusers) { // look for all bots
			botName = allusers[id].name;
			botUsers[botName] = true;
		}
		callbackSuccess();
	} else {
		callbackError();
	}
}

function getAndSaveAllBotsProcedure(prevNextBot, nextBot, callbackSuccess, callbackError) {
	//console.log('getAndSaveAllBotsProcedure');
	var url = wikiAPIEndPoint + actionQuery + jsonFormat + listallUsers + groupBot + aulimitMax;
	//console.log(url);
	// RevisionAllbots linksnLink
	// http://en.wikipedia.org/w/api.php?action=query&list=allusers&augroup=bot&aulimit=max&aufrom=PlankBot
	retrieveDataBulk(url, "aufrom", "", nextBot, function(data) {
			//console.log('successfully retrieved data bulk');
			parseAndSaveBots(data,
				function() { // success in parsing
					checkForNextBulk(data, "allusers", "aufrom",
						function(newNextBot) { // there are more bots
							//console.log('retrieved new bots -> start saving the bulk');
							getAndSaveAllBotsProcedure(nextBot, newNextBot, callbackSuccess, callbackError);
						},
						function() { // there are no more bots
							//console.log('no more bots -> continue');
							callbackSuccess();
						}
					);
				},
				function() { // no success in parsing
					//console.log('error while parsing bots data');
					callbackError();
				}
			);
		},
		function() {
			//console.log('Could not recieve data bulk');
			callbackError();
		}
	);
}

function getAndSaveAllBots(callbackSuccess, callbackError) {
	//console.log('getAndSaveAllBots');
	getAndSaveAllBotsProcedure("", "",
		function() {
			//console.log('Saved all bots!');
			callbackSuccess();
		},
		function() {
			//console.log('could not saved all bots!');
			callbackError();
		}
	);
}

function generateHiddenName() {
	var result = "hidden_" + (foundHiddenUsers + 1).toString();
	foundHiddenUsers++;
	return result;
}

/*
0. Add up to overall edits
1. Is the user differs to previous one?
    1. If yes
		1. add up to distinct edits json
		2. add up to distinct edits var (combine)
		3. if not a minor
			1. add up to major distinct
2. If this is not a minor edit
	1. If not minor
		1. add up to major edits json
.
. Give minor\major ratio
. Give distinct\overall edits ration
*/
function parseBulkForOverallEditStats(data, fromDate, untilDate, callback) {
	//console.log('parseBulkForOverallEditStats + start ' + fromDate);
	//console.log('parseBulkForOverallEditStats + end ' + untilDate);
	if(data && data.query && data.query.pages) {
		var currentRevision;
		var pages = data.query.pages;
		var date;
		var year;
		var month;
		var lastDate;
		var lastYear;
		var lastMonth;
		var editor;
		var lastEditor;
		var bot;
		var iterations = 0;
		for (var id in pages) { // look for all pages
			var revisions = pages[id].revisions;
			for(var revid in revisions) { // look for all revisions of the page
				iterations++;
				editAnalysisCounter++;
				currentRevision = revisions[revid];
				date = removeTimeOffSet(new Date(currentRevision.timestamp.toLocaleString()));
				//console.log(date);
				if(date < fromDate || date > untilDate) {
					console.log('revisions outside analysis frame');
					// set last revision to the current one anyway
					lastRev = currentRevision;
				} else {
					editor = currentRevision.user;
					if(typeof(editor) == 'undefined') {
						editor = generateHiddenName();
					}

					bot = getUserIsABot(editor);
					if(lastRev && typeof(lastRev.minor) == 'undefined') { // it is not a minor change in the sequence (attention this is NOT about distinct one ... but in a row)
						lastMajChg++;
					}
					if(lastRev && lastRev.user !== editor) { // we have a new user -> LAST revision is a distinct one
						// Get the date of the last revision
						lastDate = removeTimeOffSet(new Date(lastRev.timestamp.toLocaleString()));
						lastYear = lastDate.getFullYear();
						lastMonth = lastDate.getMonth();
						lastEditor = lastRev.user;
						if(typeof(lastEditor) == 'undefined') {
							lastEditor = generateHiddenName();
						}
						// Do edits part
						addUpToStats(lastYear, distinctEditData, lastMonth);
						if(lastMajChg > 0) { // is a major change since there was at least one major change in the sequence
							//console.log('found a major revision');
							addUpToStats(lastYear, distinctMajorEditData, lastMonth);
						} else { // it was not a major change!
							//console.log('Not a major change');
						}
						userPartOfEditStatistics(lastEditor, lastYear, lastMonth,
							function(isABot, isAnonym) {
								if(!isABot) {	// not a bot
									addUpToStats(lastYear, nonBotDistinctEditData, lastMonth);
									if(lastMajChg > 0) { // is a major change since there was at least one major change in the sequence
										//console.log('found a major revision');
										addUpToStats(lastYear, nonBotDistinctMajorEditData, lastMonth);
										addUpToEditorsStats(lastEditor, lastYear, nonBotDistinctMajorEditorsData, lastMonth);
									} else { // it was not a major change!
										//console.log('Not a major change');
									}
									if(isAnonym) { // anonymous
										// ToDo Should be non bot and not simply anonymous
										//addUpToStats(lastYear, anonymousDistinctEditData, lastMonth);
										if(lastMajChg > 0) {
											// ToDo Should be non bot and not simply anonymous
											//addUpToStats(lastYear, anonymousDistinctMajorEditData, lastMonth);
										}
									} else { // registered nonbot
										// ToDo Should be non bot and not simply registered
										//addUpToStats(lastYear, registeredDistinctEditData, lastMonth);
										if(lastMajChg > 0) {
											addUpToStats(lastYear, registeredNonBotDistinctMajorEditData, lastMonth);
											addUpToEditorsStats(lastEditor, lastYear, registeredNonBotDistinctMajorEditorsData, lastMonth);
										}
									}
								}
							}
						);
						lastMajChg = 0;
					} else { // not distinct - checke
						//console.log('This is not a distinct edit -> cannot be major either, but can be last one');
					}
					// not a distinct edit but one in a sequence
					// ATENTION I MOVED THIS LINE TO THE TOP
					// date = removeTimeOffSet(new Date(currentRevision.timestamp.toLocaleString()));
					year = date.getFullYear();
					month = date.getMonth();
					addUpToStats(year, overallEditData, month);
					lastRev = currentRevision;
					if(typeof(editor) == 'undefined') {
						//console.log("found ya!");
					}
					userPartOfEditStatistics(editor, year, month,
						function(isABot, isAnonym) {
							if(!isABot) {	// not a bot
								addUpToStats(year, nonBotEditData, month);
								if(isAnonym) { // anonymous
									addUpToStats(year, anonymousEditData, month);
								} else { // registered nonbot
									addUpToStats(lastYear, registeredEditData, month);
								}
							}
						}
					);
				}
			}
			lastDate = removeTimeOffSet(new Date(lastRev.timestamp.toLocaleString()));
			if(lastDate < fromDate || lastDate > untilDate) {
				//console.log('revisions outside analysis frame');
			} else {
				lastYear = lastDate.getFullYear();
				lastMonth = lastDate.getMonth();
				lastEditor = lastRev.user;
				// Do edits part
				addUpToStats(lastYear, distinctEditData, lastMonth);
				if(iterations < maxResults) {
					if(typeof(lastRev.minor) == 'undefined') { // it is not a minor change in the sequence (attention this is NOT about distinct one ... but in a row)
						lastMajChg++;
					}
					if(lastMajChg > 0) { // is a major change since there was at least one major change in the sequence
						//console.log('found a major revision');
						addUpToStats(lastYear, distinctMajorEditData, lastMonth);
					} else { // it was not a major change!
						//console.log('Not a major change');
					}
					if(!getUserIsABot(lastEditor)) {	// not a bot
						addUpToStats(lastYear, nonBotDistinctEditData, lastMonth);
						if(lastMajChg > 0) { // is a major change since there was at least one major change in the sequence
							//console.log('found a major revision');
							addUpToStats(lastYear, nonBotDistinctMajorEditData, lastMonth);
							addUpToEditorsStats(lastEditor, lastYear, nonBotDistinctMajorEditorsData, lastMonth);
						} else { // it was not a major change!
							//console.log('Not a major change');
						}
						if(getUserIsAnonym(lastEditor)) { // anonymous
							// see above
							//addUpToStats(lastYear, anonymousDistinctEditData, lastMonth);
							if(lastMajChg > 0) {
								// see above
								//addUpToStats(lastYear, anonymousDistinctMajorEditData, lastMonth);
							}
						} else { // registered nonbot
							addUpToStats(lastYear, registeredDistinctEditData);
							if(lastMajChg > 0) {
								addUpToStats(lastYear, registeredNonBotDistinctMajorEditData, lastMonth);
								addUpToEditorsStats(lastEditor, lastYear, registeredNonBotDistinctMajorEditorsData, lastMonth);
							}
						}
					}
				}
			}
		}
		callback();
	}
}

function parseBulkForOverallTalkEditStats(data, fromDate, untilDate, callback) {
	//console.log('parseBulkForOverallTalkEditStats + start ' + fromDate);
	//console.log('parseBulkForOverallTalkEditStats + end ' + untilDate);
	if(data && data.query && data.query.pages) {
		var currentRevision;
		var pages = data.query.pages;
		var date;
		var year;
		var month;
		var lastDate;
		var lastYear;
		var lastMonth;
		var editor;
		var lastEditor;
		var bot;
		var iterations = 0;
		for (var id in pages) { // look for all pages
			var revisions = pages[id].revisions;
			for(var revid in revisions) { // look for all revisions of the page
				iterations++;
				editAnalysisCounter++;
				currentRevision = revisions[revid];
				date = removeTimeOffSet(new Date(currentRevision.timestamp.toLocaleString()));
				//console.log(date);
				if(date < fromDate || date > untilDate) {
					console.log('revisions outside analysis frame');
					// set last revision to the current one anyway
					lastRev = currentRevision;
				} else {
					editor = currentRevision.user;
					if(typeof(editor) == 'undefined') {
						editor = generateHiddenName();
					}

					bot = getUserIsABot(editor);
					if(lastRev && typeof(lastRev.minor) == 'undefined') { // it is not a minor change in the sequence (attention this is NOT about distinct one ... but in a row)
						lastMajChg++;
					}
					if(lastRev && lastRev.user !== editor) { // we have a new user -> LAST revision is a distinct one
						// Get the date of the last revision
						lastDate = removeTimeOffSet(new Date(lastRev.timestamp.toLocaleString()));
						lastYear = lastDate.getFullYear();
						lastMonth = lastDate.getMonth();
						lastEditor = lastRev.user;
						if(typeof(lastEditor) == 'undefined') {
							lastEditor = generateHiddenName();
						}
						// Do edits part
						addUpToStats(lastYear, distinctTalkEditData, lastMonth);
						if(lastMajChg > 0) { // is a major change since there was at least one major change in the sequence
							//console.log('found a major revision');
							addUpToStats(lastYear, distinctMajorTalkEditData, lastMonth);
						} else { // it was not a major change!
							//console.log('Not a major change');
						}
						talkUserPartOfEditStatistics(lastEditor, lastYear, lastMonth,
							function(isABot, isAnonym) {
								if(!isABot) {	// not a bot
									addUpToStats(lastYear, nonBotDistinctTalkEditData, lastMonth);
									if(lastMajChg > 0) { // is a major change since there was at least one major change in the sequence
										//console.log('found a major revision');
										addUpToStats(lastYear, nonBotDistinctMajorTalkEditData, lastMonth);
										addUpToEditorsStats(lastEditor, lastYear, nonBotDistinctMajorTalkEditorsData, lastMonth);
									} else { // it was not a major change!
										//console.log('Not a major change');
									}
									if(isAnonym) { // anonymous
										// ToDo Should be non bot and not simply anonymous
										//addUpToStats(lastYear, anonymousDistinctEditData, lastMonth);
										if(lastMajChg > 0) {
											// ToDo Should be non bot and not simply anonymous
											//addUpToStats(lastYear, anonymousDistinctMajorEditData, lastMonth);
										}
									} else { // registered nonbot
										// ToDo Should be non bot and not simply registered
										//addUpToStats(lastYear, registeredDistinctEditData, lastMonth);
										if(lastMajChg > 0) {
											addUpToStats(lastYear, registeredNonBotDistinctMajorTalkEditData, lastMonth);
											addUpToEditorsStats(lastEditor, lastYear, registeredNonBotDistinctMajorTalkEditorsData, lastMonth);
										}
									}
								}
							}
						);
						lastMajChg = 0;
					} else { // not distinct - checke
						//console.log('This is not a distinct edit -> cannot be major either, but can be last one');
					}
					// not a distinct edit but one in a sequence
					// ATENTION I MOVED THIS LINE TO THE TOP
					// date = removeTimeOffSet(new Date(currentRevision.timestamp.toLocaleString()));
					year = date.getFullYear();
					month = date.getMonth();
					addUpToStats(year, overallTalkEditData, month);
					lastRev = currentRevision;
					if(typeof(editor) == 'undefined') {
						//console.log("found ya!");
					}
					talkUserPartOfEditStatistics(editor, year, month,
						function(isABot, isAnonym) {
							if(!isABot) {	// not a bot
								addUpToStats(year, nonBotTalkEditData, month);
								if(isAnonym) { // anonymous
									addUpToStats(year, anonymousTalkEditData, month);
								} else { // registered nonbot
									addUpToStats(lastYear, registeredTalkEditData, month);
								}
							}
						}
					);
				}
			}
			lastDate = removeTimeOffSet(new Date(lastRev.timestamp.toLocaleString()));
			if(lastDate < fromDate || lastDate > untilDate) {
				//console.log('revisions outside analysis frame');
			} else {
				lastYear = lastDate.getFullYear();
				lastMonth = lastDate.getMonth();
				lastEditor = lastRev.user;
				// Do edits part
				addUpToStats(lastYear, distinctTalkEditData, lastMonth);
				if(iterations < maxResults) {
					if(typeof(lastRev.minor) == 'undefined') { // it is not a minor change in the sequence (attention this is NOT about distinct one ... but in a row)
						lastMajChg++;
					}
					if(lastMajChg > 0) { // is a major change since there was at least one major change in the sequence
						//console.log('found a major revision');
						addUpToStats(lastYear, distinctMajorTalkEditData, lastMonth);
					} else { // it was not a major change!
						//console.log('Not a major change');
					}
					if(!getUserIsABot(lastEditor)) {	// not a bot
						addUpToStats(lastYear, nonBotDistinctTalkEditData, lastMonth);
						if(lastMajChg > 0) { // is a major change since there was at least one major change in the sequence
							//console.log('found a major revision');
							addUpToStats(lastYear, nonBotDistinctMajorTalkEditData, lastMonth);
							addUpToEditorsStats(lastEditor, lastYear, nonBotDistinctMajorTalkEditorsData, lastMonth);
						} else { // it was not a major change!
							//console.log('Not a major change');
						}
						if(getUserIsAnonym(lastEditor)) { // anonymous
							// see above
							//addUpToStats(lastYear, anonymousDistinctEditData, lastMonth);
							if(lastMajChg > 0) {
								// see above
								//addUpToStats(lastYear, anonymousDistinctMajorEditData, lastMonth);
							}
						} else { // registered nonbot
							addUpToStats(lastYear, registeredDistinctTalkEditData);
							if(lastMajChg > 0) {
								addUpToStats(lastYear, registeredNonBotDistinctMajorTalkEditData, lastMonth);
								addUpToEditorsStats(lastEditor, lastYear, registeredNonBotDistinctMajorTalkEditorsData, lastMonth);
							}
						}
					}
				}
			}
		}
		callback();
	}
}

function resetEditData() {
	overallEditData = {};
	distinctEditData = {};
	distinctMajorEditData = {};
	nonBotEditData = {};
	nonBotDistinctEditData = {};
	nonBotDistinctMajorEditData = {};

	editorsData = {};
	registeredEditorsData = {};
	botEditorsData = {};
	anonymEditorsData = {};
	nonBotDistinctMajorEditorsData = {};
	registeredNonBotDistinctMajorEditorsData = {};
	lastRev = null;
	lastMajChg = 0;

	//revisionCount = 0;
	editAnalysisCounter = 0;

	foundHiddenUsers = 0;

}

function resetTalkEditData() {
	overallTalkEditData = {};
	distinctTalkEditData = {};
	distinctMajorTalkEditData = {};
	nonBotTalkEditData = {};
	nonBotDistinctTalkEditData = {};
	nonBotDistinctMajorTalkEditData = {};

	talkEditorsData = {};
	registeredTalkEditorsData = {};
	botTalkEditorsData = {};
	anonymTalkEditorsData = {};
	nonBotDistinctMajorTalkEditorsData = {};
	registeredNonBotDistinctMajorTalkEditorsData = {};
	lastRev = null;
	lastMajChg = 0;

	//revisionCount = 0;
	editAnalysisCounter = 0;

	foundHiddenUsers = 0;

}

function generateDataForOverallEditStatsPlot(title, fromDate, untilDate, prevNextRevision, nextRevision, callbackSuccess, callbackError) {
	var url = wikiAPIEndPoint + actionQuery + propRevisions + jsonFormat + rvpropPrefix + "ids|timestamp|flags|user" + rvlimitMax + titlePrefix + title + newerRevisionDir + callbackJsonp;

	//var url = "http://localhost:8080/revisions";
	console.log(url);
	retrieveDataBulk(url, "rvcontinue", prevNextRevision, nextRevision,
		function(data) { // success in recieving data
			//console.log('successfully retrieved revision bulk');
			parseBulkForOverallEditStats(data, fromDate, untilDate,
				function() { // parsing of the bulk finished
					updateEditProgressbar();
					checkForNextBulk(data, "revisions", "rvcontinue",
						function(newNextRevision) { // More data
							//console.log('There are still more data' + nextRevision);
							generateDataForOverallEditStatsPlot(title, fromDate, untilDate, nextRevision, newNextRevision, callbackSuccess, callbackError);

						},
						function() { // No more data
							//console.log('No more data -> go over to ploting');
							//here must data be transfered as an argument if I switch to server architecture
							callbackSuccess();
						}
					);
				}
			);
		}, function() { // error in recieving data
			//console.log('Could not recieve revision bulk');
			callbackError();
		}
	);
}

function generateDataForOverallTalkEditStatsPlot(title, fromDate, untilDate, prevNextRevision, nextRevision, callbackSuccess, callbackError) {
	var url = wikiAPIEndPoint + actionQuery + propRevisions + jsonFormat + rvpropPrefix + "ids|timestamp|flags|user" + rvlimitMax + titlePrefix + title + newerRevisionDir + callbackJsonp;
	retrieveDataBulk(url, "rvcontinue", prevNextRevision, nextRevision,
		function(data) { // success in recieving data
			//console.log('successfully retrieved revision bulk');
			parseBulkForOverallTalkEditStats(data, fromDate, untilDate,
				function() { // parsing of the bulk finished
					updateEditProgressbar();
					checkForNextBulk(data, "revisions", "rvcontinue",
						function(newNextRevision) { // More data
							//console.log('There are still more data' + nextRevision);
							generateDataForOverallTalkEditStatsPlot(title, fromDate, untilDate, nextRevision, newNextRevision, callbackSuccess, callbackError);

						},
						function() { // No more data
							//console.log('No more data -> go over to ploting');
							//here must data be transfered as an argument if I switch to server architecture
							callbackSuccess();
						}
					);
				}
			);
		}, function() { // error in recieving data
			//console.log('Could not recieve revision bulk');
			callbackError();
		}
	);
}

function generateOverallEditStats(title, fromDate, untilDate, callbackSuccess, callbackError) {
	resetEditData();
	generateDataForOverallEditStatsPlot(
		title,
		fromDate,
		untilDate,
		"",
		"",
		function(data) { // success
			callbackSuccess(overallEditData);
		},
		function(data) { // error
			callbackError();
		}
	);
}

function generateOverallTalkEditStats(title, fromDate, untilDate, callbackSuccess, callbackError) {
	resetTalkEditData();
	generateDataForOverallTalkEditStatsPlot(
		title,
		fromDate,
		untilDate,
		"",
		"",
		function(data) { // success
			callbackSuccess(overallTalkEditData);
		},
		function(data) { // error
			callbackError();
		}
	);
}


///Anchor Related Call


/*
Plan for implementing anchoring
1. Data structure test (occurrence for single anchor) !!!v!!!
2. Skeleton for the procedure (retrieve \ start process part)
3. Link parser
4. Remaining data + tests
Other plans:
1. Tables
2. Refactoring
3. Optimizing
   3.1 local variables
   3.2 reduce function definition amount (try small example with defining procedures rather than using new.
   3.3 define variables everywhere... just avoid x.y znd x[y] twice or more
   3.4 http://jonraasch.com/blog/10-javascript-performance-boosting-tips-from-nicholas-zakas
   3.5 http://blog.monitis.com/index.php/2011/05/15/30-tips-to-improve-javascript-performance/
   3.6 Cash all selectors
   3.7 Work with fragments and not append live ...
   3.8 return false;  for click events
*/

function addStartDate(anchor, timestamp) {
	//console.log("addStartDate");
	if(!anchorData[anchor]) {
		var anchorCount = anchorData["count"];
		if(!anchorCount) {
			anchorData["count"] = 1;
		} else {
			anchorData["count"] = ++anchorCount; // You have an additional anchor
		}
		anchorData[anchor] = {}
	}
	var countTemp = anchorData[anchor]["count"];
	if(typeof(countTemp) == 'undefined')
		countTemp = 0;
	if(anchorData[anchor][countTemp] && anchorData[anchor][countTemp]["start"]) {
		//console.log("[DEBUG] Critical error: start already set");
		return;
	}
	if(countTemp > 0) {
		var curEndDate = anchorData[anchor][countTemp - 1]["end"];
		if(!curEndDate) {
			//console.log("[DEBUG] Critical error: end date not set be able to start new date");
			return;
		}
	}
	anchorData[anchor][countTemp] = {"start" : timestamp}
	anchorData[anchor]["count"] = countTemp;
}

function addStopDate(anchor, timestamp) {
	//console.log("addStopDate");
	if(anchorData[anchor]) { // anchor exist
		var currentPeriod = anchorData[anchor]["count"];
		if(typeof(currentPeriod) == 'undefined' || !anchorData[anchor][currentPeriod] || !anchorData[anchor][currentPeriod]["start"] || anchorData[anchor][currentPeriod]["end"]) {
			//console.log("[DEBUG] Critical error: nothing to end: either no start date or already stop date");
			return;
		}
		anchorData[anchor][currentPeriod]["end"] = timestamp;
		anchorData[anchor]["count"] = ++currentPeriod;
	} else {
		//console.log('No anchor exist, cannot set end date');
		return;
	}
}

function checkIfAnchorIsValid(anchor) {
	//console.log('checkIfAnchorIsValid');
	var categoryCheck = anchor.substring(0, 9); // Category
	var langCheck = anchor.substr(2, 1); // language check
	var imageCheck = anchor.substr(0, 6); // image check
	var fileCheck = anchor.substr(0, 5); // File check:
	var wiktionaryCheck = anchor.substr(0, 11); // wiktionary: check:
	// || wikiTemplate == "Template:"
	if(categoryCheck === "Category:" || langCheck === ":" || imageCheck === "Image:" || fileCheck === "File:" || wiktionaryCheck === "wiktionary:") {
		return false;
	} else {
		return true;
	}
}

function removeInfoBox(content, deepness) {
	var nextOpeningBracket = content.indexOf("{{");;
	var nextClosingBracket = content.indexOf("}}");

	if(nextClosingBracket === -1) {
		return ""; // broken content
	} else {
		if(nextOpeningBracket <= nextClosingBracket && nextOpeningBracket > 0) { // step deeper
			return removeInfoBox(content.substring(nextOpeningBracket + 2), ++deepness);
		} else { // we reached the inner one CHECK which level you are
			if(deepness === 0) { // end reached
				return content.substring(nextClosingBracket + 2);
			} else {
				return removeInfoBox(content.substring(nextClosingBracket + 2), --deepness);
			}
		}
	}
}

function checkforInfoBox(content) {
	var infoBoxPos = content.indexOf("{{Infobox");
	if(infoBoxPos > 0) {
		return content.substring(0, infoBoxPos) + removeInfoBox(content.substring(infoBoxPos + 9), 0);
	} else {
		return content;
	}
}

function parseSingleRevisionLinks(content, timestamp) {
	//console.log('parseSingleRevisionLinks');
	content = checkforInfoBox(content);
	var safeCheck = content.indexOf("==");
	if(safeCheck > 0) {
		content = content.substring(0,content.indexOf("=="));
	}
	var findStart = content.indexOf("[[");
	var findEnd;
	var findNested;
	var result;
	var anchorOcurence;
	var tempCurAnchors;
	var findPipe;
	while(findStart > -1) { // found a link start
		findEnd = content.indexOf("]]");
		findNested = content.substr(findStart + 2).indexOf("[["); // to find a possible opening link is before closing
		if(findNested > -1 && findNested < (findEnd - findStart)) { //Nested structure found -> remove outer one
			content = content.substr(findStart + 2);
		} else {
			if(findEnd > findStart) {
				result = content.substring(findStart + 2, findEnd);
				findPipe = result.indexOf("|");
				if(findPipe > 0)
					result = result.substr(0, findPipe);
				if(checkIfAnchorIsValid(result)) { // Anchor is valid: try to save in anchor data
					result = result.toLowerCase().replace("_", " "); // lower case for all terms in order to account for different spellings and replace all underscores
					addStartDate(result, timestamp);
					anchorOcurence = currentAnchors[result];
					if(!anchorOcurence) {
						currentAnchors[result] = true;
						tempCurAnchors = currentAnchors["count"];
						if(!tempCurAnchors)
							currentAnchors["count"] = 1;
						else
							currentAnchors["count"] = ++ tempCurAnchors;
					}
				}
			}
			content = content.substr(findEnd + 2);
		}
		findStart = content.indexOf("[[");
	}
}

function accountForNewAnchors(currentYear, currentMonth) {
	for (var anchor in currentAnchors)	 {
		if(!lastAnchors[anchor]) {
			// Removed from instability
			addUpToStats(currentYear, anchorMovements, currentMonth);
		}
	}
}

function compareRevisions(timestamp) {
	var currentYear = timestamp.getFullYear();
	var currentMonth = timestamp.getMonth();
	// TODO check whether to do it or not
	accountForNewAnchors(currentYear, currentMonth);
	addUpToStats(currentYear, anchorRelevantRevisions, currentMonth); // count how many revisions compared
	if(lastAnchors["count"]) { // if there are any anchors in the previous revision
		var lastAnchor;
		for (var anchor in lastAnchors)	 {
			if(anchor !== "count") {
				if(currentAnchors[anchor]) { // anchor survived
					//var currentSurvivals = anchorData[anchor]["survivals"]
					var currentSurvivalObject = anchorData[anchor]["survivals"];
					//var currentSurvivals = currentSurvivalObject[count];
					if(!currentSurvivalObject) {
						anchorData[anchor]["survivals"] = {};
					} else {
						//anchorData[anchor]["survivals"] = ++currentSurvivals;
					}
					currentSurvivalObject =  anchorData[anchor]["survivals"];
					addUpToStats(currentYear,currentSurvivalObject, currentMonth);
				} else { // anchor did not survive
					addUpToStats(currentYear, anchorMovements, currentMonth);
					addStopDate(anchor, timestamp);
				}
			}
		}
	}
}

function checkDateIsNewer(newDate) {
	if(!lastAPIResultYear) {
		lastAPIResultYear = newDate;
		return true;
	}
	else {
		if(newDate < lastAPIResultYear) {
			return false;
		}
	}
	lastAPIResultYear = newDate;
	return true;
}

function parseRevisionBulkLinks(data, callbackSuccess, callbackError) {
	//console.log('parseBulkForOverallEditStats');
	if(data && data.query && data.query.pages) {
		var pages = data.query.pages;
		var date;
		var year;
		var content;
		var editor;
		var currentRevision;
		var iterations = 0;
		var lastRevision = lastRev; // For performance
		var lastMajChanges = lastMajChg; // For performance
		for (var id in pages) { // look for all pages
			var revisions = pages[id].revisions;
			for(var revid in revisions) { // look for all revisions of the page
				iterations++;
				anchorAnalysisCounter++;
				currentRevision = revisions[revid];
				if(lastRevision && typeof(lastRevision.minor) == 'undefined') { // Last revision was a major change -> remember it (we look at last ones since only last ones can become distinct)
					lastMajChanges++;
				}
				editor = currentRevision.user; // look at the current user
				if(lastRevision && lastRevision.user !== editor) { // Last revision was a distinct one since users from current and last differs
					// check for minors disabled
					//if(lastMajChanges > 0) { // is a major change since there was at least one major change in the sequence of revisions
					//console.log('found previous revision to be a major revision ');
					content = lastRevision['*'];
					if(content) {
						lastContentSize = content;
						date = removeTimeOffSet(new Date(lastRevision.timestamp.toLocaleString()));
						// API bug crash fix
						if(checkDateIsNewer(date)) {
							currentAnchors = {}; // empty the list with anchors
							parseSingleRevisionLinks(content, date); // here the list of current anchors will be updated
							compareRevisions(date);
							lastAnchors = currentAnchors; // set the current list of anchors as the one to compare the next one with
						}
						// end api bug crash fix
					} else {
						//console.log('No content for the revision in parseRevisionBulkLinks');
						//callbackError();
					}
					lastMajChanges = 0;
					//}
				}
				lastRevision = currentRevision;
			}
			if(typeof(lastRevision.minor) == 'undefined')
				lastMajChanges++;
			if(iterations < maxResults) { // maxResults is defined in config. This means we are reached the last revision (except there are exactly maxResult revisions ToDo account for it
				// check for minors disabled
				//if(lastMajChanges > 0) { // is a major change since there was at least one major change in the sequence of revisions
				//console.log('found last distinct revision to be a major revision ');
				content = lastRevision['*'];
				if(content) {
					date = removeTimeOffSet(new Date(lastRevision.timestamp.toLocaleString()));
					if(checkDateIsNewer(date)) {
						currentAnchors = {}; // empty the list with anchors
						parseSingleRevisionLinks(content, date); // here the list of current anchors will be updated
						compareRevisions(date);
						lastAnchors = currentAnchors; // set the current list of anchors as the one to compare the next one with
					}
				} else {
					//console.log('No content for the revision');
					callbackError();
				}
				//}
			}
			lastMajChg = lastMajChanges; // need to update the global one as well
			lastRev = currentRevision; 	// remember globally
		}
		callbackSuccess();
	}
}

function anchorAnalysisProcedure(title, prevNextRevision, nextRevision, callbackSuccess, callbackError) {
	//console.log('startanchorAnalysisProcedure');
	var url = wikiAPIEndPoint + actionQuery + propRevisions  + jsonFormat + rvpropPrefix + "timestamp|content|flags|user" + rvlimitMax + titlePrefix + title + rvFirstSection + newerRevisionDir + callbackJsonp;
	console.log(url);
	retrieveDataBulk(url, "rvcontinue", prevNextRevision, nextRevision,
		function(data) { // success in receiving data
			//console.log('successfully retrieved revision bulk');
			parseRevisionBulkLinks(data,
				function() { // parsing link successful
					updateAnchorProgressbar();
					checkForNextBulk(data, "revisions", "rvcontinue",
						function(newNextRevision) { // More data
							//console.log('There are still more data' + nextRevision);
							anchorAnalysisProcedure(title, nextRevision, newNextRevision, callbackSuccess, callbackError);
						},
						function() { // No more data
							//console.log('No more data -> go over to plotting');
							//here must data be transferred as an argument if I switch to server architecture
							callbackSuccess();
						}
					);
				}, function() { // parsing link error
					//console.log('parsing link error in anchorAnalysisProcedure');
					callbackError();
				}
			);
		}, function() { // error in receiving data
			//console.log('Could not receive revision bulk in anchorAnalysisProcedure');
			callbackError();
		}
	);
}

function startAnchorAnalysis(title, callbackSuccess, callbackError) {
	//console.log('startAnchorAnalysis');
	resetAnchorData();
	anchorAnalysisProcedure(title, "", "",
		function(data) { // success
			//console.log('data successfully generated');
			callbackSuccess(anchorData);
		},
		function(data) { // error
			//console.log('failed to generate data');
			callbackError();
		}
	);
}

function getAnchorData() {
	return anchorData;
}

function resetAnchorData() {
	anchorData = {};
	lastAnchors = {};
	currentAnchors = {};
	lastRev = null;
	lastMajChg = 0;
	anchorAnalysisCounter = 0;
	lastAnchorPBUpdateTime = new Date().getTime() / 1000;
	lastAnchorPBUpdateValue = 0;
	lastAPIResultYear = null;
	anchorRelevantRevisions = {};
	anchorMovements = {};
	anchorMonthEvolutionData = {};
	anchorFullMonthEvolutionData = {};
	totalAnchorIntroductions = {};
	uniqueAnchorIntroductions = {};
	anchorCompareTable = [];
}

function getYearAnchorSnapshots() {
	var overalResult = [];
	var yearResult = [];
	var anchor;
	var fromDate;
	var untilDate;
	//anchorRelevantRevisions
	for(var year in anchorRelevantRevisions) {
		if(year !== "count") {
			fromDate = new Date("01/01/" + year);
			untilDate = new Date("01/01/" + (parseInt(year) + 1).toString());
			yearResult = convertAnchorDataToSnapshotArray(anchorData, fromDate, untilDate, "year");
			// if there are some result
			if(yearResult.length > 0) {
				overalResult.push([year, yearResult]);
			}
		}
	}
	anchorYearEvolutionData = overalResult;
	constructAnchorCompareTable(overalResult);
	return overalResult;
}

function getMonthAnchorSnapshots(full) {
	var overalResult = [];
	var monthResult = [];
	var yearResult = [];
	var anchor;
	var fromDate;
	var untilDate;
	var save = true;
	if(full === true) {
		save = false;
	}
	//anchorRelevantRevisions
	var month;
	for(var year in anchorRelevantRevisions) {
		if(year !== "count") {
			yearResult = [];
			for(month in anchorRelevantRevisions[year]) {
				if(month !== "count") {
					monthResult = [];
					//fromDate = new Date("01/" + getMonthNumber(month) + "/" + year);
					fromDate = new Date(getMonthNumber(month) + "/01/" + year);
					if(month < 11) {
						//untilDate = new Date("01/" + getMonthNumber(month + 1) + "/" + year);
						untilDate = new Date(getMonthNumber(parseInt(month) + 1) + "/01/" + year);
					} else {
						//untilDate = new Date("01/01/" + (parseInt(year) + 1).toString());
						untilDate = new Date("01/01/" + (parseInt(year) + 1).toString());
					}
					monthResult = convertAnchorDataToSnapshotArray(anchorData, fromDate, untilDate, "month", save, full);
					if(monthResult.length > 0) {
						yearResult.push([month, monthResult]);
					}
				}
			}
			//yearResult.push([year, monthResult]);
			if(yearResult.length > 0) {
				overalResult.push([year, yearResult]);
			}

		}

	}
	if(!full) {
		anchorMonthEvolutionData = overalResult;
	} else {
		anchorFullMonthEvolutionData = overalResult;
	}
	return overalResult;
}

function resetAnchorEvolutionStats() {
	totalAnchorIntroductions = {};
	anchorMonthEvolutionData = {};
	anchorFullMonthEvolutionData = {};
	anchorRelevantRevisions = {};
	anchorMovements = {};
	uniqueAnchorIntroductions = {};
	let addDataInitialized = false;
}

/*
Start with the first year snapshot.
Remember the starting year
Go over every anchor
Add it to the supplemental list of already added things (to quickly check whether something in it)
Try to fill the gaps for previous years by checking if there is an entry for every previous year if not place a zero
Add the value for the current year
Take the next year and start again with every anchor
*/


function completeGapsInCompareArray(array, lastYear, startintYear) {
	if(array.length > 0 ) {
		startintYear = array[array.length - 1][0] + 1;
	}
	for(var i = startintYear; i < lastYear; i++) {
		array.push([i, 0]);
	}
}

function convertCompareJsonToTable(json) {
	var i;
	var anchorName;
	var currentYear = new Date().getFullYear();
	var resultTable = [];
	var resultRow;
	var anchorYearArray;
	for (var anchor in json) {
		resultRow = [];
		resultRow.push(anchor);
		anchorYearArray = json[anchor];
		for(var i = 0; i < anchorYearArray.length; i++) {
			// Disabled
			//if(anchorYearArray[i][0] != currentYear) {
			resultRow.push(anchorYearArray[i][1]);
			//}
		}
		resultTable.push(resultRow);
	}
	return resultTable;
}

function completeCompareArray(json, firstYear, lastYear) {
	var startingYear;
	var array;
	var totals;
	var i;
	var j;
	var adjustedTotals;
	for (var anchor in json) {
		j = 0;
		totals = 0;
		adjustedTotals = 0.0;
		array = json[anchor];
		if(array.length > 0 ) {
			startingYear = array[array.length - 1][0] + 1;
		}
		for(i = firstYear; i <= lastYear; i++) {
			if(i >= startingYear) {
				array.push([i, 0]);
			} else {
				totals += parseFloat(array[j][1]);
			}
			j++;
		}
		for(var z = 0; z < array.length; z++) {
			adjustedTotals += ((1 + z) / array.length) * array[z][1];
		}
		array.push([i, totals.toFixed(2)]);
		array.push([i + 1, adjustedTotals.toFixed(3)]);
	}
}

function constructAnchorCompareTable(yearSnapshots) {
	var i;
	var firstYear = true;
	var currentYear = new Date().getFullYear();
	var year;
	var currentAnchorObject;
	var resultTableJson = {};
	var startingYear = false;
	var anchorName;
	var currentAnchorYearArray;
	var j;
	for(var i = 0; i < yearSnapshots.length; i++){
		year = parseInt(yearSnapshots[i][0]);
		// Removed only for full years as Uri's request
		//if(!firstYear && year != currentYear) { // only for full years
		if(!startingYear) {
			startingYear = year;
		}
		j = 0;
		for(var j = 0; j < yearSnapshots[i][1].length; j++){
			currentAnchorObject = yearSnapshots[i][1][j];
			anchorName = currentAnchorObject[0].substring(currentAnchorObject[0].indexOf(">") + 1, currentAnchorObject[0].indexOf("</a"));
			currentAnchorYearArray = resultTableJson[anchorName];
			if(!currentAnchorYearArray) {
				resultTableJson[anchorName] = [];
				currentAnchorYearArray = resultTableJson[anchorName];
			}
			completeGapsInCompareArray(currentAnchorYearArray, year, startingYear);
			currentAnchorYearArray.push([year, parseFloat(currentAnchorObject[4]).toFixed(2)]);
		}
		//}
		firstYear = false;
	}
	completeCompareArray(resultTableJson, startingYear, year);
	anchorCompareTable = convertCompareJsonToTable(resultTableJson);
}


//Backlinks related

/*
Logic
1. Retrieve all backlinks
2. Iterate trough all backlinks and do for every bl:
	1. Get last revision
	2. Remember the year (current timestamp)
	3. Get parsed version of the revision with links\templates
	4. Check if there is a link
	5. If there a link go search first accurance by
		1. Get first revision
		2. Remember the year (and the timestamp)
		3. Get parsed text for the revision with links
		4. Check the links for presence of target article
		5. If found -> do 2 saves 1) save into json a pair (term, timestamp_of_reference) 2) add + 1 to the result output and !!!end!!!
		6. If not found check what would be the next year
			1. If the next year is beyond remembered last revision date
				1. Check whether we found occurance in 4.
				2. If found - do 5. and !!!end!!!
			2. If the next year is below remembered last revision
				1. Get the next year revision
				2. Start from 3. Again!
	6. If not -> check templates (TODO) or remember the bl as one with no found occurance timestamp
		1. If no in templates -> !end!
*/
// Get all backlinks
// http://en.wikipedia.org/w/api.php?action=query&list=backlinks&format=xml&bllimit=max&bltitle=thing&callback=?
// get last revision
// http://en.wikipedia.org/w/api.php?action=query&prop=revisions&format=xml&rvprop=ids|timestamp|content&rvlimit=1&titles=Amdahl%27s%20law&callback=?
// get a particular revision
// http://en.wikipedia.org/w/api.php?action=query&prop=revisions&format=xml&rvprop=ids|timestamp&rvlimit=1&rvstart=2001-01-01T00:00:00Z&rvend=2014-01-01T00:00:00Z&rvdir=newer&titles=User:Froderik&callback=?
// Parse a particular revision
// http://en.wikipedia.org/w/api.php?action=parse&format=xml&oldid=955240

//http://en.wikipedia.org/w/api.php?action=query&prop=revisions&format=xml&rvprop=timestamp&rvlimit=10&rvstart=2006-01-01T00:00:00Z&rvend=2014-01-01T00:00:00Z&rvdir=newer&titles=thing&callback=?

// http://en.wikipedia.org/w/api.php?action=query&prop=revisions&format=xml&rvprop=ids|timestamp&rvlimit=1&titles=User:Froderik&callback=?
// http://en.wikipedia.org/w/api.php?action=query&prop=revisions&format=xml&rvprop=ids|timestamp&rvlimit=1&rvstart=2001-01-01T00:00:00Z&rvdir=newer&titles=User:Froderik&callback=?

// 4 outcomes: category, definition part, rest part, indirect

function resetDataAfterArticleChange() {
	backlinksCount = 0;
}

function resetBacklinkStats() {
	doneBacklinks = 0;
	skippedBacklinks = 0;
	//lastRevisionYear = 0;
	lastReferenceType = "";
	overallOccurencesData = {};
	categoryOccurencesData = {};
	definitionOccurencesData = {};
	restOccurencesData = {};
	indirectOccurencesData = {};
	blinkAnalysisCounter = 0;
	$("#progress_content1").text("");
	$("#progress_content2").text("");
	$("#progress_content3").text("");

}

function countBacklinksProcedure(title, prevNextPartPointer, nextPartPointer, callbackSuccess, callbackError) {
	var url = wikiAPIEndPoint + actionQuery + backlinksAction + jsonFormat + bllimitMax + bltitlePrefix + title + callbackJsonp;
	retrieveDataBulk(url, "blcontinue", prevNextPartPointer, nextPartPointer,
		function(data) { // success in recieving data
			//console.log('successfully retrieved backlink bulk');
			checkForNextBulk(data, "backlinks", "blcontinue",
				function(newNextPartPointer) { // More data
					//console.log('There are still more data' + nextPartPointer);
					backlinksCount = backlinksCount + 500;
					countBacklinksProcedure(title, nextPartPointer, newNextPartPointer, callbackSuccess, callbackError);
				},
				function() { // No more data
					//console.log('No more data -> add remaining backlinks');
					//here must data be transfered as an argument if I switch to server architecture
					if(data && data.query && data.query.backlinks) {
						var backlinks = data.query.backlinks;
						for (var id in backlinks) { // look for all backlinks
							backlinksCount++;
						}
					}
					callbackSuccess();
				}
			);
		}, function() { // error in recieving data
			//console.log('Could not recieve backlinks bulk');
			callbackError();
		}
	);
}

function countBackLinks(title, callback) {
	//console.log('generateOverallEditStats');
	countBacklinksProcedure(title, "", "",
		function(data) { // success
			//console.log('backlinks successfully counted');
			callback(backlinksCount);
		},
		function(data) { // error
			//console.log('failed to count backlinks');
			callback();
		}
	);
}

function resetFirstOccurenceData() {
	firstOccurrenceData	= {};
	alreadyProceed = 0;
	borderID = 0;
	interruptReferenceStatGeneration = 0;
}


function checkForLinkOccurenceInPlain(data, referenedTitle, callbackFound, callbackNotFound, backlink) {
	//console.log('Searching for occurences in article text for: ' + backlink);
	if(data && data["query"] && data["query"]["pages"]) { // recieved not corrupted data
		var pages = data.query.pages;
		for (var id in pages) { // look for all pages
			var revisions = pages[id].revisions;
			for(var revid in revisions) { // look for all revisions of the page
				var currentRevision = revisions[revid];
				if(currentRevision['*']) {
					var content = currentRevision['*'].toLowerCase();
					var searchString = sessionStorage.getItem('selected_article').toLowerCase();
					var foundTermPos = content.indexOf('[[' + searchString);
					var foundCategoryPos = content.indexOf('[[category:' + searchString); //[[Category:Cloud computing
					//var foundDefinition = content.indexOf('==');
					//console.log(content.substring(foundDefinition, 20));
					if(foundCategoryPos !== -1) { // Category found (1)
						callbackFound("category");
					} else {
						if(foundTermPos !== -1) { // Internal link found
							var foundDefinitionPos = content.indexOf('==');
							if(foundTermPos < foundDefinitionPos || foundDefinitionPos === -1) { // in definition part (2)
								callbackFound("definition");
							} else { // in the rest part (3)
								callbackFound("rest");
							}
						} else { // in template \ navigation (4)
							//callbackNotFound();
							callbackFound("indirect");
						}
					}
				} else {
					//console.log('Data is corrupt');
					callbackNotFound("");
				}
			}
		}

	} else {
		console.log('Data is corrupt');
		callbackNotFound("");
	}
}

function checkForLinkOccurence(data, referenedTitle, callbackFound, callbackNotFound) {
	//console.log('checkForLinkOccurence');
	if(data && data.parse && data.parse.links) {
		var links = data.parse.links;
		for (var id in links) { // look for all links
			var title = links[id]['*'];
			if(title === referenedTitle) {
				callbackFound();
				return;
			}
		}
		callbackNotFound();
	}
}

function getYearAndIdOfFirstRevision(data, callbackSuccess, callbackError) {
	//console.log('getYearAndIdOfFirstRevision');
	if(data && data.query && data.query.pages) {
		var pages = data.query.pages;
		for (var id in pages) { // look for all pages
			var revisions = pages[id].revisions;
			if(!revisions) {
				console.log('Error in retrieveing revision R and D Effect');
				callbackSuccess(null, null);
				//callbackError();
			}
			for(var revid in revisions) { // look for all revisions of the page
				var date = removeTimeOffSet(new Date(revisions[revid].timestamp.toLocaleString()));
				//var newDate = date.toUTCString();
				//date = removeTimeOffSet(date);

				/*
				var tomeOffSet = date.getTimezoneOffset();
				date.setHours(date.getHours() + (tomeOffSet / 60));
				*/

				var year = date.getFullYear();
				callbackSuccess(year, revisions[revid].revid);
			}
		}
	} else {
		console.log("error in getYearAndIdOfFirstRevision");
		callbackError();
	}

}

// Both arguments are strings
function saveBacklinkDataForReferenceStats(backlink, year, type, lastType) {
	addUpToStats(year, overallOccurencesData);
	if(lastType !== "indirect") {
		addUpToStats(year, allWoIndirectOccurencesData);
	}
	firstOccurrenceData[backlink] = year;
	if(lastType === "category") {
		addUpToStats(year, categoryOccurencesData);
	} else {
		if(lastType === "definition") {
			addUpToStats(year, definitionOccurencesData);
		} else {
			if(lastType === "rest") {
				addUpToStats(year, restOccurencesData);
			} else {
				addUpToStats(year, indirectOccurencesData);
			}
		}
	}

	// ToDo Remove
	//$("#list_content").append("<a href='http://en.wikipedia.org/wiki/" + backlink + "'" + "target=_'blank'" +">" + backlink + "</a>: " + year + " where?: " + type + "<br/>");
	var row = ["<a href='http://"+wikiLang+".wikipedia.org/wiki/" + backlink + "'" + "target=_'blank'" +">" + backlink + "</a>: ", year, lastType, type];
	backLinkArrayData.push(row);
	doneBacklinks++;
	$("#progress_content1").text("Processed: " + doneBacklinks);
	//$("#references_list_accordion").accordion("refresh");
	// End remove
}

function findEarlyBacklinkOccurenceFast(backlink, referenedTitle, nextYear, callbackSuccess, callbackError, lastType, lastRevisionYear) {
	//console.log('Starting to search for early occurence FAST for ' + backlink + " in year " + nextYear + " and already found the first one in " + lastType);
	var revisionURL = wikiAPIEndPoint + actionQuery + propRevisions + jsonFormat + rvpropPrefix + "ids|timestamp|content" + rvlimit1 + rvStartPrefix + nextYear + "-01-01T00:00:00Z" +rvNewerDirection + titlePrefix + backlink + callbackJsonp;
	console.log(revisionURL);
	retrieveDataBulk(revisionURL, "", "", "", function(data) { // success in recieving data (1 item which is the first revision in the given year)
			//console.log('successfully retrieved revision of the given year for the backlink: ' + backlink);
			getYearAndIdOfFirstRevision(data,
				function(year, revid) { // year of the first revision is retrieved
					//if(nextYear < )
					nextYear = year;

					checkForLinkOccurenceInPlain(data, referenedTitle, function(type) { // found a link within links of the last current earlier revision -> save and return

							if(type && type !== "indirect") {// TODO strange
								//console.log('First occurance of a link was found in the plain and not indirect for: ' + backlink + " in year " + nextYear.toString() + " in " + type);
								saveBacklinkDataForReferenceStats(backlink, nextYear.toString(), type, lastType);
								callbackSuccess(type);
							} else { // type of found reference is incorrect or its indirect
								//console.log('Somehow indirect was return in search in the plain text! achtung!  for: ' + backlink + " in year " + nextYear.toString());
								// Try next year
								var tempYear = parseInt(nextYear);
								tempYear++;
								if(tempYear <= lastRevisionYear) { // search further
									nextYear = tempYear.toString();
									findEarlyBacklinkOccurenceFast(backlink, referenedTitle, nextYear, callbackSuccess, callbackError, lastType, lastRevisionYear);
								} else { // no revisions available in this year
									saveBacklinkDataForReferenceStats(backlink, lastRevisionYear.toString(), type, lastType);
									callbackSuccess(lastType);
								}
							}
						},
						function(type) { //  not found within links of the current earlier revision -> search further
							//console.log('Nothing found in plain text for: ' + backlink + " in year " + nextYear.toString());
							// Try next year

							// ToDo redundant!
							var tempYear = parseInt(nextYear);
							tempYear++;
							if(tempYear <= lastRevisionYear) { // search further
								nextYear = tempYear.toString();
								findEarlyBacklinkOccurenceFast(backlink, referenedTitle, nextYear, callbackSuccess, callbackError, lastType, lastRevisionYear);
							} else { // no revisions available in this year
								saveBacklinkDataForReferenceStats(backlink, lastRevisionYear.toString(), type, lastType);
								callbackSuccess(lastType);
							}
						}, backlink
					);

				},
				function() { // could not retrieve year and id for first revision
					//console.log('Could not retrieved first revision');
					callbackError();
				}
			);
		}, function() { // error in recieving data
			//console.log('Could not receive backlinks bulk');
			callbackError();
		}
	);
}

function findEarlyBacklinkOccurence(backlink, referenedTitle, nextYear, callbackSuccess, callbackError, lastType, lastRevisionYear) {
	//console.log('Starting to search for early occurence SLOW for ' + backlink + " in year " + nextYear + " and already found the first one in " + lastType);

	var revisionURL = wikiAPIEndPoint + actionQuery + propRevisions + jsonFormat + rvpropPrefix + "ids|timestamp" + rvlimit1 + rvStartPrefix + nextYear + "-01-01T00:00:00Z" +rvNewerDirection + titlePrefix + backlink + callbackJsonp;
	//console.log(revisionURL);
	retrieveDataBulk(revisionURL, "rvcontinue", "", "",
		function(data) { // success in recieving data (1 item which is the first revision in the given year)
			//console.log('successfully retrieved revision of the given year for the backlink: ' + backlink);
			getYearAndIdOfFirstRevision(data,
				function(year, revid) { // year of the first revision is retrieved
					//if(nextYear < )
					if(year) {	// no revisions found in the year
						nextYear = year;
						retrieveAnyParsedRevision(revid, "links", backlink, referenedTitle,
							function(data) { // Successfuly got the last parsed revision
								checkForLinkOccurence(data, referenedTitle,
									function() { // found a link within links of the last current earlier revision -> save and return
										//console.log('Last occurance of a link was found in the year: ' + nextYear.toString());
										saveBacklinkDataForReferenceStats(backlink, nextYear.toString(), "*", "indirect");
										callbackSuccess();
									},
									function() { //  not found within links of the current earlier revision -> search further
										//console.log('No occurence of a link was found in the year '+ nextYear);
										// Try next year
										var tempYear = parseInt(nextYear);
										tempYear++;
										if(tempYear <= lastRevisionYear) { // search further
											nextYear = tempYear.toString();
											findEarlyBacklinkOccurence(backlink, referenedTitle, nextYear, callbackSuccess, callbackError, lastType, lastRevisionYear);
										} else { // no revisions available in this year
											saveBacklinkDataForReferenceStats(backlink, lastRevisionYear.toString(), "*", "indirect");
											callbackSuccess();
										}
									}
								);
							},
							function() { // could not get last parsed revision
								console.log('Could not retrieved parsed revision');
								callbackError();
							}
						);
					} else { // this happens if there is no revisions in the year but this is not the last year
						saveBacklinkDataForReferenceStats(backlink, lastRevisionYear.toString(), "*", "indirect");
						callbackSuccess();
					}
				},
				function() { // could not retrieve year and id for first revision
					//console.log('Could not retrieved first revision');
					callbackError();
				}
			);
		}, function() { // error in recieving data
			console.log('Could not recieve backlinks bulk');
			callbackError();
		}
	);
}

function retrieveAnyParsedRevision(revid, contents, backlink, referenedTitle, callbackSuccess, callbackError) {
	//console.log('retrieveAnyParsedRevision');
	var url = wikiAPIEndPoint + actionParse + jsonFormat + revisionIdPrefix + revid + propPrefix + contents;
	//console.log(url);
	retrieveDataBulk(url, "", "", "",
		function(data) { // success in receiving data
			//console.log('successfully retrieved data bulk');
			callbackSuccess(data);
		}, function() { // error in receiving data
			//console.log('Could not receive data bulk');
			callbackError();
		}
	);
}

// ToDo replace
function findFirstBacklinkOccurence(backlink, referenedTitle, callbackSuccess, callbackError) {
	//console.log('We actually start to search for first occurrences for: ' + backlink);
	//if(backlink == "100 metres")
	//	//console.log('got ya');
	var lastRevisionURL = wikiAPIEndPoint + actionQuery + propRevisions + jsonFormat + rvpropPrefix + "ids|timestamp|content" + rvlimit1 + titlePrefix + backlink + callbackJsonp;
	//console.log("url for finding first occurrence is: " + lastRevisionURL);
	var lastRevisionYear;
	retrieveDataBulk(lastRevisionURL, "rvcontinue", "", "",
		function(data) { // success in receiving data (1 item which is the very last revision)
			//console.log('successfully retrieved last revision for the backlink ' + backlink);
			getYearAndIdOfFirstRevision(data,
				function(year, revid) { // year of the first revision is retrieved
					lastRevisionYear = parseInt(year); // remember the last year of occurence
					//console.log("Last revision year for current backlink " + backlink + " is: " + lastRevisionYear);

					checkForLinkOccurenceInPlain(data, referenedTitle,
						function(type) { // found a link within links of the last revision -> search for first occurance
							//console.log('We found first occurrence in plain text for: ' + backlink + " in: " + type);
							if(type) {
								//console.log('Last occurrence of a link was found, type is: ' + type);
								lastReferenceType = type;
								if(type === "indirect") {
									/*
									alreadyProceed++; // remember how many backlinks we have already proceeded in parallel
									skippedBacklinks++; // update the gobal var for displaying progress
									blinkAnalysisCounter++;
									updateBlinkProgressbar();
									$("#progress_content2").text("Skipped: " + skippedBacklinks); // update the client
									callbackSuccess();
									*/
									findEarlyBacklinkOccurence(backlink, referenedTitle, "2001",
										function() { // early occurrence found
											//console.log('EarliestOccurrence was found slow!');
											callbackSuccess();
										},
										function() { // could not find early occurence
											//console.log('EarliestOccurrence was not found in normal one!');
											callbackError();
										},
										type, lastRevisionYear
									);
								} else {
									findEarlyBacklinkOccurenceFast(backlink, referenedTitle, "2001",
										function() { // early occurrence found
											//console.log('EarliestOccurrence was found fast!');
											callbackSuccess();
										},
										function() { // could not find early occurence
											//console.log('EarliestOccurrence was not found! in fast one');
											callbackError();
										},
										type, lastRevisionYear
									);
								}

							} else { // type of found reference is incorrect
								console.log('Incorrect type of the found link');
								callbackError();
							}
						},
						function() { //  not found within links -> search within templates links
							//console.log('We could not fiund first occurence in plain text for: ' + backlink);
							//console.log('No occurence of a link was found in the last revision');
							strangeBacklinks++;
							$("#progress_content3").text("Strange: " + strangeBacklinks);
							// ToDo Implement template search
							callbackSuccess();
						}, backlink
					);

				},
				function() { // could not retrieve
					console.log('Could not get year and id of the revision');
					callbackError();
				}
			);
		}, function() { // error in receiving data
			console.log('Could not receive last revision for backlink');
			callbackError();
		}
	);
}

function getIsMainArticle(title) {
	var userOrTalkPart = title.substring(0,5); // User: or Talk:
	var userTalkOrWikipediaPart = title.substring(0, 10); // User talk: or Wikipedia:
	var wikiTalkPart =  title.substring(0, 15); //
	var wikiTemplate =  title.substring(0, 9); //
	var wikiPortal =  title.substring(0, 7); //
	var wikiTemplateTalk =  title.substring(0, 14); // Template talk:
	var wiktionaryCheck = title.substring(0, 11); // wiktionary: check:

	//Category:
	// || wikiTemplate == "Template:"
	return !(wikiPortal === "portal:" || userOrTalkPart === "User:" || userOrTalkPart === "Talk:" || userTalkOrWikipediaPart === "User talk:" || userTalkOrWikipediaPart === "Wikipedia:" || userTalkOrWikipediaPart === "File talk:" || wikiTalkPart === "Wikipedia talk:" || wikiTalkPart === "MediaWiki talk:" || wikiTemplateTalk === "Template talk:" || wiktionaryCheck === "wiktionary:");
}

function processNextBackLinkRecursive(referenedTitle, backlinks, nextID, callbackSuccess, callbackError) {
	//console.log('processNextBackLink');
	if(interruptReferenceStatGeneration !== 1) {
		if(backlinks && backlinks[nextID] && backlinks[nextID].title) {
			var backlinktTitle = backlinks[nextID].title.replace(/&/g, "%26").replace(/\+/g, "%2B").replace(/=/g, "%3D") ;
			//console.log('backlinktTitle: ' + backlinktTitle);
			if(getIsMainArticle(backlinktTitle)) {
				findFirstBacklinkOccurence(backlinktTitle, referenedTitle,
					function() { // first occurrence successfully found
						//console.log('First occurence was found for ' + backlinktTitle);
						nextID++;
						//alert('TADAM! 1');
						setTimeout(function() {
								//alert('TADAM!2');
								processNextBackLinkRecursive(referenedTitle, backlinks, nextID, callbackSuccess, callbackError);
							},
							10
						);
					},
					function() { // first occurance was not found
						//console.log('First occurrence could not be found for ' + backlinktTitle);
						callbackError();
					}
				);
			} else {
				//console.log('Not interesting article: ');
				skippedBacklinks++;
				$("#progress_content2").text("Skipped: " + skippedBacklinks);
				nextID++;
				setTimeout(function() {
						//alert('TADAM!2');
						processNextBackLinkRecursive(referenedTitle, backlinks, nextID, callbackSuccess, callbackError);
					},
					10
				);
			}
		} else {
			//console.log('End of backlinks');
			callbackSuccess();
		}
	} else {
		console.log("Some error");
		callbackError();
	}
}

var alreadyProceed = 0;
var borderID = 0;

function delaydFindFirstExecution(cumulativeDelay, backlinktTitle, referenedTitle, callbackSuccess, callbackError) {
	//console.log('Delayed occurrence search is initiated for: ' + backlinktTitle);
	//if(backlinktTitle == "100 metres")
	//	//console.log('got ya');
	setTimeout(function() {
			if(interruptReferenceStatGeneration !== 1) {
				//if(backlinktTitle == "100 metres")
				//	//console.log('got ya');
				findFirstBacklinkOccurence(backlinktTitle, referenedTitle,
					function() { // first occurrence successfully found
						alreadyProceed++;
						blinkAnalysisCounter++;
						updateBlinkProgressbar();
						if(borderID > 0 && alreadyProceed >= borderID) { // border id is set (all executions are initialized) and we have proceed them all
							callbackSuccess();
						}
					},
					function() { // first occurrence was not found
						console.log('First occurrence could not be found for ' + backlinktTitle);
						callbackError();
						return;
					}
				);
			}
		},
		cumulativeDelay
	);
}

function processNextBackLinkBulkInParallel(referenedTitle, backlinks, nextID, callbackSuccess, callbackError) {
	//console.log('processNextBackLinkInParallel');
	var backlinktTitle;
	var cumulativeDelay = 0;
	alreadyProceed = 0;
	var i = 0;
	while(backlinks && backlinks[nextID] && backlinks[nextID].title && i < 2) { // there is a backlink to proceed

		backlinktTitle = backlinks[nextID].title.replace(/&/g, "%26").replace(/\+/g, "%2B").replace(/\=/g, "%3D"); // get the title
		//console.log('Starting to work with article: ' + backlinktTitle);
		if(getIsMainArticle(backlinktTitle)) { // it is main article which we are interested in
			//console.log('It is a main article -> start finding occurrences ');
			cumulativeDelay += 1000;
			// TO STOP BEFORE
			//i++;
			delaydFindFirstExecution(cumulativeDelay, backlinktTitle, referenedTitle, callbackSuccess, callbackError);

		} else { // it is an article to skip -> still count that ine as proceeded of course
			//console.log('Not interesting article: ');
			alreadyProceed++; // remember how many backlinks we have already proceeded in parallel
			skippedBacklinks++; // update the global var for displaying progress
			blinkAnalysisCounter++;
			updateBlinkProgressbar();
			$("#progress_content2").text("Skipped: " + skippedBacklinks); // update the client
		}
		nextID++; // go to the next backlink article
	}
	borderID = nextID; // remember the last id in order to parallel execution to stop when this value is reached
}

function generateDataForReferenceTimelineStats(title, prevNextPartPointer, nextPartPointer, callbackSuccess, callbackError) {
	//console.log('generateDataForReferenceTimelineStats');
	var url = wikiAPIEndPoint + actionQuery + backlinksAction + jsonFormat + bllimitMax + bltitlePrefix + title + callbackJsonp;
	//console.log(url);

	retrieveDataBulk(url, "blcontinue", prevNextPartPointer, nextPartPointer,
		function(data) { // success in receiving data
			//console.log('successfully retrieved backlink bulk');
			if(data && data.query && data.query.backlinks) {
				var backlinks = data.query.backlinks;
				processNextBackLinkBulkInParallel(title, backlinks, 0,
					function() { // all backlinks are processed
						//console.log('All backlinks in the current bulk are processed!');
						// Replace it
						//callbackSuccess();
						checkForNextBulk(data, "backlinks", "blcontinue",
							function(newNextPartPointer) { // More data
								//console.log('There are still more data' + newNextPartPointer);
								generateDataForReferenceTimelineStats(title, nextPartPointer, newNextPartPointer, callbackSuccess, callbackError);
							},
							function() { // No more data
								//console.log('No more data');
								//here must data be transferred as an argument if I switch to server architecture
								callbackSuccess();
							}
						);
					},
					function() { // Error while processing backlinks in the current bulk
						//console.log('Error while processing backlinks in the current bulk');
						callbackError();
					}
				);
			}
		}, function() { // error in receiving data
			//console.log('Could not receive backlinks bulk');
			callbackError();
		}
	);
}

function generateReferenceTimelineStats(title, callbackSuccess, callbackError) {
	// some initializations
	resetFirstOccurenceData();
	generateDataForReferenceTimelineStats(title, "", "",
		function() { // success
			//console.log('data successfully generated');
			callbackSuccess(overallOccurencesData);
		},
		function() { // error
			//console.log('failed to generate data');
			callbackError();
		}
	);
}

/*
1. get all revisions with user and timestamp
2. for every revision
	1. Try to add a total user (counter and name) as procedure checking for existing
	2. Try to add to total users in a year (counter per year and list per year) as procedure checking for existing users
	3. Check if its a registered user
*/
/*
1. Get all revisions
2. For all rev
*/


function getArticleAPIName(articleName, callbackSuccess, callbackError) {
	var url = wikiAPIEndPoint + actionQuery + jsonFormat + propRevisions + rvpropPrefix + "ids" + titlePrefix + articleName + callbackJsonp;
	//console.log(url);
	//http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=ids&format=json&titles=Cloud_computing&callback=?
		retrieveDataBulk(url, "", "", "",
			function(data) {
				//console.log('successfully retrieved data bulk');
				if(data && data["query"] && data["query"]["pages"]) { // received not corrupted data
					for (var id in data.query.pages) { // look for all pages
						var page = data.query.pages[id];
						var pageID = page["pageid"];
						if(pageID && pageID > 0) {
							callbackSuccess(page["title"]);
						} else { // id is corrupt
							//console.log('Page ID is corrupt');
							callbackError();
						}
					}

				} else {
					//console.log('Data is corrupt');
					callbackError();
				}
			},
			function() {
				//console.log('Could not receive data bulk');
				callbackError();
			}
		);
}


//Revision Related

function getFirstRevisionDate(title, callbackSuccess, callbackError) {
	var url = wikiAPIEndPoint + actionQuery + propRevisions + jsonFormat + rvpropPrefix + "timestamp" + rvlimit1 + titlePrefix + title + newerRevisionDir + callbackJsonp;
	//console.log(url);
	//var url = "http://localhost:8080/revisions";
	var content;
	var date;
	retrieveDataBulk(url, "", "", "",
		function(data) {
			if(data && data.query && data.query.pages) {
				//targetRevision = data.query.pages[0];
				var pages = data.query.pages;
				for (var id in pages) { // look for all pages
					var revisions = pages[id].revisions;
					for(var revid in revisions) { // look for all revisions of the page
						date = removeTimeOffSet(new Date(revisions[revid]["timestamp"].toLocaleString()));
						callbackSuccess(date);
						return;
					}
				}
			}
		}, function() { // error in receiving data
			callbackError();
		}
	);
}

function getFirstTalkRevisionDate(title, callbackSuccess, callbackError) {
	var url = wikiAPIEndPoint + actionQuery + propRevisions + jsonFormat + rvpropPrefix + "timestamp" + rvlimit1 + titlePrefix + "Talk:" + title + newerRevisionDir + callbackJsonp;

	//console.log(url);
	var content;
	var date;
	retrieveDataBulk(url, "", "", "",
		function(data) {
			if(data && data.query && data.query.pages) {
				//targetRevision = data.query.pages[0];
				var pages = data.query.pages;
				for (var id in pages) { // look for all pages
					var revisions = pages[id].revisions;
					for(var revid in revisions) { // look for all revisions of the page
						date = removeTimeOffSet(new Date(revisions[revid]["timestamp"].toLocaleString()));
						callbackSuccess(date);
						return;
					}
				}
			}
		}, function() { // error in receiving data
			callbackError();
		}
	);
}

function getLastRevisionDate(title, callbackSuccess, callbackError) {
    //console.log('startanchorAnalysisProcedure');
    var url = wikiAPIEndPoint + actionQuery + propRevisions + jsonFormat + rvpropPrefix + "timestamp" + rvlimit1 + titlePrefix + title + "&rvdir=older" + callbackJsonp;
   //console.log(url);
    var content;
    var time;
    var date;
    retrieveDataBulk(url, "", "", "",
        function (data) { // success in recieving data
            //console.log(data);
            if (data && data.query && data.query.pages) {
                //targetRevision = data.query.pages[0];
                var pages = data.query.pages;
                for (var id in pages) { // look for all pages
                    var revisions = pages[id].revisions;
                    for (var revid in revisions) { // look for all revisions of the page
                        date = removeTimeOffSet(new Date(revisions[revid]["timestamp"].toLocaleString()));
                        callbackSuccess(date);
                        return;
                    }
                }
            }
        }, function () { // error in receiving data
            callbackError();
        }
    );
}



function getTalkLastRevisionDate(title, callbackSuccess, callbackError) {
	//console.log('startanchorAnalysisProcedure');
	var url = wikiAPIEndPoint + actionQuery + propRevisions + jsonFormat + rvpropPrefix + "timestamp" + rvlimit1 + titlePrefix  + "Talk:" + title + "&rvdir=older" + callbackJsonp;
	var content;
	var time;
	var date;
	retrieveDataBulk(url, "", "", "",
		function (data) { // success in recieving data
			//console.log(data);
			if (data && data.query && data.query.pages) {
				//targetRevision = data.query.pages[0];
				var pages = data.query.pages;
				for (var id in pages) { // look for all pages
					var revisions = pages[id].revisions;
					for (var revid in revisions) { // look for all revisions of the page
						date = removeTimeOffSet(new Date(revisions[revid]["timestamp"].toLocaleString()));
						callbackSuccess(date);
						return;
					}
				}
			}
		}, function () { // error in receiving data
			callbackError();
		}
	);
}
