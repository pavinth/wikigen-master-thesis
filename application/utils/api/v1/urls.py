from django.urls import path
from rest_framework.routers import DefaultRouter

from application.utils.api.v1 import views

app_name = 'utils'

urlpatterns = [
    path('check_record/', views.check_record, name='check_record')
]
