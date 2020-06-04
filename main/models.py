from django.db import models

# Create your models here

class Ingredient(models.Model):
    name = models.CharField(max_length=40)
    type = models.CharField(max_length=40)

    def __str__(self):
        return self.name


class User(models.Model):
    username = models.CharField(max_length=40)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Recipes(models.Model):
    name = models.CharField(max_length=40)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredients = models.ManyToManyField(Ingredient)

    def __str__(self):
        return self.name
