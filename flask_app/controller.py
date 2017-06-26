import logging

from flask_app import db
from flask_app.models import Expense

logger = logging.getLogger(__name__)


def insert_expense(user_id, timestamp, amount, description):
    expense = Expense(user_id=user_id, timestamp=timestamp, amount=amount, description=description)
    db.session.add(expense)
    db.session.commit()

    return expense


def remove_expense(expense_id):
    # Decouple this from permission
    expense = Expense.query.filter_by(id = expense_id)
