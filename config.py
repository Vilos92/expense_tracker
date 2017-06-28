import os

from utils import create_custom_enum


CONFIG_TYPES = ['Development', 'Testing', 'Production']
ConfigTypes = create_custom_enum('ConfigTypes', CONFIG_TYPES)

DATABASE_URI_TEMPLATE = 'postgres://{user}:{pwd}@{host}:{port}/{db}'


class Config(object):
    DEBUG = False
    TESTING = False

    SQLALCHEMY_DATABASE_URI = DATABASE_URI_TEMPLATE.format(user='expense-tracker-dev', pwd='dev1234',
                                                            host='localhost', port='5432',
                                                            db='expense-tracker-dev')

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = 'dev-K*"IK,t(g(Zv6b.XPCsg:dH[4^O"qJ'


class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True


class TestingConfig(Config):
    TESTING = True

    SQLALCHEMY_DATABASE_URI = DATABASE_URI_TEMPLATE.format(user='expense-tracker-test', pwd='test1234',
                                                            host='localhost', port='6543',
                                                            db='expense-tracker-test')

    SECRET_KEY = 'test-EQ>*Ye*hY7H}5`Qxs*ny&:3F3NmHf"'
