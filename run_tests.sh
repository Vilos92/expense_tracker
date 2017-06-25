#!/bin/bash
export PROJECT_NAME='expense-tracker-test'
export FLASK_CONFIG=Testing

export DB_CONTAINER_NAME=$PROJECT_NAME'-postgres'
export DB_VOLUME_NAME=$PROJECT_NAME'-postgres'
export DB_PORT=6543
export DB_PWD=test1234
export DB_USER=$PROJECT_NAME


. create_postgres_container.sh

nosetests tests.py
