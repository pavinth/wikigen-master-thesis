from django.urls import include, path

from rest_framework_swagger.views import get_swagger_view

app_name = 'v1'

schema_view = get_swagger_view(title="Swagger Docs")

urlpatterns = [
    path('docs/', schema_view),
    path('utils/', include('application.utils.api.v1.urls'), name='utils'),
    path('stats/', include('application.stats.api.v1.urls'), name='stats'),
]
