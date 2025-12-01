# MyChoice

### Create New Django Project

`./.venv/bin/django-admin startproject mychoice .`

### Install Dependencies

`./.venv/bin/python -m pip install django djangorestframework psycopg2-binary django-cors-headers`

### Start PostgreSQL

`brew services start postgresql`

### Create DB

````
-- 1) Create a local DB user with password
CREATE ROLE mychoice_user WITH LOGIN PASSWORD 'mychoice_password';

-- 2) Allow this user to create databases (nice for dev)
ALTER ROLE mychoice_user CREATEDB;

-- 3) Create the project database owned by that user
CREATE DATABASE mychoice_db OWNER mychoice_user;

-- 4) (Optional) Verify
\du
\l

-- 5) Quit
\q
```

### Run Django Server

`./.venv/bin/python manage.py runserver`

### Run Migrations

```
./.venv/bin/python manage.py makemigrations
./.venv/bin/python manage.py migrate
./.venv/bin/python manage.py runserver 8000
```