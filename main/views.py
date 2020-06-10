from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from main import models
import random
import requests
from rest_framework import viewsets, decorators
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
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

@login_required
def api_query(response, location, rating, price="1,2,3,4"):
    API_KEY = "3ITPjXB1GPOj78Fag-o0LLQv2nOt7gmQWNjDJxqo7RK-HYmwVTyzm7F0MK7-Z6sPFmyaiEH5sgfU6JkrH4nNV06JHFTJ7GSPFlj7CdSDx12qPtaezp0-x01xJ9G9XnYx"
    get_total = requests.get("https://api.yelp.com/v3/businesses/search", headers={"Authorization": "Bearer " + API_KEY}, params={'location': location, 'price': price, 'categories': 'restaurants,All', 'limit': 50})
    offset = random.randint(1, float(get_total.json()["total"]) - 50)
    print(offset)
    print(float(get_total.json()["total"]))
    new_dict = {
        "total": 0,
        "businesses": [],
    }
    response_list = requests.get("https://api.yelp.com/v3/businesses/search", headers={"Authorization": "Bearer " + API_KEY}, params={'location': location, 'price': price, 'offset': offset, 'categories': 'restaurants,All', 'limit': 50})
    if (float(rating) != 0):
        for i in range(0, len(response_list.json()["businesses"]) - 1):
            if response_list.json()["businesses"][i]["rating"] >= float(rating):
                new_dict['total'] += 1
                new_dict["businesses"].append(response_list.json()["businesses"][i])
    return JsonResponse(new_dict)