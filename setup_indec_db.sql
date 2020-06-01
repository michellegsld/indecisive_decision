-- Create a states DB and insert a table
CREATE DATABASE IF NOT EXISTS indec_db;
USE indec_db;

CREATE TABLE IF NOT EXISTS ingredients(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE, 
    name varchar(256) NOT NULL, 
    type VARCHAR(256) NOT NULL);

CREATE TABLE IF NOT EXISTS users(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE, 
    username VARCHAR(50) NOT NULL UNIQUE, 
    password varchar(255) NOT NULL);

CREATE TABLE IF NOT EXISTS recipes(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT UNIQUE,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    name VARCHAR(256) NOT NULL,
    ingredients VARCHAR(512) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_ingredients(
    ingredient_id INT NOT NULL, 
    recipe_id INT NOT NULL, 
    CONSTRAINT recp_ingred_pk PRIMARY KEY (recipe_id, ingredient_id),
    CONSTRAINT FK_recipe
        FOREIGN KEY(recipe_id) REFERENCES recipes (id), 
    CONSTRAINT FK_inredient
        FOREIGN KEY(ingredient_id) REFERENCES ingredients (id)
);
