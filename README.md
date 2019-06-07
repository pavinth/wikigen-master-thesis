# Instruction to run:

`docker-compose up --build`

- runs migrations
- collects static files
- populates database with fixtures
- runs the server

# FOR API DOCS:

`http://0.0.0.0:8000/api/v1/docs`

There are 3 endpoints:
- to create candidate
- to create interviewer
- to create interview

# Interview Filters:
- candidate: /api/v1/interview/interview/?candidate_uuid=<candidate_uuid>
- interviewer: /api/v1/interview/interview/?interviewer_uuid=<interviewer_uuid>
- day: /api/v1/interview/interview/?day=<date: 2019-07-15>

# TESTING:
- Please make sure that the containers are running (app_server_1 and database_1)
- `docker exec interview_management_app_server_1 python manage.py test  --noinput`
- There are 13 tests in total. 