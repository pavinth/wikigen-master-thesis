// WikiGen
// This script is to be used for configuration purposes. Put all constants here!
// 
//////////////////

//http://"+wikiLang+".wikipedia.org/w/api.php?action=query&prop=revisions&format=json&rvprop=timestamp&rvlimit=max&titles="+title+"&callback=?" + rvContinue,

var requestTimeout = 120000;

var wikiLang = "en";
var wikiAPIEndPoint = "http://"+wikiLang+".wikipedia.org/w/api.php?";
var actionQuery = "action=query";
var actionParse = "action=parse";
var propRevisions = "&prop=revisions";
var propLinks = "&prop=links";
var propCategories ="&prop=categories";
var jsonFormat = "&format=json&rawcontinue=";//This is handling of https://www.mediawiki.org/wiki/API:Raw_query_continue
var rvpropPrefix = "&rvprop=";
var linkLimitMax="&pllimit=max";
var rvlimitMax = "&rvlimit=100";
var rvlimit1 = "&rvlimit=1";
var titlePrefix = "&titles=";
var callbackJsonp = "&callback=?";
var backlinksAction = "&list=backlinks";
var bltitlePrefix = "&bltitle=";
var bllimitMax = "&bllimit=max";
var bllimit5 = "&bllimit=5";
var rvprops = "timestamp";
var rvFirstSection = "&rvsection=0";
var revisionIdPrefix = "&oldid=";
var propPrefix = "&prop=";
var rvStartPrefix = "&rvstart=";
var newerRevisionDir = "&rvdir=newer";
var rvNewerDirection = "&rvdir=newer";
var listallUsers = "&list=allusers";
var groupBot = "&augroup=bot";
var aulimitMax = "&aulimit=max";
var floatPrecision = 4;
var maxResults = 500;
var languareChanged = false;
var languageArray = [[],[]];

// RevisionLink

// Spin config
var opts = {
	lines: 9, // The number of lines to draw
	length: 13, // The length of each line
	width: 3, // The line thickness
	radius: 14, // The radius of the inner circle
	corners: 0.3, // Corner roundness (0..1)
	rotate: 0, // The rotation offset
	color: '#ff7f2a', // #rgb or #rrggbb
	speed: 1, // Rounds per second
	trail: 39, // Afterglow percentage
	shadow: true, // Whether to render a shadow
	hwaccel: false, // Whether to use hardware acceleration
	className: 'spinner', // The CSS class to assign to the spinner
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	top: 25, // Top position relative to parent in px
	left: 25 // Left position relative to parent in px
};

function addLanguage(langName, langAbr) {
	languageArray[0].push(langName + " (" + langAbr + ")");
	languageArray[1].push(langAbr);	
}

function getLangAbrByName(name) {
	var temp;
	for(var i = 0; i < languageArray[0].length; i++) {
		temp = languageArray[0][i];
		if(temp === name) {
			return languageArray[1][i];
		}
	}
	return "en";
}

function getLanguageNames() {
	return languageArray[0];	
}

function getLanguageAbr() {
	return languageArray[1];	
}

function getWikiLang() {
	return wikiLang;
}

function setWikiLang(lang) {
	wikiLang = lang;
	wikiAPIEndPoint = "http://"+wikiLang+".wikipedia.org/w/api.php?";
	languareChanged = true;
}

function parseLanguages(data, callbackSuccess, callbackError) {
	if(data && data["parse"] && data["parse"]["langlinks"]) { // recieved not corrupted data
		var langlinks = data.parse.langlinks;
		var languageName;
		var languageShortcut;
		for (var id in langlinks) { // look for all pages
			var langlink = langlinks[id];
			languageName = langlink['*'];
			languageShortcut = langlink['lang'];
			addLanguage(languageName, languageShortcut);
		}
		addLanguage("Language", "en");
		callbackSuccess(languageArray[0]);
	} else {
		callbackError();
	}
}

function initializeLanguages(callbackSuccess, callbackError) {
	var url = "http://en.wikipedia.org/w/api.php?" + actionParse + jsonFormat + propPrefix + "langlinks" + "&page=Language";
	console.log("initializeLanguages");
	if(languageArray[0].length === 0) {
		retrieveDataBulk(url, "", "", "",
			function(data) { // success in recieving data
				console.log('successfully retrieved data bulk');
				parseLanguages(data, callbackSuccess, callbackError);
				//callbackSuccess();		
			}, function() { // error in recieving data
				console.log('Could not receive data bulk');
				callbackError();
			}
		);	
	} else {
		callbackSuccess(languageArray[0]);
	}
}