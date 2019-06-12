from rest_framework import serializers

from application.stats import models


class Article(serializers.ModelSerializer):
	class Meta:
		model = models.Article
		fields = '__all__'


class Revision(serializers.ModelSerializer):
	year = serializers.SerializerMethodField()

	class Meta:
		model = models.Revision
		fields = [
			'year',
			'created_at',
			'updated_at',
			'revid',
			'parentid',
			'user',
			'timestamp',
			'title',
		]

	def get_year(self, revision):
		return revision.timestamp.year


class Anchor(serializers.ModelSerializer):
	class Meta:
		model = models.Anchor
		fields = '__all__'
