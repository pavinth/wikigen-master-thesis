from django.utils import timezone

from rest_framework import status, response
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, get_object_or_404

from application.stats.models import Article
from application.stats.api.v1 import serializers
        

@api_view(['GET'])
def check_record(request, article_title=None):
    if article_title:
        threshold = timezone.now() - timezone.timedelta(minutes=5)
        article = get_object_or_404(Article.objects.all(), title=article_title, created_at__gte=threshold)
        serialized = serializers.Article(article)
        return response.Response(serialized.data, status=status.HTTP_200_OK)
    return response.Response(status=status.HTTP_400_BAD_REQUEST)
