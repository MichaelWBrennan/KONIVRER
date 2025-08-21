#!/bin/bash
# Smart Conflict Resolver for Autonomous Repository Management
# Handles merge conflicts using intelligent heuristics and fallback strategies

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse command line arguments
PR_NUMBER=""
REPOSITORY=""
GITHUB_TOKEN=""
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --pr-number)
            PR_NUMBER="$2"
            shift 2
            ;;
        --repository)
            REPOSITORY="$2"
            shift 2
            ;;
        --github-token)
            GITHUB_TOKEN="$2"
            shift 2
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Usage: $0 --pr-number <number> --repository <owner/repo> --github-token <token> [--verbose]"
            echo ""
            echo "Options:"
            echo "  --pr-number      PR number to resolve conflicts for"
            echo "  --repository     GitHub repository (owner/repo)"
            echo "  --github-token   GitHub token for API access"
            echo "  --verbose        Enable verbose output"
            echo "  --help           Show this help message"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate required arguments
if [[ -z "$PR_NUMBER" ]] || [[ -z "$REPOSITORY" ]] || [[ -z "$GITHUB_TOKEN" ]]; then
    log_error "Missing required arguments. Use --help for usage information."
    exit 1
fi

# Load merge rules configuration
load_merge_rules() {
    local rules_file="$REPO_ROOT/.github/merge-rules.yaml"
    if [[ -f "$rules_file" ]]; then
        log_info "Loading merge rules from $rules_file"
        # Parse YAML using Python for simplicity
        python3 -c "
import yaml
import sys
try:
    with open('$rules_file', 'r') as f:
        rules = yaml.safe_load(f)
    if 'policy' in rules:
        policy = rules['policy']
        print(f'LOCKFILE_REGENERATE={policy.get(\"lockfile_regenerate\", True)}')
        print(f'REGENERATE_COMMANDS={policy.get(\"regenerate_commands\", [])}')
        print(f'FORMATTING_COMMANDS={policy.get(\"formatting_commands\", [])}')
        print(f'BUILD_COMMANDS={policy.get(\"build_commands\", [])}')
        print(f'GENERATED_ASSETS={policy.get(\"generated_assets\", [])}')
except Exception as e:
    print(f'Error loading merge rules: {e}', file=sys.stderr)
    sys.exit(1)
"
    else
        log_warning "Merge rules file not found, using defaults"
        echo "LOCKFILE_REGENERATE=true"
        echo "REGENERATE_COMMANDS=[]"
        echo "FORMATTING_COMMANDS=[]"
        echo "BUILD_COMMANDS=[]"
        echo "GENERATED_ASSETS=[]"
    fi
}

# Setup Git configuration
setup_git() {
    log_info "Setting up Git configuration"
    
    git config user.name "github-actions[bot]"
    git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
    git config pull.rebase true
    git config merge.renamelimit 9999
    
    # Fetch all branches and tags
    git fetch --all --prune --tags
}

