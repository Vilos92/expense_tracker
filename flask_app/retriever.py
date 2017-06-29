import logging

from utils import DatabaseRetrieveException

from flask_app import db
from flask_app.models import Expense

logger = logging.getLogger(__name__)


def get_expense(expense_id, user_id=None):
    query = Expense.query.filter_by(id = expense_id)

    if user_id:
         # Expense must belong to a user_id
         expense = query.filter_by(user_id = user_id).first()
         if not expense:
            warning = 'expense with id = {} and user with id = {} does not exist'.format(
                     expense_id, user_id)
            raise DatabaseRetrieveException(warning)
    else:
        # If user_id not specified, can retrieve any expense
        expense = query.first()
        if not expense:
            warning = 'expense with id = {} does not exist'.format(expense_id)
            raise DatabaseRetrieveException(warning)

    return expense


def get_expenses(user_id, start_timestamp=None, end_timestamp=None):
    query = Expense.query.filter_by(user_id = user_id)

    if start_timestamp:
        query = query.filter(Expense.timestamp >= start_timestamp)

    if end_timestamp:
        query = query.filter(Expense.timestamp <= end_timestamp)

    return query.all()


def get_report(user_id, start_timestamp=None, end_timestamp=None):
    expenses = get_expenses(user_id, start_timestamp, end_timestamp)
    expense_dicts = [expense.to_dict() for expense in expenses]

    return {'expenses': expense_dicts}
