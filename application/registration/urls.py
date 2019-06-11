from django.urls import path

from application.registration import views

urlpatterns = [
    path('login/', views.Login.as_view(), name='registration-login'),
]
