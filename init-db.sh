#!/bin/bash
set -e

# Se crean las bases de datos independientes
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE userdb;
    GRANT ALL PRIVILEGES ON DATABASE userdb TO $POSTGRES_USER;

    CREATE DATABASE authdb;
    GRANT ALL PRIVILEGES ON DATABASE authdb TO $POSTGRES_USER;
EOSQL