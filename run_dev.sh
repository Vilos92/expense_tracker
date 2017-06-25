#!/bin/bash
export PROJECT_NAME='expense-tracker-dev'
export FLASK_CONFIG=Development

export DB_CONTAINER_NAME=$PROJECT_NAME'-postgres'
export DB_VOLUME_NAME=$PROJECT_NAME'-postgres'
export DB_PORT=5432
export DB_PWD=dev1234
export DB_USER=$PROJECT_NAME

. create_postgres_container.sh

python run.py --debug
