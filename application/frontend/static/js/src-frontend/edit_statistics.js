var EditStats = {

    getDate: function (datePickerElement) {
        var date;
        try {
            date = $.datepicker.parseDate( "mm/dd/yy", datePickerElement.value );
        } catch( error ) {
            date = null;
        }
        return new Date(date);

    },

    closeDescription: function (articleType) {
        this.prepareElement(articleType, "generate_edit_button").hide();

        var element = this.prepareElement(articleType, "edit_description_accordion_header");

        if (typeof (element.attr('clicked')) == 'undefined') {
            element.click();
            element.attr('clicked', 1);
        }
    },

    emptyProgressBar: function (articleType) {
        this
            .prepareElement(articleType, "edit_progressbar")
            .progressbar({
                value: 0
            });
    },

    emptyEditStatContent: function (articleType) {
        var elements = [
            "edit_stats_content1",
            "edit_stats_content2",
            "editors_stats_content1",

        ];

        elements.forEach(value => this.emptyElements(articleType, value));
    },

    emptyElements: function (articleType, elementName) {
        this.prepareElement(articleType, elementName).empty();
    },

    hideOldResult: function (articleType) {
        this.prepareElement(articleType, "edit_results").hide();
    },

    displaySpinner: function (articleType) {
        this.prepareElement(articleType, "edit_stats_loading_form").show();
    },

    editTextStatistics: function (data, articleType) {
        var $edit_stats_content1 = this.prepareElement(articleType, 'edit_stats_content1');
        var $edit_stats_content2 = this.prepareElement(articleType, 'edit_stats_content2');

        $edit_stats_content1.append('<p>Date of the first revision:<b>' + '</p>' + '</b>');
        $edit_stats_content1.append('<p>Total number of revisions:<b> ' + getOverallEdits() + '</p>' + '</b>');
        $edit_stats_content1.append('<p>Number of distinct edits:<b> ' + getDistinctEdits() + '</p>' + '</b>');
        $edit_stats_content1.append('<p>Number of distinct major edits:<b> ' + getDistinctMajorEdits() + '</p>' + '</b>');

        $edit_stats_content2.append('<p> ' + '<b>' + data + '</b>' + '</p>');
        $edit_stats_content2.append('<p>Total number of revisions without bots:<b> ' + getNonBotEdits() + '</p>' + '</b>');
        $edit_stats_content2.append('<p>Number of distinct edits without bots:<b> ' + getNonBotDistinctEdits() + '</p>' + '</b>');
        $edit_stats_content2.append('<p>Number of distinct major edits without bots:<b> ' + getNonBotDistinctMajorEdits() + '<p>' + '</b>');
    },

    plotEditors: function (articleType) {
        var elements = [
            "edit_graph_type",
            "edit_graph_type2",
            "editors_graph_type",
            "editors_graph_type2",
            "edit_stats_accordion",
            "edit_details_accordion",
            "editors_stats_accordion",
            "ratios_accordion"
        ];
        elements.forEach(value => this.showElement(articleType, value));
    },

    showElement: function (articleType, element) {
        this.prepareElement(articleType, element).show();
    },

    editorTextStatistics: function (articleType) {
        var element = this.prepareElement(articleType, 'editors_stats_content1');

        element.append('<p>Total number of editors:<b> ' + getEditors() + '</p>' + '</b>');
        element.append('<p>Number of registered editors:<b> ' + getRegisteredEditors() + '</p>' + '</b>');
        element.append('<p>Number of anonymous editors:<b> ' + getAnonymEditors() + '</p>' + '</b>');
        element.append('<p>Number of bot editors:<b> ' + getBotEditors() + '</p>' + '</b>');
    },

    plotEdits: function (articleType) {
        var elements = [
            "edit_graph_type",
            "edit_graph_type2"
        ];
        elements.forEach(value => this.showElement(articleType, value));
    },

    prepareElement: function (articleType, elementName) {
        var element = "#" + articleType + elementName;
        return $(element);
    },

    hideProgressBar: function () {
        $("#edit_stats_loading_form").hide();
    },

    showResults: function (articleType) {
        this.prepareElement(articleType, "edit_results").show();
    },

    overallEditSuccessCallback: function (data, articleType) {
        return function () {
            EditStats.hideProgressBar();
            EditStats.showResults(articleType);
            updateTimeStats();
            EditStats.plotEdits(articleType);
            EditStats.editTextStatistics(data, articleType);
            EditStats.plotEditors(articleType);
            EditStats.editorTextStatistics(articleType);
        }
    },

    overallEditErrorCallback: function () {
        return function () {
            console.log("error occurred.");
        }
    },

    plotRevisionMap: function (revisionMapElement, revisionTimeArray, articleType) {
        if (typeof (revisionMapElement.attr('rendered')) == 'undefined') {
            plotRevisionMapOverviewGraph(
                this.prepareElement(articleType, "chart_ph_6"),
                this.prepareElement(articleType, "chart_ph_6_overview"),
                revisionTimeArray,
                "revisions map",
                1,
                '#124b77'
            );

            revisionMapElement.attr('rendered', 1);
        }
    },



    /*
    plotYearlyEditsPerEditorStatistics: function (yearlyEditsPerEditorMapElement, articleType) {
        if (typeof (yearlyEditsPerEditorMapElement.attr('rendered')) == 'undefined') {
            var visualOverride = constructVisualOverride(false, false, true, true);
            var plotArray3 = convert2JsonToInstabilityYearArray(getOverallEditData(), getEditorsData());
            plotYearDataGraph(
                "#chart_ph_4",
                plotArray3,
                "Edits per editor (yearly)",
                getMaxHeightFromArray(plotArray3),
                '#846335',
                true,
                true,
                visualOverride
            );
            yearlyEditsPerEditorMapElement.attr('rendered', 1);
        }
    },

    plotDetailedEditsPerEditorStatistics: function (detailedEditsPerEditorMapElement, articleType) {
        if (typeof (detailedEditsPerEditorMapElement.attr('rendered')) == 'undefined') {

            var visualOverride = constructVisualOverride(false, false, true, true);
            var plotArray3 = convert2JsonToInstabilityYearArray(getNonBotDistinctMajorEditData(), getNonBotDistinctMajorEditorsData());
            plotMonthDataOverviewGraph(
                "#chart_ph_7",
                "#chart_ph_7_overview",
                 plotArray3,
                "Edits per editor (monthly)",
                 getMaxHeightFromArray(plotArray3),
                '#141972',
                true,
                true,
                visualOverride
            );
            detailedEditsPerEditorMapElement.attr('rendered', 1);
        }
    },

*/

    closeElements: function (articleType) {
        this.closeDescription(articleType);
        this.emptyProgressBar(articleType);
        this.emptyEditStatContent(articleType);
        this.hideOldResult(articleType);
        this.displaySpinner(articleType);
    },

    revisionDateSuccessCallback: function (selectArticle, articleType) {

        var pickedFromDate = new Date($("#e_datepicker_from").val());
        var pickedUntilDate = new Date($("#e_datepicker_until").val());

        if('talk_' === articleType) {
            return function (data) {
                generateOverallTalkEditStats(
                    selectArticle,
                    pickedFromDate,
                    pickedUntilDate,
                    EditStats.overallEditSuccessCallback(data, articleType),
                    EditStats.overallEditErrorCallback()
                );
            }
        }

        return function (data) {
            generateOverallEditStats(
                selectArticle,
                pickedFromDate,
                pickedUntilDate,
                EditStats.overallEditSuccessCallback(data, articleType),
                EditStats.overallEditErrorCallback()
            );
        }
    },

    revisionDateErrorCallback: function () {
        return function () {
            console.log("corrupt first date");
        }
    },

    initialize: function () {
        this.closeElements('');
        this.closeElements('talk_');

        startMeasuringTime();
        startMeasuringNetworkDelay();
    },

    handleTabs: function (articleType, dataType) {
        var rendered = this.prepareElement(articleType, dataType + "_part").attr('rendered');

        if (typeof (rendered) == 'undefined') {
            this.prepareElement(articleType, dataType + "_stat_header").click();
            this.prepareElement(articleType, dataType + '_part').attr('rendered', 1);
        }
    },

    bindClickOnTabs: function (articleType, element) {
        $('value').bind('click', function () {
            EditStats.handleTabs(articleType, element);
        });
    }
};

