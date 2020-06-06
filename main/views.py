from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from main import models
from rest_framework import viewsets
from main.serializers import UserSerializer, IngredientSerializer, RecipesSerializer

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = models.Ingredient.objects.all().order_by('-id')
    serializer_class = IngredientSerializer

class RecipesViewSet(viewsets.ModelViewSet):
    queryset = models.Recipes.objects.all().order_by('-id')
    serializer_class = RecipesSerializer

def index(response):
    return render(response, 'index.html')

def login_signup(response):
    return render(response, 'login_signup.html')
