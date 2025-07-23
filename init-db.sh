#!/bin/bash
set -e

# Se crean las bases de datos independientes
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
  CREATE DATABASE condodb;
  GRANT ALL PRIVILEGES ON DATABASE condodb TO $POSTGRES_USER;

  CREATE DATABASE keycloak;
  GRANT ALL PRIVILEGES ON DATABASE keycloak TO $POSTGRES_USER;
EOSQL