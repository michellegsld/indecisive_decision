from django.urls import path
from . import views

urlpatterns = [
path("", views.restaurant_search, name="restaurant_search"),
]
