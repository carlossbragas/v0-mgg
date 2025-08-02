#!/bin/bash

# MinhaGrana PWA Deployment Script for Docker Swarm

set -e

echo "🚀 Starting MinhaGrana PWA deployment..."

# Configuration
STACK_NAME="minhagrana"
BACKEND_IMAGE="minhagrana/backend"
VERSION=${1:-latest}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker Swarm is initialized
check_swarm() {
    if ! docker info --format '{{.Swarm.LocalNodeState}}' | grep -q "active"; then
        log_error "Docker Swarm is not initialized. Run: docker swarm init"
        exit 1
    fi
    log_info "Docker Swarm is active"
}

# Create secrets if they don't exist
create_secrets() {
    log_info "Creating Docker secrets..."
    
    # Database password
    if ! docker secret ls | grep -q "db_password"; then
        echo "postgres123" | docker secret create db_password -
        log_info "Created db_password secret"
    fi
    
    # JWT secret
    if ! docker secret ls | grep -q "jwt_secret"; then
        openssl rand -base64 32 | docker secret create jwt_secret -
        log_info "Created jwt_secret secret"
    fi
    
    # Redis password
    if ! docker secret ls | grep -q "redis_password"; then
        echo "redis123" | docker secret create redis_password -
        log_info "Created redis_password secret"
    fi
    
    # Grafana password
    if ! docker secret ls | grep -q "grafana_password"; then
        echo "admin123" | docker secret create grafana_password -
        log_info "Created grafana_password secret"
    fi
}

# Build and push backend image
build_backend() {
    log_info "Building backend image..."
    
    cd backend
    docker build -t ${BACKEND_IMAGE}:${VERSION} .
    docker tag ${BACKEND_IMAGE}:${VERSION} ${BACKEND_IMAGE}:latest
    
    # Push to registry if not local deployment
    if [ "$2" = "push" ]; then
        docker push ${BACKEND_IMAGE}:${VERSION}
        docker push ${BACKEND_IMAGE}:latest
        log_info "Pushed backend image to registry"
    fi
    
    cd ..
}

# Deploy the stack
deploy_stack() {
    log_info "Deploying stack: $STACK_NAME"
    
    # Update the image version in docker-stack.yml if needed
    if [ "$VERSION" != "latest" ]; then
        sed -i.bak "s|image: minhagrana/backend:latest|image: minhagrana/backend:${VERSION}|g" docker-stack.yml
    fi
    
    docker stack deploy -c docker-stack.yml $STACK_NAME
    
    # Restore original file if modified
    if [ -f docker-stack.yml.bak ]; then
        mv docker-stack.yml.bak docker-stack.yml
    fi
    
    log_info "Stack deployed successfully"
}

# Wait for services to be ready
wait_for_services() {
    log_info "Waiting for services to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        local running_services=$(docker stack services $STACK_NAME --format "table {{.Name}}\t{{.Replicas}}" | grep -c "1/1\|2/2\|3/3" || true)
        local total_services=$(docker stack services $STACK_NAME --quiet | wc -l)
        
        if [ "$running_services" -eq "$total_services" ]; then
            log_info "All services are running!"
            break
        fi
        
        log_warn "Attempt $attempt/$max_attempts: $running_services/$total_services services ready"
        sleep 10
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        log_error "Services failed to start within expected time"
        docker stack services $STACK_NAME
        exit 1
    fi
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s http://localhost/health > /dev/null; then
            log_info "Health check passed!"
            break
        fi
        
        log_warn "Health check attempt $attempt/$max_attempts failed"
        sleep 5
        ((attempt++))
    done
    
    if [ $attempt -gt $max_attempts ]; then
        log_error "Health check failed"
        exit 1
    fi
}

# Show deployment status
show_status() {
    log_info "Deployment Status:"
    echo ""
    docker stack services $STACK_NAME
    echo ""
    log_info "Stack deployed successfully! 🎉"
    log_info "API Health: http://localhost/health"
    log_info "Grafana: http://localhost:3000 (admin/admin123)"
    log_info "Prometheus: http://localhost:9090"
}

# Cleanup function
cleanup() {
    if [ "$1" = "remove" ]; then
        log_warn "Removing stack: $STACK_NAME"
        docker stack rm $STACK_NAME
        log_info "Stack removed"
    fi
}

# Main execution
main() {
    case "${1:-deploy}" in
        "deploy")
            check_swarm
            create_secrets
            build_backend $VERSION
            deploy_stack
            wait_for_services
            health_check
            show_status
            ;;
        "build")
            build_backend $VERSION push
            ;;
        "remove")
            cleanup remove
            ;;
        "status")
            show_status
            ;;
        *)
            echo "Usage: $0 {deploy|build|remove|status} [version]"
            echo "  deploy  - Deploy the complete stack"
            echo "  build   - Build and push backend image"
            echo "  remove  - Remove the stack"
            echo "  status  - Show current status"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
