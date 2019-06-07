import autofixture
from django import test
from django.urls import reverse
from rest_framework import status

from application.interview import models as interview_models


class TestInterviewFiltering(test.TestCase):
    def setUp(self):
        self.client = test.Client()
        self.interviews = autofixture.create(interview_models.Interview, 10, generate_fk=True)
        self.url = reverse('api:v1:interview:interview-list')

    def test_candidate_uuid_filter(self):
        candidate_uuid = self.interviews[0].candidate.uuid
        url = self.url + f'?candidate_uuid={candidate_uuid}'
        response = self.client.get(url)

        filter_count = interview_models.Interview.objects.filter(candidate__uuid=candidate_uuid).count()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), filter_count)
        self.assertEqual(response.data[0]['candidate'], str(candidate_uuid))

    def test_interviewer_uuid_filter(self):
        interviewer_uuid = self.interviews[0].interviewer.uuid
        url = self.url + f'?interviewer_uuid={interviewer_uuid}'
        response = self.client.get(url)

        filter_count = interview_models.Interview.objects.filter(interviewer__uuid=interviewer_uuid).count()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), filter_count)
        self.assertEqual(response.data[0]['interviewer'], str(interviewer_uuid))

    def test_date_filter(self):
        day = self.interviews[0].day
        url = self.url + f'?day={day}'
        response = self.client.get(url)

        filter_count = interview_models.Interview.objects.filter(day=day).count()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), filter_count)
        self.assertEqual(response.data[0]['day'], str(day))
