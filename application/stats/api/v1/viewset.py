from application.stats import models
from application.stats.api.v1 import filters, serializers

from rest_framework import viewsets


class Article(viewsets.ModelViewSet):
    lookup_field = 'id'
    filterset_class = filters.Article
    serializer_class = serializers.Article
    queryset = models.Article.objects.all()


class Revision(viewsets.ModelViewSet):
    lookup_field = 'revid'
    filterset_class = filters.Revision
    serializer_class = serializers.Revision
    queryset = models.Revision.objects.all()


class Anchor(viewsets.ModelViewSet):
    lookup_field = 'id'
    filterset_class = filters.Anchor
    serializer_class = serializers.Anchor
    queryset = models.Anchor.objects.all()
