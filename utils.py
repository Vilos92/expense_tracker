from collections import namedtuple


def create_custom_enum(name, options):
    custom_enum = namedtuple(name, [x.upper() for x in options])                                         
    return custom_enum(*options)
