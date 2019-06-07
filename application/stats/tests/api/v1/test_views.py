from django.urls import reverse
from rest_framework import status

from application.interview.api.v1 import base_test
from application.interview import models


class TestInterview(base_test.Interview):
    def setUp(self):
        super().setUp()
        self.url = reverse('api:v1:interview:interview-list')

    def test_interview_created_successfully(self):
        response = self.client.post(self.url, self.valid_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(models.Interview.objects.count(), 1)

    def test_interview_returns_bad_request_when_required_field_not_provided(self):
        field_name = 'candidate'
        del self.valid_data[field_name]

        response = self.client.post(self.url, self.valid_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(models.Interview.objects.count(), 0)
        self.assertTrue(field_name in response.data.keys())
