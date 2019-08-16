from django.contrib.auth.models import User
from django.test import TestCase, Client
from django.urls import reverse


class TestProfileView(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('api:v1:profile:profile')
        self.user = User.objects.create_user(username='test_user', password='test_pass')

    def test_access_not_denied(self):
        self.client.login(self.user)
        self.client.get(self.url)
