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
