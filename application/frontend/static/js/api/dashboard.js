$(function () {
    ArticleIndex.triggerArticleLinkClick();
    IndexActions.indexToggle();
    ArticleIndex.renderArticles();
    CategoryIndex.renderCategories();
});

var IndexActions = {
    indexToggle: function () {
        $("#wikigen-logo").click(function () {
            window.location.replace("http://0.0.0.0:8000/");
        });
    },
};

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
