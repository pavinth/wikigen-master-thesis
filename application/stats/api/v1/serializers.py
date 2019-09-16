from django.contrib.auth import authenticate

from rest_framework import serializers

from application.stats import models


class Article(serializers.Serializer):
	id = serializers.IntegerField(read_only=True)
	anchor = serializers.CharField(write_only=True)
	strength = serializers.FloatField(write_only=True)
	last_seen = serializers.DateField(write_only=True)
	first_seen = serializers.DateField(write_only=True)
	days_survived = serializers.FloatField(write_only=True)
	re_introductions = serializers.IntegerField(write_only=True)
	revision_survived = serializers.IntegerField(write_only=True)
	category = serializers.CharField(write_only=True, default='no_category')
	title = serializers.CharField()
	category_count = serializers.IntegerField(read_only=True)
	total_anchor_count = serializers.SerializerMethodField()
	created_at = serializers.DateTimeField(read_only=True)

	class Meta:
		fields = '__all__'

	def create(self, validated_data):
		title = validated_data.pop('title')
		category_name = validated_data.pop('category')

		article, _ = models.Article.objects.get_or_create(title=title, user=self.context['request'].user)
		print('Article created: ', _)

		category, _ = models.Category.objects.get_or_create(name=category_name, user=self.context['request'].user)
		anchor, _ = models.Anchor.objects.get_or_create(article=article, category=category, **validated_data)

		print('Anchor created: ', _)

		return article

	def get_total_anchor_count(self, article):
		return article.anchor_set.count()


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
	anchor = serializers.CharField(max_length=256)
	strength = serializers.FloatField()
	last_seen = serializers.DateField()
	first_seen = serializers.DateField()
	days_survived = serializers.FloatField()
	re_introductions = serializers.IntegerField()
	revision_survived = serializers.IntegerField()
	category = serializers.CharField(source='category.name')

	class Meta:
		model = models.Anchor
		fields = '__all__'


class Category(serializers.ModelSerializer):
	name = serializers.CharField()

	class Meta:
		model = models.Category
		fields = ['name']

	def create(self, validated_data):
		user = self.context['request'].user

		return models.Category.objects.create(user=user, **validated_data)
