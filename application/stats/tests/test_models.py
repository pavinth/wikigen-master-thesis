from django.core.exceptions import ValidationError
from django.utils import timezone

from application.interview import models
from application.interview.api.v1 import base_test
from application.interview.validators import NOT_WORKING_HOUR

from rest_framework import exceptions as rest_exceptions


class TestInterview(base_test.Interview):
    def setUp(self):
        super().setUp()
        self.valid_data['candidate'] = self.candidate
        self.valid_data['interviewer'] = self.interviewer

    def test_interview_created_successfully(self):
        interview = models.Interview(**self.valid_data)
        interview.save()

        self.assertEqual(models.Interview.objects.count(), 1)

    def test_validation_error_if_interview_not_working_hour(self):
        self.valid_data['time'] = 7
        interview = models.Interview(**self.valid_data)

        self.assertRaisesMessage(ValidationError, NOT_WORKING_HOUR, interview.save)

    def test_validation_error_if_not_working_hour(self):
        self.valid_data['time'] = 7
        interview = models.Interview(**self.valid_data)

        self.assertRaisesMessage(ValidationError, NOT_WORKING_HOUR, interview.save)

    def test_validation_error_if_interview_is_not_2_hour_before_today(self):
        today = timezone.now().date()
        now = timezone.now().hour
        self.valid_data['time'] = now
        self.valid_data['day'] = today

        interview = models.Interview(**self.valid_data)

        self.assertRaises(rest_exceptions.ValidationError, interview.save)
