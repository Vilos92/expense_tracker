import logging
from functools import wraps

from utils import DatabaseRetrieveException, DatabaseUpdateException, DatabaseDeleteException

from flask import jsonify, request
from flask_restful import Resource
from flask_jwt_extended import (create_access_token, create_refresh_token,
        jwt_required, jwt_refresh_token_required, get_jwt_identity)

from flask_app import app, rest_api
from flask_app.auth import authenticate_user, get_user
from flask_app.retriever import get_expense, get_expenses, get_report
from flask_app.controller import insert_expense, update_expense, delete_expense

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


def current_user():
    user_id = get_jwt_identity()
    return get_user(user_id)


def admin_required(func):
    @wraps(func)
    @jwt_required
    def decorated_function(*args, **kwargs):
        user = current_user()

        if user.is_admin != True:
            error = 'Request does not have admin authorization'
            raise InvalidRequest(error, 401)
        return func(*args, **kwargs)
    return decorated_function


class AuthenticatedResource(Resource):
    method_decorators = [jwt_required]


class AdminResource(Resource):
    method_decorators = [admin_required]


class Login(Resource):
    def post(self):
        request_json = request.json

        required_params = ['username', 'password']
        username, password = parse_request_json(request_json, *required_params)

        user = authenticate_user(username, password)

        if not user:
            error = 'Invalid username or password'
            raise InvalidRequest(error, 401)
        
        return {
                'access_token': create_access_token(identity=user.id),
                'refresh_token': create_refresh_token(identity=user.id)
                }

rest_api.add_resource(Login, '/auth/login')

@app.route('/refresh', methods=['POST'])
class Refresh(Resource):
    method_decorators = [jwt_refresh_token_required]

    def post(self):
        user = current_user()

        return {
                'access_token': create_access_token(identity=user.id),
                }

rest_api.add_resource(Refresh, '/auth/refresh')


class Expense(AuthenticatedResource):
    def get(self):
        user_id = current_user().id

        logger.debug('Retrieving expenses for user with id = {}'.format(user_id))
        expenses = get_expenses(user_id)

        expense_dicts = [expense.to_dict() for expense in expenses]
        return {'expenses': expense_dicts}

    def post(self):
        user_id = current_user().id
        request_json = request.get_json()

        required_params = ['timestamp', 'amount', 'description']
        timestamp, amount, description = parse_request_json(request_json, *required_params)

        expense = insert_expense(user_id, timestamp, amount, description)
        return {'success': True, 'expense': expense.to_dict()}

rest_api.add_resource(Expense, '/api/expense')


class ExpenseItem(AuthenticatedResource):
    def get(self, expense_id):
        user = current_user()

        logger.debug('Retrieving expense with id = {}'.format(expense_id))
        try:
            if user.is_admin:
                expense = get_expense(expense_id)
            else:
                expense = get_expense(expense_id, user_id=user.id)
        except DatabaseRetrieveException as e:
            raise InvalidRequest(str(e), 401)

        return {'expense': expense.to_dict()}

    def put(self, expense_id):
        user = current_user()
        request_json = request.get_json()

        parse_request_json(request_json)

        timestamp = request_json.get('timestamp', None)
        amount = float(request_json.get('amount', None))
        description = request_json.get('description', None)

        logger.debug('Updating expense with id = {}'.format(expense_id))
        try:
            expense = update_expense(expense_id, user_id=user.id, timestamp=timestamp,
                    amount=amount, description=description)
        except DatabaseUpdateException as e:
            raise InvalidRequest(str(e), 401)

        return {'success': True, 'expense': expense.to_dict()}

    def delete(self, expense_id):
        user = current_user()

        logger.debug('Deleting expense with id = {}'.format(expense_id))
        try:
            expense = delete_expense(expense_id, user_id=user.id)
        except DatabaseDeleteException as e:
            raise InvalidRequest(str(e), 401)

        return {'success': True}

rest_api.add_resource(ExpenseItem, '/api/expense/<int:expense_id>')


class Report(AuthenticatedResource):
    def get(self):
        user = current_user()

        start_date = request.args.get('start-date', None)
        end_date = request.args.get('end-date', None)

        logger.debug('Getting report for user with id = {}'.format(user.id))
        report = get_report(user.id, start_date, end_date)

        return {'report': report}

rest_api.add_resource(Report, '/api/report')
