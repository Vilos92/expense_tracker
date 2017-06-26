import logging

from flask_app import db
from flask_app.models import Expense

logger = logging.getLogger(__name__)


def insert_expense(user_id, timestamp, amount, description):
    expense = Expense(user_id=user_id, timestamp=timestamp, amount=amount, description=description)
    db.session.add(expense)
    db.session.commit()
    return expense


def update_expense(expense_id, timestamp=None, amount=None, description=None):
    expense = Expense.query.filter_by(id = expense_id).first()
    if not expense:
        raise Exception
    # Use exception, for if expense does not exist (RetrievalException)

    if timestamp:
        expense.timestamp = timestamp

    if amount:
        expense.amount = amount

    if description:
        expense.description = description
    
    db.session.commit()
    return expense


def delete_expense(expense_id):
    # Decouple this from permission

    expense = Expense.query.filter_by(id = expense_id).first()

    if not expense:
        # Raise removal warning
        pass

    db.session.delete(expense)
    db.session.commit()
