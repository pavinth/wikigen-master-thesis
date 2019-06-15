from django.contrib.auth import authenticate, login, logout

from rest_framework import response, status
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response

from application.registration.api.v1 import serializers


class CreateWikiUser(CreateAPIView):
    serializer_class = serializers.CreateWikiUser


class LoginWikiUser(CreateAPIView):
    serializer_class = serializers.LoginWikiUser

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid(raise_exception=True):
            user = authenticate(**serializer.validated_data)
            if user:
                login(request, user)
                return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def log_out(request):
    if request.user.is_authenticated:
        logout(request)
        return response.Response(status=status.HTTP_200_OK)
    message = {'data': 'Logged in Session not found!'}
    return response.Response(data=message, status=status.HTTP_400_BAD_REQUEST)
