$(function() {
    // Render generated elements
    $("#change_article").button();
    $("#generate_edit_stat").button();
    //$("#tabs").tabs();
    $("#tabs").tabs({ show: { effect: "fadeIn", duration: 1000} });

    // Correct height of the tab to fit wikipedia article size
    $("#wikiframe").height(screen.height - 400);

    // Display name of the selected article
    $("#selected_article").html("Selected article is: " + "<a target='_blank' href='http://"+wikiLang+".wikipedia.org/wiki/" + sessionStorage.getItem('selected_article') + "'>" + sessionStorage.getItem('selected_article')+ "</a>  ");

    // Bind a click event to return to selection page

    $("#change_article").on('click', function(event) {
           $(".fas.fa-sign-in-alt").hide();
        $('#WikiGen_content').load("http:0.0.0.0:8000", function() {
            $(".fas.fa-user-plus").hide();
            resetDataAfterArticleChange();
            $(this).trigger('create');
        });
    });

    $("#wikigen-logo").on('click', function(event) {
        $('#WikiGen_content').load("http:0.0.0.0:8000", function() {
            $(".fas.fa-sign-in-alt").hide();
            $(".fas.fa-user-plus").hide();
            resetDataAfterArticleChange();
            $(this).trigger('create');
        });
    });


    $("#article_tab_link").on('click', function(event) {
        if(languageChanged) {
            languageChanged = false;
            $('#article_content').empty();
            $('#article_content').append("<object id='wikiframe' data='http://"+wikiLang+".wikipedia.org/w/index.php?title="+ sessionStorage.getItem('selected_article')+"    &oldid=" + getRevisionIdByDateString($("#revision_date").val()) +"' width='100%'>Error: Embedded data could not be displayed or requested article does not exist. </object>");
            $("#wikiframe").height(screen.height - 400);
        }
    });

    // Load original wikipedia article
    var articleGenerated = sessionStorage.getItem('article_generated');
    if(articleGenerated === undefined || articleGenerated === null || articleGenerated === "") {
        sessionStorage.setItem('article_generated', 'true');
        $('#article_tab_content').load("/article-page/", function() {
            $(this).trigger('create');
        });
    }

    // Bind click event on example tab in order to render examples
    $("#edit_tab_link").on('click', function(event) {
        var editStatsGenerated = sessionStorage.getItem('edit_stats_generated');
        if(editStatsGenerated === undefined || editStatsGenerated === null || editStatsGenerated === "") {
            sessionStorage.setItem('edit_stats_generated', 'true');
            $('#edit_tab_content').load("/edit-page/", function() {
                $(this).trigger('create');
            });
        }
        });


        $("#anchor_tab_link").on('click', function() {
            var anchorStatsGenerated = sessionStorage.getItem('anchor_stats_generated');
            if(anchorStatsGenerated === undefined || anchorStatsGenerated === null || anchorStatsGenerated === "") {
                sessionStorage.setItem('anchor_stats_generated', 'true');
                $('#anchor_tab_content').load("/anchor-page/", function() {
                    $(this).trigger('create');
                });
            }
        });

    // Bind click event on example tab in order to render examples
    $("#blink_tab_link").on('click', function() {
        var referenceStatsGenerated = sessionStorage.getItem('blink_stats_generated');
        if(referenceStatsGenerated === undefined || referenceStatsGenerated === null ||referenceStatsGenerated === "") {
            sessionStorage.setItem('blink_stats_generated', 'true');
            $('#blink_tab_content').load("/blink-page/", function() {
                $(this).trigger('create');
            });
        }
    });

    // Bind click event on example tab in order to render examples
    $("#comp_tab_link").on('click', function() {
        var compStatsGenerated = sessionStorage.getItem('comp_stats_generated');
        if(compStatsGenerated === undefined || compStatsGenerated === null || compStatsGenerated === "") {
            sessionStorage.setItem('comp_stats_generated', 'true');
            $('#comp_tab_content').load("/comparison-page/", function() {
                $(this).trigger('create');
            });
        }
    });


    // Bind click event on example tab in order to render examples
    $("#about_tab_link").on('click', function() {
        $('#about_tab_content').load("/about-page/", function() {
            $(this).trigger('create');
        });
    });


    // thapa changes
    if (localStorage['user'] === undefined)
        $('.logged-in-user').hide();

    function logout(){
        const LOGOUT_URL = 'http://0.0.0.0:8000/api/v1/registration/logout/';
        var user = JSON.parse(localStorage.getItem('user'));

        if(user === undefined){
            alert('You are not logged in!');
            return;
        }
        delete localStorage['user'];
        alert('Logged out successfully!');
        window.location.replace('http://localhost:5000');
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
        $(".dropdown-list").css ({"overflow":"visible"});
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
    $(".fas.fa-calendar ").on("click", function(e){
        window.open("/dashboard-page/", '_self');

});
});




