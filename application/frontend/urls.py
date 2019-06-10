from django.urls import path

from application.frontend import views

app_name = 'utils'

urlpatterns = [
    path('', views.HomePageView.as_view(), name='article-selection-page'),
    path('article-page/', views.ArticlePageView.as_view(), name='article-page'),
    path('edit-page/', views.EditPageView.as_view(), name='edit-page'),
    path('anchor-page/', views.AnchorPageView.as_view(), name='anchor-page'),
    path('blink-page/', views.BlinkPageView.as_view(), name='blink-page'),
    path('about-page/', views.AboutPageView.as_view(), name='about-page'),
    path('login-page/', views.LoginPageView.as_view(), name='login-page'),
    path('registration-page/', views.RegistrationPageView.as_view(), name='registration-page'),
    path('dashboard-page/', views.DashboardPageView.as_view(), name='dashboard-page'),
]
