$(function() {

$("#selected_article").append("Selected article is: " + "<a target='_blank' href='http://"+wikiLang+".wikipedia.org/wiki/" + "'>" + sessionStorage.getItem('selected_article')+ "</a>  ");


$("#wikigen-logo").click( function() {
        window.location.replace("http://0.0.0.0:8000/");
    });


$("#change_article").click( function() {
        window.location.replace("http://0.0.0.0:8000/");
    });




    // Render elements
    $("#page_description_accordion").accordion({
        collapsible: true,
        active: true,
        heightStyle: "content"
    });

    $("#page_description_accordion_header").click();

    $("#get_article").button();

    $( "#revision_date_div" ).hide();

    // Load the wiki article
    $('#article_content').append("<object id='wikiframe' data='http://"+wikiLang+".wikipedia.org/wiki/"+ sessionStorage.getItem('selected_article') +"' width='100%'>Error: Embedded data could not be displayed or requested article does not exist. </object>");
    // Adjust article height

    $("#wikiframe").height(screen.height + 300);

    $("#get_article").bind('click', function() {
        //alert("<object id='wikiframe' data='http://"+wikiLang+".wikipedia.org/wiki/"+ sessionStorage.getItem('selected_article')+"' width='100%'>Error: Embedded data could not be displayed or requested article does not exist.  </object>");
        $('#article_tab_content').load("http://0.0.0.0:8000/article-page/", function() {
            $(this).trigger('create');
        });
    });

    $("#open_revision").bind('click', function() {
        $('#article_content').empty();
        $('#article_content').append("<object id='wikiframe' data='http://"+wikiLang+".wikipedia.org/w/index.php?title="+ sessionStorage.getItem('selected_article')+" &oldid=" + getRevisionIdByDateString($("#revision_date").val()) +"' width='100%'>Error: Embedded data could not be displayed or requested article does not exist. </object>");
        $("#wikiframe").height(screen.height + 300);
    });
});