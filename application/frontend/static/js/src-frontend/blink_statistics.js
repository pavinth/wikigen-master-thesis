$(function () {

    // Render elements
    $("#generate_reference_stat").button();

    $("#references_list_accordion").hide();

    $("#generation_stopped").hide();
    $("#reference_type").buttonset();
    $("#reference_type2").buttonset();
    $("#reference_type").hide();
    $("#reference_type2").hide();
    $("#generate_reference_button").show();

    $(".accordition_element").accordion({
        collapsible: true,
        active: true,
        heightStyle: "content"
    });

    $("#blink_description_accordion_header").click();

    $("#blink_results").hide();

    $("#blink_stats_loading_form").hide();

    $("#blink_progressbar").progressbar({
        value: 0
    });

    $(".help_dialog").dialog({
        autoOpen: false,
        width: 1000,
        modal: true,
        open: function () {
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

    $(".ui-widget li").hover(
        function () {
            $(this).addClass("ui-state-hover");
        },
        function () {
            $(this).removeClass("ui-state-hover");
        }
    );

    $("#blink_stats_loading_form").hide();

    // Automatically generate number of references
    /* var target = $('#nora_content')[0];
     var spinnerCount = new Spinner(opts).spin(target);
     */

    // Define html global variables
    //var spinnerGraph;
    resetBacklinkStats();
    countBackLinks(localStorage.getItem('selected_article'),
        function (backlinksCount) {
            //spinnerCount.stop();
            $('#loading_blcount').hide();
            $('#nora_content').append('<p><b>Number of referencing articles: ' + backlinksCount + '</b></p>');
        },
        function () {
            //console.log("Could not count backlinks");
        }
    );

    $("#blink_graph_i").bind('click', function (event) {
        $("#blink_graph_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#blink_table_i").bind('click', function (event) {
        $("#blink_table_i_dialog").dialog("open");
        event.preventDefault();
    });

    function reloadGraphWithNewData(timelineData, graphDiv) {
        convertJsonToTimeArray(timelineData,
            function (resultArray) {
                //console.log('time json is converted and ready to be ploted');
                generateCumulativeArray(resultArray,
                    function (cumulativeArray) {
                        $("#reference_type").show();
                        $("#reference_type2").show();
                        //$("#timeline_content").height(300);
                        //$("#timeline_content2").height(300);
                        $.plot(graphDiv,
                            [
                                {
                                    data: resultArray,
                                    bars: {show: true}
                                },
                                {
                                    data: cumulativeArray,
                                    lines: {show: true}
                                }
                            ]
                        );
                    }
                );
            }
        );
    }

    $("#blink_graph_part_header").bind('click', function (event) {
        var rendered = $('#blink_graph_part').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            reloadGraphWithNewData(getOverallOccurencesData(), $("#timeline_content"));
            //reloadGraphWithNewData(getDefinitionOccurencesData(), $("#timeline_content2"));
            $('#blink_graph_part').attr('rendered', 1);
        }
    });


    $("#generate_reference_stat").bind('click', function (event) {
        $("#blink_progressbar").progressbar({
            value: 0
        });

        $("#blink_stats_loading_form").show();

        $('#list_content').empty();
        $('#list_content').html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="blink_table"></table>');
        var clicked = $('#blink_description_accordion_header').attr('clicked');
        if (typeof (clicked) == 'undefined') {
            $("#blink_description_accordion_header").click();
            $('#blink_description_accordion_header').attr('clicked', 1);
        }


        var curValue = $("#generate_reference_stat").text();
        if (curValue === "Generate Objectification Statistics") {
            resetBacklinkStats();

            // change button title
            $("#generate_reference_stat span").text('Stop Generating Procedure');

            $("#blink_results").hide();

            startMeasuringTime();
            startMeasuringNetworkDelay();

            generateReferenceTimelineStats(localStorage.getItem('selected_article'),
                function (referenceTimelineData) {
                    $("#generate_reference_button").hide();
                    $("#blink_stats_loading_form").hide();
                    updateTimeStats();
                    $("#blink_results").show();
                    $("#generate_reference_stat span").text('Generate Objectification Statistics');
                    //console.log('Statistics generated');

                    $("#references_list_accordion").show();
                    var oTable = $('#blink_table').dataTable(
                        {
                            "responsive": true,
                            "autoWidth": false,
                            "aaData": getBackLinkArrayData(),
                            "aoColumns": [
                                {"sTitle": "Article", "sWidth": "30%"},
                                {"sTitle": "Year of reference", "sClass": "center", "sWidth": "20%"},
                                {"sTitle": "Latest position in article", "sClass": "center", "sWidth": "20%"},
                                {"sTitle": "Earliest position in article", "sClass": "center", "sWidth": "20%"}
                            ]
                        }
                    );
                },
                function () {
                    // TODO replace it by something non redundant
                    console.log('Statistics is not generated completely');
                    /*
                    $("#blink_stats_loading_form").hide();
                    updateTimeStats();
                    $("#blink_results").show();
                    reloadGraphWithNewData(getDefinitionOccurencesData, $("#timeline_content"));
                    reloadGraphWithNewData(getDefinitionOccurencesData(), $("#timeline_content2"));
                    $("#references_list_accordion").show();
                    $("#generate_reference_stat span").text('Generate Objectification Statistics');
                    var oTable = $('#blink_table').dataTable(
                        {
                            "aaData": getBackLinkArrayData(),
                            "aoColumns": [
                                { "sTitle": "Article (What?)", "sWidth": "60%" },
                                { "sTitle": "Year of reference (When?)", "sClass": "center", "sWidth": "20%" },
                                { "sTitle": "Position in article (Where?)", "sClass": "center", "sWidth": "20%" }
                            ]
                        }
                    );	*/
                }
            );
        } else {
            $("#generate_reference_stat span").text('Stop Objectification Statistics');
            //  spinnerGraph.stop();
            $("#generation_stopped").dialog();
            //alert('Statistic generation was stopped!');
            doInterruptReferenceStatGeneration();

        }
    });

    $("#o_references").bind('click', function (event) {
        //console.log("switch to references in definitions");
        var timelineData = getOverallOccurencesData();
        reloadGraphWithNewData(timelineData, $("#timeline_content"));
    });

    $("#def_references").bind('click', function (event) {
        //console.log("switch to references in definitions");
        var timelineData = getDefinitionOccurencesData();
        reloadGraphWithNewData(timelineData, $("#timeline_content"));
    });

    $("#cat_references").bind('click', function (event) {
        //console.log("switch to references in definitions");
        var timelineData = getCategoryOccurencesData();
        reloadGraphWithNewData(timelineData, $("#timeline_content"));
    });

    $("#rest_references").bind('click', function (event) {
        //console.log("switch to references in definitions");
        var timelineData = getRestOccurencesData();
        reloadGraphWithNewData(timelineData, $("#timeline_content"));
    });

    $("#indirect_references").bind('click', function (event) {
        //console.log("switch to references in definitions");
        var timelineData = getIndirectOccurencesData();
        reloadGraphWithNewData(timelineData, $("#timeline_content"));
    });

    $("#cwoi_references").bind('click', function (event) {
        //console.log("switch to references everywhere except indirect");
        var timelineData = getAllWoIndirectOccurencesData();
        reloadGraphWithNewData(timelineData, $("#timeline_content"));
    });


    $("#blink_tab_link").on('click', function () {
        var referenceStatsGenerated = localStorage.getItem('blink_stats_generated');
        if (referenceStatsGenerated === undefined || referenceStatsGenerated === null || referenceStatsGenerated === "") {
            localStorage.setItem('blink_stats_generated', 'true');
            $('#blink_tab_content').load("/blink-page/", function () {
                $(this).trigger('create');
            });
        }
    });


});

