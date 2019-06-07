from application.interview import models
from application.interview.api.v1 import base_test, serializers


class TestInterview(base_test.Interview):
    def setUp(self):
        super().setUp()
        self.serializer = serializers.Interview

    def test_interview_serializes_successfully(self):
        serializer = self.serializer(data=self.valid_data)

        self.assertTrue(serializer.is_valid())

        serializer.save()

        self.assertEqual(models.Interview.objects.count(), 1)
        self.assertEqual(serializer.data['candidate'], str(self.candidate.uuid))
        self.assertEqual(serializer.data['interviewer'], str(self.interviewer.uuid))
