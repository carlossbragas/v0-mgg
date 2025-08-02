#!/bin/bash

# Docker Swarm Setup Script for MinhaGrana PWA

set -e

echo "🐳 Setting up Docker Swarm for MinhaGrana PWA..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    log_info "Docker is installed: $(docker --version)"
}

# Initialize Docker Swarm
init_swarm() {
    if docker info --format '{{.Swarm.LocalNodeState}}' | grep -q "active"; then
        log_warn "Docker Swarm is already initialized"
        return
    fi
    
    log_info "Initializing Docker Swarm..."
    docker swarm init
    log_info "Docker Swarm initialized successfully"
}

# Create overlay networks
create_networks() {
    log_info "Creating overlay networks..."
    
    if ! docker network ls | grep -q "minhagrana-network"; then
        docker network create --driver overlay --attachable minhagrana-network
        log_info "Created minhagrana-network"
    else
        log_warn "Network minhagrana-network already exists"
    fi
}

# Create required directories
create_directories() {
    log_info "Creating required directories..."
    
    mkdir -p nginx/ssl
    mkdir -p monitoring
    mkdir -p data/postgres
    mkdir -p data/redis
    mkdir -p logs
    
    log_info "Directories created"
}

# Generate SSL certificates (self-signed for development)
generate_ssl() {
    log_info "Generating SSL certificates..."
    
    if [ ! -f nginx/ssl/cert.pem ]; then
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/key.pem \
            -out nginx/ssl/cert.pem \
            -subj "/C=BR/ST=SP/L=SaoPaulo/O=MinhaGrana/CN=localhost"
        
        log_info "SSL certificates generated"
    else
        log_warn "SSL certificates already exist"
    fi
}

# Create monitoring configuration
create_monitoring_config() {
    log_info "Creating monitoring configuration..."
    
    cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'minhagrana-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx:80']

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']
EOF
    
    log_info "Prometheus configuration created"
}

# Set proper permissions
set_permissions() {
    log_info "Setting proper permissions..."
    
    chmod +x scripts/*.sh
    chmod 600 nginx/ssl/key.pem 2>/dev/null || true
    chmod 644 nginx/ssl/cert.pem 2>/dev/null || true
    
    log_info "Permissions set"
}

# Show next steps
show_next_steps() {
    log_info "Setup completed! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Configure your environment variables in backend/.env"
    echo "2. Run: ./scripts/deploy.sh deploy"
    echo "3. Access your application at: https://localhost"
    echo ""
    echo "Useful commands:"
    echo "  - View services: docker stack services minhagrana"
    echo "  - View logs: docker service logs minhagrana_backend"
    echo "  - Scale service: docker service scale minhagrana_backend=5"
    echo "  - Remove stack: ./scripts/deploy.sh remove"
}

# Main execution
main() {
    check_docker
    init_swarm
    create_networks
    create_directories
    generate_ssl
    create_monitoring_config
    set_permissions
    show_next_steps
}

main "$@"
