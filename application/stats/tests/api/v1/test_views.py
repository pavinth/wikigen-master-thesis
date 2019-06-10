from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from application.stats import models


class TestAnchorList(TestCase):
    def setUp(self):
        password = 'test_pass'
        self.user = User.objects.create_user(username='test_user', password=password)
        self.client = Client()
        self.client.login(username=self.user.username, password=password)
        self.url = reverse('api:v1:stats:article-list')
        self.valid_data = {
            "title": "test_article_1",
            "anchors": [
                {
                    "anchor": "test_anchor_9",
                    "strength": 3.14,
                    "last_seen": "2019-10-12",
                    "first_seen": "2019-10-13",
                    "days_survived": 2.13,
                    "re_introductions": 2,
                    "revision_survived": 3
                }
            ]
        }

    def test_anchors_created_successfully(self):
        response = self.client.post(self.url, self.valid_data, format='json')

        print(response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.Anchor.objects.count(), 2)
"""
{
    "title": "test_article_1",
    "anchors": [
        {
            "anchor": "test_anchor",
            "strength": 2.14,
            "last_seen": "2019-10-19",
            "first_seen": "2019-10-19",
            "days_survived": 1.13,
            "re_introductions": 1,
            "revision_survived": 2,
            "category": "Test Cat 1"
        },
        {
            "anchor": "test_anchor_1",
            "strength": 3.14,
            "last_seen": "2019-10-20",
            "first_seen": "2019-10-20",
            "days_survived": 2.13,
            "re_introductions": 2,
            "revision_survived": 3
        },
        {
            "anchor": "test_anchor_2",
            "strength": 2.14,
            "last_seen": "2019-10-11",
            "first_seen": "2019-10-12",
            "days_survived": 1.13,
            "re_introductions": 1,
            "revision_survived": 2,
            "category": "Test Cat 2"
        },
        {
            "anchor": "test_anchor_3",
            "strength": 3.14,
            "last_seen": "2019-10-12",
            "first_seen": "2019-10-13",
            "days_survived": 2.13,
            "re_introductions": 2,
            "revision_survived": 3
        }
    ]
}
"""