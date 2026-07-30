#!/bin/sh
set -e

echo "Waiting for postgres..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.5
done
echo "Postgres is ready."

# python manage.py migrate --noinput      ← comment this out temporarily
# python manage.py collectstatic --noinput ← comment this out too

if [ "$#" -gt 0 ]; then
  exec "$@"
fi

exec daphne -b 0.0.0.0 -p 8000 config.asgi:application
