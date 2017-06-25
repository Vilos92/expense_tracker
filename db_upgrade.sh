#!/bin/bash
export FLASK_APP=flask_app
flask db upgrade -d flask_migrations
