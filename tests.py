import unittest
import os

import bcrypt

import pendulum

from flask import json, url_for
from flask_jwt import jwt_required, current_identity
from flask_testing import TestCase

from config import ConfigTypes
from utils import (datetime_to_pendulum, DatabaseRetrieveException,
        DatabaseInsertException, DatabaseUpdateException, DatabaseDeleteException)

from flask_app import app, db
from flask_app.models import User, Expense
from flask_app.auth import (hash_password, create_user, authenticate_user,
        get_user, user_identity)

from flask_app.controller import insert_expense, update_expense, delete_expense
from flask_app.retriever import get_expense, get_expenses


class FlaskTest(TestCase):
    def create_app(self):
        config_type = os.environ.get('FLASK_CONFIG', None)
        self.assertEqual(config_type, ConfigTypes.TESTING)
        return app


class DbTestUtils(FlaskTest):
    def create_test_user(self, name='test_user', password='XDjVGeLvmT'):
        return create_user(name, password)

    def setUp(self):
        db.drop_all()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()


class AuthTest(DbTestUtils):
    TEST_NAME = 'test_user'
    TEST_PASSWORD = 'P21AJ5eQWC'

    def test_hash_password(self):
        salt = bcrypt.gensalt()
        self.assertEqual(len(salt), 29)

        hashed_password = hash_password(salt, self.TEST_PASSWORD)
        self.assertEqual(len(hashed_password), 60)

    def test_create_user(self):
        user_query = db.session.query(User).filter(User.name == self.TEST_NAME)
        self.assertIsNone(user_query.first())

        self.create_test_user(name=self.TEST_NAME)
        self.assertIsNotNone(user_query.first())

    def test_authenticate_user(self):
        user = authenticate_user(self.TEST_NAME, self.TEST_PASSWORD)
        self.assertIsNone(user)

        user_A = self.create_test_user(name=self.TEST_NAME, password=self.TEST_PASSWORD)
        user_B = authenticate_user(self.TEST_NAME, self.TEST_PASSWORD)
        self.assertIsNotNone(user_A)
        self.assertIsNotNone(user_B)
        self.assertEqual(user_A, user_B)

    def test_get_user(self):
        user = get_user(user_id=1)
        self.assertIsNone(user)

        user_A = self.create_test_user(name=self.TEST_NAME)
        user_B = get_user(user_id=user_A.id)
        self.assertIsNotNone(user_A)
        self.assertIsNotNone(user_B)
        self.assertEqual(user_A, user_B)


class JwtTestUtils(DbTestUtils):
    AUTH_REQUEST_HANDLER_STR = '_default_auth_request_handler'

    with app.test_request_context():
        AUTH_URL = url_for(AUTH_REQUEST_HANDLER_STR)

    TEST_NAME = 'test_user'
    TEST_PASSWORD = 'P21AJ5eQWC'

    def create_test_data(self, name=TEST_NAME):
        return {
            'username': name,
            'password': self.TEST_PASSWORD
            }

    def create_jwt_test_user(self, name=TEST_NAME):
        user = self.create_test_user(name, self.TEST_PASSWORD)
        data = self.create_test_data(name=name)

        response = self.client.post(self.AUTH_URL, content_type='application/json',
                data=json.dumps(data))
        access_token = response.json['access_token']

        jwt_token = 'JWT {}'.format(access_token)
        headers = {'Authorization': jwt_token}

        return user, headers


class JwtTest(JwtTestUtils):
    def test_get_auth(self):
        test_data = self.create_test_data()

        response = self.client.post(self.AUTH_URL, content_type='application/json',
                data=json.dumps(test_data))
        self.assert_401(response)
        self.assertIsNotNone(response.data)

        self.create_test_user(self.TEST_NAME, self.TEST_PASSWORD)
        response = self.client.post(self.AUTH_URL, content_type='application/json',
                data=json.dumps(test_data))
        self.assertIsNotNone(response.data)
        self.assertIsNotNone(response.json)
        self.assertIn('access_token', response.json)

    def test_protected(self):
        with app.test_request_context():
            protected_url = url_for('test_protected')

        response = self.client.get(protected_url)
        self.assert_401(response)
        self.assertIsNotNone(response.data)

        user_, headers = self.create_jwt_test_user()

        response = self.client.get(protected_url, headers=headers)
        self.assert_200(response)
        self.assertIsNotNone(response.data)

    def test_is_admin(self):
        with app.test_request_context():
            protected_url = url_for('test_admin_protected')

        user, headers = self.create_jwt_test_user()

        response = self.client.get(protected_url, headers=headers)
        self.assert_401(response)
        self.assertIsNotNone(response.data)

        user.is_admin = True
        db.session.commit()

        response = self.client.get(protected_url, headers=headers)
        self.assert_200(response)
        self.assertIsNotNone(response.data)


