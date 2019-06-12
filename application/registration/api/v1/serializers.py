from django.contrib.auth.models import User
from rest_framework import serializers


class CreateWikiUser(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True)

	class Meta:
		model = User
		fields = [
			'email',
			'username',
			'password',
			'last_name',
			'first_name',
		]

	def create(self, validated_data):
		return User.objects.create_user(is_active=True, **validated_data)


class LoginWikiUser(serializers.Serializer):
	username = serializers.CharField()
	password = serializers.CharField()

	class Meta:
		field = '__all__'
