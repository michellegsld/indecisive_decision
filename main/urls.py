from django.urls import path
from . import views

urlpatterns = [
path("", views.index, name="index"),
path("login", views.login_signup, name="login_signup"),
path("signup", views.login_signup, name="login_signup")
]
