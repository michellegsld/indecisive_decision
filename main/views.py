from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.forms.models import model_to_dict
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from main.serializers import UserSerializer, IngredientSerializer, RecipesSerializer, RestaurantSerializer
from django.template import RequestContext
from main import models
from main.forms import LoginForm
from rest_framework import viewsets, decorators
from rest_framework.response import Response
import random
import requests

# Create your views here.
class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = models.Restaurant.objects.all()
    serializer_class = RestaurantSerializer

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

def profile(response):
    user = response.user
    favorites = user.profile.favorites.values()
    return render(response, "profile.html", {"favorites": favorites})


def index(response):
    return render(response, 'index.html')


def restaurant_search(response):
    return render(response, 'restaurant_search.html')


def api_query(response, location, rating, price="1,2,3,4"):
    API_KEY = "3ITPjXB1GPOj78Fag-o0LLQv2nOt7gmQWNjDJxqo7RK-HYmwVTyzm7F0MK7-Z6sPFmyaiEH5sgfU6JkrH4nNV06JHFTJ7GSPFlj7CdSDx12qPtaezp0-x01xJ9G9XnYx"
    get_total = requests.get("https://api.yelp.com/v3/businesses/search", headers={"Authorization": "Bearer " + API_KEY}, params={'location': location, 'price': price, 'categories': 'restaurants,All', 'limit': 50})
    if "error" in get_total.json():
        return JsonResponse(get_total.json())
    total_results = float(get_total.json()["total"])
    if total_results < 0:
        total_results += 50
    offset = random.randint(1, total_results)
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

def save_favorite(request, rest_id):

    if request.user.is_authenticated:
        uid = request.user.id
        API_KEY = "3ITPjXB1GPOj78Fag-o0LLQv2nOt7gmQWNjDJxqo7RK-HYmwVTyzm7F0MK7-Z6sPFmyaiEH5sgfU6JkrH4nNV06JHFTJ7GSPFlj7CdSDx12qPtaezp0-x01xJ9G9XnYx"
        get_business = requests.get("https://api.yelp.com/v3/businesses/" + rest_id, headers={"Authorization": "Bearer " + API_KEY})
        favorite_restaurant = get_business.json()

        try:
            c_user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            return JsonResponse({"error": "Failed to add: User does not exist"})

        new_favorite = models.Restaurant(name=favorite_restaurant["name"])
    
        joined_address = " "
        joined_address = joined_address.join(favorite_restaurant["location"]['display_address'])
        
        new_favorite.rest_id = favorite_restaurant["id"]
        new_favorite.address = joined_address
        new_favorite.image_url = favorite_restaurant["image_url"]
        new_favorite.rating = favorite_restaurant["rating"]
        new_favorite.price = favorite_restaurant["price"]
        new_favorite.save()

        c_user.profile.favorites.add(new_favorite)
        c_user.save()
        return JsonResponse({"status": "success"})
    else:
        return JsonReponse({"error": "Can't add favorite to anonymous user"})
    
def delete_favorite(request, r_id):
    if request.user.is_authenticated:
        uid = request.user.id
        try:
            c_user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            return JsonResponse({"error": "Failed to add: User does not exist"})
        
        for entry in c_user.profile.favorites.values():
            if entry['rest_id'] == r_id:
                delete = entry
                print(delete['id'])
        
        c_user.profile.favorites.remove(models.Restaurant.objects.get(pk=delete['id']))
        c_user.profile.save()
        c_user.save()
        return JsonResponse({"success": "favorite deleted"})
    else:
        return JsonResponse({"error": "no user"})
            

#Authentication

def LoginRequest(request):
    if request.method == 'POST':
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}")
                return redirect('/')
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    form = AuthenticationForm()
    return render(request = request,
                    template_name = "login.html",
                    context={"form":form})
    
def LogoutView(request):
    logout(request)
    return redirect('/')


def RegisterView(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f"New account created: {username}")
            login(request, user)
            return redirect("/")
        
        else:
            for msg in form.error_messages:
                print(msg)
                messages.error(request, f"{msg}: {form.error_messages[msg]}")

            return render(request = request, template_name = "register.html", context={"form":form})

    form = UserCreationForm
    return render(request = request, template_name = "register.html", context={"form":form})
