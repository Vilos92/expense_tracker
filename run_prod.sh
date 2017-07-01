#!/bin/bash
export PROJECT_NAME='expense-tracker-prod'
export FLASK_CONFIG=Production

export DB_CONTAINER_NAME=$PROJECT_NAME'-postgres'
export DB_VOLUME_NAME=$PROJECT_NAME'-postgres'
export DB_PORT=5432
export DB_PWD=prod1234
export DB_USER=$PROJECT_NAME

. create_postgres_container.sh

python3 run.py
