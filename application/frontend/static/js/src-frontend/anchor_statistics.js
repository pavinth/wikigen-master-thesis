

$(function() {

    var currentYear = 0;
    var currentMonth = 0;
    var tagYearArray;
    var tagMonthArray;
    var currentChosenAnchor;
    var addDataInitialized = false;
    var anchorYearSnapshots;
    var anchorMonthSnapshots;
    var anchorMonthSnapshotsFull;


    function replotLinesWithDissimilarityData(graphArrayData, graph, graphLabel, color) {
        //var resultArray = convert2JsonToYearArray(graphData1, graphData2);
        $.plot(graph, [
                {
                    color: color,
                    data: graphArrayData,
                    lines: { show: true},
                    points: { show: true },
                    label: graphLabel
                }
            ],
            {
                selection: { mode: "xy" },
                grid: { hoverable: true, clickable: true },
                yaxis:{ min:0, max:getMaxHeightFromArray(graphArrayData), tickDecimals:2},
                xaxis: { mode: "time" },
            }
        );
    }

    $( "#datepicker_from" ).datepicker({
        altField: "#alternate_from",
        altFormat: "DD, d MM, yy",
        changeYear: true,
        changeMonth: true
    });

    $( "#datepicker_until" ).datepicker({
        altField: "#alternate_until",
        altFormat: "DD, d MM, yy",
        changeYear: true,
        changeMonth: true
    });

    $("#date_picker_button").button();

    $("#anchor_evolution_button").button();
    $("#generate_anchors_button").show();

    // Render elements
    $("#generate_anchor_stat").button();
    $("#anchor_results").hide();

    $("#anchor_progressbar").progressbar({
        value: 0
    });
    $("#anchor_stats_loading_form").hide();

    $("#anchor_results").hide();

    $(".accordition_element").accordion({
        collapsible: true,
        active: true,
        heightStyle: "content"
    });

    $( ".help_dialog" ).dialog({
        autoOpen: false,
        width: 1000,
        modal: true,
        open: function() {
            $('.ui-widget-overlay').addClass('custom-overlay');
        },
        show: {
            effect: "fadeIn",
            duration: 1500
        },
        hide: {
            effect: "fadeOut",
            duration: 1000
        }
    });

    $(".ui-widget li" ).hover(
        function() {
            $( this ).addClass( "ui-state-hover" );
        },
        function() {
            $( this ).removeClass( "ui-state-hover" );
        }
    );

    $("#anchor_description_accordion_header").click();

    $("#anchor_chronology_part_header").bind('click', function(event) {
        var rendered = $('#anchor_chronology_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            var jsonData = getAnchorData();
            var anchorName = getFirstAnchorInJSON(jsonData);
            redrawAnchorMap(anchorName);
            $('#anchor_chronology_part').attr('rendered', 1);
        } else {
            redrawAnchorMap(currentChosenAnchor);
        }
    });

    $("#anchor_map_i").bind('click', function(event) {
        $( "#anchor_map_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_snapshots_comp_i").bind('click', function(event) {
        $( "#anchor_snapshots_comp_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_table_i").bind('click', function(event) {
        $( "#anchor_table_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_snapshots_d_i").bind('click', function(event) {
        $( "#anchor_snapshots_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_snapshots_i").bind('click', function(event) {
        $( "#anchor_snapshots_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_tagcloud_part_i").bind('click', function(event) {
        $( "#anchor_tagcloud_part_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });


    $("#anchor_dynamics_i").bind('click', function(event) {
        $( "#anchor_dynamics_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_dissimilarity_i").bind('click', function(event) {
        $( "#anchor_dissimilarity_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_introductions_i").bind('click', function(event) {
        $( "#anchor_introductions_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_instability_i").bind('click', function(event) {
        $( "#anchor_instability_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_editwar_i").bind('click', function(event) {
        $( "#anchor_editwar_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_coverage_i").bind('click', function(event) {
        $( "#anchor_coverage_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_category_i").bind('click', function(event) {
        $( "#anchor_category_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });



    $("#anchor_tagcloud_prev").bind('click', function(event) {
        // Tagcloud
        //var tagArray = initializeTagArray(getAnchorData());
        //var tagYearArray = constructFullTagYearArray(tagArray);
        if(currentYear > 0) {
            currentYear -= 1;
            currentMonth = 0;
            $("#year_tagcloud").css({ opacity: 0.5 });
            $("#year_tagcloud").fadeTo('slow', 1.0);
            plotTagCloud("#year_tagcloud", tagYearArray[currentYear]);
        }
        event.preventDefault();
    });

    $("#anchor_tagcloud_next").bind('click', function(event) {
        if(currentYear < (tagYearArray.length - 1)) {
            currentYear += 1;
            currentMonth = 0;
            $("#year_tagcloud").css({ opacity: 0.5 });
            $("#year_tagcloud").fadeTo('slow', 1.0);
            plotTagCloud("#year_tagcloud", tagYearArray[currentYear]);
        }
        event.preventDefault();
    });

    $("#anchor_tagcloud_m_prev").bind('click', function(event) {
        if(!(currentYear === 0 && currentMonth === 0)) {
            if(currentMonth === 0) {
                currentYear -= 1;
                currentMonth = tagMonthArray[currentYear][1].length - 1;
            } else {
                currentMonth -= 1;
            }

            $("#year_tagcloud").css({ opacity: 0.5 });
            $("#year_tagcloud").fadeTo('slow', 1.0);
            plotTagCloud("#year_tagcloud", tagMonthArray[currentYear][1][currentMonth], true);
        }
        event.preventDefault();
    });

    $("#anchor_tagcloud_m_next").bind('click', function(event) {
        if(!(currentYear >= (tagYearArray.length - 1) && currentMonth >= (tagMonthArray[currentYear].length - 1))) {
            if(currentMonth >= tagMonthArray[currentYear][1].length - 1) {
                currentYear += 1;
                currentMonth = 0;
            } else {
                currentMonth += 1;
            }
            $("#year_tagcloud").css({ opacity: 0.5 });
            $("#year_tagcloud").fadeTo('slow', 1.0);
            plotTagCloud("#year_tagcloud", tagMonthArray[currentYear][1][currentMonth], true);
        }
        event.preventDefault();
    });

    $("#anchor_tagcloud_part_header").bind('click', function(event) {
        var rendered = $('#anchor_tagcloud_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            // Tagcloud
            var tagArray = initializeTagArray(getAnchorData());
            tagYearArray = constructFullTagYearArray(tagArray);
            tagMonthArray = constructFullTagMonthArray(tagArray);
            plotTagCloud("#year_tagcloud", tagYearArray[0]);
            $('#anchor_tagcloud_part').attr('rendered', 1);
        }

        event.preventDefault();
    });

    $("#anchor_snapshots_comp_part_header").bind('click', function(event) {
        var rendered = $('#anchor_snapshots_comp_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            var anchorCompareTableData = getAnchorCompareTable();
            // URI REQUEST ADD YEARS
            var columnData = constructColumnsFromAnchorCompareData(anchorCompareTableData, anchorYearSnapshots);
            var oCompareTable = $('#anchor_compare_table').dataTable(
                {
                    "aaData": anchorCompareTableData,
                    "aaSorting": [[ columnData.length - 1, "desc" ]],
                    "bAutoWidth": false,
                    "aoColumns": columnData
                }
            );
            $('#anchor_snapshots_comp_part').attr('rendered', 1);
        }

        event.preventDefault();
    });

    $("#anchor_snapshots_d_part_header").bind('click', function(event) {
        var rendered = $('#anchor_snapshots_d_part').attr('rendered');
        var Table;
        if (typeof (rendered) == 'undefined') {
            if (!addDataInitialized) {
                anchorYearSnapshots = getYearAnchorSnapshots();
                anchorMonthSnapshots = getMonthAnchorSnapshots();
                anchorMonthSnapshotsFull = getMonthAnchorSnapshots(true);
                addDataInitialized = true;
            }

            var i = 0;
            var year;
            var month;
            var oTable;
            var aDataSet;
            var firstYear = true;
            var currentYear = new Date().getFullYear();
            var visualOverride = constructVisualOverride(false, true, false, true);
            while (anchorYearSnapshots[i]) {
                year = anchorYearSnapshots[i][0];
                aDataSet = anchorYearSnapshots[i][1];
                $("#anchor_evolution_results").append("<b>" + year + "</b><br>");
                //console.log(" 1 " + currentYear);
                ///console.log(" 2 " + year);

                // Exclude the uncomplete first and last years
                //if(!(firstYear || currentYear == year))
                //{
                // REVIEW Graphs removed -> reestablish column width 1 40 and column width 2 60
                $('#anchor_evolution_results').append('<table border="0" class="year_snapshot" width="100%">' +
                    '<col width="100%"><col width="0%"><td> ' +
                    '<table cellpadding="0" cellspacing="0" border="0" class="display" id="anchor_table_' + year + '"></table> ' +
                    '</td><td style="padding:0 0 0 25px;"> <div id="year_dissimilarity_chart_' + year + '" style="width:100%;height:300px;"></div>' +
                    ' </td></table>');
                Table = $('#anchor_table_' + year).dataTable(
                    {
                        "responsive": true,
                        "aaData": aDataSet,
                        "aaSorting": [[4, "desc"]],
                        "aoColumns": [
                            { "sTitle": "Anchor","sClass": "center", "sWidth": "200" },
                            { "sTitle": "Days Survived", "sClass": "left", "sWidth": "40px" },
                            { "sTitle": "Revisions Survived", "sClass": "left", "sWidth": "40px" },
                            { "sTitle": "(Re)Introductions", "sClass": "left", "sWidth": "40px" },
                            { "sTitle": "Anchor Strength","sClass": "left", "sWidth": "40px" },
                        ]
                    }
                );
                getAnchorDissimilatyArrayForYear(anchorYearSnapshots, i);

                // Add an accordition
                $('#anchor_evolution_results').append('<div id="anchor_snapshot_' + i + '">	' +
                    '<h3 id="anchor_snapshot_header_' + i + '" class="anchor_snapshot_details">Monthly data for ' + year +
                    ' (click to expand)</h3>' +
                    '	<div  id="month_details_' + i + '"></div>' +
                    '</div> <br><br>');
                $('#anchor_snapshot_' + i).accordion({
                    collapsible: true,
                    active: true,
                    heightStyle: "content"
                });

                $('#anchor_snapshot_header_' + i).attr('year', i);
                $('#anchor_snapshot_header_' + i).attr('yearName', year);

                firstYear = false;
                i++;
            }
            // Add click events for month details
            $(document).on('click', ".anchor_snapshot_details", function () {
                //alert("tst!");
                var rendered = $(this).attr('rendered');
                if (typeof (rendered) == 'undefined') {
                    //alert("Rendering!");
                    var j = 0;
                    var i = $(this).attr('year');
                    var year = $(this).attr('yearName');
                    var aDataSet;
                    var dissimilarityMonths;

                    while (anchorMonthSnapshots[i][1][j]) {
                        month = anchorMonthSnapshots[i][1][j][0];
                        aDataSet = anchorMonthSnapshots[i][1][j][1];
                        if (aDataSet.length > 0) {
                            $("#month_details_" + i).append("<b> Month: " + getMonthName(month) + "</b><br>");
                            // REVIEW Graphs removed -> reestablish column width 1 40 and column width 2 60
                            $("#month_details_" + i).append('<table border="0" width="100%">' +
                                '<col width="100%"><col width="0%"><' +
                                'td><table cellpadding="0" cellspacing="0" border="0" class="display" id="anchor_table_'
                                + year + '_' + month + '"></table>' +
                                '</td><td style="padding:0 0 0 25px;">' +
                                '<div style="margin-top: 1em;">' +
                                '<div id="year_dissimilarity_chart_' + year + '_' + month +
                                '" style="width:100%;height:300px;"></div></div>' +
                                '</td></tr></table><br><br><br><br>');

                            oTable = $('#anchor_table_' + year + '_' + month).dataTable(
                                {
                                    "responsive": true,
                                    "aaData": aDataSet,
                                    "aaSorting": [[4, "desc"]],
                                    "aoColumns": [
                                        { "sTitle": "Anchor","sClass": "center", "sWidth": "300px" },
                                        { "sTitle": "Days Survived", "sClass": "left", "sWidth": "50px" },
                                        { "sTitle": "Revisions Survived", "sClass": "left", "sWidth": "50px" },
                                        { "sTitle": "(Re)Introductions", "sClass": "left", "sWidth": "50px" },
                                        { "sTitle": "Anchor Strength", "sClass": "left", "sWidth": "50px" },
                                    ]
                                }
                            );
                            dissimilarityMonths = getAnchorDissimilatyArrayForMonth(anchorMonthSnapshots, i, j);
                        }
                        j++;
                    }
                    $(this).attr('rendered', 1);
                }
            });
            // mark as rendered
            $('#anchor_snapshots_d_part').attr('rendered', 1);
        }

        event.preventDefault();
    });


    $("#anchor_snapshots_part_header").bind('click', function(event) {
        var rendered = $('#anchor_snapshots_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            // console.log
        }
    });

    $("#anchor_dynamics_part_header").bind('click', function(event) {
        var rendered = $('#anchor_dynamics_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            if(!addDataInitialized) {
                anchorYearSnapshots = getYearAnchorSnapshots();
                anchorMonthSnapshots = getMonthAnchorSnapshots();
                anchorMonthSnapshotsFull = getMonthAnchorSnapshots(true);
                addDataInitialized = true;
            }
            //resetAnchorEvolutionStats();
            $('#anchor_dynamics_part').attr('rendered', 1);
        }
    });

    $("#anchor_introductions_part_header").bind('click', function(event) {
        var rendered = $('#anchor_introductions_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            // Introductions
            var visualOverride = constructVisualOverride(true, false, false, false);
            var maxHeight;
            var addedAnchorsArray = getNewAnchorsMonthArray(anchorMonthSnapshots);
            var removedAnchorsArray = getOldAnchorsMonthArray(anchorMonthSnapshots);
            if(findMax(addedAnchorsArray) > findMax(removedAnchorsArray) ) {
                maxHeight = getMaxHeightFromArray(addedAnchorsArray);
            } else {
                maxHeight = getMaxHeightFromArray(removedAnchorsArray);
            }
            var dataObject1 = constructMonthDataObject(
                 addedAnchorsArray,
                '#1aeb2a',
                'New anchors per month',
                true,
                 visualOverride,2
            );
            var dataObject2 = constructMonthDataObject(
                removedAnchorsArray,
                '#cc4520',
                'Removed anchors per month',
                true,
                visualOverride,
                2
            );

            plotMonthMultiGraph2(
                $("#chart_anchor_introductions_m"),
                $("#introductions_m_overview"),
                dataObject1,
                dataObject2,
                maxHeight
            );
            $('#anchor_introductions_part').attr('rendered', 1);
        }
    });

    $("#anchor_instability_part_header").bind('click', function(event) {
        var rendered = $('#anchor_instability_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            // Instability
            var instabilityYearArray = convert2JsonToInstabilityYearArray(getAnchorMovements(), getAnchorRelevantRevisions());
            var instabilityMonthArray = convert2JsonToInstabilityMonthArray(getAnchorMovements(), getAnchorRelevantRevisions());
            plotYearDataGraph(
                $("#chart_anchor_instability"),
                instabilityYearArray,
                "Anchoring instability per year",
                getMaxHeightFromArray(instabilityYearArray),
                '#343434',
                true,
                true
            );

            plotMonthDataOverviewGraph(
                $("#chart_anchor_instability_m"),
                $("#instability_m_overview"),
                instabilityMonthArray,
                "Anchoring instability per month",
                getMaxHeightFromArray(instabilityMonthArray),
                '#343434',
                true,
                true
            );

            $('#anchor_instability_part').attr('rendered', 1);
        }
    });

    $("#anchor_warlevel_part_header").bind('click', function(event) {
        var rendered = $('#anchor_warlevel_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            // Edit war level (all introductions gevided bz all links)
            var visualOverride = constructVisualOverride(false, false, true, true);
            var noveltyYearArray = convertArrayAndJsonToNoveltyYearArray(anchorYearSnapshots, getAnchorMovements());
            var noveltyMonthArray = convertArrayAndJsonToNoveltyMonthArray(anchorMonthSnapshotsFull, getAnchorMovements());
            //var noveltyMonthArray = convertArrayAndJsonToNoveltyMonthArray(anchorFullMonthSnapshots, getTotalAnchorIntroductions());
            plotYearDataGraph(
                $("#chart_anchor_novelty"),
                noveltyYearArray,
                "Edit war level per year",
                getMaxHeightFromArray(noveltyYearArray),
                '#343434',
                true,
                true,
                visualOverride
            );
            plotMonthDataOverviewGraph(
                $("#chart_anchor_novelty_m"),
                $("#novelty_m_overview"),
                noveltyMonthArray,
                "Edit war level per month",
                getMaxHeightFromArray(noveltyMonthArray),
                '#343434',
                true,
                true,
                 visualOverride
            );
            $('#anchor_warlevel_part').attr('rendered', 1);
        }
    });

    $("#anchor_dissimilarity_part_header").bind('click', function(event) {
        var rendered = $('#anchor_dissimilarity_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            // Dissimilarity
            var visualOverride = constructVisualOverride(false, false, true, true);
            var dissimilarityYearArray = getAnchorDissimilatyYearArray(anchorYearSnapshots);
            var dissimilarityMonthArray = getAnchorDissimilatyMonthArray(anchorMonthSnapshots);
            plotYearDataGraph(
                $("#chart_anchor_dissimilarity"),
                dissimilarityYearArray,
                "Anchor dissimilarity between current and previous years",
                1.1,
                '#343434',
                true,
                true,
                visualOverride
            );
            plotMonthDataOverviewGraph(
                $("#chart_anchor_dissimilarity_m"),
                $("#dissimilarity_m_overview"),
                dissimilarityMonthArray,
                "Anchor dissimilarity between current and previous month",
                1.1,
                '#343434',
                true,
                true,
                visualOverride
            );

            $('#anchor_dissimilarity_part').attr('rendered', 1);
        }
    });

    $("#anchor_coverage_part_header").bind('click', function(event) {
        var rendered = $('#anchor_coverage_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            // Coverage
            var coverageYearArray = getAvgAnchorPresenceTimeYearArray(anchorYearSnapshots);
            var coverageMonthArray = getAvgAnchorPresenceTimeMonthArray(anchorMonthSnapshots);
            plotYearDataGraph(
                $("#chart_anchor_coverage"),
                coverageYearArray,
                "Average presence time of anchors per year",
                getMaxHeightFromArray(coverageYearArray),
                '#343434',
                true,
                true
            );
            plotMonthDataOverviewGraph(
                $("#chart_anchor_coverage_m"),
                $("#coverage_m_overview"),
                coverageMonthArray,
                "Average presence time of anchors per month",
                getMaxHeightFromArray(coverageMonthArray),
                '#343434',
                true,
                true
            );
            $('#anchor_coverage_part').attr('rendered', 1);
        }
    });

    $("#date_picker_button").bind('click', function(event) {
        //prepareAchorEvolutionAnalysis();
        var pickedFromDate = new Date($("#datepicker_from")[0].value);
        var pickedUntilDate = new Date($("#datepicker_until")[0].value);
        console.log("Picked from date: " + pickedFromDate);
        console.log("Picked from date: " + pickedUntilDate);
        var jsonData = getAnchorData();
        var aDataSet = convertAnchorDataToArray(jsonData, pickedFromDate, pickedUntilDate);
        $('#').empty();
        $('#table_frame').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="anchor_table"></table>' );
        var oTable = $('#anchor_table').dataTable(
            {
                "responsive": true,
                "aaData": aDataSet,
                "aaSorting": [[ 4, "desc" ]],
                "aoColumns": [
                    { "sTitle": "Anchor","sClass": "center", "sWidth": "20%" },
                    { "sTitle": "Days Survived", "sClass": "left", "sWidth": "10%" },
                    { "sTitle": "Revisions Survived", "sClass": "left", "sWidth": "10%" },
                    { "sTitle": "(Re)Introductions", "sClass": "left", "sWidth": "10%" },
                    { "sTitle": "Anchor Strength", "sClass": "left", "sWidth": "10%" },
                    { "sTitle": "First Seen","sClass": "left", "sWidth": "10%" },
                    { "sTitle": "Last Seen", "sClass": "left","sWidth": "10%" },
                    { "sTitle": "Category","sClass": "center", "sWidth": "20%" },
                    { "sTitle": "Save/Edit","sClass": "center", "sWidth": "30%" }
                ]
            }
        );
    });

    function redrawAnchorMap(anchorName) {
        currentChosenAnchor = anchorName;
        var test1 = 'Anchor name: <font color="blue"><b><a href="http://'+wikiLang+'.wikipedia.org/wiki/' + anchorName + '"' + ' target="_blank"' +'>' + anchorName + '</a></b></font><br><br><br>';
        //var test2 = 'Anchor name:<b> ' + anchorName+ '</b><br><br>';
        $('#anchor_name').html(test1);

        var startJson = getAnchorData()[anchorName];
        var dataArray = getAnchorLifeTimeFromJSON(startJson);

        var options = {
            xaxis: { mode: "time", tickLength: 5 },
            yaxis: { ticks: [[0.0, "absent"], [1.0, "present"]]},
            grid: { hoverable: true, clickable: true },
            selection: { mode: "x" }
        };

        var plot = $.plot($("#anchor_graph"), [
            {
                data: dataArray,
                lines: {show: true},
                points: {show: true}
            }

        ], options);

        var anchor_overview = $.plot($("#anchor_overview"), [dataArray], {
            series: {
                lines: { show: true, lineWidth: 1 },
                //points: {show: true},
                shadowSize: 0
            },
            xaxis: { ticks: [], mode: "time" },
            yaxis: { ticks: [], min: 0, autoscaleMargin: 0.1 },
            selection: { mode: "x" }
        });

        // now connect the two
        $("#anchor_graph").bind("plotselected", function (event, ranges) {
            // do the zooming
            plot = $.plot($("#anchor_graph"), [
                    {
                        data: dataArray,
                        lines: {show: true},
                        points: {show: true}
                    }

                ],
                $.extend(true, {}, options, {
                    xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
                }));

            // don't fire event on the overview to prevent eternal loop
            anchor_overview.setSelection(ranges, true);
        });

        $("#anchor_overview").bind("plotselected", function (event, ranges) {
            plot.setSelection(ranges);
        });

        $("#anchor_graph").bind('plotclick', function(event, pos, item) {
            var date = new Date(item.datapoint[0]);
            var revisionID = getRevisionIdByDate(date);
            $("#article_tab_link").click();
            $('#article_content').empty();
            $('#article_content').append("<object id='wikiframe' data='http://"+wikiLang+".wikipedia.org/w/index.php?title="+localStorage.getItem('selected_article')+" &oldid=" + revisionID +"' width='100%'>Error: Embedded data could not be displayed or requested article does not exist. </object>");
            $("#wikiframe").height(screen.height - 300);
            //alert("date is: " + date);
        });

        applyRevisionMapHover($("#anchor_graph"), false, true);
    }

    // Bind click event on statistic generation button
    $("#generate_anchor_stat").bind('click', function(event) {
        //debugJump();
        console.log("start!");

        // Hide all results and show loading bar
        $("#generate_anchors_button").hide();
        $("#anchor_results").hide();
        $("#anchor_stats_loading_form").show();
        $("#anchor_progressbar").progressbar({
            value: 0
        });
        $("#anchor_results").hide();


        var clicked = $('#anchor_description_accordion_header');
         clicked.attr('clicked');
        if(typeof(clicked) == 'undefined') {
            clicked.click();
            clicked.attr('clicked', 1);
        }
        var tableFrame = $('#table_frame');
        tableFrame.empty();
        tableFrame.html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="anchor_table"></table>' );


        startMeasuringTime();
        startMeasuringNetworkDelay();

        startAnchorAnalysis(localStorage.getItem('selected_article'),
            function(jsonData) { // Successfully generated the data for the anchor analysis
                var firstRevision;
                var lastRevision;
                // Get the first date
                console.log("Get first revision date");
                getFirstRevisionDate(localStorage.getItem('selected_article'), function(data) { // success in recieving data
                        firstRevision = data;
                        //console.log("the first date is " + data);
                        getLastRevisionDate(localStorage.getItem('selected_article'), function(data) { // success in recieving data
                                lastRevision = data;
                                console.log("the first date is " + firstRevision);
                                console.log("the last date is " + lastRevision);



                                //console.log('Success');
                                var aDataSet = convertAnchorDataToArray(jsonData, firstRevision, "");
                                $('#anchor_table').dataTable(
                                    {
                                        "responsive": true,
                                        "aaData": aDataSet,
                                        "aaSorting": [[ 4, "desc" ]],
                                        "bAutoWidth": false,
                                        "aoColumns": [
                                            { "sTitle": "Anchor", "sClass": "center", "sWidth": "20%" },
                                            { "sTitle": "Days Survived", "sClass": "left", "sWidth": "10%" },
                                            { "sTitle": "Revisions Survived", "sClass": "left", "sWidth": "10%" },
                                            { "sTitle": "(Re)Introductions", "sClass": "left", "sWidth": "10%" },
                                            { "sTitle": "Anchor Strength", "sClass": "left", "sWidth": "10%" },
                                            { "sTitle": "First Seen", "sClass": "left", "sWidth": "10%" },
                                            { "sTitle": "Last Seen","sClass": "left", "sWidth": "10%" },
                                            { "sTitle": "Category","sClass": "center", "sWidth": "20%" },
                                            { "sTitle": "Save/Edit","sClass": "center", "sWidth": "30%" }
                                        ]
                                    }
                                );
                                $(document).on('click', ".anchor_element", function() {
                                    var anchorName = this.text;
                                    redrawAnchorMap(anchorName);

                                });

                                if(!addDataInitialized) {
                                    anchorYearSnapshots = getYearAnchorSnapshots();
                                    anchorMonthSnapshots = getMonthAnchorSnapshots();
                                    anchorMonthSnapshotsFull = getMonthAnchorSnapshots(true);
                                    //debugJump();
                                    addDataInitialized = true;
                                }
                                updateTimeStats();
                                $("#anchor_results").show();
                                $("#anchor_stats_loading_form").hide();



                            }, function() { // error in recieving data
                                console.log("corrupt first date");
                            }
                        );
                    }, function() { // error in recieving data
                        console.log("corrupt first date");
                    }
                );


            },
            function() { // could not generate data for tha analysis
                //console.log('No Success while generating anchors');
            }
        );
    });

    function plotTagCloud(div, array, month) {
        $(div).empty();
        if(month === true) {
            $('#tag_cloud_month').html(getMonthName(tagMonthArray[currentYear][1][currentMonth][0]));
        } else {
            $('#tag_cloud_month').html("all months");
        }
        $('#tag_cloud_year').html("<b>" + tagYearArray[currentYear][0] + "</b>");
        for(var i = 0; i < array[1].length; i++) {
            //	  <a href="/path" rel="3">peace</a>
            $(div).append("<a href='#' rel=" + array[1][i][1] + ">" + array[1][i][0] + "</a> ");
        }
        $(div + " a").tagcloud({
            size: {
                start: 14,
                end: 14,
                unit: "pt"
            },
            color: {
                start: "#FFFFFF",
                mid: "#9da9d4",
                end: "#F52"
            }
        });
    }

    $('#anchor_category_header').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="anchor_cat_table"></table>');
    $('#anchor_cat_table').dataTable(
        {
            "responsive": true,
            "aaSorting": [[ 4, "desc" ]],
            "bAutoWidth": false,
            "aoColumns": [
                { "sTitle": "Last Seen", "sClass": "center", "sWidth": "10%",  },
                { "sTitle": "First Seen", "sClass": "left", "sWidth": "10%" },
                { "sTitle": "Anchor Strength", "sClass": "left", "sWidth": "10%" },
                { "sTitle": "(Re)Introductions", "sClass": "left", "sWidth": "10%" },
                { "sTitle": "Revisions Survived", "sClass": "left", "sWidth": "10%" },
                { "sTitle": "Days Survived", "sClass": "left", "sWidth": "10%" },
                { "sTitle": "Anchor", "sClass": "left", "sWidth": "10%" },
                { "sTitle": "Category Name",  "sClass": "center","sWidth": "10%" }
            ]
        }
    );

     $("#anchor_tab_link").on('click', function() {
        var referenceStatsGenerated = localStorage.getItem('anchor_stats_generated');
        if(referenceStatsGenerated === undefined || referenceStatsGenerated === null ||referenceStatsGenerated === "") {
            localStorage.setItem('anchor_stats_generated', 'true');
            $('#anchor_tab_content').load("/anchor-page/", function() {
                $(this).trigger('create');
            });
        }
    });

});

