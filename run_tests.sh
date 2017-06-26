#!/bin/bash
export PROJECT_NAME='expense-tracker-test'
export FLASK_CONFIG=Testing

export DB_CONTAINER_NAME=$PROJECT_NAME'-postgres'
export DB_VOLUME_NAME=$PROJECT_NAME'-postgres'
export DB_PORT=6543
export DB_PWD=test1234
export DB_USER=$PROJECT_NAME


. create_postgres_container.sh

if [ -z $1 ]; then
    module=''
else
    module=':'$1
fi

if [ -z $2 ]; then
    method=''
else
    method='.'$2
fi

cmd='nosetests tests.py'$module$method
echo $cmd
eval $cmd
