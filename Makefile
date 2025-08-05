.PHONY: help install dev build start test docker-up docker-down docker-logs clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run start:dev

build: ## Build the application
	npm run build

start: ## Start production server
	npm run start:prod

test: ## Run tests
	npm run test

test-watch: ## Run tests in watch mode
	npm run test:watch

test-cov: ## Run tests with coverage
	npm run test:cov

docker-up: ## Start services with Docker Compose
	docker-compose up -d

docker-up-build: ## Build and start services with Docker Compose
	docker-compose up -d --build

docker-down: ## Stop Docker Compose services
	docker-compose down

docker-logs: ## Show Docker Compose logs
	docker-compose logs -f

docker-clean: ## Remove Docker containers and volumes
	docker-compose down -v
	docker system prune -f

db-only: ## Start only PostgreSQL database
	docker-compose up -d postgres

clean: ## Clean build artifacts
	rm -rf dist node_modules coverage