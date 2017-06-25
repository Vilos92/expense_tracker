#!/bin/bash
export FLASK_APP=flask_app
flask db init -d flask_migrations
