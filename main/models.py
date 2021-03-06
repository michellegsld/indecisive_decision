from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here
# Models for the database
# Django automatically creates tables based on models

class Ingredient(models.Model):
    name = models.CharField(max_length=40)
    type = models.CharField(max_length=40)

    def __str__(self):
        return self.name

class Restaurant(models.Model):
    """ Model for the favorite restaurants """
     rest_id = models.CharField(max_length=50)
     name = models.CharField(max_length=255)
     rating = models.CharField(max_length=10, null=True)
     address = models.CharField(max_length=75, null=True)
     image_url = models.URLField(default='', null=True)
     price = models.CharField(max_length=6, null=True)
     

class Profile(models.Model):
    """ Extension of the user model """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    favorites = models.ManyToManyField(Restaurant, related_name='favorited_by', blank=True)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """ New receiver because of a addition to user model """
    if created:
        Profile.objects.create(user=instance)
        
@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """ New addition for saving because of addition to user model """
    instance.profile.save()





class Recipes(models.Model):
    name = models.CharField(max_length=40)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes', null=True)
    ingredients = models.ManyToManyField(Ingredient)

    def __str__(self):
        return self.name
