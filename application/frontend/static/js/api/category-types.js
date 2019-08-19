$(function() {
        $.getJSON("http://0.0.0.0:8000/api/v1/stats/article/", function(data){
                var articleName ='';
                var articleId = '';
                $.each(data.results, function(key, value){
                    articleName += '<tr>';
                    articleName += '<td style="text-align: center">' + "<a href='#' class='articleDetailInfo'>" + value.title + "</a>"+'</td>';
                    articleName += '<td style="text-align: center">' + "<a href='#' class='articleDetailInfo'>" + value.category_count + "</a>"+'</td>';
                    articleName += '<td style="text-align: center">' + "<a href='#' class='articleDetailInfo'>" + value.anchor_count + "</a>"+'</td>';
                    articleName += '</tr>';
                    articleId = value.id;
                });
                $('#detailTable').append(articleName);
                console.log(articleId);

                $.getJSON("http://0.0.0.0:8000/api/v1/stats/article/"+ articleId +"/anchor/", function (data) {
                var categoryDetail ='';
                var avg_days_survived = 0;
                var avg_rev_survived = 0;
                var avg_re_introductions = 0;
                var avg_anchor_strength = 0;
                var number_of_cats = 0;
                $.each(data.results, function(key, value){
                    categoryDetail += '<tr>';
                    categoryDetail+= '<td style="text-align: left">' + value.category+'</td>';
                    categoryDetail+= '<td style="text-align: left">' + "<a href='#'> " + value.anchor + "</a>"  +'</td>';
                    categoryDetail+= '<td style="text-align: left">' + value.days_survived +'</td>';
                    categoryDetail+= '<td style="text-align: center">' + value.revision_survived+'</td>';
                    categoryDetail+= '<td style="text-align: center">' + value.re_introductions+'</td>';
                    categoryDetail+= '<td style="text-align: left">' + value.strength+'</td>';
                    categoryDetail+= '<td style="text-align: left">' + value.first_seen+'</td>';
                    categoryDetail+= '<td style="text-align: left">' + value.last_seen+'</td>';
                    categoryDetail+= '</tr>';
                    avg_days_survived += value.days_survived;
                    avg_rev_survived += value.revision_survived;
                    avg_re_introductions += value.re_introductions;
                    avg_anchor_strength += value.strength;
                    number_of_cats += 1;
                });
                $('#categoryTable').append(categoryDetail);

                var analysis_html = '<tr>';
                analysis_html+= '<td style="text-align: left;" colspan="2"><b>Average</b></td>';
                analysis_html+= '<td style="text-align: left">' + (avg_days_survived / number_of_cats).toFixed(2) +'</td>';
                analysis_html+= '<td style="text-align: center">' + (avg_rev_survived / number_of_cats).toFixed(2) +'</td>';
                analysis_html+= '<td style="text-align: center">' + (avg_re_introductions / number_of_cats).toFixed(2) +'</td>';
                analysis_html+= '<td style="text-align: left">' + (avg_anchor_strength / number_of_cats).toFixed(2) +'</td>';
                analysis_html+= '<td style="text-align: left" colspan="2"></td>';
                analysis_html+= '</tr>';

                $('#categoryTable').append(analysis_html);
            });
        });
});
