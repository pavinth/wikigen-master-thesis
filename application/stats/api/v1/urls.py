from django.urls import include, path

from rest_framework_nested import routers

from application.stats.api.v1 import viewset

app_name = 'stats'

router = routers.SimpleRouter()
router.register(r'article', viewset.Article)
router.register(r'category', viewset.Category)

article_router = routers.NestedSimpleRouter(router, r'article', lookup='article')
article_router.register(r'revision', viewset.Revision, base_name='revision')
article_router.register(r'anchor', viewset.Anchor, base_name='anchor')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(article_router.urls)),
]
