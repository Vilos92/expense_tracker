FROM ubuntu:16.04
MAINTAINER Greg Linscheid linscheid.greg@gmail.com

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip

ADD requirements.txt /tmp/requirements.txt

RUN pip3 install -r /tmp/requirements.txt

ADD . /expense_tracker

RUN chmod +x /expense_tracker/run_prod.sh

ENV PYTHONPATH /expense_tracker/

EXPOSE 8000:5000

CMD cd /expense_tracker && ./run_prod.sh
