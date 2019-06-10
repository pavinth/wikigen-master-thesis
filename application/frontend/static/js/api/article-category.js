var ArticleCategory = {
    createCategoryDetailTable: function (
        articleTitle,
        fromDate = '2001-01-01',
        toDate = moment().format(DateRangePicker.dateFormat)
    ) {

        var table = Table.render(
            ArticleCategory.createDataToRender(articleTitle, fromDate, toDate),
            ArticleCategory.createHeader(articleTitle),
            "article-anchors-table"
        );

        var charts = ArticleCategoryChart.createChartContainers();

        $('#content-holder').html(table + charts);

        ArticleCategoryChart.createGraphs(ArticleCategory.categoriesToPlot(articleTitle, fromDate, toDate));

        DateRangePicker.createDatePickers("category-from", "category-to");
        DateRangePicker.setUserDefinedDefaultDates("category", moment(fromDate), moment(toDate));

        $('#analyse-category').click(function () {
            fromDate = $('#category-from').val();
            toDate = $('#category-to').val();
            ArticleCategory.createCategoryDetailTable(articleTitle, fromDate, toDate);
        });

        ArticleIndex.triggerArticleLinkClick();
    },

    createDataToRender: function (articleTitle, fromDate, toDate) {
        return ArticleCategory.createCategoryTableData(
            ArticleCategory.categoriesToPlot(articleTitle, fromDate, toDate)
        );
    },

    categoriesToPlot: function(articleTitle, fromDate, toDate) {
        return ArticleCategory
            .createCategoriesToPlot(ArticleCategory.createFilteredAnchors(articleTitle), fromDate, toDate)
            .flatMap(x => x);
    },

    createFilteredAnchors: function (articleTitle) {
        return JSON
            .parse(localStorage.getItem('allStoredArticles'))
            .results
            .filter(article => article.title === articleTitle);

    },

    createCategoriesToPlot: function (filteredArticle, fromDate, toDate) {
        return filteredArticle
            .map(article => [...new Set(article.anchors.map(anchor => anchor.category))])
            .flatMap(x => x)
            .map(categoryTitle => {
                var categoryAnalysis = [];
                filteredArticle.map(article => {
                    var categories = [];
                    article.anchors.forEach(anchor => {

                        fromDate = moment(fromDate, DateRangePicker.dateFormat);
                        toDate = moment(toDate, DateRangePicker.dateFormat);
                        var fromDateIsAfterFirstDate = ArticleCategory.dateBefore(fromDate, anchor.first_seen);
                        var toDateIsBeforeLastDate = ArticleCategory.dateAfter(toDate, anchor.last_seen);

                        if (anchor.category === categoryTitle && (fromDateIsAfterFirstDate && toDateIsBeforeLastDate)) {
                            categories.push({
                                name: anchor.category,
                                daysSurvived: anchor.days_survived,
                                revisionSurvived: anchor.revision_survived,
                                reintroduction: anchor.re_introductions,
                                strength: anchor.strength,
                                dateFrom: anchor.first_seen,
                                dateTo: anchor.last_seen
                            });
                        }
                    });
                    if (categories.length !== 0) {
                        categoryAnalysis.push({
                            name: categoryTitle,
                            anchorCount: categories.length,
                            totalDaysSurvived: ArticleCategory.getSum(categories.map(cat => cat.daysSurvived)),
                            averageDaysSurvived: ArticleCategory.getSum(categories.map(cat => cat.daysSurvived)) / categories.length,
                            totalRevisionSurvived: ArticleCategory.getSum(categories.map(cat => cat.revisionSurvived)),
                            averageRevisionSurvived: ArticleCategory.getSum(categories.map(cat => cat.revisionSurvived)) / categories.length,
                            totalReIntroduction: ArticleCategory.getSum(categories.map(cat => cat.reintroduction)),
                            averageReIntroduction: ArticleCategory.getSum(categories.map(cat => cat.reintroduction)) / categories.length,
                            totalStrength: ArticleCategory.getSum(categories.map(cat => cat.strength)),
                            averageStrength: ArticleCategory.getSum(categories.map(cat => cat.strength)) / categories.length,
                        });
                    }
                });

                return categoryAnalysis;
            });
    },

    createDatepickerMarkup: function () {
        var formContainer = '<div class="form-row align-items-start article-category-form">';

        var fromMarkup = '<input type="text" class="form-control mb-2" id="category-from" placeholder="Date From">';
        var toMarkup = ' <input type="text" class="form-control" id="category-to" placeholder="Till Date">';

        var fromDateMarkup = '<div class="col-auto">' + fromMarkup + '</div>';
        var toDateMarkup = '<div class="col-auto">' + toMarkup + '</div>';

        var button = '<div class="col-auto"><button type="button" class="btn btn-primary mb-2" id="analyse-category">Analyse</button></div>';

        return formContainer + fromDateMarkup + toDateMarkup + button + '</div>';
    },

    createHeader: function (articleTitle) {
        var articleLink = '<ol class="breadcrumb">' + '<li class="breadcrumb-item"><a href="#" class="article-menu-link"> Articles</a></li>';
        var articleName = '<li class="breadcrumb-item active" >' + articleTitle + '</li>';
        return articleLink + articleName + '</ol>' + ArticleCategory.createDatepickerMarkup();
    },

    dateBefore: function (date1, date2) {
        return new Date(date2) >= new Date(date1);
    },

    dateAfter: function (date1, date2) {
        return new Date(date2) <= new Date(new Date().setDate(new Date(date1).getDate() + 1));
    },

    getDate: function (element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    },

    getSum: function (array) {
        return array.reduce((a, b) => a + b, 0);
    },

    createCategoryTableData(categories) {
        return {
            "headers": [
                "Category Name",
                "Anchor Count",
                "Total Days Survived",
                "Average Days Survived",
                "Total Revision Survived",
                "Average Revision Survived",
                "Total Re-Introduction",
                "Average Re-Introduction",
                "Total Anchor Strength",
                "Average Anchor Strength"
            ],
            "data": categories.map(category => {
                return {
                    dataColumns: [
                        category.name,
                        category.anchorCount,
                        category.totalDaysSurvived.toFixed(2),
                        category.averageDaysSurvived.toFixed(2),
                        category.totalRevisionSurvived,
                        category.averageRevisionSurvived.toFixed(2),
                        category.totalReIntroduction,
                        category.averageReIntroduction.toFixed(2),
                        category.totalStrength.toFixed(2),
                        category.averageStrength.toFixed(2)
                    ],
                    actionColumn: []
                }
            })
        };
    }
};