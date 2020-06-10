from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from main import models
from rest_framework import viewsets, decorators
from rest_framework.response import Response
from main.serializers import UserSerializer, IngredientSerializer, RecipesSerializer


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    
    @decorators.action(methods=['get'], detail=True, url_path='get_reipes', url_name='get-recipes')
    def user_recipes(self, request, pk=None):
        recpies = {}
        user = self.get_object()
        for entry in models.Recpies.objects.get(user_id=user.id):
            recpies[entry.id] = entry
        return Response(recipes)

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = models.Ingredient.objects.all().order_by('-id')
    serializer_class = IngredientSerializer
    
 
class RecipesViewSet(viewsets.ModelViewSet):
    queryset = models.Recipes.objects.all().order_by('-id')
    serializer_class = RecipesSerializer
    
    @decorators.action(methods=['get'], detail=True, url_path='get_ingredients', url_name='get-ingredients')
    def recipe_ingredients(self, request, pk=None):
        ingredient_names = {}
        recipe = self.get_object()
        for entry in recipe.ingredients.all():
            ingredient_names[entry.id] = entry.name
        return Response(ingredient_names)

def index(response):
    return render(response, 'index.html')

def restaurant_search(response):
    return render(response, 'restaurant_search.html')