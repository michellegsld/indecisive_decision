from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(response):
    return render(response, 'index.html')

def restaurant_search(response):
    return render(response, 'restaurant_search.html')