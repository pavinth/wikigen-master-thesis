from application.stats import models

from django_filters import rest_framework as filters


class Article(filters.FilterSet):
    class Meta:
        model = models.Article
        fields = '__all__'


class Revision(filters.FilterSet):
    class Meta:
        model = models.Revision
        fields = '__all__'
