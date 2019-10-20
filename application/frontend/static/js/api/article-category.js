var ArticleCategory = {
    createCategoryDetailTable: function (articleTitle) {
        var allAnchors = JSON.parse(localStorage.getItem('allStoredArticles'));

        var filteredArticle = allAnchors.results.filter(article => article.title === articleTitle);

        var categoriesByArticle = filteredArticle.map(article => {
            return [...new Set(article.anchors.map(anchor => anchor.category))];
        });

        var categoryToPlot = {
            articleTitle: articleTitle,
            categories:  []
        };


        var categoriesToPlot = categoriesByArticle
            .flatMap(categoryTitles => categoryTitles)
            .map(categoryTitle => {
                return filteredArticle.map(article => {
                    var categories = [];
                    article.anchors.forEach(anchor => {
                        if (anchor.category === categoryTitle) {
                            categories.push({
                                name: anchor.category,
                                daysSurvived: anchor.days_survived,
                                revisionSurvived: anchor.revision_survived,
                                reintroduction: anchor.re_introductions,
                                strength: anchor.strength,
                            });
                        }
                    });


                    return {
                        name: categoryTitle,
                        anchorCount: categories.length,
                        totalDaysSurvived: ArticleCategory.getSum(categories.map(cat => cat.daysSurvived)),
                        totalRevisionSurvived: ArticleCategory.getSum(categories.map(cat => cat.revisionSurvived)),
                        totalStrength: ArticleCategory.getSum(categories.map(cat => cat.strength)),
                        totalReIntroduction: ArticleCategory.getSum(categories.map(cat => cat.reintroduction))
                    };
                });

            });


        var dataToRender = ArticleCategory.createCategoryTableData(categoriesToPlot.flatMap(x => x));

        $('#content-holder').html(Table.render(
            dataToRender,
            '<i><a href="#" class="article-menu-link"> Articles</a></i> <i class="fas fa-angle-double-right"></i> ' + articleTitle,
            "article-anchors-table"
        ));

        ArticleIndex.triggerArticleLinkClick();
    },

    getSum: function (array) {
        return array.reduce( (a, b) => a + b, 0);
    },
    createCategoryTableData(categories) {
        return {
            "headers": [
                "Category Name",
                "Anchor Count",
                "Total Days Survived",
                "Total Revision Survived",
                "Total Re-Introduction",
                "Total Anchor Strength"
            ],
            "data": categories.map(category => {
                return {
                    dataColumns: [
                        category.name,
                        category.anchorCount,
                        category.totalDaysSurvived,
                        category.totalRevisionSurvived,
                        category.totalReIntroduction,
                        category.totalStrength
                    ],
                    actionColumn: []
                }
            })
        };
    },
};