# Get PR information
get_pr_info() {
    local pr_number="$1"
    local api_url="https://api.github.com/repos/$REPOSITORY/pulls/$pr_number"
    
    log_info "Fetching PR information for #$pr_number"
    
    local response
    response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
                     -H "Accept: application/vnd.github.v3+json" \
                     "$api_url")
    
    if [[ $? -ne 0 ]]; then
        log_error "Failed to fetch PR information"
        return 1
    fi
    
    # Extract PR details
    local head_ref
    local base_ref
    local head_sha
    
    head_ref=$(echo "$response" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(data['head']['ref'])
" 2>/dev/null)
    
    base_ref=$(echo "$response" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(data['base']['ref'])
" 2>/dev/null)
    
    head_sha=$(echo "$response" | python3 -c "
import json, sys
data = json.load(sys.stdin)
print(data['head']['sha'])
" 2>/dev/null)
    
    if [[ -z "$head_ref" ]] || [[ -z "$base_ref" ]] || [[ -z "$head_sha" ]]; then
        log_error "Failed to extract PR information"
        return 1
    fi
    
    echo "$head_ref|$base_ref|$head_sha"
}

# Checkout PR branch
checkout_pr_branch() {
    local head_ref="$1"
    local head_sha="$2"
    
    log_info "Checking out PR branch: $head_ref"
    
    # Check if branch exists locally
    if git show-ref --verify --quiet "refs/remotes/origin/$head_ref"; then
        git checkout -B "$head_ref" "origin/$head_ref"
    else
        # Fetch the specific commit
        git fetch origin "$head_sha"
        git checkout -B "$head_ref" "$head_sha"
    fi
    
    log_success "Checked out PR branch: $head_ref"
}

# Detect file types for conflict resolution
detect_file_types() {
    local conflicted_files="$1"
    local lockfiles=()
    local generated=()
    local formatting=()
    local documentation=()
    
    while IFS= read -r file; do
        if [[ -z "$file" ]]; then
            continue
        fi
        
        # Detect lockfiles
        if [[ "$file" =~ \.(lock|sum)$ ]] || [[ "$file" == "package-lock.json" ]] || \
           [[ "$file" == "yarn.lock" ]] || [[ "$file" == "pnpm-lock.yaml" ]] || \
           [[ "$file" == "poetry.lock" ]] || [[ "$file" == "Pipfile.lock" ]] || \
           [[ "$file" == "Gemfile.lock" ]] || [[ "$file" == "Cargo.lock" ]] || \
           [[ "$file" == "go.sum" ]]; then
            lockfiles+=("$file")
        # Detect generated assets
        elif [[ "$file" =~ /(dist|build|node_modules)/ ]] || \
             [[ "$file" =~ \.(snap|lock)$ ]] || \
             [[ "$file" =~ /(docs/_build|openapi|protobuf)/ ]]; then
            generated+=("$file")
        # Detect formatting files
        elif [[ "$file" =~ \.(js|ts|jsx|tsx|py|go|rs|java|kt|swift)$ ]] || \
             [[ "$file" =~ \.(md|txt|rst)$ ]]; then
            formatting+=("$file")
        # Detect documentation
        elif [[ "$file" =~ \.(md|txt|rst|adoc)$ ]] || \
             [[ "$file" =~ /(docs|documentation|README)/ ]]; then
            documentation+=("$file")
        fi
    done <<< "$conflicted_files"
    
    echo "LOCKFILES:${lockfiles[*]:-}"
    echo "GENERATED:${generated[*]:-}"
    echo "FORMATTING:${formatting[*]:-}"
    echo "DOCUMENTATION:${documentation[*]:-}"
}

# Resolve conflicts using heuristics
resolve_conflicts_heuristics() {
    local conflicted_files="$1"
    local file_types="$2"
    
    log_info "Resolving conflicts using intelligent heuristics"
    
    # Parse file types
    local lockfiles
    local generated
    local formatting
    local documentation
    
    while IFS= read -r line; do
        case "$line" in
            LOCKFILES:*)
                lockfiles="${line#LOCKFILES:}"
                ;;
            GENERATED:*)
                generated="${line#GENERATED:}"
                ;;
            FORMATTING:*)
                formatting="${line#FORMATTING:}"
                ;;
            DOCUMENTATION:*)
                documentation="${line#DOCUMENTATION:}"
                ;;
        esac
    done <<< "$file_types"
    
    # Handle lockfiles - prefer base and regenerate
    if [[ -n "$lockfiles" ]]; then
        log_info "Handling lockfile conflicts: $lockfiles"
        for file in $lockfiles; do
            if [[ -f "$file" ]]; then
                log_info "Resolving lockfile: $file"
                git checkout --ours "$file"
                git add "$file"
            fi
        done
        
        # Regenerate lockfiles if configured
        if [[ "$LOCKFILE_REGENERATE" == "true" ]]; then
            log_info "Regenerating lockfiles"
            for cmd in "${REGENERATE_COMMANDS[@]}"; do
                if [[ -n "$cmd" ]]; then
                    log_info "Running: $cmd"
                    eval "$cmd" || log_warning "Command failed: $cmd"
                fi
            done
        fi
    fi
    
    # Handle generated assets - prefer base
    if [[ -n "$generated" ]]; then
        log_info "Handling generated asset conflicts: $generated"
        for file in $generated; do
            if [[ -f "$file" ]]; then
                log_info "Resolving generated file: $file"
                git checkout --ours "$file"
                git add "$file"
            fi
        done
    fi
    
    # Handle formatting conflicts - use patience merge
    if [[ -n "$formatting" ]]; then
        log_info "Handling formatting conflicts: $formatting"
        # These will be resolved by the patience merge strategy
    fi
    
    # Handle documentation conflicts - prefer incoming
    if [[ -n "$documentation" ]]; then
        log_info "Handling documentation conflicts: $documentation"
        for file in $documentation; do
            if [[ -f "$file" ]]; then
                log_info "Resolving documentation: $file"
                git checkout --theirs "$file"
                git add "$file"
            fi
        done
    fi
}

# Attempt clean rebase
attempt_clean_rebase() {
    local base_ref="$1"
    
    log_info "Attempting clean rebase onto $base_ref"
    
    if git rebase "origin/$base_ref"; then
        log_success "Clean rebase successful"
        return 0
    else
        log_warning "Clean rebase failed, conflicts detected"
        return 1
    fi
}

# Resolve conflicts with patience merge
resolve_with_patience() {
    local base_ref="$1"
    
    log_info "Attempting patience merge strategy"
    
    # Abort any ongoing rebase
    git rebase --abort 2>/dev/null || true
    
    # Try patience merge
    if git merge -X patience "origin/$base_ref"; then
        log_success "Patience merge successful"
        return 0
    else
        log_warning "Patience merge failed"
        return 1
    fi
}

# Resolve conflicts with theirs strategy
resolve_with_theirs() {
    local base_ref="$1"
    
    log_info "Attempting merge with -X theirs strategy"
    
    # Abort any ongoing merge
    git merge --abort 2>/dev/null || true
    
    # Try theirs merge
    if git merge -X theirs "origin/$base_ref"; then
        log_success "Theirs merge successful"
        return 0
    else
        log_warning "Theirs merge failed"
        return 1
    fi
}

