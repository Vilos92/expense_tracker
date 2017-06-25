from flask_app import db


class Base(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)


class User(Base):
    __tablename__ = 'user'

    name = db.Column(db.String(80), unique=True, nullable=False)
    salt = db.Column(db.String(29), nullable=False)
    password = db.Column(db.String(60), nullable=False)

    def __init__(self, name, salt, password):
        self.name = name

        self.salt = salt
        self.password = password

    def __repr__(self):
        return '<User %r>' % self.name
