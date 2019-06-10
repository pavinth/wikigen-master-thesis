from django.contrib.auth import authenticate

from rest_framework import serializers

from application.stats import models


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
	article = serializers.IntegerField(source='article.id', required=False)
	anchor = serializers.CharField(max_length=256, required=False)
	strength = serializers.FloatField(required=False, allow_null=True)
	last_seen = serializers.DateField(required=False, allow_null=True)
	first_seen = serializers.DateField(required=False, allow_null=True)
	days_survived = serializers.FloatField(required=False, allow_null=True)
	re_introductions = serializers.IntegerField(required=False, allow_null=True)
	revision_survived = serializers.IntegerField(required=False, allow_null=True)
	category = serializers.CharField(source='category.name', required=False, allow_null=True)
	created_at = serializers.DateTimeField(read_only=True)
	updated_at = serializers.DateTimeField(read_only=True)

	class Meta:
		model = models.Anchor
		fields = '__all__'


class Article(serializers.ModelSerializer):
	id = serializers.IntegerField(read_only=True)
	anchors = Anchor(many=True, source='anchor_set')
	title = serializers.CharField()
	category_count = serializers.IntegerField(read_only=True)
	total_anchor_count = serializers.IntegerField(read_only=True)
	created_at = serializers.DateTimeField(read_only=True)

	class Meta:
		model = models.Article
		fields = [
			'id',
			'anchors',
			'title',
			'category_count',
			'total_anchor_count',
			'created_at',
		]

	def create(self, validated_data):
		print(validated_data)
		title = validated_data.pop('title')
		article, _ = models.Article.objects.get_or_create(title=title, user=self.context['request'].user)

		anchors = validated_data.pop('anchor_set', None)

		for anchor in anchors:
			category_name = anchor.pop('category', None)
			if category_name:
				category_name = category_name['name']
			else:
				category_name = 'no_category'
			category, _ = models.Category.objects.get_or_create(name=category_name, user=self.context['request'].user)

			models.Anchor.objects.get_or_create(article=article, category=category, **anchor)

		return article


class Category(serializers.ModelSerializer):
	name = serializers.CharField()

	class Meta:
		model = models.Category
		fields = ['name']

	def create(self, validated_data):
		user = self.context['request'].user

		return models.Category.objects.create(user=user, **validated_data)
