# Pull base image
FROM python:3.6-slim

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /wiki

# Copy project
COPY . /wiki/

# Install dependencies
RUN pip install -r requirements.txt
