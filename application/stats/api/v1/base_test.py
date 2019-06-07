from django import test
from django.utils import timezone

from application.candidate import models as candidate_models
from application.interview.api.v1.choices import Medium
from application.interviewer import models as interviewer_models

from autofixture import create_one


class Interview(test.TestCase):
    def setUp(self):
        valid_timestamp = timezone.now() + timezone.timedelta(days=5)
        self.client = test.Client()
        self.candidate = create_one(candidate_models.Candidate)
        self.interviewer = create_one(interviewer_models.Interviewer)
        self.valid_data = {
            'candidate': self.candidate.uuid,
            'interviewer': self.interviewer.uuid,
            'day': valid_timestamp.date(),
            'time': 15,
            'medium': Medium.ONLINE,
        }
