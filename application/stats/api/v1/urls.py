from django.urls import include, path
from rest_framework.routers import DefaultRouter

from rest_framework_nested import routers

from application.stats.api.v1 import viewset

app_name = 'stats'

router = routers.SimpleRouter()
router.register(r'article', viewset.Article)

article_router = routers.NestedSimpleRouter(router, r'article', lookup='article')
article_router.register(r'revision', viewset.Revision, base_name='revision')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(article_router.urls)),
]
