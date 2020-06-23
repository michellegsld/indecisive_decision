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

# Viewset for the REST API  Restaurant object
class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = models.Restaurant.objects.all()
    serializer_class = RestaurantSerializer


# Viewset for the REST API User object

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


    # Get all recpies associated with a certain user based on the UID

    @decorators.action(methods=['get'], detail=True, url_path='get_reipes', url_name='get-recipes')
    def user_recipes(self, request, pk=None):
        recpies = {}
        user = self.get_object()
        for entry in models.Recpies.objects.get(user_id=user.id):
            recpies[entry.id] = entry
        return Response(recipes)

# Viewset for all Ingredient objects in the Database

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = models.Ingredient.objects.all().order_by('-id')
    serializer_class = IngredientSerializer


# Viewset for the Recpie objects in the database

class RecipesViewSet(viewsets.ModelViewSet):
    queryset = models.Recipes.objects.all().order_by('-id')
    serializer_class = RecipesSerializer

    # Method to retrieve all ingredients associated with a recpie
    @decorators.action(methods=['get'], detail=True, url_path='get_ingredients', url_name='get-ingredients')
    def recipe_ingredients(self, request, pk=None):
        ingredient_names = {}
        recipe = self.get_object()
        for entry in recipe.ingredients.all():
            ingredient_names[entry.id] = entry.name
        return Response(ingredient_names)

# 
# PAGE VIEWS
#


# Renders the profile page on call
def profile(response):
    user = response.user
    favorites = user.profile.favorites.values()
    return render(response, "profile.html", {"favorites": favorites})


# Render the landing page on call
def index(response):
    return render(response, 'index.html')


# Renders the restaurant decider page on call
def restaurant_search(response):
    return render(response, 'restaurant_search.html')


#
# FUNCTIONAL VIEWS
#

def api_query(response, location, rating, price="1,2,3,4"):

    """
    A method that allows the frontend to Query the yelp API with a set of parameters
    
    Location: The user input location to set the Yelp API with
    Rating: The user selected rating, defaults to all
    Price: The user selected price, default to any
    
    Return: The results of the Yelp API filtered to the user parameters
    """
    
    API_KEY = "3ITPjXB1GPOj78Fag-o0LLQv2nOt7gmQWNjDJxqo7RK-HYmwVTyzm7F0MK7-Z6sPFmyaiEH5sgfU6JkrH4nNV06JHFTJ7GSPFlj7CdSDx12qPtaezp0-x01xJ9G9XnYx" # Will be changed to not list the API key
    
    get_total = requests.get("https://api.yelp.com/v3/businesses/search", headers={"Authorization": "Bearer " + API_KEY}, params={'location': location, 'price': price, 'categories': 'restaurants,All', 'limit': 50, 'radius': 24140})
    
    if "error" in get_total.json(): # Check if the API returned an error for the request
        return JsonResponse(get_total.json())
    
    total_results = float(get_total.json()["total"]) # Get the total amount of results in the request

    if total_results < 0: # Make sure the total isn't negative
        total_results += 50
    offset = random.randint(1, total_results) # Set the offset to a random number between 1 and the total
    
    new_dict = {
        "total": 0,
        "businesses": [],
    }

    response_list = requests.get("https://api.yelp.com/v3/businesses/search", headers={"Authorization": "Bearer " + API_KEY}, params={'location': location, 'price': price, 'offset': offset, 'categories': 'restaurants,All', 'limit': 50, 'radius': 24140})
    
    if (float(rating) != 0): # If the user selected a rating
        for i in range(0, len(response_list.json()["businesses"]) - 1):
            if response_list.json()["businesses"][i]["rating"] >= float(rating): # Check for businesses at, or above the selected rating
                new_dict['total'] += 1
                new_dict["businesses"].append(response_list.json()["businesses"][i])

    return JsonResponse(new_dict) # Return the filtered results

def save_favorite(request, rest_id):
    
    """
    View to save a favorite to the currently loged in user
    
    rest_id: The restaurant id for the favorite to save.
    
    Returns: Seccuess or Error depending on what happens
    """

    if request.user.is_authenticated: # Only try to save if a user is logged in
        uid = request.user.id # Get the ID of the current user
        API_KEY = "3ITPjXB1GPOj78Fag-o0LLQv2nOt7gmQWNjDJxqo7RK-HYmwVTyzm7F0MK7-Z6sPFmyaiEH5sgfU6JkrH4nNV06JHFTJ7GSPFlj7CdSDx12qPtaezp0-x01xJ9G9XnYx"
        get_business = requests.get("https://api.yelp.com/v3/businesses/" + rest_id, headers={"Authorization": "Bearer " + API_KEY})
        favorite_restaurant = get_business.json() # Get the single favorite returned by the API

        try:
            c_user = User.objects.get(pk=uid) # Get the object of the current user
        except User.DoesNotExist:
            return JsonResponse({"error": "Failed to add: User does not exist"})

        new_favorite = models.Restaurant(name=favorite_restaurant["name"]) # Define a new Restaurant model to save parameters
    
        # Save all the parameters
        
        joined_address = " "
        joined_address = joined_address.join(favorite_restaurant["location"]['display_address'])
        
        new_favorite.rest_id = favorite_restaurant["id"]
        new_favorite.address = joined_address
        new_favorite.image_url = favorite_restaurant["image_url"]
        new_favorite.rating = favorite_restaurant["rating"]
        new_favorite.price = favorite_restaurant["price"]
        new_favorite.save() # Save the restaurant object

        c_user.profile.favorites.add(new_favorite) # Add the restaurant object to the user favorites
        c_user.save()
        return JsonResponse({"status": "success"})
    else:
        return JsonResponse({"error": "Can't add favorite to anonymous user"})
    
def delete_favorite(request, r_id):
    """
    View to delete a favorite to the currently loged in user
    
    rest_id: The restaurant id for the favorite to delete.
    
    Returns: Seccuess or Error depending on what happens
    """
    if request.user.is_authenticated: # If the user is logged in
        uid = request.user.id # Get the current user's ID
        try:
            c_user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            return JsonResponse({"error": "Failed to add: User does not exist"})
        
        for entry in c_user.profile.favorites.values(): # Loop through all a user's favorites
            if entry['rest_id'] == r_id:
                delete = entry
        
        c_user.profile.favorites.remove(models.Restaurant.objects.get(pk=delete['id'])) # Remove the restaurant object from uesr favorites
        c_user.profile.save() # Save user profile
        c_user.save() # Save the user

        return JsonResponse({"success": "favorite deleted"})
    else:
        return JsonResponse({"error": "no user"})
            

#Authentication

def LoginRequest(request):
    """
    The login request view that allows a user to login
    Return: Renders the login page.
    
    """
    if request.method == 'POST':
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None: # If the user is authenticated 
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
                    context={"form":form})  # Render the login page
    
def LogoutView(request):
    """ Logs out the current user """
    logout(request)
    return redirect('/')


def RegisterView(request):
    """
    View to register a new user
    Return: The register form based on the built-in form
    """
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f"New account created: {username}")
            login(request, user) # Login the user after registration
            return redirect("/") # Redirect to the home page
        
        else:
            for msg in form.error_messages:
                print(msg)
                messages.error(request, f"{msg}: {form.error_messages[msg]}") # Print error messages

            return render(request = request, template_name = "register.html", context={"form":form}) # Render the register form

    form = UserCreationForm
    return render(request = request, template_name = "register.html", context={"form":form}) # Original render of the register template
