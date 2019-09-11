$(function() {

        $('#loading_dialog').hide();

        $('#selection_i_dialog').hide();


    clearLocalStorage();
    $("#selected_language span").text(getWikiLang());
    $("#language_changer").hide();
    $( "#inner_lang_div_start" ).hide();
// Hide error dialogs at the beginning
    $("#no_query").hide();
    $("#no_article").hide();

// Bind click event on search button
    $("#searchbtn").bind('click', function(event) {
        // Prevent submission, handle manually
        event.preventDefault();
        // Check for correct name of the article
        var selectedArticle = /*"thing"*/ $("#searchbar").val();
        var talkSelectedArticle = /*"thing"*/ "Talk:" + selectedArticle;
        if((selectedArticle === undefined || selectedArticle === null || selectedArticle === "")) {
            $("#no_query").dialog();
        } else {
            // Save chosen element
            //localStorage.setItem('selected_article', $("#searchbar").val());
            // Go to main page
            getArticleAPIName(selectedArticle, function(apiName) { // name found
                    localStorage.setItem('selected_article', apiName);


                    $('.loader').show();
                  // var spinnerTarget = $('#edit_stats_loading')[0];
                    //var spinner = new Spinner(opts).spin(spinnerTarget);
                    precalculateRevisionCount(apiName, function(revisionCount) {

                          $('.loader').hide();  // spinner.stop();
                           // $("#loading_dialog").dialog('close');
                            setRevisionCountCalculated();
                            var revisionDates = getRevisionDates();
                            var termTemplate = "<span class='ui-autocomplete-term'>%s</span>";
                            $( "#revision_date" ).autocomplete({
                                source: revisionDates,
                                open: function(e,ui) {
                                    var acData = $(this).data('uiAutocomplete'),
                                        styledTerm = termTemplate.replace('%s', acData.term);

                                    acData.menu.element.find('a').each(function() {
                                        var me = $(this);
                                        me.html( me.text().replace(acData.term, styledTerm) );
                                    });
                                }
                            });
                            $( "#revision_date_div" ).hide();
                        },
                        function () {
                        }
                    );

                      window.location.replace("http://0.0.0.0:8000/article-page/");

                },

                function() { // name not found
                    $("#no_article").dialog();
                }
            );


            getArticleAPIName(talkSelectedArticle, function(apiName) { // name found
               localStorage.setItem('talk_selected_article', apiName);
                precalculateRevisionCount(apiName, function(revisionCount) {
                     setRevisionCountCalculated();
                        var revisionDates = getRevisionDates();
                        var termTemplate = "<span class='ui-autocomplete-term'>%s</span>";
                        $( "#revision_date" ).autocomplete({
                            source: revisionDates,
                            open: function(e,ui) {
                                var
                                    acData = $(this).data('uiAutocomplete'),
                                    styledTerm = termTemplate.replace('%s', acData.term);

                                acData.menu.element.find('a').each(function() {
                                    var me = $(this);
                                    me.html( me.text().replace(acData.term, styledTerm) );
                                });
                            }
                        });
                        $( "#talk_revision_date_div" ).show();
                    },
                    function () {
                    }
                );

            });
        }
    });

    $("#selection_i").bind('click', function(event) {
        $( "#selection_i_dialog" ).dialog( "open" );
        event.preventDefault();
    });

    $("#select_language_b_start").bind('click', function(event) {
        setWikiLang(getLangAbrByName($('#select_language_start').val()));
        $("#selected_language span").text(getWikiLang());
        $("#language_changer").hide();
        $( "#inner_lang_div_start" ).hide();
        //$('#change_article').click();
    });

    $("#change_language").bind('click', function(event) {
        $("#language_changer").show();
        initializeLanguages(
            function(languageData){
                $( "#inner_lang_div_start" ).show();
                $( "#lang_loading_start" ).hide();
                $( "#select_language_start" ).autocomplete({
                    source: languageData
                });
            },
            function() {
            //console.log("Could not load the languages!");
            }
        );
        event.preventDefault();
    });

    $( ".help_dialog" ).dialog({
        autoOpen: false,
        width: 1000,
        height:800,
        modal: true,
        open: function() {
            $('.ui-widget-overlay').addClass('custom-overlay');
        },
        opacity:100,
        show: {
            effect: "fadeIn",
        },
        hide: {
            effect: "fadeOut",

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
});
