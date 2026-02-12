#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VPS_HOST="jp-vps"
VPS_USER="claude"
VPS_DEPLOY_DIR="/opt/jesseprojects"
LOCAL_DIR="/srv/knowledge/Claude/VPS/apps/jesseprojects-v2"

# Functions
print_usage() {
    echo "Usage: $0 <environment> [iteration]"
    echo ""
    echo "Environments:"
    echo "  prod              Deploy to production (jesseprojects.com)"
    echo "  sandbox <iter>    Deploy to sandbox iteration (sb.jesseprojects.com/<iter>)"
    echo ""
    echo "Examples:"
    echo "  $0 prod           # Deploy to production"
    echo "  $0 sandbox 1      # Deploy to sandbox iteration 1"
    echo "  $0 sandbox 3      # Deploy to sandbox iteration 3"
    exit 1
}

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

deploy_production() {
    log_info "Deploying to PRODUCTION (jesseprojects.com)"

    # Build the production image locally
    log_info "Building production Docker image..."
    docker build -t jesseprojects-prod:latest -f Dockerfile .

    # Save the image to a tar file
    log_info "Saving Docker image to tar file..."
    docker save jesseprojects-prod:latest | gzip > /tmp/jesseprojects-prod.tar.gz

    # Create deployment directory on VPS
    log_info "Creating deployment directory on VPS..."
    ssh ${VPS_HOST} "mkdir -p ${VPS_DEPLOY_DIR}"

    # Copy files to VPS
    log_info "Copying files to VPS..."
    scp /tmp/jesseprojects-prod.tar.gz ${VPS_HOST}:${VPS_DEPLOY_DIR}/
    scp docker-compose.prod.yml ${VPS_HOST}:${VPS_DEPLOY_DIR}/docker-compose.yml

    # Load and deploy on VPS
    log_info "Loading and deploying on VPS..."
    ssh ${VPS_HOST} "cd ${VPS_DEPLOY_DIR} && \
        docker load < jesseprojects-prod.tar.gz && \
        docker-compose down && \
        docker-compose up -d && \
        rm jesseprojects-prod.tar.gz"

    # Cleanup local tar file
    rm /tmp/jesseprojects-prod.tar.gz

    log_info "Production deployment complete!"
    log_info "Site: https://jesseprojects.com"
}

deploy_sandbox() {
    local iteration=$1

    if [[ -z "$iteration" ]]; then
        log_error "Iteration number required for sandbox deployment"
        print_usage
    fi

    if ! [[ "$iteration" =~ ^[1-9][0-9]*$ ]]; then
        log_error "Iteration must be a positive integer"
        exit 1
    fi

    log_info "Deploying to SANDBOX iteration ${iteration} (sb.jesseprojects.com/${iteration})"

    # Build the application
    log_info "Building React application..."
    npm run build

    # Create a tar of the build
    log_info "Creating build archive..."
    tar -czf /tmp/jesseprojects-sandbox-${iteration}.tar.gz -C dist .

    # Create deployment directories on VPS
    log_info "Creating deployment directories on VPS..."
    ssh ${VPS_HOST} "mkdir -p ${VPS_DEPLOY_DIR}/iterations/${iteration}"

    # Copy build to VPS
    log_info "Copying build to VPS..."
    scp /tmp/jesseprojects-sandbox-${iteration}.tar.gz ${VPS_HOST}:${VPS_DEPLOY_DIR}/iterations/

    # Extract build on VPS
    log_info "Extracting build on VPS..."
    ssh ${VPS_HOST} "cd ${VPS_DEPLOY_DIR}/iterations/${iteration} && \
        tar -xzf ../jesseprojects-sandbox-${iteration}.tar.gz && \
        rm ../jesseprojects-sandbox-${iteration}.tar.gz"

    # Deploy sandbox container if not already running
    log_info "Ensuring sandbox container is running..."
    ssh ${VPS_HOST} "cd ${VPS_DEPLOY_DIR} && \
        if [ ! -f docker-compose.sandbox.yml ]; then
            echo 'First sandbox deployment - setting up container...'
        fi"

    # Copy sandbox config files on first deploy
    scp docker-compose.sandbox.yml ${VPS_HOST}:${VPS_DEPLOY_DIR}/
    scp Dockerfile.sandbox ${VPS_HOST}:${VPS_DEPLOY_DIR}/
    scp nginx-sandbox.conf ${VPS_HOST}:${VPS_DEPLOY_DIR}/

    # Build and deploy sandbox container
    ssh ${VPS_HOST} "cd ${VPS_DEPLOY_DIR} && \
        docker-compose -f docker-compose.sandbox.yml build && \
        docker-compose -f docker-compose.sandbox.yml up -d"

    # Cleanup local tar file
    rm /tmp/jesseprojects-sandbox-${iteration}.tar.gz

    log_info "Sandbox deployment complete!"
    log_info "Site: https://sb.jesseprojects.com/${iteration}"
}

# Main script
if [[ $# -lt 1 ]]; then
    print_usage
fi

ENVIRONMENT=$1

case $ENVIRONMENT in
    prod|production)
        deploy_production
        ;;
    sandbox|sb)
        deploy_sandbox $2
        ;;
    *)
        log_error "Unknown environment: $ENVIRONMENT"
        print_usage
        ;;
esac

log_info "Deployment complete!"
