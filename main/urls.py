from django.urls import path, re_path
from . import views
from main.views import LoginRequest

urlpatterns = [
path("register/", views.RegisterView, name="register"),
path("login/", views.LoginRequest, name="login"),
re_path(r'logout/$', views.LogoutView, name="logout_request"),
path("", views.restaurant_search, name="restaurant_search"),
path("api_query/<location>/<rating>/<price>/", views.api_query, name="api-query"),
path("save_favorite/<rest_id>/", views.save_favorite, name="save-favorite")
]
