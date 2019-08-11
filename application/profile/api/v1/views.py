from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from application.profile.api.v1 import serializer


# TODO(Pravin): Needs to have ListAPIView
class Profile(CreateAPIView):
    permission_classes = [IsAuthenticated,]
    serializer_class = serializer.Profile

    def post(self, request, *args, **kwargs):
        username = request.data['username']
        password = request.data['password']
        import pdb; pdb.set_trace()
        user = authenticate(username=username, password=password)
        serialized_user = self.serializer_class(user)
        return Response(serialized_user.data, status=status.HTTP_200_OK)
