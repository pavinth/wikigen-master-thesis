from django.urls import path

from application.registration.api.v1 import views

app_name = 'registration'

urlpatterns = [
    path('create/', views.CreateWikiUser.as_view(), name='create-user'),
    path('login/', views.LoginWikiUser.as_view(), name='login'),
]
