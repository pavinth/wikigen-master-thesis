var ArticleCategory = {
    createCategoryDetailTable: function (
        articleTitle,
        fromDate = '01-01-2001',
        toDate = moment().format(DateRangePicker.dateFormat)
    ) {
        $('#content-holder').html(Table.render(
            ArticleCategory.createDataToRender(articleTitle, fromDate, toDate),
            ArticleCategory.createHeader(articleTitle),
            "article-anchors-table"
        ));

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
            ArticleCategory
                .createCategoriesToPlot(ArticleCategory.createFilteredAnchors(articleTitle), fromDate, toDate)
                .flatMap(x => x)
        );
    },

    createFilteredAnchors: function (articleTitle) {
        return JSON
            .parse(localStorage.getItem('allStoredArticles'))
            .results
            .filter(article => article.title === articleTitle);

    },

    /*
    Given I have categories: "test", "test2" and I have selected article called "She".
    When I select the date range forthe review to be "01/01/2003" till "01/01/2005".
    And I add anchor "china" and "singular" to category "test".
    Then I change the date range to "01/01/2013" till "22/10/2019".
    And I add anchor "she" and "she (pronoun)" to category "test2".
    Then I go to the dashboard and select article "she"
    And I click on the link to the categories of the article.
    Then I should see categories "test1" and "test2" with their associated aggregated anchor attributes.
    And I change the date range to "01/01/2012" till "01/01/2018"
    Then I should see "test2" with aggregated anchor attributes.

     */

    createCategoriesToPlot: function (filteredArticle, fromDate, toDate) {
        return filteredArticle
            .map(article => [...new Set(article.anchors.map(anchor => anchor.category))])
            .flatMap(x => x)
            .map(categoryTitle => {
                var lado = [];
                filteredArticle.map(article => {
                    var categories = [];
                    article.anchors.forEach(anchor => {
                        var fromDateIsAfterFirstSeen = ArticleCategory.dateBefore(fromDate, anchor.first_seen);

                        var toDateIsBeforeLastSeen = ArticleCategory.dateAfter(toDate, anchor.last_seen);

                        if (anchor.category === categoryTitle && (fromDateIsAfterFirstSeen && toDateIsBeforeLastSeen)) {
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
                        lado.push({
                            name: categoryTitle,
                            anchorCount: categories.length,
                            totalDaysSurvived: ArticleCategory.getSum(categories.map(cat => cat.daysSurvived)),
                            totalRevisionSurvived: ArticleCategory.getSum(categories.map(cat => cat.revisionSurvived)),
                            totalStrength: ArticleCategory.getSum(categories.map(cat => cat.strength)),
                            totalReIntroduction: ArticleCategory.getSum(categories.map(cat => cat.reintroduction))
                        });
                    }
                });

                return lado;
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
        return new Date(date2) <= new Date(date1);
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
    }
};