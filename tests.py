import unittest
import os

import bcrypt

from flask import json
from flask_testing import TestCase

from config import ConfigTypes
from flask_app import app, db
from flask_app.models import User
from flask_app.auth import (hash_password, create_user, authenticate_user,
        get_user, user_identity)


class FlaskTest(TestCase):
    def create_app(self):
        config_type = os.environ.get('FLASK_CONFIG', None)
        self.assertEqual(config_type, ConfigTypes.TESTING)
        return app


class FlaskDbTest(FlaskTest):
    def create_test_user(self, name='test_user', password='XDjVGeLvmT'):
        return create_user(name, password)

    def setUp(self):
        db.drop_all()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()


class AuthTest(FlaskDbTest):
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


class JwtTest(FlaskDbTest):
    AUTH_URL = '/auth'

    TEST_NAME = 'test_user'
    TEST_PASSWORD = 'P21AJ5eQWC'

    TEST_DATA = {
            'username': TEST_NAME,
            'password': TEST_PASSWORD
            }

    def test_get_auth(self):
        response = self.client.post(self.AUTH_URL, content_type='application/json',
                data=json.dumps(self.TEST_DATA))
        self.assertIsNotNone(response.data)
        self.assert_401(response)

        self.create_test_user(self.TEST_NAME, self.TEST_PASSWORD)
        response = self.client.post(self.AUTH_URL, content_type='application/json',
                data=json.dumps(self.TEST_DATA))
        self.assertIsNotNone(response.data)
        self.assertIsNotNone(response.json)
        self.assertIn('access_token', response.json)

    def test_protected(self):
        protected_url = '/test/protected'

        response = self.client.get(protected_url)
        self.assertIsNotNone(response.data)
        self.assert_401(response)

        self.create_test_user(self.TEST_NAME, self.TEST_PASSWORD)
        response = self.client.post(self.AUTH_URL, content_type='application/json',
                data=json.dumps(self.TEST_DATA))
        access_token = response.json['access_token']

        jwt_token = 'JWT {}'.format(access_token)
        headers = {'Authorization': jwt_token}

        response = self.client.get(protected_url, headers=headers)
        self.assertIsNotNone(response.data)
        self.assert_200(response)


    def test_is_admin(self):
        protected_url = '/test/admin_protected'

        user = self.create_test_user(self.TEST_NAME, self.TEST_PASSWORD)
        response = self.client.post(self.AUTH_URL, content_type='application/json',
                data=json.dumps(self.TEST_DATA))
        access_token = response.json['access_token']

        jwt_token = 'JWT {}'.format(access_token)
        headers = {'Authorization': jwt_token}

        response = self.client.get(protected_url, headers=headers)
        self.assertIsNotNone(response.data)
        self.assert_401(response)

        user.is_admin = True
        db.session.commit()

        response = self.client.get(protected_url, headers=headers)
        self.assertIsNotNone(response.data)
        self.assert_200(response)


if __name__ == '__main__':
    unittest.main()
