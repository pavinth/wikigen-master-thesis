from rest_framework import serializers

from application.stats import models


class Article(serializers.ModelSerializer):
	class Meta:
		model = models.Article
		fields = '__all__'


class Revision(serializers.ModelSerializer):
	class Meta:
		model = models.Revision
		exclude = [
			'id',
		]
