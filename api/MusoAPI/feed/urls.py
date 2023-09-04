from .views import FilterBasedSearch
from django.urls import path


urlpatterns = [
    path('search', FilterBasedSearch.as_view())
]
