from unittest import mock

from django.contrib.auth.models import User
from django.test import TestCase
from django.utils import timezone

from application.stats import models
from application.stats.api.v1 import serializers


class TestArticle   (TestCase):
    def setUp(self):
        self.serializer = serializers.Article
        self.model = models.Article
        self.user = User.objects.create(username='test_user', password='test_pass')
        self.valid_data = {
            'title': 'test_article',
            'anchor': 'test_anchor',
            'strength': 2.14,
            'last_seen': timezone.now().date(),
            'first_seen': timezone.now().date(),
            'days_survived': 1.13,
            're_introductions': 1,
            'revision_survived': 2,
        }

    def test_default_category(self):
        request = mock.MagicMock()
        request.user = self.user

        serializer = self.serializer(data=self.valid_data, context={'request': request})
        self.assertTrue(serializer.is_valid())

        serializer.save()

        self.assertEqual(models.Article.objects.count(), 1)
        self.assertEqual(models.Category.objects.count(), 1)
        self.assertEqual(models.Anchor.objects.count(), 1)
        self.assertEqual(serializer.data['total_anchor_count'], 1)

        article = models.Article.objects.first()

        created_anchor = models.Anchor.objects.get(article=article)

        self.assertEqual(created_anchor.category.name, 'no_category')
