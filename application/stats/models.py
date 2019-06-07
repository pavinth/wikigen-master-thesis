from django.db import models

from application.utils.mixins import DateTime


class Article(DateTime):
    id = models.IntegerField(primary_key=True)
    ns = models.CharField(max_length=8)
    title = models.CharField(max_length=128)

    def __str__(self):
        return f'Article: {self.title}'


class Revision(DateTime):
    title = models.ForeignKey(Article, on_delete=models.CASCADE)
    revid = models.IntegerField()
    parentid = models.IntegerField()
    user = models.CharField(max_length=64)
    timestamp = models.DateTimeField()

    def __str__(self):
        return f'{self.revid} - {self.user} at: {self.timestamp}'