# Resolve conflicts with ours strategy
resolve_with_ours() {
    local base_ref="$1"
    
    log_info "Attempting merge with -X ours strategy"
    
    # Abort any ongoing merge
    git merge --abort 2>/dev/null || true
    
    # Try ours merge
    if git merge -X ours "origin/$base_ref"; then
        log_success "Ours merge successful"
        return 0
    else
        log_warning "Ours merge failed"
        return 1
    fi
}

# Verify resolution with build and tests
verify_resolution() {
    log_info "Verifying conflict resolution with build and tests"
    
    # Run formatting commands if configured
    if [[ ${#FORMATTING_COMMANDS[@]} -gt 0 ]]; then
        log_info "Running formatting commands"
        for cmd in "${FORMATTING_COMMANDS[@]}"; do
            if [[ -n "$cmd" ]]; then
                log_info "Running: $cmd"
                eval "$cmd" || log_warning "Formatting command failed: $cmd"
            fi
        done
    fi
    
    # Run build and test commands if configured
    if [[ ${#BUILD_COMMANDS[@]} -gt 0 ]]; then
        log_info "Running build and test commands"
        for cmd in "${FORMATTING_COMMANDS[@]}"; do
            if [[ -n "$cmd" ]]; then
                log_info "Running: $cmd"
                if eval "$cmd"; then
                    log_success "Build/test command successful: $cmd"
                else
                    log_error "Build/test command failed: $cmd"
                    return 1
                fi
            fi
        done
    fi
    
    log_success "Conflict resolution verification passed"
    return 0
}

# Push resolved branch
push_resolved_branch() {
    local head_ref="$1"
    
    log_info "Pushing resolved branch: $head_ref"
    
    if git push --force-with-lease origin "$head_ref"; then
        log_success "Successfully pushed resolved branch"
        return 0
    else
        log_error "Failed to push resolved branch"
        return 1
    fi
}

# Main conflict resolution function
resolve_conflicts() {
    local pr_number="$1"
    local head_ref="$2"
    local base_ref="$3"
    
    log_info "Starting conflict resolution for PR #$pr_number"
    log_info "Head branch: $head_ref"
    log_info "Base branch: $base_ref"
    
    # Setup Git
    setup_git
    
    # Checkout PR branch
    checkout_pr_branch "$head_ref" "$head_sha"
    
    # Try clean rebase first
    if attempt_clean_rebase "$base_ref"; then
        log_success "Conflicts resolved with clean rebase"
        return 0
    fi
    
    # Get list of conflicted files
    local conflicted_files
    conflicted_files=$(git diff --name-only --diff-filter=U)
    
    if [[ -z "$conflicted_files" ]]; then
        log_success "No conflicts detected after rebase"
        return 0
    fi
    
    log_info "Conflicts detected in: $conflicted_files"
    
    # Detect file types for heuristic resolution
    local file_types
    file_types=$(detect_file_types "$conflicted_files")
    
    # Apply heuristic resolution
    resolve_conflicts_heuristics "$conflicted_files" "$file_types"
    
    # Try patience merge
    if resolve_with_patience "$base_ref"; then
        log_success "Conflicts resolved with patience merge"
    else
        # Try theirs strategy
        if resolve_with_theirs "$base_ref"; then
            log_success "Conflicts resolved with theirs strategy"
        else
            # Try ours strategy as last resort
            if resolve_with_ours "$base_ref"; then
                log_success "Conflicts resolved with ours strategy"
            else
                log_error "All conflict resolution strategies failed"
                return 1
            fi
        fi
    fi
    
    # Verify resolution
    if ! verify_resolution; then
        log_error "Conflict resolution verification failed"
        return 1
    fi
    
    # Push resolved branch
    if ! push_resolved_branch "$head_ref"; then
        log_error "Failed to push resolved branch"
        return 1
    fi
    
    log_success "Conflict resolution completed successfully"
    return 0
}

# Main execution
main() {
    log_info "🚀 Starting smart conflict resolution for PR #$PR_NUMBER"
    
    # Load merge rules
    eval "$(load_merge_rules)"
    
    # Get PR information
    local pr_info
    pr_info=$(get_pr_info "$PR_NUMBER")
    
    if [[ $? -ne 0 ]]; then
        log_error "Failed to get PR information"
        exit 1
    fi
    
    # Parse PR info
    IFS='|' read -r head_ref base_ref head_sha <<< "$pr_info"
    
    # Resolve conflicts
    if resolve_conflicts "$PR_NUMBER" "$head_ref" "$base_ref"; then
        log_success "🎉 Conflict resolution completed successfully for PR #$PR_NUMBER"
        exit 0
    else
        log_error "💥 Conflict resolution failed for PR #$PR_NUMBER"
        exit 1
    fi
}

# Run main function
main "$@"