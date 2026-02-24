include .env
export $(shell sed 's/=.*//' .env)

.PHONY: api psql migration test

api:
	@cd api && ENVIRONMENT=dev go run cmd/api/main.go

psql:
	@docker exec -it anim-crm-pg psql -U ${DB_USER} -d ${DB_NAME}

migration:
	@docker exec -it anim-crm-pg psql -U ${DB_USER} -d ${DB_NAME} -f $(m)

test:
	docker exec -it anim-crm-api go test ./...

test-local:
	@cd backend && ENV_PATH=/home/madeinheaven91/Projects/anim-crm/.env go test -v ./...
