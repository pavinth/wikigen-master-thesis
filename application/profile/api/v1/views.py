from rest_framework import status, response
from rest_framework.decorators import api_view

from application.profile.api.v1 import serializer


@api_view(['GET'])
def profile(request):
    if request.user.is_authenticated:
        serialized_user = serializer.Profile(request.user)
        return response.Response(data=serialized_user.data, status=status.HTTP_200_OK)
    return response.Response(status=status.HTTP_404_NOT_FOUND)
