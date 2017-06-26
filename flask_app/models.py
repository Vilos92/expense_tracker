from utils import datetime_to_pendulum

from flask_app import db


class Base(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)


class UserRole(Base):
    __tablename__ = 'user_role'

    name = db.Column(db.String(80), unique=True, nullable=False)


class User(Base):
    __tablename__ = 'user'

    name = db.Column(db.String(80), unique=True, nullable=False)
    salt = db.Column(db.String(29), nullable=False)
    password = db.Column(db.String(60), nullable=False)
    is_admin = db.Column(db.Boolean(), default=False, nullable=False)

    def __init__(self, name, salt, password, is_admin=False):
        self.name = name

        self.salt = salt
        self.password = password
        self.is_admin = is_admin

    def __repr__(self):
        return '<User %r>' % self.name


class Expense(Base):
    __tablename__ = 'expense'

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref='expenses')

    timestamp = db.Column(db.DateTime(), index=True, nullable=False)
    amount = db.Column(db.Float(), nullable=False)
    description = db.Column(db.String(), nullable=False)

    def __init__(self, user_id, timestamp, description, amount):
        self.user_id = user_id
        self.timestamp = timestamp
        self.amount = amount
        self.description = description

    def __repr__(self):
        return '<Expense %r>' % self.id

    def to_dict(self):
        dt = datetime_to_pendulum(self.timestamp)
        timestamp = dt.to_iso8601_string()

        return {
                'user_id': self.user_id,
                'timestamp': timestamp,
                'amount': self.amount,
                'description': self.description
                }
