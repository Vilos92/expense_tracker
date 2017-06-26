import logging
from functools import wraps

from flask import jsonify
from flask_restful import Resource
from flask_jwt import jwt_required, current_identity

from flask_app import app, rest_api

logger = logging.getLogger(__name__)



class InvalidRequest(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)

        self.message = message

        if status_code is not None:
            self.status_code = status_code

        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


@app.errorhandler(InvalidRequest)
def handle_invalid_request(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code

    logger.warn('{} - {}'.format(error.status_code, error.message))
    return response


def admin_required(func):
    @wraps(func)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        if current_identity.is_admin != True:
            error = 'Request does not have admin authorization'
            raise InvalidRequest(error, 401)
        return func(*args, **kwargs)
    return decorated_function


class AuthenticatedResource(Resource):
    method_decorators = [jwt_required()]


class AdminResource(Resource):
    method_decorators = [admin_required]


class Expense(AdminResource):
    def get(self):
        logger.debug('Retrieving expenses from database')
        expenses = []

        return {'expenses': expenses}

rest_api.add_resource(Expense, '/api/expense')
