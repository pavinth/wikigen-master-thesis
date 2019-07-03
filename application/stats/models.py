from django.contrib.auth.models import User
from django.db import models

from application.utils.mixins import DateTime


class Article(DateTime):
    article_id = models.IntegerField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ns = models.CharField(max_length=8, null=True, blank=True)
    anon = models.CharField(max_length=64, null=True, blank=True)
    title = models.CharField(max_length=128)

    def __str__(self):
        return f'Article: {self.title}'


class ArticleMixin(models.Model):
    title = models.ForeignKey(Article, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Revision(ArticleMixin, DateTime):
    revid = models.IntegerField()
    parentid = models.IntegerField()
    user = models.CharField(max_length=64)
    timestamp = models.DateTimeField()

    def __str__(self):
        return f'{self.revid} - {self.user} at: {self.timestamp}'


class Category(DateTime):
    name = models.CharField(max_length=256)

    def __str__(self):
        return f'Category: {self.name}'


class Anchor(ArticleMixin, DateTime):
    anchor = models.CharField(max_length=256)
    strength = models.FloatField()
    last_seen = models.DateField()
    first_seen = models.DateField()
    days_survived = models.FloatField()
    re_introductions = models.PositiveIntegerField()
    revision_survived = models.PositiveIntegerField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f'{self.anchor}'
