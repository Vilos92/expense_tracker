from functools import wraps

from flask import abort
from flask_jwt import jwt_required, current_identity

from flask_app import app


def admin_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        if current_identity.is_admin != True:
            return abort(401)
        return func(*args, **kwargs)
    return decorated_function
