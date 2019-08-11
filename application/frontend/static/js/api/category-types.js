$(function() {


        $.getJSON("http://0.0.0.0:8000/api/v1/stats/article/", function(data){

                var articleName ='';
                $.each(data.results, function(key, value){
                    articleName += '<tr>';
                    articleName += '<td style="text-align: center">' + "<a href='#' class='articleDetailInfo'>" + value.title + "</a>"+'</td>';
                    articleName += '</tr>';
                });
                $('#detailTable').append(articleName);
            });

    $.getJSON("http://0.0.0.0:8000/api/v1/stats/article/1/anchor/", function (data) {
        var categoryDetail ='';
        $.each(data.results, function(key, value){
            categoryDetail += '<tr>';
            categoryDetail+= '<td style="text-align: left">' + value.category+'</td>';
            categoryDetail+= '<td style="text-align: left">' + "<a href='#'> " + value.anchor + "</a>"  +'</td>';
            categoryDetail+= '<td style="text-align: left">' + value.days_survived+'</td>';
            categoryDetail+= '<td style="text-align: center">' + value.revision_survived+'</td>';
            categoryDetail+= '<td style="text-align: center">' + value.re_introductions+'</td>';
            categoryDetail+= '<td style="text-align: left">' + value.strength+'</td>';
            categoryDetail+= '<td style="text-align: left">' + value.first_seen+'</td>';
            categoryDetail+= '<td style="text-align: left">' + value.last_seen+'</td>';
            categoryDetail+= '</tr>';
        });
        $('#categoryTable').append(categoryDetail);
    });

});
