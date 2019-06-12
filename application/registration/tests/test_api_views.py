from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse
from rest_framework import status


class TestLogin(TestCase):
    def test_login_success(self):
        username, password = 'myuser', 'mypass'
        user = User.objects.create(username=username, password=password)
        client = Client()
        url = reverse('api:v1:registration:login')
        data = {'username': username, 'password': password}

        response = client.post(url, data)
        import pdb
        pdb.set_trace()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
