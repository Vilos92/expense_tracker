import bcrypt

from flask_app import app, db
from flask_app.models import User


def hash_password(salt, password):
    combined_password = password + salt.decode('utf-8') + app.secret_key
    hashed_password = bcrypt.hashpw(combined_password.encode('utf-8'), salt)
    return hashed_password 


def create_user(name, password):
    salt = bcrypt.gensalt()
    hashed_password = hash_password(salt, password)

    new_user = User(name=name, salt=salt.decode('utf-8'), password=hashed_password.decode('utf-8'))
    db.session.add(new_user)
    db.session.commit()

    return new_user


def authenticate_user(name, password):
    salt = db.session.query(User.salt).filter(User.name == name).scalar()

    if not salt:
        return None
    hashed_password = hash_password(salt.encode('utf-8'), password)

    query = (User.query.filter(User.name == name,
                                User.password == hashed_password.decode('utf-8')))
    return query.first()


def get_user(user_id):
    return User.query.filter_by(id = user_id).first()


def user_identity(payload):
    user_id = payload['identity']
    user = get_user(user_id)
    return user
