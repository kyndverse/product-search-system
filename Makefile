.PHONY: up down restart logs ps clean connector-register connector-delete connector-status connector-list connector-restart psql

CONNECT_URL=http://localhost:8083
CONNECTOR_NAME=marketplace-postgres-source
CONNECTOR_FILE=./infrastructure/debezium/connectors/postgres-connector.json

up:
	docker compose -f infrastructure/docker-compose.yaml up -d

down:
	docker compose -f infrastructure/docker-compose.yaml down

restart:
	docker compose -f infrastructure/docker-compose.yaml down
	docker compose -f infrastructure/docker-compose.yaml up -d

logs:
	docker compose -f infrastructure/docker-compose.yaml logs -f

ps:
	docker compose -f infrastructure/docker-compose.yaml ps

clean:
	docker compose -f infrastructure/docker-compose.yaml down -v

connector-register:
	curl -X POST $(CONNECT_URL)/connectors \
		-H "Content-Type: application/json" \
		--data @$(CONNECTOR_FILE)

connector-delete:
	curl -X DELETE $(CONNECT_URL)/connectors/$(CONNECTOR_NAME)

connector-status:
	curl $(CONNECT_URL)/connectors/$(CONNECTOR_NAME)/status

connector-list:
	curl $(CONNECT_URL)/connectors

connector-restart:
	curl -X POST $(CONNECT_URL)/connectors/$(CONNECTOR_NAME)/restart

psql:
	docker exec -it infrastructure-postgres-1 psql -U product-service -d marketplace_db
