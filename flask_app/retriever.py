import logging

from utils import DatabaseRetrieveException

from flask_app import db
from flask_app.models import Expense
from flask_app.auth import user_exists

logger = logging.getLogger(__name__)


def get_expense(expense_id):
    expense = Expense.query.filter_by(id = expense_id).first()

    if not expense:
        warning = 'expense with id = {} does not exist'.format(expense_id)
        raise DatabaseRetrieveException(warning)

    return expense


def get_expenses(user_id):
    if not user_exists(user_id):
        warning = 'user with id = {} does not exist'.format(user_id)
        raise DatabaseRetrieveException(warning)

    return Expense.query.filter_by(user_id = user_id).all()


def get_report(start_timestamp, end_timestamp):
    return
