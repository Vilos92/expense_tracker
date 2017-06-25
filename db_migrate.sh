#!/bin/bash
export FLASK_APP=flask_app
flask db migrate -d flask_migrations
