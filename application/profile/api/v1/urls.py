from django.urls import path

from application.profile.api.v1 import views

app_name = 'profile'

urlpatterns = [
    path('profile/', views.profile, name='profile')
]
