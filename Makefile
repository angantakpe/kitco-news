# Environment and compose files
ENV_FILE := .env
COMPOSE_FILE := docker-compose.yml
KUBECTL_APPLY = kubectl apply -f kubernetes/

.PHONY: all
all: build up

## Docker commands

.PHONY: build
build:
	@echo "🔨 Building backend and frontend services..."
	docker-compose -f $(COMPOSE_FILE) build

.PHONY: up
up: 
	@echo "🚀 Starting all services..."
	docker network inspect traefik-public >/dev/null 2>&1 || docker network create traefik-public
	docker-compose -f $(COMPOSE_FILE) up -d

.PHONY: down
down:
	@echo "🛑 Stopping all services..."
	docker-compose -f $(COMPOSE_FILE) down

.PHONY: restart
restart: down up

.PHONY: logs
logs:
	@echo "📜 Viewing logs..."
	docker-compose -f $(COMPOSE_FILE) logs -f

.PHONY: clean
clean:
	@echo "🧹 Cleaning up containers and volumes..."
	docker-compose -f $(COMPOSE_FILE) down -v --remove-orphans

.PHONY: backend-shell
backend-shell:
	@echo "🐳 Accessing backend container shell..."
	docker exec -it $(shell docker ps -qf "name=backend") sh

.PHONY: frontend-shell
frontend-shell:
	@echo "🐳 Accessing frontend container shell..."
	docker exec -it $(shell docker ps -qf "name=frontend") sh

## Kubernetes commands

.PHONY: deploy
deploy:
	@echo "🚀 Deploying application to Kubernetes..."
	$(KUBECTL_APPLY)database.yaml
	$(KUBECTL_APPLY)backend.yaml
	$(KUBECTL_APPLY)frontend.yaml
	$(KUBECTL_APPLY)ingress.yaml
	@echo "✅ Deployment complete!"

.PHONY: delete
delete:
	@echo "🗑️ Deleting Kubernetes resources..."
	kubectl delete -f kubernetes/
	@echo "✅ Kubernetes resources deleted!"

.PHONY: k8s-logs
k8s-logs:
	@echo "📜 Fetching logs from backend..."
	kubectl logs -l app=backend

.PHONY: k8s-status
k8s-status:
	@echo "🔍 Checking Kubernetes status..."
	kubectl get all

.PHONY: k8s-restart
k8s-restart: delete deploy

.PHONY: k8s-forward
k8s-forward:
	@echo "🔀 Forwarding ports for local access..."
	kubectl port-forward service/frontend-service 3000:3000 &
	kubectl port-forward service/backend-service 3001:3001 &

.PHONY: k8s-dashboard
k8s-dashboard:
	@echo "📊 Opening Kubernetes Dashboard..."
	minikube dashboard

.PHONY: k8s-describe
k8s-describe:
	@echo "📜 Describing Kubernetes backend pod..."
	kubectl describe pod -l app=backend

## Help command to guide usage

.PHONY: help
help:
	@echo "🚀 Available commands:"
	@echo "  make build         - Build all services"
	@echo "  make up            - Start all services"
	@echo "  make down          - Stop all services"
	@echo "  make restart       - Restart services"
	@echo "  make logs          - View logs"
	@echo "  make clean         - Remove containers and volumes"
	@echo "  make backend-shell - Enter backend container"
	@echo "  make frontend-shell - Enter frontend container"
	@echo "  make deploy        - Deploy application to Kubernetes"
	@echo "  make delete        - Remove Kubernetes deployments"
	@echo "  make k8s-logs      - Fetch logs from backend pods"
	@echo "  make k8s-status    - Check status of all Kubernetes resources"
	@echo "  make k8s-forward   - Forward Kubernetes services to local ports"
	@echo "  make k8s-dashboard - Open the Minikube dashboard"
	@echo "  make k8s-describe  - Describe Kubernetes backend pod"
