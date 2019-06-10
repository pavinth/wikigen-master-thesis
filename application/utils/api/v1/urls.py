from django.urls import re_path

from application.utils.api.v1 import views

app_name = 'utils'

urlpatterns = [
    re_path('check_record/(?P<article_title>[\w|\W]+)/$', views.check_record, name='check_record')
]
