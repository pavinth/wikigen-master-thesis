$(function() {

        $('#loading_dialog').hide();

        $('#selection_i_dialog').hide();



    
    // thapa changes
    if (localStorage['user'] === undefined)
        $('.logged-in-user').hide();
    
    function logout(){
        const LOGOUT_URL = 'http://0.0.0.0:8000/api/v1/registration/logout/';
        var user = JSON.parse(localStorage.getItem('user'));
    
        if(user === undefined){
            //alert('You are not logged in!');
            return;
        }
        delete localStorage['user'];
      //  alert('Logged out successfully!');
        window.location.replace('http://0.0.0.0:8000');
        /* TODO THAPA 
            $.ajax({
            url: LOGOUT_URL,
            method: 'POST',
            crossDomain: true,
            data: {
                'username': user.username,
                'password': user.password,
            },
            statusCode: {
                200: function(){
                  delete localStorage['user'];
                    alert('Logout Successful!');
                },
                400: function(){
                    alert('Error in Logging out! Are you Logged in?');
                },
                404: function(){
                    alert('Invalid URL! Is server running?');
                }
            },
        })

        */
        
      }
    
    $(".logged-in-user ").on("click", function(e){
        e.preventDefault();
        if(e.target.id === "logout-submit"){
            logout();
        }
        if($(this).hasClass("open")) {
            $(this).removeClass("open");
            $(this).children("ul").slideUp("fast");
        } else {
            $(this).addClass("open");
            $(this).children("ul").slideDown("fast");
        }
    });



    clearSessionStorage();
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
            //sessionStorage.setItem('selected_article', $("#searchbar").val());
            // Go to main page
            getArticleAPIName(selectedArticle, function(apiName) { // name found
                    sessionStorage.setItem('selected_article', apiName);

                    $("#loading_dialog" ).dialog({
                        autoOpen: true,
                        width: 800,
                        modal: true,
                        open: function() {
                            $('.ui-widget-overlay').addClass('custom-overlay');
                        },
                        show: {
                            effect: "fadeIn",
                            duration: 2000
                        },
                        hide: {
                            effect: "fadeOut",
                            duration: 3000
                        }
                    });

                    var spinnerTarget = $('#edit_stats_loading')[0];
                    var spinner = new Spinner(opts).spin(spinnerTarget);
                    precalculateRevisionCount(apiName, function(revisionCount) {
                            spinner.stop();
                            //$("#loading_dialog").dialog('close');
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
                            $( "#revision_date_div" ).show();
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
                sessionStorage.setItem('talk_selected_article', apiName);
                precalculateRevisionCount(apiName, function(revisionCount) {
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
