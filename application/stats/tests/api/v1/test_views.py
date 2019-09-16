from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse
from django.utils import timezone

from rest_framework import status

from application.stats import models


class TestArticle(TestCase):
    def setUp(self):
        self.url = reverse('api:v1:stats:article-list')
        credentials = {'username': 'test', 'password': 'test'}
        self.user = User.objects.create_user(**credentials)
        self.client = Client()
        self.client.login(**credentials)
        self.data = {
            'title': 'test_article_1',
            'anchor': 'anchor_1',
            'strength': 1.0,
            'first_seen': timezone.now().date(),
            'last_seen': timezone.now().date(),
            'days_survived': 2.5,
            're_introductions': 1,
            'revision_survived': 1,
        }

    def test_article_created_successfully(self):
        response = self.client.post(self.url, self.data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.Article.objects.count(), 1)
        self.assertEqual(models.Anchor.objects.count(), 1)

    def test_article_created_only_once(self):
        response = self.client.post(self.url, self.data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.Article.objects.count(), 1)
        self.assertEqual(models.Anchor.objects.count(), 1)

        self.data['anchor'] = 'Updated Anchor'

        response = self.client.post(self.url, self.data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.Article.objects.count(), 1)
        self.assertEqual(models.Anchor.objects.count(), 2)
        self.assertEqual(models.Category.objects.count(), 1)
