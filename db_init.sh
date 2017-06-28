#!/bin/bash
export FLASK_APP=flask_app

migrations_dir='flask_migrations'

cmd='rm -r '$migrations_dir
echo $cmd
eval $cmd

cmd='flask db init -d '$migrations_dir
echo $cmd
eval $cmd
