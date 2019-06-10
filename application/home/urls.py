from django.urls import path

from application.home import views

urlpatterns = [
    path('search/', views.search, name='search'),
]
