#!/usr/bin/python3
from django.contrib.auth.models import User
from main.models import Ingredient, Recipes, Restaurant, Profile
from rest_framework import serializers
       
class IngredientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'type']

class RecipesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Recipes
        fields = ['id', 'name', 'ingredients', 'user_id']
        
class RestaurantSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Restaurant
        fields = ["id", "name", "rating", "image_url", "price", "address"]
        
        
class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    favorites = RestaurantSerializer(many=True)

    class Meta:
        model = Profile
        fields = ['favorites']

class UserSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups', 'id', 'profile']
        
    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create(**validated_data)
        Profile.objects.add(user=user, **profile_data)
        return user
       