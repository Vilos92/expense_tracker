#!/usr/bin/env python
import logging
import argparse
from flask_app import app

logger = logging.getLogger(__name__)


def parse_args():
    arg_parser = argparse.ArgumentParser()
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument('-l', '--log-level', default='INFO', help='log level')
    arg_parser.add_argument('--debug', action='store_true', help='run in debug mode')

    args = arg_parser.parse_args()
    return args


def main(debug):
    app.run(debug=debug)


if __name__ == '__main__':
    args = parse_args()

    log_level = args.log_level
    debug = args.debug

    if debug:
        log_level = 'DEBUG'

    logging.basicConfig(level=log_level)

    main(debug)
