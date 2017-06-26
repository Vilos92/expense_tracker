import logging

from utils import DatabaseRetrieveException

from flask_app import db
from flask_app.models import Expense

logger = logging.getLogger(__name__)


def get_expense(expense_id):
    expense = Expense.query.filter_by(id = expense_id).first()

    if not expense:
        warning = 'expense with id = {} does not exist'.format(expense_id)
        raise DatabaseRetrieveException(warning)

    return expense


def get_expenses(user_id):
    expenses = Expense.query.filter_by(user_id = user_id).all()

    if not expenses:
        warning = 'expenses do not exist for user with id = {}'.format(user_id)
        raise DatabaseRetrieveException(warning)

    return expenses


def get_report(start_timestamp, end_timestamp):
    return
