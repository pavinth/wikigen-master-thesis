from django.contrib.auth.models import User
from rest_framework import serializers


class Profile(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = [
            'id',
            'groups',
            'password',
            'is_staff',
            'is_active',
            'is_superuser',
            'user_permissions',
        ]
