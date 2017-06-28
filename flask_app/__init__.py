import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_jwt import JWT, jwt_required, current_identity

from config import ConfigTypes


app = Flask(__name__)

config_type = os.environ.get('FLASK_CONFIG', ConfigTypes.DEVELOPMENT)
if config_type not in ConfigTypes:
    config_type = ConfigTypes.DEVELOPMENT

config_path = 'config.{}Config'.format(config_type)
app.config.from_object(config_path)

app_directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app.static_folder = os.path.join(app_directory, 'static')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

rest_api = Api(app)


# auth features requires "db", which is declared above
from flask_app.auth import authenticate_user, user_identity
jwt = JWT(app, authenticate_user, user_identity)


from flask_app import views, api, models
from flask_app.api import admin_required


# If testing, add JWT test routes
config_type = os.environ.get('FLASK_CONFIG', None)
if config_type == ConfigTypes.TESTING:
    @app.route('/test/protected')
    @jwt_required()
    def test_protected():
        return '%s' % current_identity


    @app.route('/test/admin_protected')
    @admin_required
    def test_admin_protected():
        return '%s' % current_identity
