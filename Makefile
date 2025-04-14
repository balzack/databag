default:
	@grep '^[^#[:space:].].*:' Makefile

dev-start:
	docker compose -f docker-compose.dev.yml up -d
dev-stop:
	docker compose -f docker-compose.dev.yml down

dev-restart-server:
	docker compose -f docker-compose.dev.yml restart net-server
dev-restart-web:
	docker compose -f docker-compose.dev.yml restart net-web
dev-restart-repeater:
	docker compose -f docker-compose.dev.yml restart net-repeater

prod-docker-start:
	docker compose up -d

prod-raw-build:
	./build.sh
