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
    serializer_class = serializers.DashboardSerializer

    def get_queryset(self):
        query = '''
        select 
            sa.*, 
            sc.name, 
            saa.title 
        from
            stats_anchor sa 
        inner join
            stats_category sc on sc.id = sa.category_id 
        inner join 
            stats_article saa on saa.id = sa.article_id 
        where 
            saa.title='He'; 
            '''

        anchor_list = models.Dashboard.objects.raw(query)

        for anchor in anchor_list:
            print(anchor_list)
