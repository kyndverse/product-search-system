CREATE ROLE debezium
WITH
    LOGIN
    REPLICATION
    PASSWORD 'debezium';

GRANT CONNECT ON DATABASE marketplace_db TO debezium;

GRANT USAGE ON SCHEMA public TO debezium;

GRANT SELECT ON TABLE public.products TO debezium;
GRANT SELECT ON TABLE public.categories TO debezium;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO debezium;