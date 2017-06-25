import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt import JWT

from config import ConfigTypes


app = Flask(__name__)

config_type = os.environ.get('FLASK_CONFIG', ConfigTypes.DEVELOPMENT)
if config_type not in ConfigTypes:
    config_type = ConfigTypes.DEVELOPMENT

config_path = 'config.{}Config'.format(config_type)
app.config.from_object(config_path)

db = SQLAlchemy(app)
migrate = Migrate(app, db)


# authenticate_user requires "db", which is declared above
from flask_app.auth import authenticate_user, user_identity
jwt = JWT(app, authenticate_user, user_identity)


from flask_app import views, api, models
