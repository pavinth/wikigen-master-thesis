import uuid
from django.db import models
from django.utils import timezone


class DateTime(models.Model):
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now_add=True, editable=False)

    class Meta:
        abstract = True
