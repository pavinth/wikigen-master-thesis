$(function() {
        $('#categoryTable').hide()
        $.getJSON("http://0.0.0.0:8000/api/v1/stats/article/", function(data){
                var articleName ='';
                $.each(data.results, function(key, value){
                    date = new Date(value.created_at)
                    articleName += '<tr>';
                    articleName += '<td id="dashboard-article">' + "<a href='#'>" + '<p style="text-decoration:underline;"  class="articleDetailInfo">' + value.title + '</p><input type="hidden" id="article_id" value='+ value.id +'></td>';
                    articleName += '<td style="text-align: left">' + "<p  class='articleDetailInfo'>" +  value.category_count + "</p>"+'</td>';
                    articleName += '<td style="text-align: left">' + "<p class='articleDetailInfo'>" + value.total_anchor_count + "</p>"+'</td>';
                    articleName += '<td style="text-align: left">' + "<p class='articleDetailInfo'>" + date.toDateString() + "</p>"+'</td>';
                    articleName += '</tr>';
                });
                $('#detailTable').append(articleName);

                $('.articleDetailInfo').click(function(){
                    articleId = $(this).next().val();
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
                            categoryDetail+= '<td style="text-align: center">' + value.days_survived +'</td>';
                            categoryDetail+= '<td style="text-align: center">' + value.revision_survived+'</td>';
                            categoryDetail+= '<td style="text-align: center">' + value.re_introductions+'</td>';
                            categoryDetail+= '<td style="text-align: center">' + value.strength+'</td>';
                            categoryDetail+= '<td style="text-align: center">' + value.first_seen+'</td>';
                            categoryDetail+= '<td style="text-align: left">' + value.last_seen+'</td>';
                            categoryDetail+= '</tr>';
                            avg_days_survived += value.days_survived;
                            avg_rev_survived += value.revision_survived;
                            avg_re_introductions += value.re_introductions;
                            avg_anchor_strength += value.strength;
                            number_of_cats += 1;
                        });
                        $('#categoryTable').show()
                        $('#categoryTableBody').html(categoryDetail);

                        var analysis_html = '<tr>';
                        analysis_html+= '<td style="text-align: left;" colspan="2"><b>Average</b></td>';
                        analysis_html+= '<td style="text-align: center">' + '<b>' + (avg_days_survived / number_of_cats).toFixed(2) + '</b>' +'</td>';
                        analysis_html+= '<td style="text-align: center">' + '<b>' + (avg_rev_survived / number_of_cats).toFixed(2) +'</b>'+'</td>';
                        analysis_html+= '<td style="text-align: center">' + '<b>' +(avg_re_introductions / number_of_cats).toFixed(2) +'</b>'+'</td>';
                        analysis_html+= '<td style="text-align: center">' + '<b>' + (avg_anchor_strength / number_of_cats).toFixed(2) +'</b>'+'</td>';
                        analysis_html+= '<td style="text-align: left" colspan="2"></td>';
                        analysis_html+= '</tr>';

                        $('#categoryTable').append(analysis_html);
                    });
                });
            });

                $("#wikigen-logo").click( function() {
                    window.location.replace("http://0.0.0.0:8000/");
                });


                $("#change_article").click( function() {
                        window.location.replace("http://0.0.0.0:8000/");
                 });
});
