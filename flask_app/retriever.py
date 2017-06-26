import logging

from utils import DatabaseRetrieveException

from flask_app import db
from flask_app.models import Expense
from flask_app.auth import get_user, user_exists

logger = logging.getLogger(__name__)


def get_expense(expense_id, user_id=None):
    user = None
    if user_id:
        user = get_user(user_id)
        if not user:
            warning = 'user with id = {} does not exist'.format(user_id)
            raise DatabaseRetrieveException(warning)

    query = Expense.query.filter_by(id = expense_id)

    if not user or user.is_admin:
        # If user not specified, or user is admin, can retrieve any expense
        expense = query.first()
        if not expense:
            warning = 'expense with id = {} does not exist'.format(expense_id)
            raise DatabaseRetrieveException(warning)
    else:
         # If not admin, expense must belong to user
         expense = query.filter_by(user_id = user_id).first()
         if not expense:
            warning = 'expense with id = {} and user with id = {} does not exist'.format(
                     expense_id, user_id)
            raise DatabaseRetrieveException(warning)

    return expense


def get_expenses(user_id):
    if not user_exists(user_id):
        warning = 'user with id = {} does not exist'.format(user_id)
        raise DatabaseRetrieveException(warning)

    return Expense.query.filter_by(user_id = user_id).all()


def get_report(start_timestamp, end_timestamp):
    return
