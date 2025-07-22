
#!/bin/bash

# Component Permission Manager
# Manages file permissions for critical components

set -e

# Define component directories in a single array
COMPONENT_DIRS=(
  "src/styles/globals.css"
  "src/components/WaveBackground"
  "src/components/LazySection"
  "src/components/ErrorBoundary"
  "src/components/FloatingButton"
  "src/components/Mermaid"
  "src/components/ThemeToggle"
  "src/components/PerformanceDashboard"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to display usage
usage() {
    echo "Usage: $0 [OPTION]"
    echo "Manage file permissions for critical components"
    echo ""
    echo "Options:"
    echo "  protect     Make files read-only (444)"
    echo "  unprotect   Make files writable (644)"
    echo "  status      Show current permissions"
    echo "  help        Show this help message"
    echo ""
    echo "Components managed:"
    echo "  - WaveBackground"
    echo "  - LazySection"  
    echo "  - ErrorBoundary"
    echo "  - FloatingButton"
    echo "  - Mermaid"
    echo "  - ThemeToggle"
    echo "  - PerformanceDashboard"
    echo "  - globals.css"
}

# Function to check if directory exists
check_directory() {
    local dir=$1
    if [ ! -d "$dir" ] && [ ! -f "$dir" ]; then
        echo -e "${RED}Error: Directory/file $dir does not exist${NC}"
        return 1
    fi
    return 0
}

# Function to protect files (make read-only)
protect_files() {
    echo -e "${YELLOW}Protecting component files (making read-only)...${NC}"
    
    for dir in "${COMPONENT_DIRS[@]}"; do
        if check_directory "$dir"; then
            echo "Processing $dir..."
            if [ -f "$dir" ]; then
                # Handle single files
                chmod 444 "$dir"
            else
                # Handle directories
                find "$dir" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) -exec chmod 444 {} \;
            fi
            echo -e "${GREEN}✓ Protected files in $dir${NC}"
        fi
    done
    
    echo -e "${GREEN}All specified component files are now read-only${NC}"
}

# Function to unprotect files (make writable)
unprotect_files() {
    echo -e "${YELLOW}Unprotecting component files (making writable)...${NC}"
    
    for dir in "${COMPONENT_DIRS[@]}"; do
        if check_directory "$dir"; then
            echo "Processing $dir..."
            if [ -f "$dir" ]; then
                # Handle single files
                chmod 644 "$dir"
            else
                # Handle directories
                find "$dir" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) -exec chmod 644 {} \;
            fi
            echo -e "${GREEN}✓ Unprotected files in $dir${NC}"
        fi
    done
    
    echo -e "${GREEN}All specified component files are now writable${NC}"
}

# Function to show current permissions
show_status() {
    echo -e "${YELLOW}Current file permissions:${NC}"
    echo ""
    
    for dir in "${COMPONENT_DIRS[@]}"; do
        if check_directory "$dir"; then
            echo "=== $dir ==="
            if [ -f "$dir" ]; then
                # Handle single files
                ls -la "$dir" | awk '{print $1, $9}'
            else
                # Handle directories
                find "$dir" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) -exec ls -la {} \; | awk '{print $1, $9}'
            fi
            echo ""
        fi
    done
}

# Main script logic
case "${1:-help}" in
    protect)
        protect_files
        ;;
    unprotect)
        unprotect_files
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        echo -e "${RED}Error: Unknown option '$1'${NC}"
        echo ""
        usage
        exit 1
        ;;
esac
