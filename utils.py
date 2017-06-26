from collections import namedtuple

import pendulum


def create_custom_enum(name, options):
    custom_enum = namedtuple(name, [x.upper() for x in options])                                         
    return custom_enum(*options)


def datetime_to_pendulum(datetime_object):
    return pendulum.instance(datetime_object)


class DatabaseInsertionException(Exception):
    def __init__(self, *args, **kwargs):
        Exception.__init__(self, *args, **kwargs)


class DatabaseDeletionException(Exception):
    def __init__(self, *args, **kwargs):
        Exception.__init__(self, *args, **kwargs)


class DatabaseRetrievalException(Exception):                                                             
    def __init__(self, *args, **kwargs):
        Exception.__init__(self, *args, **kwargs)
