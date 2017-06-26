import logging

from utils import DatabaseRetrievalException

from flask_app import db
from flask_app.models import Expense

logger = logging.getLogger(__name__)


def get_expense(expense_id):
    expense = Expense.query.filter_by(id = expense_id).first()

    if not expense:
        warning = 'expense with id = {} does not exist'.format(expense_id)
        raise DatabaseRetrievalException(warning)

    return expense


def get_report(start_timestamp, end_timestamp):
    return
