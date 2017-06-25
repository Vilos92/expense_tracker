#!/bin/bash
docker volume create --name=$DB_VOLUME_NAME

cmd='docker run --name '$DB_CONTAINER_NAME' -e POSTGRES_USER='$DB_USER' -e POSTGRES_PASSWORD='${DB_PWD}' -p '${DB_PORT}':5432 -v '${DB_VOLUME_NAME}':/var/lib/postgresql/data -d postgres'
echo $cmd
eval $cmd