class ExpenseTest(JwtTestUtils):
    def insert_test_expense(self, user=None, timestamp=None,
            amount=47.5, description='Test expense'):
        if not user:
            user = self.create_test_user()

        if not timestamp:
            timestamp = pendulum.now()

        expense = insert_expense(user_id=user.id, timestamp=timestamp,
                amount=amount, description=description)
        return expense

    def test_insert_expense(self):
        # User ID does not exist
        user = self.create_test_user()
        db.session.delete(user)
        db.session.commit()
        with self.assertRaises(DatabaseInsertException):
            expense = self.insert_test_expense(user=user)

        # User ID does exist
        user = self.create_test_user()
        timestamp = pendulum.now()

        amount = 47.5
        description = 'Test expense'

        expense = self.insert_test_expense(user=user, timestamp=timestamp,
                amount=amount, description=description)

        self.assertEqual(expense.user_id, user.id)
        self.assertEqual(datetime_to_pendulum(expense.timestamp), timestamp)
        self.assertEqual(expense.amount, amount)
        self.assertEqual(expense.description, description)

        first_expense = Expense.query.first()
        self.assertEqual(expense, first_expense)

    def test_get_expense(self):
        # Expense ID does not exist
        with self.assertRaises(DatabaseRetrieveException):
            get_expense(1)

        # Expense ID does exist
        expense_A = self.insert_test_expense()
        expense_B = get_expense(expense_A.id)
        expense_C = Expense.query.filter_by(id = expense_A.id).first()

        self.assertEqual(expense_A, expense_B)
        self.assertEqual(expense_B, expense_C)

        # Expense ID does exist, wrong user_id
        user_1 = self.create_test_user(name='test_user_1')
        user_2 = self.create_test_user(name='test_user_2')
        expense = self.insert_test_expense(user_1)
        with self.assertRaises(DatabaseRetrieveException):
            get_expense(expense.id, user_id=user_2.id)

        # Expense ID does exist, correct user_id
        try:
            get_expense(expense.id, user_id=user_1.id)
        except DatabaseRetrieveException as e:
            self.fail(e)

    def test_get_expenses(self):
        # User ID does not exist
        with self.assertRaises(DatabaseRetrieveException):
            get_expenses(1)

        # User ID does exist - no expenses
        user = self.create_test_user()
        expenses = get_expenses(user.id)
        self.assertEqual(len(expenses), 0)

        # Expenses inserted
        expenses_from_insert = [self.insert_test_expense(user=user) for x in range(10)]
        expenses_from_get = get_expenses(user.id)
        self.assertEqual(len(expenses_from_insert), len(expenses_from_get))
        self.assertEqual(expenses_from_insert, expenses_from_get)

    def test_update_expense(self):
        # Test updating an expense which does not exist
        with self.assertRaises(DatabaseUpdateException):
            update_expense(expense_id=10)

        expense = self.insert_test_expense()

        # Test that ORM returned by update_expense() is the same
        updated_expense = update_expense(expense_id=expense.id)
        self.assertEqual(expense, updated_expense)

        # Test updating timestamp
        new_timestamp = pendulum.now()
        self.assertNotEqual(datetime_to_pendulum(expense.timestamp), new_timestamp)
        update_expense(expense_id=expense.id, timestamp=new_timestamp)
        self.assertEqual(datetime_to_pendulum(expense.timestamp), new_timestamp)

        # Test updating amount
        new_amount = expense.amount + 10.0
        self.assertNotEqual(expense.amount, new_amount)
        update_expense(expense_id=expense.id, amount=new_amount)
        self.assertEqual(expense.amount, new_amount)

        # Test updating description
        new_description = "Let's change the description"
        self.assertNotEqual(expense.description, new_description)
        updated_expense = update_expense(expense_id=expense.id, description=new_description)
        self.assertEqual(expense.description, new_description)

    def test_delete_expense(self):
        with self.assertRaises(DatabaseDeleteException):
            delete_expense(1)

        expense = self.insert_test_expense()
        expense_query = Expense.query.filter_by(id = expense.id)

        self.assertIsNotNone(expense_query.first())
        delete_expense(expense.id)
        self.assertIsNone(expense_query.first())


class ExpenseApiTest(ExpenseTest):
    with app.test_request_context():
        EXPENSE_LIST_URL = url_for('expenselist')

    def get_expense_url(self, expense_id):
        with app.test_request_context():
            return url_for('expense', expense_id=expense_id)

    def test_expenses_get(self):
        # GET - without authentication
        response = self.client.get(self.EXPENSE_LIST_URL)
        self.assert_401(response)
        self.assertIsNotNone(response.data)

        # GET - with authentication - no expenses
        user, headers = self.create_jwt_test_user()
        response = self.client.get(self.EXPENSE_LIST_URL, headers=headers)
        self.assert_200(response)
        self.assertIsNotNone(response.json)

        expenses = response.json['expenses']
        self.assertEqual(len(expenses), 0)

        # GET - several expenses
        num_expenses = 10
        expense_ids = []
        for x in range(0, num_expenses):
            expense = self.insert_test_expense(user=user)
            expense_ids.append(expense.id)
        response = self.client.get(self.EXPENSE_LIST_URL, headers=headers)
        response_json = response.json
        self.assertIsNotNone(response_json)

        response_expenses = response_json['expenses']
        self.assertEqual(len(response_expenses), num_expenses)

    def test_expense_get(self):
        user_1, headers_1 = self.create_jwt_test_user(name='test_user_1')
        user_2, headers_2 = self.create_jwt_test_user(name='test_user_2')

        # GET  - without authentication
        response = self.client.get(self.get_expense_url(1))
        self.assert_401(response)
        self.assertIsNotNone(response.data)

        # GET - expense_id does not belong to user
        expense = self.insert_test_expense(user=user_1)
        expense_url = self.get_expense_url(expense.id)

        response = self.client.get(expense_url, headers=headers_2)
        self.assert_401(response)

        # GET - expense_id belongs to user
        response = self.client.get(expense_url, headers=headers_1)
        self.assert_200(response)
        self.assertIsNotNone(response.json)

        # GET - expense_id does not belong to user, but user is an admin
        user_2.is_admin = True
        db.session.commit()

        response = self.client.get(expense_url, headers=headers_2)
        self.assert_200(response)
        self.assertIsNotNone(response.json)


if __name__ == '__main__':
    unittest.main()
