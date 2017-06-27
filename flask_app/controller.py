import logging

from utils import (DatabaseInsertException, DatabaseRetrieveException,
        DatabaseUpdateException, DatabaseDeleteException)

from flask_app import db
from flask_app.models import Expense
from flask_app.auth import user_exists
from flask_app.retriever import get_expense

logger = logging.getLogger(__name__)


def insert_expense(user_id, timestamp, amount, description):
    if not user_exists(user_id):
        warning = 'user with id = {} does not exist'.format(user_id)
        raise DatabaseInsertException(warning)

    expense = Expense(user_id=user_id, timestamp=timestamp, amount=amount, description=description)
    db.session.add(expense)
    db.session.commit()
    return expense


def update_expense(expense_id, user_id=None, timestamp=None, amount=None, description=None):
    try:
        expense = get_expense(expense_id, user_id)
    except DatabaseRetrieveException as e:
        raise DatabaseUpdateException(e)

    if timestamp:
        expense.timestamp = timestamp

    if amount:
        expense.amount = amount

    if description:
        expense.description = description
    
    db.session.commit()
    return expense


def delete_expense(expense_id, user_id=None):
    try:
        expense = get_expense(expense_id, user_id)
    except DatabaseRetrieveException as e:
        raise DatabaseDeleteException(e)

    db.session.delete(expense)
    db.session.commit()
