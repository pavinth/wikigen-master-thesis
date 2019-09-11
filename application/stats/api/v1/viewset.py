from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from application.stats import models
from application.stats.api.v1 import filters, serializers


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
    filterset_class = filters.Anchor
    serializer_class = serializers.Anchor

    def get_queryset(self):
        return models.Anchor.objects.filter(article__user=self.request.user, article__id=self.kwargs['article_id'])


class Category(viewsets.ModelViewSet):
    lookup_field = 'id'
    serializer_class = serializers.Category
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        return models.Cataegory.objects.filter(user=self.request.user)


class Dashboard(viewsets.ModelViewSet):
    serializer_class = serializers.Anchor

    def get_queryset(self):
        anchor_list = models.Anchor.objects \
            .select_related('article') \
            .select_related('category') \
            .filter(article__title="He")

        return anchor_list
