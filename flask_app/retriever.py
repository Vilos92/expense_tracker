import logging

from flask_app import db
from flask_app.models import Expense

logger = logging.getLogger(__name__)


def get_expense(expense_id):
    return Expense.query.filter_by(id = expense_id).first()


def get_report(start_timestamp, end_timestamp):
    return
