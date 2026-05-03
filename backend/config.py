import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = "coffee-shop-secret-key"
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(
        BASE_DIR, "coffee_shop.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False