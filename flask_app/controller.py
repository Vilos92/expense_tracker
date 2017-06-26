import logging

from utils import DatabaseInsertException, DatabaseUpdateException, DatabaseDeleteException

from flask_app import db
from flask_app.models import Expense
from flask_app.auth import user_exists

logger = logging.getLogger(__name__)


def insert_expense(user_id, timestamp, amount, description):
    if not user_exists(user_id):
        warning = 'user with id = {} does not exist'.format(user_id)
        raise DatabaseInsertException(warning)

    expense = Expense(user_id=user_id, timestamp=timestamp, amount=amount, description=description)
    db.session.add(expense)
    db.session.commit()
    return expense


def update_expense(expense_id, timestamp=None, amount=None, description=None):
    expense = Expense.query.filter_by(id = expense_id).first()
    if not expense:
        warning = 'expense with id = {} does not exist'.format(expense_id)
        raise DatabaseUpdateException(warning)

    if timestamp:
        expense.timestamp = timestamp

    if amount:
        expense.amount = amount

    if description:
        expense.description = description
    
    db.session.commit()
    return expense


def delete_expense(expense_id):
    expense = Expense.query.filter_by(id = expense_id).first()
    if not expense:
        warning = 'expense with id = {} does not exist'.format(expense_id)
        raise DatabaseDeleteException(warning)

    db.session.delete(expense)
    db.session.commit()
