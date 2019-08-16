$(function() {

    // Render elements
    $("#comp_description_accordion_header").click();
    $("#graph_type").buttonset();
    $("#talk_graph_type").buttonset();
    $("#anchor_graph_type").buttonset();

    $(".accordition_element").accordion({
        collapsible: true,
        active: true,
        heightStyle: "content"
    });
    $("#generate_referece_button").show();

    // Render elements

    $("#generate_comp_stat").button();
    $('#generate_comp_stat').click(function() {
        $(this).hide();
    });

    $("#comp_results").hide();
    $("#comp_graph_part").hide();
    $("#talk_comp_graph_part").hide();
    $("#anchor_comp_graph_part").hide();


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

    $("#generate_comp_stat").bind('click', function(event) {
        $("#comp_results").show();
        $("#comp_graph_part").show();
        $("#talk_comp_graph_part").show();
        $("#anchor_comp_graph_part").show();
        //$("#blink_stats_loading_form").show();

    });

    $("#comp_graph_i").bind('click', function(event) {
        $( "#comp_graph_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#talk_comp_graph_i").bind('click', function(event) {
        $( "#talk_comp_graph_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#anchor_comp_graph_i").bind('click', function(event) {
        $( "#anchor_comp_graph_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#comp_graph_part_header").bind('click', function(event) {
        var rendered = $('#comp_graph_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            plotEditsComparisonMultiGraph();
            $('#comp_graph_part').attr('rendered', 1);
        }
    });

    $("#talk_comp_graph_part_header").bind('click', function(event) {
        var rendered = $('#talk_comp_graph_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            plotTalkComparisonMultiGraph();
            $('#talk_comp_graph_part').attr('rendered', 1);
        }
    });

    $("#anchor_comp_graph_part_header").bind('click', function(event) {
        var rendered = $('#anchor_comp_graph_part').attr('rendered');
        if(typeof(rendered) == 'undefined') {
            plotAnchorComparisonMultiGraph();
            $('#anchor_comp_graph_part').attr('rendered', 1);
        }
    });


    $("#g_edits").bind('click', function(event) {
        if ($('#g_edits').is(':checked')) {
            overrideForEdits = constructVisualOverride(true, false, false, false);
        } else {
            overrideForEdits = constructVisualOverride(false, false, false, false);
        }
        plotEditsComparisonMultiGraph();
    });

    $("#talk_g_edits").bind('click', function(event) {
        if ($('#talk_g_edits').is(':checked')) {
            overrideForTalkEdits = constructVisualOverride(true, false, false, false);
        } else {
            overrideForTalkEdits = constructVisualOverride(false, false, false, false);
        }
        plotTalkComparisonMultiGraph();
    });

    $("#g_editors").bind('click', function(event) {
        if ($('#g_editors').is(':checked')) {
            overrideForEditors = constructVisualOverride(true, false, false, false);
        } else {
            overrideForEditors = constructVisualOverride(false, false, false, false);
        }
        plotEditsComparisonMultiGraph();
    });

    $("#talk_g_editors").bind('click', function(event) {
        if ($('#talk_g_editors').is(':checked')) {
            overrideForTalkEditors = constructVisualOverride(true, false, false, false);
        } else {
            overrideForTalkEditors = constructVisualOverride(false, false, false, false);
        }
        plotTalkComparisonMultiGraph();
    });

    $("#g_editseditor").bind('click', function(event) {
        if ($('#g_editseditor').is(':checked')) {
            overrideForEditsEditor = constructVisualOverride(true, false, false, false);
        } else {
            overrideForEditsEditor = constructVisualOverride(false, false, false, false);
        }
        plotEditsComparisonMultiGraph();
    });

    $("#talk_g_editseditor").bind('click', function(event) {
        if ($('#talk_g_editseditor').is(':checked')) {
            overrideForTalkEditsEditor = constructVisualOverride(true, false, false, false);
        } else {
            overrideForTalkEditsEditor = constructVisualOverride(false, false, false, false);
        }
        plotTalkComparisonMultiGraph();
    });

    $("#g_editsreditor").bind('click', function(event) {
        if ($('#g_editsreditor').is(':checked')) {
            overrideForEditsEditor2 = constructVisualOverride(true, false, false, false);
        } else {
            overrideForEditsEditor2 = constructVisualOverride(false, false, false, false);
        }
        plotEditsComparisonMultiGraph();
    });

    $("#talk_g_editsreditor").bind('click', function(event) {
        if ($('#talk_g_editsreditor').is(':checked')) {
            overrideForTalkEditsEditor2 = constructVisualOverride(true, false, false, false);
        } else {
            overrideForTalkEditsEditor2 = constructVisualOverride(false, false, false, false);
        }
        plotTalkComparisonMultiGraph();
    });

    $("#g_diss").bind('click', function(event) {
        if ($('#g_diss').is(':checked')) {
            overrideForDiss = constructVisualOverride(true, false, false, false);
        } else {
            overrideForDiss = constructVisualOverride(false, false, false, false);
        }
        plotAnchorComparisonMultiGraph();
    });




    $("#g_indirect_1").bind('click', function(event) {
        if ($('#g_indirect_1').is(':checked')) {
            overrideForNew = constructVisualOverride(true, false, false, false);
        } else {
            overrideForNew = constructVisualOverride(false, false, false, false);
        }
        plotAnchorComparisonMultiGraph();
    });


    $("#g_indirect_2").bind('click', function(event) {
        if ($('#g_indirect_2').is(':checked')) {
            overrideForRemoved = constructVisualOverride(true, false, false, false);
        } else {
            overrideForRemoved = constructVisualOverride(false, false, false, false);
        }
        plotAnchorComparisonMultiGraph();
    });

    $("#g_ewars").bind('click', function(event) {
        if ($('#g_ewars').is(':checked')) {
            overrideForEditwar = constructVisualOverride(true, false, false, false);
        } else {
            overrideForEditwar = constructVisualOverride(false, false, false, false);
        }
        plotAnchorComparisonMultiGraph();
    });


    $("#g_coverage").bind('click', function(event) {
        if ($('#g_coverage').is(':checked')) {
            overrideForCoverage = constructVisualOverride(true, false, false, false);
        } else {
            overrideForCoverage = constructVisualOverride(false, false, false, false);
        }
        plotAnchorComparisonMultiGraph();
    });




    var overrideForEdits = constructVisualOverride(false, false, false, false);
    var overrideForEditors = constructVisualOverride(false, false, false, false);
    var overrideForEditsEditor = constructVisualOverride(false, false, false, false);
    var overrideForEditsEditor2 = constructVisualOverride(false, false, false, false);



    function plotEditsComparisonMultiGraph() {
        var overallEditData = getOverallEditData();
        var visualOverride = constructVisualOverride(true, false, false, false);
        var displayNone = constructVisualOverride(false, false, false, false);


        var dataObject1 = constructMonthDataObject(
            getNonBotDistinctMajorEditData(),
            '#CFA600',
            'Overall non-bot distinct major edits',
            false,
            overrideForEdits,
            3,
            true
        );

        var dataObject2 = constructMonthDataObject(
            getNonBotDistinctMajorEditorsData(),
            '#EBC633',
            'Major distinct non-bot editors',
            false,
            overrideForEditors,
            3,
            true
        );

        var plotArray3 = convert2JsonToInstabilityMonthArray(getNonBotDistinctMajorEditData(), getNonBotDistinctMajorEditorsData());

        var dataObject3 = constructMonthDataObject(
            plotArray3,
            '#F2DA7D',
            'Major distinct non-bot edits per editor',
            true,
            overrideForEditsEditor,
            3,
            true
        );

        var plotArray4 = convert2JsonToInstabilityMonthArray(
            getRegisteredNonBotDistinctMajorEditData(),
            getRegisteredNonBotDistinctMajorEditorsData());

        var dataObject4 = constructMonthDataObject(
            plotArray4,
            '#dec973',
            'Edits per registered editors',
            true,
            overrideForEditsEditor2,
            3,
            true
        );



        plotEditsMonthMultiGraph9(
            $("#comp_content"),
            $("#comp_content_overview"),
            dataObject1,
            dataObject2,
            dataObject3,
            dataObject4,
            1.1,
            true
        );
    }


    var overrideForTalkEdits = constructVisualOverride(false, false, false, false);
    var overrideForTalkEditors = constructVisualOverride(false, false, false, false);
    var overrideForTalkEditsEditor = constructVisualOverride(false, false, false, false);
    var overrideForTalkEditsEditor2 = constructVisualOverride(false, false, false, false);

    function plotTalkComparisonMultiGraph() {
        var overallTalkEditData = getOverallTalkEditData();
        var visualOverride = constructVisualOverride(true, false, false, false);
        var displayNone = constructVisualOverride(false, false, false, false);


        var dataObject1 = constructMonthDataObject(
            getNonBotDistinctMajorTalkEditData(),
            '#CFA600',
            'Overall non-bot distinct major edits',
            false,
            overrideForTalkEdits,
            2,
            true
        );


        var dataObject2 = constructMonthDataObject(
            getNonBotDistinctMajorTalkEditorsData(),
            '#EBC633',
            'Major distinct non-bot editors',
            false,
            overrideForTalkEditors,
            2,
            true
        );

        var plotArray3 = convert2JsonToInstabilityMonthArray(getNonBotDistinctMajorTalkEditData(), getNonBotDistinctMajorTalkEditorsData());

        var dataObject3 = constructMonthDataObject(
            plotArray3,
            '#F2DA7D',
            'Major distinct non-bot edits per editor',
            true,
            overrideForTalkEditsEditor,
            2,
            true
        );

        var plotArray4 = convert2JsonToInstabilityMonthArray(getRegisteredNonBotDistinctMajorTalkEditData(), getRegisteredNonBotDistinctMajorTalkEditorsData());

        var dataObject4 = constructMonthDataObject(
            plotArray4,
            '#dec973',
            'Edits per registered editors',
            true,
            overrideForTalkEditsEditor2,
            2,
            true
        );

        plotTalkMonthMultiGraph9(
            $("#talk_comp_content"),
            $("#talk_comp_content_overview"),
            dataObject1,
            dataObject2,
            dataObject3,
            dataObject4,
            1.1,
            true
        );
    }


    var overrideForDiss = constructVisualOverride(false, false, false, false);
    var overrideForNew = constructVisualOverride(false, false, false, false);
    var overrideForRemoved = constructVisualOverride(false, false, false, false);
    var overrideForEditwar = constructVisualOverride(false, false, false, false);
    var overrideForCoverage = constructVisualOverride(false, false, false, false);

function plotAnchorComparisonMultiGraph() {
    var visualOverride = constructVisualOverride(true, false, false, false);
    var displayNone = constructVisualOverride(false, false, false, false);
    var anchorMonthSnapshots = getAnchorMonthEvolutionData();
    var anchorFullMonthSnapshots = getAnchorFullMonthEvolutionData();

    var dissimilarityMonthArray = getAnchorDissimilatyMonthArray(anchorMonthSnapshots);
    var addedAnchorsArray = getNewAnchorsMonthArray(anchorMonthSnapshots);
    var removedAnchorsArray = getOldAnchorsMonthArray(anchorMonthSnapshots);

    var dataObject1 = constructMonthDataObject(addedAnchorsArray,
        '#389065',
        'New anchors',
        true,
        overrideForNew,
        3,
        true
    );

    var dataObject2 = constructMonthDataObject(
        removedAnchorsArray,
        '#CC3300',
        'Removed anchors',
        true,
        overrideForRemoved,
        3,
        true
    );

    var noveltyMonthArray = convertArrayAndJsonToNoveltyMonthArray(anchorFullMonthSnapshots, getTotalAnchorIntroductions());

    var dataObject3 = constructMonthDataObject(
        noveltyMonthArray,
        '#e8895a',
        'Edit war level',
        true,
        overrideForEditwar,
        3,
        true
    );

    var dataObject4 = constructMonthDataObject(
        dissimilarityMonthArray,
        '#6c7a58',
        'Anchor dissimilarity',
        true,
        overrideForDiss,
        3,
        true
    );


    var coverageMonthArray = getAvgAnchorPresenceTimeMonthArray(anchorMonthSnapshots);
    var dataObject5= constructMonthDataObject(
        coverageMonthArray,
        '#669999',
        'Anchor average coverage',
        true,
        overrideForCoverage,
        3,
        true
    );

    plotAnchorMonthMultiGraph9(
        $("#anchor_comp_content"),
        $("#anchor_comp_content_overview"),
        dataObject1,
        dataObject2,
        dataObject3,
        dataObject4,
        dataObject5,
        1.1,
        true
    );
}
});