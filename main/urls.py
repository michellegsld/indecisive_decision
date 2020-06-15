from django.urls import path
from . import views

urlpatterns = [
path("", views.index, name="index"),
path("restaurants", views.restaurant_search, name="restaurant_search"),
path("api_query/<location>/<rating>/<price>/", views.api_query, name="api-query")
]
