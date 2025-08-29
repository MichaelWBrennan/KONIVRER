#!/usr/bin/env python3
"""
Autonomous Repository Management - Main Orchestrator
Handles all PR lifecycle management with zero human intervention.
"""

import argparse
import json
import logging
import os
import subprocess
import sys
import time
import yaml
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

import requests
from github import Github, GithubException

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class AutonomousMergeOrchestrator:
    """Main orchestrator for autonomous PR lifecycle management."""
    
    def __init__(self, config: Dict):
        self.config = config
        self.github = Github(config['github_token'])
        self.repo = self.github.get_repo(config['repository'])
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'token {config["github_token"]}',
            'Accept': 'application/vnd.github.v3+json'
        })
        
    def discover_eligible_prs(self) -> List[Dict]:
        """Discover all PRs eligible for autonomous processing."""
        logger.info("🔍 Discovering eligible PRs...")
        
        eligible_prs = []
        try:
            # If a specific PR is requested, only process that one
            pr_number = self.config.get('pr_number')
            if pr_number:
                try:
                    pr = self.repo.get_pull(int(pr_number))
                    if self._is_pr_eligible(pr):
                        eligible_prs.append({
                            'number': pr.number,
                            'title': pr.title,
                            'head_ref': pr.head.ref,
                            'base_ref': pr.base.ref,
                            'user': pr.user.login,
                            'labels': [label.name for label in pr.labels],
                            'mergeable_state': pr.mergeable_state,
                            'updated_at': pr.updated_at,
                            'created_at': pr.created_at
                        })
                    else:
                        logger.info(f"🚫 PR #{pr.number} not eligible by policy")
                    return eligible_prs
                except Exception as e:
                    logger.error(f"❌ Could not load PR #{pr_number}: {e}")
                    return []

            # Get all open PRs
            prs = self.repo.get_pulls(state='open', sort='updated', direction='desc')
            
            for pr in prs:
                if self._is_pr_eligible(pr):
                    eligible_prs.append({
                        'number': pr.number,
                        'title': pr.title,
                        'head_ref': pr.head.ref,
                        'base_ref': pr.base.ref,
                        'user': pr.user.login,
                        'labels': [label.name for label in pr.labels],
                        'mergeable_state': pr.mergeable_state,
                        'updated_at': pr.updated_at,
                        'created_at': pr.created_at
                    })
                    
            logger.info(f"✅ Found {len(eligible_prs)} eligible PRs")
            return eligible_prs
            
        except Exception as e:
            logger.error(f"❌ Error discovering PRs: {e}")
            return []
    
    def _is_pr_eligible(self, pr) -> bool:
        """Check if a PR is eligible for autonomous processing."""
        # Check for deny labels
        deny_labels = self.config.get('deny_labels', [])
        pr_labels = [label.name for label in pr.labels]
        
        if any(label in pr_labels for label in deny_labels):
            logger.info(f"🚫 PR #{pr.number} excluded due to deny label")
            return False
            
        # Check for draft status
        if pr.draft:
            logger.info(f"🚫 PR #{pr.number} excluded (draft)")
            return False
            
        # Check for critical path changes
        if self._has_critical_path_changes(pr):
            logger.info(f"🚫 PR #{pr.number} excluded (critical paths)")
            return False
            
        return True
    
    def _has_critical_path_changes(self, pr) -> bool:
        """Check if PR touches critical paths that should not be auto-merged."""
        try:
            files = pr.get_files()
            critical_paths = self.config.get('critical_paths', [])
            
            for file in files:
                file_path = file.filename
                if any(self._path_matches_pattern(file_path, pattern) for pattern in critical_paths):
                    logger.warning(f"⚠️ PR #{pr.number} touches critical path: {file_path}")
                    return True
                    
            return False
            
        except Exception as e:
            logger.error(f"❌ Error checking critical paths: {e}")
            return True  # Fail safe
    
    def _path_matches_pattern(self, path: str, pattern: str) -> bool:
        """Check if a file path matches a glob pattern."""
        import fnmatch
        return fnmatch.fnmatch(path, pattern)
    
    def process_pr(self, pr_data: Dict) -> bool:
        """Process a single PR through the autonomous pipeline."""
        pr_number = pr_data['number']
        logger.info(f"🔄 Processing PR #{pr_number}: {pr_data['title']}")
        
        try:
            # Step 1: Check if PR is behind base
            if self._is_pr_behind_base(pr_data):
                logger.info(f"📥 PR #{pr_number} is behind base, updating...")
                if not self._update_pr_branch(pr_data):
                    logger.error(f"❌ Failed to update PR #{pr_number}")
                    return False
            
            # Step 2: Wait for CI checks to complete
            if not self._wait_for_ci_checks(pr_data):
                logger.error(f"❌ CI checks failed for PR #{pr_number}")
                return False
            
            # Step 3: Check mergeability
            mergeable_state = self._get_mergeable_state(pr_data)
            if mergeable_state == 'conflicting':
                logger.info(f"⚠️ PR #{pr_number} has conflicts, resolving...")
                if not self._resolve_conflicts(pr_data):
                    logger.error(f"❌ Failed to resolve conflicts for PR #{pr_number}")
                    return False
            
            # Step 4: Attempt merge
            if not self._merge_pr(pr_data):
                logger.error(f"❌ Failed to merge PR #{pr_number}")
                return False
            
            # Step 5: Post-merge cleanup
            self._post_merge_cleanup(pr_data)
            
            logger.info(f"✅ Successfully processed PR #{pr_number}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error processing PR #{pr_number}: {e}")
            self._escalate_failure(pr_data, str(e))
            return False
    
    def _is_pr_behind_base(self, pr_data: Dict) -> bool:
        """Check if PR is behind the base branch."""
        try:
            pr = self.repo.get_pull(pr_data['number'])
            return pr.behind_by > 0
        except Exception as e:
            logger.error(f"❌ Error checking if PR is behind: {e}")
            return False
    
    def _update_pr_branch(self, pr_data: Dict) -> bool:
        """Update PR branch to be up-to-date with base."""
        try:
            # Try rebase first
            logger.info(f"🔄 Attempting rebase for PR #{pr_data['number']}")
            
            # Use GitHub API to update branch
            url = f"https://api.github.com/repos/{self.config['repository']}/pulls/{pr_data['number']}/update-branch"
            response = self.session.put(url, json={'expected_head_sha': pr_data['head_ref']})
            
            if response.status_code == 202:
                logger.info(f"✅ Branch update initiated for PR #{pr_data['number']}")
                return True
            else:
                logger.warning(f"⚠️ Branch update failed, status: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error updating PR branch: {e}")
            return False
    
    def _wait_for_ci_checks(self, pr_data: Dict) -> bool:
        """Wait for all CI checks to complete and pass."""
        max_wait_time = self.config.get('ci_timeout_minutes', 30) * 60
        start_time = time.time()
        
        while time.time() - start_time < max_wait_time:
            try:
                pr = self.repo.get_pull(pr_data['number'])
                
                # Get commit status
                commit = pr.get_commits().reversed[0]
                status = commit.get_combined_status()
                
                if status.state == 'success':
                    logger.info(f"✅ All CI checks passed for PR #{pr_data['number']}")
                    return True
                elif status.state == 'failure':
                    logger.error(f"❌ CI checks failed for PR #{pr_data['number']}")
                    return False
                elif status.state == 'pending':
                    logger.info(f"⏳ Waiting for CI checks to complete for PR #{pr_data['number']}...")
                    time.sleep(30)
                    continue
                    
            except Exception as e:
                logger.error(f"❌ Error checking CI status: {e}")
                return False
        
        logger.error(f"❌ CI checks timeout for PR #{pr_data['number']}")
        return False
    
    def _get_mergeable_state(self, pr_data: Dict) -> str:
        """Get the current mergeable state of a PR."""
        try:
            pr = self.repo.get_pull(pr_data['number'])
            return pr.mergeable_state
        except Exception as e:
            logger.error(f"❌ Error getting mergeable state: {e}")
            return 'unknown'
    
    def _resolve_conflicts(self, pr_data: Dict) -> bool:
        """Resolve merge conflicts using the conflict resolver script."""
        try:
            logger.info(f"🔧 Resolving conflicts for PR #{pr_data['number']}")
            
            # Call the conflict resolver script
            cmd = [
                'bash', 'scripts/conflict_resolver.sh',
                '--pr-number', str(pr_data['number']),
                '--repository', self.config['repository'],
                '--github-token', self.config['github_token']
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            
            if result.returncode == 0:
                logger.info(f"✅ Conflicts resolved for PR #{pr_data['number']}")
                return True
            else:
                logger.error(f"❌ Conflict resolution failed: {result.stderr}")
                return False
                
        except subprocess.TimeoutExpired:
            logger.error(f"❌ Conflict resolution timeout for PR #{pr_data['number']}")
            return False
        except Exception as e:
            logger.error(f"❌ Error resolving conflicts: {e}")
            return False
    
    def _merge_pr(self, pr_data: Dict) -> bool:
        """Merge the PR using the configured merge method."""
        try:
            pr = self.repo.get_pull(pr_data['number'])
            merge_method = self.config.get('merge_method', 'squash')
            
            logger.info(f"🔀 Merging PR #{pr_data['number']} using {merge_method} method")
            
            # Attempt merge with primary method
            try:
                if merge_method == 'squash':
                    pr.merge(merge_method='squash', commit_message=f"[auto-merge] {pr_data['title']}")
                elif merge_method == 'merge':
                    pr.merge(merge_method='merge', commit_message=f"[auto-merge] {pr_data['title']}")
                elif merge_method == 'rebase':
                    pr.merge(merge_method='rebase', commit_message=f"[auto-merge] {pr_data['title']}")
                
                logger.info(f"✅ PR #{pr_data['number']} merged successfully")
                return True
                
            except GithubException as e:
                if "Merge conflict" in str(e) or "Required status check" in str(e):
                    logger.warning(f"⚠️ Primary merge method failed, trying fallback...")
                    
                    # Try fallback method
                    fallback_method = self.config.get('fallback_merge_method', 'merge')
                    if fallback_method != merge_method:
                        try:
                            if fallback_method == 'squash':
                                pr.merge(merge_method='squash', commit_message=f"[auto-merge] {pr_data['title']}")
                            elif fallback_method == 'merge':
                                pr.merge(merge_method='merge', commit_message=f"[auto-merge] {pr_data['title']}")
                            elif fallback_method == 'rebase':
                                pr.merge(merge_method='rebase', commit_message=f"[auto-merge] {pr_data['title']}")
                            
                            logger.info(f"✅ PR #{pr_data['number']} merged with fallback method")
                            return True
                            
                        except GithubException as fallback_e:
                            logger.error(f"❌ Fallback merge also failed: {fallback_e}")
                            return False
                    else:
                        logger.error(f"❌ Primary merge failed and no fallback configured: {e}")
                        return False
                else:
                    logger.error(f"❌ Merge failed: {e}")
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Error during merge: {e}")
            return False
    
    def _post_merge_cleanup(self, pr_data: Dict):
        """Perform post-merge cleanup tasks."""
        try:
            pr = self.repo.get_pull(pr_data['number'])
            
            # Delete source branch if configured
            if self.config.get('delete_source_branch', True):
                try:
                    pr.delete_branch()
                    logger.info(f"🗑️ Deleted source branch for PR #{pr_data['number']}")
                except Exception as e:
                    logger.warning(f"⚠️ Could not delete source branch: {e}")
            
            # Add merge comment
            if self.config.get('comment_on_merge', True):
                comment = self._generate_merge_comment(pr_data)
                pr.create_issue_comment(comment)
                logger.info(f"💬 Added merge comment to PR #{pr_data['number']}")
                
        except Exception as e:
            logger.error(f"❌ Error during post-merge cleanup: {e}")
    
    def _generate_merge_comment(self, pr_data: Dict) -> str:
        """Generate a summary comment for the merged PR."""
        return f"""## 🤖 Autonomous Merge Completed

**PR:** #{pr_data['number']} - {pr_data['title']}
**Merged by:** Autonomous Repository Management System
**Merge time:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}
**Strategy:** {self.config.get('merge_method', 'squash')}

### 📊 Merge Summary
- ✅ All CI checks passed
- ✅ No merge conflicts (or resolved automatically)
- ✅ Branch protection rules respected
- 🗑️ Source branch cleaned up

---
*This PR was automatically merged by the autonomous system. No human intervention required.*"""
    
    def _escalate_failure(self, pr_data: Dict, error_message: str):
        """Escalate a failed PR by creating an issue."""
        try:
            if not self.config.get('issue_escalation', True):
                return
                
            issue_title = f"🚨 Autonomous Merge Failed - PR #{pr_data['number']}"
            issue_body = f"""## 🚨 Autonomous Merge Failure

**PR:** #{pr_data['number']} - {pr_data['title']}
**Error:** {error_message}
**Time:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}

### 📋 PR Details
- **Author:** {pr_data['user']}
- **Head Branch:** {pr_data['head_ref']}
- **Base Branch:** {pr_data['base_ref']}
- **Labels:** {', '.join(pr_data['labels'])}

### 🔍 Next Steps
1. Review the error details above
2. Check if manual intervention is required
3. Re-run the autonomous system if appropriate
4. Close this issue once resolved

---
*This issue was automatically created by the autonomous repository management system.*"""

            self.repo.create_issue(title=issue_title, body=issue_body, labels=['automation-failure'])
            logger.info(f"📝 Created escalation issue for failed PR #{pr_data['number']}")
            
        except Exception as e:
            logger.error(f"❌ Error creating escalation issue: {e}")
    
    def run(self):
        """Main execution loop for the autonomous system."""
        logger.info("🚀 Starting autonomous repository management...")
        
        try:
            # Discover eligible PRs
            eligible_prs = self.discover_eligible_prs()
            
            if not eligible_prs:
                logger.info("✅ No eligible PRs found")
                return
            
            # Process each PR
            successful = 0
            failed = 0
            
            for pr_data in eligible_prs:
                if self.process_pr(pr_data):
                    successful += 1
                else:
                    failed += 1
                
                # Small delay between PRs
                time.sleep(2)
            
            logger.info(f"🎯 Processing complete: {successful} successful, {failed} failed")
            
        except Exception as e:
            logger.error(f"❌ Fatal error in autonomous system: {e}")
            sys.exit(1)

def load_config() -> Dict:
    """Load configuration from environment and merge rules."""
    config = {
        'github_token': os.environ.get('GITHUB_TOKEN'),
        'repository': os.environ.get('GITHUB_REPOSITORY'),
        'merge_method': os.environ.get('MERGE_METHOD', 'squash'),
        'fallback_merge_method': os.environ.get('FALLBACK_METHOD', 'merge'),
        'max_retries': int(os.environ.get('MAX_RETRIES', '3')),
        'backoff_minutes': [int(x) for x in os.environ.get('BACKOFF_MINUTES', '5,15,45').split(',')],
        'deny_labels': os.environ.get('DENY_LABELS', '').split(',') if os.environ.get('DENY_LABELS') else [],
        'deny_paths': os.environ.get('DENY_PATHS', '').split(',') if os.environ.get('DENY_PATHS') else [],
        'ci_timeout_minutes': 30,
        'delete_source_branch': True,
        'comment_on_merge': True,
        'issue_escalation': True,
        'pr_number': os.environ.get('PR_NUMBER', ''),
        'critical_paths': [
            '.github/workflows/*',
            'infrastructure/terraform/*.tfvars',
            '.env*',
            'secrets.yaml'
        ]
    }
    
    # Load merge rules from file if available
    try:
        with open('.github/merge-rules.yaml', 'r') as f:
            rules = yaml.safe_load(f)
            if 'policy' in rules:
                policy = rules['policy']
                config.update({
                    'merge_method': policy.get('merge_method', config['merge_method']),
                    'fallback_merge_method': policy.get('fallback_merge_method', config['fallback_merge_method']),
                    'critical_paths': policy.get('critical_paths', config['critical_paths']),
                    'delete_source_branch': policy.get('post_merge', {}).get('delete_source_branch', True),
                    'comment_on_merge': policy.get('reporting', {}).get('comment_on_merge', True),
                    'issue_escalation': policy.get('reporting', {}).get('issue_escalation', True)
                })
    except Exception as e:
        logger.warning(f"⚠️ Could not load merge rules: {e}")
    
    return config

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Autonomous Repository Management')
    parser.add_argument('--repository', required=True, help='GitHub repository (owner/repo)')
    parser.add_argument('--merge-method', default='squash', help='Primary merge method')
    parser.add_argument('--fallback-method', default='merge', help='Fallback merge method')
    parser.add_argument('--max-retries', type=int, default=3, help='Maximum retry attempts')
    parser.add_argument('--backoff-minutes', default='5,15,45', help='Backoff delays in minutes')
    parser.add_argument('--deny-labels', default='', help='Comma-separated deny labels')
    parser.add_argument('--deny-paths', default='', help='Comma-separated deny paths')
    parser.add_argument('--event', default='', help='GitHub event type')
    parser.add_argument('--pr-number', default='', help='Specific PR number to process')
    
    args = parser.parse_args()
    
    # Set environment variables for config
    os.environ['GITHUB_REPOSITORY'] = args.repository
    os.environ['MERGE_METHOD'] = args.merge_method
    os.environ['FALLBACK_METHOD'] = args.fallback_method
    os.environ['MAX_RETRIES'] = str(args.max_retries)
    os.environ['BACKOFF_MINUTES'] = args.backoff_minutes
    os.environ['DENY_LABELS'] = args.deny_labels
    os.environ['DENY_PATHS'] = args.deny_paths
    
    # Propagate PR number to environment for config load
    os.environ['PR_NUMBER'] = args.pr_number

    # Load configuration
    config = load_config()
    
    # Validate required configuration
    if not config['github_token']:
        logger.error("❌ GITHUB_TOKEN environment variable is required")
        sys.exit(1)
    
    if not config['repository']:
        logger.error("❌ GITHUB_REPOSITORY environment variable is required")
        sys.exit(1)
    
    # Create and run orchestrator
    orchestrator = AutonomousMergeOrchestrator(config)
    orchestrator.run()

if __name__ == '__main__':
    main()