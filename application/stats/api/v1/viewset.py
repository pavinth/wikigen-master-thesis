from rest_framework.permissions import IsAuthenticated

from application.stats import models
from application.stats.api.v1 import filters, serializers

from rest_framework import viewsets

from django_filters.rest_framework import DjangoFilterBackend


class Article(viewsets.ModelViewSet):
    lookup_field = 'id'
    filterset_class = filters.Article
    serializer_class = serializers.Article
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        return models.Article.objects.filter(user=self.request.user)


class Revision(viewsets.ModelViewSet):
    lookup_field = 'revid'
    filterset_class = filters.Revision
    serializer_class = serializers.Revision
    queryset = models.Revision.objects.all()


class Anchor(viewsets.ModelViewSet):
    lookup_field = 'id'
    filter_backends = [DjangoFilterBackend]
    serializer_class = serializers.Anchor
    filterset_fields = ['category__name']

    def get_queryset(self):
        queryset = models.Anchor.objects.filter(article__user=self.request.user)
        
        if self.kwargs.get('article_id', None):
            queryset = queryset.filter(article__id=self.kwargs['article_id'])
        return queryset


class Category(viewsets.ModelViewSet):
    lookup_field = 'id'
    serializer_class = serializers.Category
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        return models.Category.objects.filter(user=self.request.user)