$("#generate_edit_stat").bind('click', function () {
    EditStats.initialize();

    var selectArticle = sessionStorage.getItem('selected_article');
    var talkSelectArticle = sessionStorage.getItem('talk_selected_article');

    var successCallback = EditStats.revisionDateSuccessCallback(selectArticle, '');
    var talkSuccessCallback = EditStats.revisionDateSuccessCallback(talkSelectArticle, 'talk_');

    getFirstRevisionDate(selectArticle, successCallback, EditStats.revisionDateErrorCallback());
    getFirstRevisionDate(talkSelectArticle, talkSuccessCallback, EditStats.revisionDateErrorCallback());
});

$(function () {


    function initializeChartDisplayOptions() {
        if(bars) {
            $("#bar-chart").prop("checked", 'checked');
        } else {
            $("#bar-chart").prop("checked", 'checked');
        }

        if(lines) {
            $("#line-chart").prop("checked", 'checked');
        } else {
            $("#bar-chart").prop("checked", 'checked');
        }

        if(points) {
            $("#point-chart").prop("checked", 'checked');
        } else {
            $("#bar-chart").prop("checked", 'checked');
        }

    }
    initializeChartDisplayOptions();

    $(".fa .fa-line-chart").bind('click', function(event) {
        if ($('#bar-chart').is(':checked')) {
            bars = true;
        } else {
            bars = false;
        }
    });
    $(".fa.fa-line-chart").bind('click', function(event) {
        if ($('#line-chart').is(':checked')) {
            lines = true;
        } else {
            lines = false;
        }
    });

    $(".fa.fa-circle-o").bind('click', function(event) {
        if ($('#point-chart').is(':checked')) {
            points = true;
        } else {
            points = false;
        }
    });


    var from = $("#e_datepicker_from")
        .datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1
        })
        .on("change", function () {
            to.datepicker("option", "minDate", EditStats.getDate(this));
        });
    var to = $("#e_datepicker_until").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1
    }).on("change", function () {
        from.datepicker("option", "maxDate", EditStats.getDate(this));
    });

    function renderEditStatElements() {
        $("#generate_edit_button").show();
        $("#generate_edit_stat").button();
        $("#edit_graph_type").buttonset();
        $("#talk_edit_graph_type").buttonset();
        $("#edit_graph_type2").buttonset();
        $("#talk_edit_graph_type2").buttonset();
        $("#edit_graph_type").hide();
        $("#talk_edit_graph_type").hide();
        $("#edit_graph_type2").hide();
        $("#talk_edit_graph_type2").hide();

        $(".accordition_element").accordion({
            collapsible: true,
            active: true,
            heightStyle: "content"
        });

        $("#edit_stats_accordion").hide();

        $("#editors_graph_type").buttonset();
        $("#talk_editors_graph_type").buttonset();
        $("#editors_graph_type2").buttonset();
        $("#talk_editors_graph_type2").buttonset();
        $("#editors_graph_type").hide();
        $("#talk_editors_graph_type").hide();
        $("#editors_graph_type2").hide();
        $("#talk_editors_graph_type2").hide();

        $("#editors_stats_accordion").hide();

        $("#edit_results").hide();
        $("#talk_edit_results").hide();

        $("#edit_description_accordion_header").click();

        $("#ratios_accordion").hide();
        $("#talk_ratios_accordion").hide();
        $("#edit_stats_loading_form").hide();
        $("#edit_details_accordion").hide();

        $("#edit_progressbar").progressbar({
            value: 0
        });

    }

    renderEditStatElements();



    $(".help_dialog").dialog({
        autoOpen: false,
        width: 800,
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

    $("#revision_stats_i").bind('click', function (event) {
        $("#revision_stats_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#talk_revision_stats_i").bind('click', function (event) {
        $("#talk_revision_stats_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#revisions_m_stats_i").bind('click', function (event) {
        $("#revisions_m_stats_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#talk_revision_m_stats_i").bind('click', function (event) {
        $("#talk_revision_m_stats_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#editors_m_stats_i").bind('click', function (event) {
        $("#editors_m_stats_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#talk_editors_m_stats_i").bind('click', function (event) {
        $("#talk_editors_m_stats_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#e_e_i").bind('click', function (event) {
        $("#e_e_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#talk_e_e_i").bind('click', function (event) {
        $("#e_e_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#e_e_graph_i").bind('click', function (event) {
        $("#e_e_graph_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#talk_e_e_graph_i").bind('click', function (event) {
        $("#talk_e_e_graph_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#revision_map_i").bind('click', function (event) {
        $("#revision_map_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#talk_revision_map_i").bind('click', function (event) {
        $("#talk_revision_map_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#e_e_m_graph_i").bind('click', function (event) {
        $("#e_e_m_graph_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#talk_e_e_m_graph_i").bind('click', function (event) {
        $("#talk_e_e_m_graph_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#revisions_y_stats_i").bind('click', function (event) {
        $("#revisions_y_stats_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#talk_revisions_y_stats_i").bind('click', function (event) {
        $("#talk_revisions_y_stats_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#editors_stats_i").bind('click', function (event) {
        $("#editors_stats_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#talk_editors_stats_i").bind('click', function (event) {
        $("#talk_editors_stats_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#editors_stats_y_i").bind('click', function (event) {
        $("#editors_stats_y_i_dialog").dialog("open");
        event.preventDefault();
    });

    $("#talk_editors_stats_y_i").bind('click', function (event) {
        $("#talk_editors_stats_y_i_dialog").dialog("open");
        event.preventDefault();
    });


    $("#m_o_edits").bind('click', function (event) {
        if ($('#no_bots3').is(':checked')) {
            DetailedEditPlotHook(true, false, false, true);
        } else {
            DetailedEditPlotHook(true, false, false, false);
        }
    });

    $("#talk_m_o_edits").bind('click', function (event) {
        if ($('#talk_no_bots3').is(':checked')) {
            DetailedTalkEditPlotHook(true, false, false, true);
        } else {
            DetailedTalkEditPlotHook(true, false, false, false);
        }
    });

    $("#m_comb_edits").bind('click', function (event) {
        if ($('#no_bots3').is(':checked')) {
            DetailedEditPlotHook(true, true, true, true);
        } else {
            console.log('all true2');
            DetailedEditPlotHook(true, true, true, false);
        }
    });

    $("#talk_m_comb_edits").bind('click', function (event) {
        if ($('#talk_no_bots3').is(':checked')) {
            DetailedTalkEditPlotHook(true, true, true, true);
        } else {
            DetailedTalkEditPlotHook(true, true, true, false);
        }
    });

    $("#m_d_edits").bind('click', function (event) {
        if ($('#no_bots3').is(':checked')) {
            DetailedEditPlotHook(false, true, false, true);
        } else {
            DetailedEditPlotHook(false, true, false, false);
        }
    });

    $("#talk_m_d_edits").bind('click', function (event) {
        if ($('#talk_no_bots3').is(':checked')) {
            DetailedTalkEditPlotHook(false, true, false, true);
        } else {
            DetailedTalkEditPlotHook(false, true, false, false);
        }
    });

    $("#m_dm_edits").bind('click', function (event) {
        if ($('#no_bots3').is(':checked')) {
            DetailedEditPlotHook(false, false, true, true);
        } else {
            DetailedEditPlotHook(false, false, true, false);
        }
    });

    $("#talk_m_dm_edits").bind('click', function (event) {
        if ($('#talk_no_bots3').is(':checked')) {
            DetailedTalkEditPlotHook(false, false, true, true);
        } else {
            DetailedTalkEditPlotHook(false, false, true, false);
        }
    });


    $("#o_edits").bind('click', function (event) {
        if ($('#no_bots').is(':checked')) {
            plotYearDataGraph($("#chart_ph_1"),
                getNonBotEditData(),
                "Overall non-bot edits per year",
                getMaxHeightForStats(getOverallEditData()),
                '#CFA600',
                false,
                false,
                false
            );
        } else {
            plotYearDataGraph($("#chart_ph_1"),
                getOverallEditData(),
                "Overall edits per year",
                getMaxHeightForStats(getOverallEditData()),
                '#CFA600',
                false,
                false,
                false
            );
        }
    });

    $("#talk_o_edits").bind('click', function (event) {
        if ($('#talk_no_bots').is(':checked')) {
            plotYearDataGraph($("#talk_chart_ph_1"),
                getNonBotTalkEditData(),
                "Overall non-bot edits per year",
                getMaxHeightForStats(getOverallTalkEditData()),
                '#CFA600',
                false,
                false,
                false
            );
        } else {
            plotYearDataGraph($("#talk_chart_ph_1"),
                getOverallTalkEditData(),
                "Overall edits per year",
                getMaxHeightForStats(getOverallTalkEditData()),
                '#CFA600',
                false,
                false,
                false
            );
        }
    });

    $("#d_edits").bind('click', function (event) {
        if ($('#no_bots').is(':checked')) {
            plotYearDataGraph($("#chart_ph_1"),
                getNonBotDistinctEditData(),
                "Distinct non-bot edits per year",
                getMaxHeightForStats(getOverallEditData()),
                '#EBC633',
                false,
                false,
                false
            );
        } else {
            plotYearDataGraph($("#chart_ph_1"),
                getDistinctEditData(),
                "Distinct edits per year",
                getMaxHeightForStats(getOverallEditData()),
                '#EBC633',
                false,
                false,
                false
            );
        }
    });


    $("#talk_d_edits").bind('click', function (event) {
        if ($('#talk_no_bots').is(':checked')) {
            plotYearDataGraph($("#talk_chart_ph_1"),
                getNonBotDistinctTalkEditData(),
                "Distinct non-bot edits per year",
                getMaxHeightForStats(getOverallTalkEditData()),
                '#EBC633',
                false,
                false,
                false
            );
        } else {
            plotYearDataGraph($("#talk_chart_ph_1"),
                getDistinctTalkEditData(),
                "Distinct edits per year",
                getMaxHeightForStats(getOverallTalkEditData()),
                '#EBC633',
                false,
                false,
                false
            );
        }
    });

    $("#dm_edits").bind('click', function (event) {
        if ($('#no_bots').is(':checked')) {
            plotYearDataGraph($("#chart_ph_1"),
                getNonBotDistinctMajorEditData(),
                "Major distinct non-bot edits per year",
                getMaxHeightForStats(getOverallEditData()),
                '#F2DA7D',
                false,
                false,
                false
            );
        } else {
            plotYearDataGraph($("#chart_ph_1"),
                getDistinctMajorEditData(),
                "Major distinct edits per year",
                getMaxHeightForStats(getOverallEditData()),
                '#F2DA7D',
                false,
                false,
                false
            );
        }
    });

    $("#talk_dm_edits").bind('click', function (event) {
        if ($('#talk_no_bots').is(':checked')) {
            plotYearDataGraph($("#talk_chart_ph_1"),
                getNonBotDistinctMajorTalkEditData(),
                "Major distinct non-bot edits per year",
                getMaxHeightForStats(getOverallTalkEditData()),
                '#F2DA7D',
                false,
                false,
                false
            );
        } else {
            plotYearDataGraph($("#talk_chart_ph_1"),
                getDistinctMajorTalkEditData(),
                "Major distinct edits per year",
                getMaxHeightForStats(getOverallTalkEditData()),
                '#F2DA7D',
                false,
                false,
                false
            );
        }
    });

    $("#comb_edits").bind('click', function (event) {
        var overallEditData = getOverallEditData();
        if ($('#no_bots').is(':checked')) {
            plotYearlyEditsMultiGraph(true);
        } else {
            plotYearlyEditsMultiGraph(false);
        }
    });

    $("#talk_comb_edits").bind('click', function (event) {
        var overallEditData = getOverallTalkEditData();
        if ($('#talk_no_bots').is(':checked')) {
            plotYearlyTalkEditsMultiGraph(true);
        } else {
            plotYearlyTalkEditsMultiGraph(false);
        }
    });

    $("#no_bots").bind('click', function (event) {
        if ($('#no_bots').is(':checked')) {
            if ($('#o_edits').is(':checked')) {
                plotYearDataGraph($("#chart_ph_1"),
                    getNonBotEditData(),
                    "Overall non-bot edits per year",
                    getMaxHeightForStats(getOverallEditData()),
                    '#CFA600',
                    false,
                    false,
                    false
                );
            } else {
                if ($('#d_edits').is(':checked')) {
                    plotYearDataGraph($("#chart_ph_1"),
                        getNonBotDistinctEditData(),
                        "Distinct non-bot edits per year",
                        getMaxHeightForStats(getOverallEditData()),
                        '#EBC633',
                        false,
                        false,
                        false
                    );
                } else {
                    if ($('#dm_edits').is(':checked')) {
                        plotYearDataGraph($("#chart_ph_1"),
                            getNonBotDistinctMajorEditData(),
                            "Major distinct non-bot edits per year",
                            getMaxHeightForStats(getOverallEditData()),
                            '#F2DA7D',
                            false,
                            false,
                            false
                        );
                    } else {
                        plotYearlyEditsMultiGraph(true);
                    }
                }
            }
        } else {
            if ($('#o_edits').is(':checked')) {
                plotYearDataGraph($("#chart_ph_1"),
                    getOverallEditData(),
                    "Overall edits per year",
                    getMaxHeightForStats(getOverallEditData()),
                    '#CFA600',
                    false,
                    false,
                    false
                );
            } else {
                if ($('#d_edits').is(':checked')) {
                    plotYearDataGraph($("#chart_ph_1"),
                        getDistinctEditData(),
                        "Distinct edits per year",
                        getMaxHeightForStats(getOverallEditData()),
                        '#EBC633',
                        false,
                        false,
                        false
                    );
                } else {
                    if ($('#dm_edits').is(':checked')) {
                        plotYearDataGraph($("#chart_ph_1"),
                            getDistinctMajorEditData(),
                            "Major distinct edits per year",
                            getMaxHeightForStats(getOverallEditData()),
                            "#F2DA7D",
                            false,
                            false,
                            false
                        );
                    } else {
                        plotYearlyEditsMultiGraph(false);
                    }
                }
            }
        }
    });

    $("#talk_no_bots").bind('click', function (event) {
        if ($('#talk_no_bots').is(':checked')) {
            if ($('#talk_o_edits').is(':checked')) {
                plotYearDataGraph($("#talk_chart_ph_1"),
                    getNonBotTalkEditData(),
                    "Overall non-bot edits per year",
                    getMaxHeightForStats(getOverallTalkEditData()),
                    '#CFA600',
                    false,
                    false,
                    false
                );
            } else {
                if ($('#talk_d_edits').is(':checked')) {
                    plotYearDataGraph($("#talk_chart_ph_1"),
                        getNonBotDistinctTalkEditData(),
                        "Distinct non-bot edits per year",
                        getMaxHeightForStats(getOverallTalkEditData()),
                        '#EBC633',
                        false,
                        false,
                        false
                    );
                } else {
                    if ($('#talk_dm_edits').is(':checked')) {
                        plotYearDataGraph($("#talk_chart_ph_1"),
                            getNonBotDistinctMajorTalkEditData(),
                            "Major distinct non-bot edits per year",
                            getMaxHeightForStats(getOverallTalkEditData()),
                            '#F2DA7D',
                            false,
                            false,
                            false
                        );
                    } else {
                        plotYearlyTalkEditsMultiGraph(true);
                    }
                }
            }
        } else {
            if ($('#talk_o_edits').is(':checked')) {
                plotYearDataGraph($("#talk_chart_ph_1"),
                    getOverallTalkEditData(),
                    "Overall edits per year",
                    getMaxHeightForStats(getOverallTalkEditData()),
                    '#CFA600',
                    false,
                    false,
                    false
                );
            } else {
                if ($('#talk_d_edits').is(':checked')) {
                    plotYearDataGraph($("#talk_chart_ph_1"),
                        getDistinctTalkEditData(),
                        "Distinct edits per year",
                        getMaxHeightForStats(getOverallTalkEditData()),
                        '#EBC633',
                        false,
                        false,
                        false
                    );
                } else {
                    if ($('#talk_dm_edits').is(':checked')) {
                        plotYearDataGraph($("#talk_chart_ph_1"),
                            getDistinctMajorTalkEditData(),
                            "Major distinct edits per year",
                            getMaxHeightForStats(getOverallTalkEditData()),
                            "#F2DA7D",
                            false,
                            false,
                            false
                        );
                    } else {
                        plotYearlyTalkEditsMultiGraph(false);
                    }
                }
            }
        }
    });

    $("#o_editors").bind('click', function (event) {
        plotYearDataGraph($("#chart_ph_2"),
            getEditorsData(),
            "Overall editors per year",
            getMaxHeightForStats(getEditorsData()),
            '#006699',
            false,
            false,
            false
        );
    });

    $("#talk_o_editors").bind('click', function (event) {
        plotYearDataGraph($("#talk_chart_ph_2"),
            getTalkEditorsData(),
            "Overall editors per year",
            getMaxHeightForStats(getTalkEditorsData()),
            '#006699',
            false,
            false,
            false
        );
    });

    $("#r_editors").bind('click', function (event) {
        plotYearDataGraph($("#chart_ph_2"),
            getRegisteredEditorsData(),
            "Registered editors per year",
            getMaxHeightForStats(getEditorsData()),
            '#4D94B8',
            false,
            false,
            false
        );
    });

    $("#talk_r_editors").bind('click', function (event) {
        plotYearDataGraph($("#talk_chart_ph_2"),
            getRegisteredTalkEditorsData(),
            "Registered editors per year",
            getMaxHeightForStats(getTalkEditorsData()),
            '#4D94B8',
            false,
            false,
            false
        );
    });

    $("#a_editors").bind('click', function (event) {
        plotYearDataGraph($("#chart_ph_2"),
            getAnonymEditorsData(),
            "Anonymous editors per year",
            getMaxHeightForStats(getEditorsData()),
            '#94BFD4',
            false,
            false,
            false
        );
    });


    $("#talk_a_editors").bind('click', function (event) {
        plotYearDataGraph($("#talk_chart_ph_2"),
            getAnonymTalkEditorsData(),
            "Anonymous editors per year",
            getMaxHeightForStats(getTalkEditorsData()),
            '#94BFD4',
            false,
            false,
            false
        );
    });

    $("#b_editors").bind('click', function (event) {
        plotYearDataGraph($("#chart_ph_2"),
            getBotEditorsData(),
            "Bot editors per year",
            getMaxHeightForStats(getEditorsData()),
            '#C7DDE9',
            false,
            false,
            false
        );
    });

    $("#talk_b_editors").bind('click', function (event) {
        plotYearDataGraph($("#talk_chart_ph_2"),
            getBotTalkEditorsData(),
            "Bot editors per year",
            getMaxHeightForStats(getTalkEditorsData()),
            '#C7DDE9',
            false,
            false,
            false
        );
    });

    $("#m_o_editors").bind('click', function (event) {
        detailedEditorGraphPlotHook(true, false, false, false);
    });

    $("#talk_m_o_editors").bind('click', function (event) {
        detailedTalkEditorGraphPlotHook(true, false, false, false);
    });

    $("#m_r_editors").bind('click', function (event) {
        detailedEditorGraphPlotHook(false, true, false, false);
    });

    $("#talk_m_r_editors").bind('click', function (event) {
        detailedTalkEditorGraphPlotHook(false, true, false, false);
    });

    $("#m_a_editors").bind('click', function (event) {
        detailedEditorGraphPlotHook(false, false, true, false);
    });

    $("#talk_m_a_editors").bind('click', function (event) {
        detailedTalkEditorGraphPlotHook(false, false, true, false);
    });

    $("#m_b_editors").bind('click', function (event) {
        detailedEditorGraphPlotHook(false, false, false, true);
    });

    $("#talk_m_b_editors").bind('click', function (event) {
        detailedTalkEditorGraphPlotHook(false, false, false, true);
    });

    $("#m_co_editors").bind('click', function (event) {
        detailedEditorGraphPlotHook(true, true, true, true);
    });

    $("#talk_m_co_editors").bind('click', function (event) {
        detailedTalkEditorGraphPlotHook(true, true, true, true);
    });


    $("#co_editors").bind('click', function (event) {
        plotEditorsYearGraph();
    });

    $("#talk_co_editors").bind('click', function (event) {
        plotTalkEditorsYearGraph();
    });

    $("#no_bots3").bind('click', function (event) {
        if ($('#no_bots3').is(':checked')) {
            if ($('#m_o_edits').is(':checked')) {
                DetailedEditPlotHook(true, false, false, true);
            } else {
                if ($('#m_d_edits').is(':checked')) {
                    DetailedEditPlotHook(false, true, false, true);
                } else {
                    if ($('#m_dm_edits').is(':checked')) {
                        DetailedEditPlotHook(false, false, true, true);
                    } else {
                        DetailedEditPlotHook(true, true, true, true);
                    }
                }
            }
        } else {
            if ($('#m_o_edits').is(':checked')) {
                DetailedEditPlotHook(true, false, false, false);
            } else {
                if ($('#m_d_edits').is(':checked')) {
                    DetailedEditPlotHook(false, true, false, false);
                } else {
                    if ($('#m_dm_edits').is(':checked')) {
                        DetailedEditPlotHook(false, false, true, false);
                    } else {
                        DetailedEditPlotHook(true, true, true, false);
                    }
                }
            }
        }
        // END
    });
    // ATTENTION BAD HOOK URI REQUEST
    $("#talk_no_bots3").bind('click', function (event) {
        if ($('#talk_no_bots3').is(':checked')) {
            if ($('#talk_m_o_edits').is(':checked')) {
                DetailedTalkEditPlotHook(true, false, false, true);
            } else {
                if ($('#talk_m_d_edits').is(':checked')) {
                    DetailedTalkEditPlotHook(false, true, false, true);
                } else {
                    if ($('#talk_m_dm_edits').is(':checked')) {
                        DetailedTalkEditPlotHook(false, false, true, true);
                    } else {
                        DetailedTalkEditPlotHook(true, true, true, true);
                    }
                }
            }
        } else {
            if ($('#talk_m_o_edits').is(':checked')) {
                DetailedTalkEditPlotHook(true, false, false, false);
            } else {
                if ($('#talk_m_d_edits').is(':checked')) {
                    DetailedTalkEditPlotHook(false, true, false, false);
                } else {
                    if ($('#talk_m_dm_edits').is(':checked')) {
                        DetailedTalkEditPlotHook(false, false, true, false);
                    } else {
                        DetailedTalkEditPlotHook(true, true, true, false);
                    }
                }
            }
        }
    });

    $("#edits_part_header").bind('click', function (event) {
        var rendered = $('#edits_part').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            $('#edit_stat_header').click();
            $('#edits_part').attr('rendered', 1);
        }
    });

    $("#talk_edits_part_header").bind('click', function (event) {
        var rendered = $('#talk_edits_part').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            $('#talk_edit_stat_header').click();
            $('#talk_edits_part').attr('rendered', 1);
        }
    });


    $("#editors_part_header").bind('click', function (event) {
        var rendered = $('#editors_part').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            $('#editor_stat_header').click();
            $('#editors_part').attr('rendered', 1);
        }
    });

    $("#talk_editors_part_header").bind('click', function (event) {
        var rendered = $('#talk_editors_part').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            $('#talk_editor_stat_header').click();
            $('#talk_editors_part').attr('rendered', 1);
        }
    });

    $("#edits_editor_part_header").bind('click', function (event) {
        var rendered = $('#edits_editor_part').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            //
            $('#edits_editor_part').attr('rendered', 1);
        }
    });

    $("#talk_edits_editor_part_header").bind('click', function (event) {
        var rendered = $('#talk_edits_editor_part').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            //
            $('#talk_edits_editor_part').attr('rendered', 1);
        }
    });


        $("#talk_e_e_accordion_header").bind('click', function (event) {
            var rendered = $('#talk_e_e_accordion').attr('rendered');
            if (typeof (rendered) == 'undefined') {
                var visualOverride = constructVisualOverride(false, false, true, true);
                var plotArray3 = convert2JsonToInstabilityYearArray(getOverallTalkEditData(), getTalkEditorsData());

                plotYearDataGraph($("#talk_chart_ph_4"),
                    plotArray3,
                    "Edits per editor (yearly)",
                    getMaxHeightFromArray(plotArray3),
                    '#846335',
                    true,
                    true,
                    visualOverride
                );
                $('#talk_e_e_accordion').attr('rendered', 1);
            }
        });

    $("#e_e_accordion_header").bind('click', function (event) {
        var rendered = $('#e_e_accordion').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            var visualOverride = constructVisualOverride(false, false, true, true);
            var plotArray3 = convert2JsonToInstabilityYearArray(getOverallEditData(), getEditorsData());

            plotYearDataGraph($("#chart_ph_4"),
                plotArray3,
                "Edits per editor (yearly)",
                getMaxHeightFromArray(plotArray3),
                '#846335',
                true,
                true,
                visualOverride
            );
            $('#e_e_accordion').attr('rendered', 1);
        }
    });


    $("#edit_editor_stat_header").bind('click', function (event) {
        var rendered = $('#edit_editor_stat').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            var visualOverride = constructVisualOverride(false, false, true, true);
            var plotArray3 = convert2JsonToInstabilityMonthArray(getNonBotDistinctMajorEditData(), getNonBotDistinctMajorEditorsData());

            plotMonthDataOverviewGraph($("#chart_ph_7"),
                $("#chart_ph_7_overview"),
                plotArray3,
                "Edits per editor (monthly)",
                getMaxHeightFromArray(plotArray3),
                '#343434',
                true,
                true,
                visualOverride
            );
            $('#edit_editor_stat').attr('rendered', 1);
        }
    });


        $("#talk_edit_editor_stat_header").bind('click', function (event) {
            var rendered = $('#talk_edit_editor_stat').attr('rendered');
            if (typeof (rendered) == 'undefined') {
                var visualOverride = constructVisualOverride(false, false, true, true);
                var plotArray3 = convert2JsonToInstabilityMonthArray(getNonBotDistinctMajorTalkEditData(), getNonBotDistinctMajorTalkEditorsData());

                plotMonthDataOverviewGraph($("#talk_chart_ph_7"),
                    $("#talk_chart_ph_7_overview"),
                    plotArray3,
                    "Edits per editor (monthly)",
                    getMaxHeightFromArray(plotArray3),
                    '#343434',
                    true,
                    true,
                    visualOverride
                );
                $('#talk_edit_editor_stat').attr('rendered', 1);
            }
        });



    $("#edits_yearly_accordion_header").bind('click', function (event) {
        var rendered = $('#edits_yearly_accordion_').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            plotYearlyEditsMultiGraph(false);
            $('#edits_yearly_accordion_').attr('rendered', 1);
        }
    });


    $("#talk_edits_yearly_accordion_header").bind('click', function (event) {
        var rendered = $('#talk_edits_yearly_accordion_').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            plotYearlyTalkEditsMultiGraph(false);
            $('#talk_edits_yearly_accordion_').attr('rendered', 1);
        }
    });

    $("#detailed_view_header").bind('click', function (event) {
        var rendered = $('#edit_details_accordion').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            plotMonthlyEditsMultiGraph(false);
            $('#edit_details_accordion').attr('rendered', 1);
        }
    });

    $("#talk_detailed_view_header").bind('click', function (event) {
        var rendered = $('#talk_edit_details_accordion').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            plotMonthlyTalkEditsMultiGraph(false);
            $('#talk_edit_details_accordion').attr('rendered', 1);
        }
    });

    $("#editors_y_stats_header").bind('click', function (event) {
        var rendered = $('#editors_y_stats').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            plotEditorsYearGraph();
            $('#editors_y_stats').attr('rendered', 1);
        }
    });

    $("#talk_editors_y_stats_header").bind('click', function (event) {
        var rendered = $('#talk_editors_y_stats').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            plotTalkEditorsYearGraph();
            $('#talk_editors_y_stats').attr('rendered', 1);
        }
    });

    $("#detailed_editors_header").bind('click', function (event) {
        var rendered = $('#editors_details_accordion').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            var overallEditorsData = getEditorsData();
            var visualOverride = false;
            var dataObject1 = constructMonthDataObject(
                getEditorsData(),
                '#006699',
                'Overall editors',
                false,
                visualOverride,
                4
            );
            var dataObject2 = constructMonthDataObject(
                getRegisteredEditorsData(),
                '#4D94B8',
                'Registered editors',
                false,
                visualOverride,
                4
            );
            var dataObject3 = constructMonthDataObject(
                getAnonymEditorsData(),
                '#94BFD4',
                'Anonymous editors',
                false,
                visualOverride,
                4
            );
            var dataObject4 = constructMonthDataObject(
                getBotEditorsData(),
                '#C7DDE9',
                'Bot editors',
                false,
                visualOverride,
                4
            );
            plotMonthMultiGraph4(
                $("#chart_ph_5"),
                $("#chart_ph_5_overview"),
                dataObject1,
                dataObject2,
                dataObject3,
                dataObject4,
                getMaxHeightForStats(getEditorsData(), true), false, dataObject1);
            $('#editors_details_accordion').attr('rendered', 1);
        }
    });

    $("#talk_detailed_editors_header").bind('click', function (event) {
        var rendered = $('#talk_editors_details_accordion').attr('rendered');
        if (typeof (rendered) == 'undefined') {
            var overallEditorsData = getTalkEditorsData();
            var visualOverride = false;
            var dataObject1 = constructMonthDataObject(
                getTalkEditorsData(),
                '#006699',
                'Overall editors',
                false,
                visualOverride,
                4
            );
            var dataObject2 = constructMonthDataObject(
                getRegisteredTalkEditorsData(),
                '#4D94B8',
                'Registered editors',
                false,
                visualOverride,
                4
            );
            var dataObject3 = constructMonthDataObject(
                getAnonymTalkEditorsData(),
                '#94BFD4',
                'Anonymous editors',
                false,
                visualOverride,
                4
            );
            var dataObject4 = constructMonthDataObject(
                getBotTalkEditorsData(),
                '#C7DDE9',
                'Bot editors',
                false,
                visualOverride,
                4
            );
            plotMonthMultiGraph4(
                $("#talk_chart_ph_5"),
                $("#talk_chart_ph_5_overview"),
                dataObject1,
                dataObject2,
                dataObject3,
                dataObject4,
                getMaxHeightForStats(getTalkEditorsData(), true), false, dataObject1);
            $('#talk_editors_details_accordion').attr('rendered', 1);
        }
    });


    function DetailedEditPlotHook(data1, data2, data3, bots) {
        var overViewData;
        var overallEditData = getOverallEditData();
        var visualOverride = false;
        if (bots) {
            var dataObject1 = constructMonthDataObject(
                getNonBotEditData(),
                '#CFA600',
                'Overall non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructMonthDataObject(
                getNonBotDistinctEditData(),
                '#EBC633',
                'Distinct non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructMonthDataObject(
                getNonBotDistinctMajorEditData(),
                '#F2DA7D',
                'Major non-bot distinct edits',
                false,
                visualOverride,
                3
            );
        } else {
            var dataObject1 = constructMonthDataObject(
                getOverallEditData(),
                '#CFA600',
                'Overall edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructMonthDataObject(
                getDistinctEditData(),
                '#EBC633',
                'Distinct edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructMonthDataObject(
                getDistinctMajorEditData(),
                '#F2DA7D',
                'Major distinct edits',
                false,
                visualOverride,
                3
            );
        }
        overViewData = dataObject1;
        window.aData = overViewData;
        if (data1 === false)
            dataObject1 = false;
        if (data2 === false)
            dataObject2 = false;
        if (data3 === false)
            dataObject3 = false;
        plotMonthMultiGraph3($("#chart_ph_3"),
            $("#chart_ph_3_overview"),
            dataObject1,
            dataObject2,
            dataObject3,
            getMaxHeightForStats(getOverallEditData(), true), false, overViewData);
    }

    // ATTENTION BAD HOOK Uri request
    function DetailedTalkEditPlotHook(data1, data2, data3, bots) {
        var overViewData;
        var overallEditData = getOverallTalkEditData();
        var visualOverride = false;
        if (bots) {
            var dataObject1 = constructMonthDataObject(
                getNonBotTalkEditData(),
                '#CFA600',
                'Overall non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructMonthDataObject(
                getNonBotDistinctTalkEditData(),
                '#EBC633',
                'Distinct non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructMonthDataObject(
                getNonBotDistinctMajorTalkEditData(),
                '#F2DA7D',
                'Major non-bot distinct edits',
                false,
                visualOverride,
                3
            );
        } else {
            var dataObject1 = constructMonthDataObject(
                getOverallTalkEditData(),
                '#CFA600',
                'Overall edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructMonthDataObject(
                getDistinctTalkEditData(),
                '#EBC633',
                'Distinct edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructMonthDataObject(
                getDistinctMajorTalkEditData(),
                '#F2DA7D',
                'Major distinct edits',
                false,
                visualOverride,
                3
            );
        }
        overViewData = dataObject1;
        if (data1 === false)
            dataObject1 = false;
        if (data2 === false)
            dataObject2 = false;
        if (data3 === false)
            dataObject3 = false;
        window.tData = overViewData;
        plotMonthMultiGraph3($("#talk_chart_ph_3"),
            $("#talk_chart_ph_3_overview"),
            dataObject1,
            dataObject2,
            dataObject3,
            getMaxHeightForStats(getOverallTalkEditData(), true), false, overViewData);
    }

    function plotYearlyEditsMultiGraph(bots) {
        var overallEditData = getOverallEditData();
        var visualOverride = constructVisualOverride(true, false, false, false);
        if (bots) {
            var dataObject1 = constructYearDataObject(
                getNonBotEditData(),
                '#CFA600',
                'Overall non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructYearDataObject(
                getNonBotDistinctEditData(),
                '#EBC633',
                'Distinct non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructYearDataObject(
                getNonBotDistinctMajorEditData(),
                '#F2DA7D',
                'Major distinct non-bot edits',
                false,
                visualOverride,
                3
            );
        } else {
            var dataObject1 = constructYearDataObject(
                overallEditData,
                '#CFA600',
                'Overall edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructYearDataObject(
                getDistinctEditData(),
                '#EBC633',
                'Distinct edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructYearDataObject(
                getDistinctMajorEditData(),
                '#F2DA7D',
                'Major distinct edits',
                false,
                visualOverride,
                3
            );
        }
        plotYearMultiGraph3($("#chart_ph_1"), dataObject1, dataObject2, dataObject3, getMaxHeightForStats(overallEditData));
    }

    function plotYearlyTalkEditsMultiGraph(bots) {
        var overallEditData = getOverallTalkEditData();
        var visualOverride = constructVisualOverride(true, false, false, false);
        if (bots) {
            var dataObject1 = constructYearDataObject(
                getNonBotTalkEditData(),
                '#CFA600',
                'Overall non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructYearDataObject(
                getNonBotDistinctTalkEditData(),
                '#EBC633',
                'Distinct non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructYearDataObject(
                getNonBotDistinctMajorTalkEditData(),
                '#F2DA7D',
                'Major distinct non-bot edits',
                false,
                visualOverride,
                3
            );
        } else {
            var dataObject1 = constructYearDataObject(
                getOverallTalkEditData(),
                '#CFA600',
                'Overall edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructYearDataObject(
                getDistinctTalkEditData(),
                '#EBC633',
                'Distinct edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructYearDataObject(
                getDistinctMajorTalkEditData(),
                '#F2DA7D',
                'Major distinct edits',
                false,
                visualOverride,
                3
            );
        }
        plotYearMultiGraph3($("#talk_chart_ph_1"), dataObject1, dataObject2, dataObject3, getMaxHeightForStats(getOverallTalkEditData()));
    }


    function plotMonthlyEditsMultiGraph(bots) {
        var overallEditData = getOverallEditData();
        var visualOverride = false/*constructVisualOverride(true, false, false, false)*/;
        if (bots) {
            var dataObject1 = constructMonthDataObject(
                getNonBotEditData(),
                '#CFA600',
                'Overall non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructMonthDataObject(
                getNonBotDistinctEditData(),
                '#EBC633',
                'Distinct non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructMonthDataObject(
                getNonBotDistinctMajorEditData(),
                '#F2DA7D',
                'Major non-bot distinct edits',
                false,
                visualOverride,
                3
            );
        } else {
            var dataObject1 = constructMonthDataObject(
                getOverallEditData(),
                '#CFA600',
                'Overall edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructMonthDataObject(
                getDistinctEditData(),
                '#EBC633',
                'Distinct edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructMonthDataObject(
                getDistinctMajorEditData(),
                '#F2DA7D',
                'Major distinct edits',
                false,
                visualOverride,
                3
            );
        }
        plotMonthMultiGraph3(
            $("#chart_ph_3"),
            $("#chart_ph_3_overview"),
            dataObject1,
            dataObject2,
            dataObject3,
            getMaxHeightForStats(getOverallEditData(), true),
            false,
        );
    }

    function plotMonthlyTalkEditsMultiGraph(bots) {
        var overallEditData = getOverallTalkEditData();
        var visualOverride = false/*constructVisualOverride(true, false, false, false)*/;
        if (bots) {
            var dataObject1 = constructMonthDataObject(
                getNonBotTalkEditData(),
                '#CFA600',
                'Overall non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructMonthDataObject(
                getNonBotDistinctTalkEditData(),
                '#EBC633',
                'Distinct non-bot edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructMonthDataObject(
                getNonBotDistinctMajorTalkEditData(),
                '#F2DA7D',
                'Major non-bot distinct edits',
                false,
                visualOverride,
                3
            );
        } else {
            var dataObject1 = constructMonthDataObject(
                getOverallTalkEditData(),
                '#CFA600',
                'Overall edits',
                false,
                visualOverride,
                3
            );
            var dataObject2 = constructMonthDataObject(
                getDistinctTalkEditData(),
                '#EBC633',
                'Distinct edits',
                false,
                visualOverride,
                3
            );
            var dataObject3 = constructMonthDataObject(
                getDistinctMajorTalkEditData(),
                '#F2DA7D',
                'Major distinct edits',
                false,
                visualOverride,
                3
            );
        }
        plotMonthMultiGraph3(
            $("#talk_chart_ph_3"),
            $("#talk_chart_ph_3_overview"),
            dataObject1,
            dataObject2,
            dataObject3,
            getMaxHeightForStats(getOverallTalkEditData(), true),
            false
        );
    }


    function detailedEditorGraphPlotHook(data1, data2, data3, data4) {

        var overallEditorsData = getEditorsData();
        var visualOverride = false/*constructVisualOverride(true, false, false, false)*/;
        var dataObject1 = constructMonthDataObject(
            getEditorsData(),
            '#006699',
            'Overall editors',
            false,
            visualOverride,
            4
        );
        var dataObject2 = constructMonthDataObject(
            getRegisteredEditorsData(),
            '#4D94B8',
            'Registered editors',
            false,
            visualOverride,
            4
        );
        var dataObject3 = constructMonthDataObject(
            getAnonymEditorsData(),
            '#94BFD4',
            'Anonymous editors',
            false,
            visualOverride,
            4
        );
        var dataObject4 = constructMonthDataObject(
            getBotEditorsData(),
            '#C7DDE9',
            'Bot editors',
            false,
            visualOverride,
            4
        );
        var overviewData = dataObject1;
        if (data1 === false)
            dataObject1 = false;
        if (data2 === false)
            dataObject2 = false;
        if (data3 === false)
            dataObject3 = false;
        if (data4 === false)
            dataObject4 = false;
        console.log('test3' + overviewData);
        plotMonthMultiGraph4(
            $("#chart_ph_5"),
            $("#chart_ph_5_overview"),
            dataObject1,
            dataObject2,
            dataObject3,
            dataObject4,
            getMaxHeightForStats(getEditorsData(), true), false, overviewData);
    }

    function detailedTalkEditorGraphPlotHook(data1, data2, data3, data4) {

        var overallEditorsData = getTalkEditorsData();
        var visualOverride = false/*constructVisualOverride(true, false, false, false)*/;
        var dataObject1 = constructMonthDataObject(
            getTalkEditorsData(),
            '#006699',
            'Overall editors',
            false,
            visualOverride,
            4
        );
        var dataObject2 = constructMonthDataObject(
            getRegisteredTalkEditorsData(),
            '#4D94B8',
            'Registered editors',
            false,
            visualOverride,
            4
        );
        var dataObject3 = constructMonthDataObject(
            getAnonymTalkEditorsData(),
            '#94BFD4',
            'Anonymous editors',
            false,
            visualOverride,
            4
        );
        var dataObject4 = constructMonthDataObject(
            getBotTalkEditorsData(),
            '#C7DDE9',
            'Bot editors',
            false,
            visualOverride,
            4
        );
        var overviewData = dataObject1;
        if (data1 === false)
            dataObject1 = false;
        if (data2 === false)
            dataObject2 = false;
        if (data3 === false)
            dataObject3 = false;
        if (data4 === false)
            dataObject4 = false;
        console.log('test3' + overviewData);
        plotMonthMultiGraph4(
            $("#talk_chart_ph_5"),
            $("#talk_chart_ph_5_overview"),
            dataObject1,
            dataObject2,
            dataObject3,
            dataObject4,
            getMaxHeightForStats(getTalkEditorsData(), true), false, overviewData);
    }


    function plotEditorsYearGraph() {
        var visualOverride = false/*constructVisualOverride(true, false, false, false)*/;
        var dataObject1 = constructYearDataObject(
            getEditorsData(),
            '#006699',
            'Overall editors',
            false,
            visualOverride,
            4
        );
        var dataObject2 = constructYearDataObject(
            getRegisteredEditorsData(),
            '#4D94B8',
            'Registered editors',
            false,
            visualOverride,
            4
        );
        var dataObject3 = constructYearDataObject(
            getAnonymEditorsData(),
            '#94BFD4',
            'Anonymous editors',
            false,
            visualOverride,
            4
        );
        var dataObject4 = constructYearDataObject(
            getBotEditorsData(),
            '#C7DDE9',
            'Bot editors',
            false,
            visualOverride,
            4
        );
        plotYearMultiGraph4($("#chart_ph_2"),
            dataObject1,
            dataObject2,
            dataObject3,
            dataObject4,
            getMaxHeightForStats(getEditorsData())
        );
    }

    function plotTalkEditorsYearGraph() {
        var visualOverride = false;
        var dataObject1 = constructYearDataObject(
            getTalkEditorsData(),
            '#006699',
            'Overall editors',
            false,
            visualOverride,
            4
        );
        var dataObject2 = constructYearDataObject(
            getRegisteredTalkEditorsData(),
            '#4D94B8',
            'Registered editors',
            false,
            visualOverride,
            4
        );
        var dataObject3 = constructYearDataObject(
            getAnonymTalkEditorsData(),
            '#94BFD4',
            'Anonymous editors',
            false,
            visualOverride,
            4
        );
        var dataObject4 = constructYearDataObject(
            getBotTalkEditorsData(),
            '#C7DDE9',
            'Bot editors',
            false,
            visualOverride,
            4
        );
        plotYearMultiGraph4($("#talk_chart_ph_2"),
            dataObject1,
            dataObject2,
            dataObject3,
            dataObject4,
            getMaxHeightForStats(getTalkEditorsData())
        );
    }


});

$(function () {
    $("#revision_map_part_header").bind('click', function () {
        var revisionMapElement = EditStats.prepareElement('', 'revision_map_part');
        EditStats.plotRevisionMap(revisionMapElement, getRevisionTimeArray(), '');
    });

    $("#talk_revision_map_part_header").bind('click', function () {
        var talkRevisionMapElement = EditStats.prepareElement('talk_', 'revision_map_part');
        EditStats.plotRevisionMap(talkRevisionMapElement, getTalkRevisionsTimeArray(), 'talk_');
    });


/*
    $("#e_e_accordion_header").bind('click', function () {
        var yearlyEditsPerEditorMapElement = EditStats.prepareElement('', 'e_e_accordion');
        EditStats.plotYearlyEditsPerEditorStatistics(yearlyEditsPerEditorMapElement, getOverallEditData(), getEditorsData(), '');
    });

    $("#talk_e_e_accordion_header").bind('click', function () {
        var talkYearlyEditsPerEditorMapElement = EditStats.prepareElement('talk_', 'e_e_accordion');
        EditStats.plotYearlyEditsPerEditorStatistics(talkYearlyEditsPerEditorMapElement, getOverallTalkEditData(), getTalkEditorsData(), 'talk_');
    });


    $("#edit_editor_stat_header").bind('click', function () {
        var detailedEditsPerEditorMapElement = EditStats.prepareElement('', 'edit_editor_stat');
        EditStats.plotDetailedEditsPerEditorStatistics(detailedEditsPerEditorMapElement, getNonBotDistinctMajorEditData(), getNonBotDistinctMajorEditorsData(), '');
    });

    $("#talk_edit_editor_stat_header").bind('click', function () {
        var talkDetailedEditsPerEditorMapElement = EditStats.prepareElement('talk_', 'edit_editor_stat');
        EditStats.plotDetailedEditsPerEditorStatistics(talkDetailedEditsPerEditorMapElement,getNonBotDistinctMajorTalkEditData(), getNonBotDistinctMajorTalkEditorsData(), 'talk_');
    });

 */

    var tabs = [
        "edits_part_header",
        "editors_part_header",
        "edits_editor_part_header"
    ];

    tabs.forEach(function (value) {
        EditStats.bindClickOnTabs("", value);
        EditStats.bindClickOnTabs("talk_", value);
    });


});