from django.contrib.auth import authenticate

from rest_framework import serializers

from application.stats import models


class Article(serializers.Serializer):
	id = serializers.IntegerField(read_only=True)
	username = serializers.CharField(write_only=True)
	password = serializers.CharField(write_only=True)
	anchor = serializers.CharField(max_length=256, write_only=True)
	strength = serializers.FloatField(write_only=True)
	last_seen = serializers.DateField(write_only=True)
	first_seen = serializers.DateField(write_only=True)
	days_survived = serializers.FloatField(write_only=True)
	re_introductions = serializers.IntegerField(write_only=True)
	revision_survived = serializers.IntegerField(write_only=True)
	category = serializers.CharField(write_only=True)
	title = serializers.CharField()
	ns = serializers.CharField(required=False)
	anon = serializers.CharField(required=False)

	class Meta:
		fields = '__all__'

	def create(self, validated_data):
		title = validated_data.pop('title')
		username = validated_data.pop('username')
		password = validated_data.pop('password')
		category_name = validated_data.pop('category')

		user = authenticate(username=username, password=password)

		article, _ = models.Article.objects.get_or_create(title=title, user=user)
		category, _ = models.Category.objects.get_or_create(name=category_name)

		return models.Anchor.objects.create(title=article, category=category, **validated_data)


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


class Category(serializers.ModelSerializer):
	class Meta:
		model = models.Category
		fields = '__all__'
