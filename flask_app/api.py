import logging
from functools import wraps

from utils import DatabaseRetrieveException, DatabaseDeleteException

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt import jwt_required, current_identity

from flask_app import app, rest_api
from flask_app.retriever import get_expense, get_expenses
from flask_app.controller import insert_expense, delete_expense

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


def parse_request_json(request_json, *parameters):
    if not request_json:
        error = 'Missing POST JSON'
        raise InvalidRequest(error, 422)

    missing_parameters = []
    for parameter in parameters:
        if parameter not in request_json:
            missing_parameters.append(parameter)

    if missing_parameters:
        error = 'Missing POST parameter(s): {}'.format(', '.join(missing_parameters))
        raise InvalidRequest(error, 422)

    if len(parameters) == 1:
        return request_json[parameters[0]]
    else:
        return (request_json[parameter] for parameter in parameters)


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


class Expense(AuthenticatedResource):
    def get(self):
        user_id = current_identity.id

        logger.debug('Retrieving expenses for user with id = {}'.format(user_id))
        expenses = get_expenses(user_id)

        expense_dicts = [expense.to_dict() for expense in expenses]
        return {'expenses': expense_dicts}

    def post(self):
        user_id = current_identity.id
        request_json = request.get_json()

        required_params = ['timestamp', 'amount', 'description']
        timestamp, amount, description = parse_request_json(request_json, *required_params)

        expense = insert_expense(user_id, timestamp, amount, description)
        return {'success': True, 'expense': expense.to_dict()}

rest_api.add_resource(Expense, '/api/expense')


class ExpenseItem(AuthenticatedResource):
    def get(self, expense_id):
        user = current_identity

        logger.debug('Retrieving expense with id = {}'.format(expense_id))
        try:
            if user.is_admin:
                expense = get_expense(expense_id)
            else:
                expense = get_expense(expense_id, user_id=user.id)
        except DatabaseRetrieveException as e:
            raise InvalidRequest(str(e), 401)

        return {'expense': expense.to_dict()}

    def delete(self, expense_id):
        user = current_identity

        logger.debug('Retrieving expense with id = {}'.format(expense_id))
        try:
            if user.is_admin:
                expense = delete_expense(expense_id)
            else:
                expense = delete_expense(expense_id, user_id=user.id)
        except DatabaseDeleteException as e:
            raise InvalidRequest(str(e), 401)

        return {'success': True}

rest_api.add_resource(ExpenseItem, '/api/expense/<int:expense_id>')
