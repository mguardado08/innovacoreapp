# Ejecucion del backend

Este backend corre en Django y se ejecuta dentro de Docker. La base de datos es PostgreSQL en el host.

## Requisitos

- Docker y Docker Compose.
- PostgreSQL en el host, con usuario y base creados.

## Variables de entorno

El archivo `backend/.env` contiene los secretos y la configuracion local. No se versiona.

Campos clave:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DB_ENGINE`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`

## Conexion a PostgreSQL del host

Si Postgres esta en el host, asegure que acepte conexiones desde la red Docker.

```bash
sudo sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/' /etc/postgresql/17/main/postgresql.conf

echo "host all all 172.18.0.0/16 scram-sha-256" | sudo tee -a /etc/postgresql/17/main/pg_hba.conf

sudo systemctl restart postgresql
```

## Ejecucion en desarrollo (runserver)

```bash
docker compose up -d
```

## Ejecucion en produccion (gunicorn)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Migraciones

```bash
docker compose run --rm backend python manage.py migrate
```

## Static files (admin)

Se recolectan en el build de la imagen para que el admin cargue CSS/JS.
Si cambias estaticos, haz rebuild.

## Admin

- URL: `http://127.0.0.1:8000/admin/`
- Crea el superusuario con:

```bash
docker compose run --rm backend python manage.py createsuperuser
```

## Notas

- Si cambias `DJANGO_DEBUG`, recrea el contenedor:

```bash
docker compose down
docker compose up -d --force-recreate
```
