#!/usr/bin/env python3
"""
Smart PR Labeler for Autonomous Repository Management
Automatically categorizes PRs for optimal autonomous processing.
"""

import argparse
import logging
import os
import re
import sys
from typing import Dict, List, Optional, Set

import requests
from github import Github, GithubException

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SmartPRLabeler:
    """Intelligently labels PRs for optimal autonomous processing."""
    
    def __init__(self, config: Dict):
        self.config = config
        self.github = Github(config['github_token'])
        self.repo = self.github.get_repo(config['repository'])
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'token {config["github_token"]}',
            'Accept': 'application/vnd.github.v3+json'
        })
        
        # Define label categories and their rules
        self.label_rules = {
            'priority': {
                'urgent': ['critical', 'urgent', 'hotfix', 'security', 'breaking'],
                'high': ['feature', 'enhancement', 'performance', 'bug'],
                'medium': ['documentation', 'refactor', 'test', 'chore'],
                'low': ['typo', 'formatting', 'style', 'minor']
            },
            'type': {
                'feature': ['feature', 'feat', 'enhancement', 'improvement'],
                'bugfix': ['bug', 'fix', 'bugfix', 'hotfix', 'patch'],
                'documentation': ['docs', 'documentation', 'readme', 'guide'],
                'refactor': ['refactor', 'refactoring', 'cleanup', 'restructure'],
                'test': ['test', 'testing', 'spec', 'coverage'],
                'chore': ['chore', 'maintenance', 'deps', 'dependency'],
                'security': ['security', 'vulnerability', 'cve', 'auth'],
                'performance': ['performance', 'optimization', 'speed', 'efficiency']
            },
            'scope': {
                'frontend': ['ui', 'ux', 'frontend', 'client', 'react', 'vue', 'angular'],
                'backend': ['api', 'backend', 'server', 'database', 'db'],
                'infrastructure': ['infra', 'infrastructure', 'deploy', 'ci', 'cd', 'docker'],
                'mobile': ['mobile', 'ios', 'android', 'react-native'],
                'desktop': ['desktop', 'electron', 'native', 'app'],
                'library': ['lib', 'library', 'package', 'module', 'sdk']
            },
            'complexity': {
                'simple': ['typo', 'formatting', 'style', 'minor', 'docs'],
                'moderate': ['bugfix', 'refactor', 'test', 'chore'],
                'complex': ['feature', 'enhancement', 'performance', 'security'],
                'major': ['breaking', 'architectural', 'migration', 'rewrite']
            },
            'automation': {
                'auto-merge': ['auto-merge', 'automerge', 'ready'],
                'needs-review': ['needs-review', 'review', 'manual'],
                'no-auto': ['no-auto', 'manual-merge', 'human-required'],
                'wip': ['wip', 'work-in-progress', 'draft', 'not-ready']
            }
        }
        
        # Define file-based labeling rules
        self.file_patterns = {
            'frontend': [r'\.(js|jsx|ts|tsx|vue|svelte)$', r'/(src|components|pages|styles)/', r'package\.json'],
            'backend': [r'\.(py|java|go|rs|php|rb)$', r'/(api|server|controllers|models)/', r'requirements\.txt'],
            'infrastructure': [r'\.(tf|yaml|yml|dockerfile|sh)$', r'/(infra|terraform|k8s|docker)/'],
            'mobile': [r'\.(swift|kt|dart)$', r'/(ios|android|mobile)/'],
            'documentation': [r'\.(md|rst|txt|adoc)$', r'/(docs|documentation|guides)/'],
            'test': [r'\.(test|spec)\.(js|ts|py|java|go)$', r'/(tests|specs|__tests__)/'],
            'security': [r'\.(lock|sum)$', r'/(security|auth|permissions)/', r'cve-', r'vulnerability']
        }
    
    def label_pr(self, pr_number: int, action: str = 'labeled') -> bool:
        """Label a PR based on its content and metadata."""
        try:
            logger.info(f"🏷️ Labeling PR #{pr_number} (action: {action})")
            
            # Get PR information
            pr = self.repo.get_pull(pr_number)
            if not pr:
                logger.error(f"❌ Could not find PR #{pr_number}")
                return False
            
            # Analyze PR content
            analysis = self._analyze_pr(pr)
            
            # Determine appropriate labels
            labels_to_add = self._determine_labels(analysis)
            labels_to_remove = self._determine_labels_to_remove(pr, analysis)
            
            # Apply labels
            if labels_to_add:
                self._add_labels(pr, labels_to_add)
            
            if labels_to_remove:
                self._remove_labels(pr, labels_to_remove)
            
            # Update PR description with label summary
            self._update_pr_description(pr, analysis, labels_to_add)
            
            logger.info(f"✅ Successfully labeled PR #{pr_number}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error labeling PR #{pr_number}: {e}")
            return False
    
    def _analyze_pr(self, pr) -> Dict:
        """Analyze PR content to determine appropriate labels."""
        analysis = {
            'title': pr.title.lower(),
            'body': pr.body.lower() if pr.body else '',
            'files': [],
            'commits': [],
            'labels': [label.name for label in pr.labels],
            'user': pr.user.login,
            'is_draft': pr.draft,
            'is_ready': not pr.draft and pr.mergeable_state != 'draft'
        }
        
        # Analyze changed files
        try:
            files = pr.get_files()
            for file in files:
                analysis['files'].append({
                    'name': file.filename,
                    'status': file.status,
                    'additions': file.additions,
                    'deletions': file.deletions,
                    'changes': file.changes
                })
        except Exception as e:
            logger.warning(f"⚠️ Could not analyze files: {e}")
        
        # Analyze commits
        try:
            commits = pr.get_commits()
            for commit in commits:
                analysis['commits'].append({
                    'message': commit.commit.message.lower(),
                    'author': commit.author.login if commit.author else 'unknown'
                })
        except Exception as e:
            logger.warning(f"⚠️ Could not analyze commits: {e}")
        
        return analysis
    
    def _determine_labels(self, analysis: Dict) -> List[str]:
        """Determine which labels to add based on PR analysis."""
        labels_to_add = []
        
        # Priority labels
        priority = self._determine_priority(analysis)
        if priority:
            labels_to_add.append(priority)
        
        # Type labels
        pr_type = self._determine_type(analysis)
        if pr_type:
            labels_to_add.append(pr_type)
        
        # Scope labels
        scope = self._determine_scope(analysis)
        if scope:
            labels_to_add.append(scope)
        
        # Complexity labels
        complexity = self._determine_complexity(analysis)
        if complexity:
            labels_to_add.append(complexity)
        
        # Automation labels
        automation = self._determine_automation(analysis)
        if automation:
            labels_to_add.append(automation)
        
        # Special case labels
        special_labels = self._determine_special_labels(analysis)
        labels_to_add.extend(special_labels)
        
        # Remove duplicates
        return list(set(labels_to_add))
    
    def _determine_priority(self, analysis: Dict) -> Optional[str]:
        """Determine priority based on PR content."""
        title = analysis['title']
        body = analysis['body']
        
        # Check for urgent indicators
        if any(keyword in title or keyword in body for keyword in self.label_rules['priority']['urgent']):
            return 'urgent'
        
        # Check for high priority indicators
        if any(keyword in title or keyword in body for keyword in self.label_rules['priority']['high']):
            return 'high'
        
        # Check for low priority indicators
        if any(keyword in title or keyword in body for keyword in self.label_rules['priority']['low']):
            return 'low'
        
        # Default to medium
        return 'medium'
    
    def _determine_type(self, analysis: Dict) -> Optional[str]:
        """Determine PR type based on content."""
        title = analysis['title']
        body = analysis['body']
        
        # Check each type category
        for pr_type, keywords in self.label_rules['type'].items():
            if any(keyword in title or keyword in body for keyword in keywords):
                return pr_type
        
        # Default based on file changes
        if analysis['files']:
            if any('test' in file['name'].lower() for file in analysis['files']):
                return 'test'
            elif any('docs' in file['name'].lower() for file in analysis['files']):
                return 'documentation'
            elif any('package.json' in file['name'] for file in analysis['files']):
                return 'chore'
        
        return 'enhancement'  # Default type
    
    def _determine_scope(self, analysis: Dict) -> Optional[str]:
        """Determine PR scope based on file changes."""
        if not analysis['files']:
            return None
        
        file_names = [file['name'] for file in analysis['files']]
        
        # Check each scope pattern
        for scope, patterns in self.file_patterns.items():
            for pattern in patterns:
                if any(re.search(pattern, file_name, re.IGNORECASE) for file_name in file_names):
                    return scope
        
        return None
    
    def _determine_complexity(self, analysis: Dict) -> Optional[str]:
        """Determine PR complexity."""
        title = analysis['title']
        body = analysis['body']
        
        # Check for major/complex indicators
        if any(keyword in title or keyword in body for keyword in ['breaking', 'architectural', 'migration', 'rewrite']):
            return 'major'
        
        # Check for complex indicators
        if any(keyword in title or keyword in body for keyword in ['feature', 'enhancement', 'performance', 'security']):
            return 'complex'
        
        # Check for simple indicators
        if any(keyword in title or keyword in body for keyword in ['typo', 'formatting', 'style', 'minor']):
            return 'simple'
        
        # Default to moderate
        return 'moderate'
    
    def _determine_automation(self, analysis: Dict) -> Optional[str]:
        """Determine automation labels."""
        # Check for WIP indicators
        if analysis['is_draft'] or 'wip' in analysis['title'] or 'work in progress' in analysis['title']:
            return 'wip'
        
        # Check for no-auto indicators
        if any(keyword in analysis['title'] or keyword in analysis['body'] for keyword in ['manual', 'human', 'review required']):
            return 'needs-review'
        
        # Check if PR is ready for auto-merge
        if analysis['is_ready'] and not any(label in analysis['labels'] for label in ['no-auto', 'needs-review', 'wip']):
            return 'auto-merge'
        
        return None
    
    def _determine_special_labels(self, analysis: Dict) -> List[str]:
        """Determine special case labels."""
        special_labels = []
        
        # Security-related
        if any(keyword in analysis['title'] or keyword in analysis['body'] for keyword in ['security', 'vulnerability', 'cve']):
            special_labels.append('security')
        
        # Breaking changes
        if any(keyword in analysis['title'] or keyword in analysis['body'] for keyword in ['breaking', 'breaking-change', 'major']):
            special_labels.append('breaking-change')
        
        # Dependencies
        if any('package.json' in file['name'] for file in analysis['files']):
            special_labels.append('dependencies')
        
        # Performance
        if any(keyword in analysis['title'] or keyword in analysis['body'] for keyword in ['performance', 'optimization', 'speed']):
            special_labels.append('performance')
        
        # Accessibility
        if any(keyword in analysis['title'] or keyword in analysis['body'] for keyword in ['accessibility', 'a11y', 'screen-reader']):
            special_labels.append('accessibility')
        
        return special_labels
    
    def _determine_labels_to_remove(self, pr, analysis: Dict) -> List[str]:
        """Determine which labels should be removed."""
        labels_to_remove = []
        current_labels = [label.name for label in pr.labels]
        
        # Remove conflicting labels
        if 'wip' in current_labels and analysis['is_ready']:
            labels_to_remove.append('wip')
        
        if 'needs-review' in current_labels and 'auto-merge' in analysis.get('labels', []):
            labels_to_remove.append('needs-review')
        
        return labels_to_remove
    
    def _add_labels(self, pr, labels: List[str]) -> bool:
        """Add labels to a PR."""
        try:
            if not labels:
                return True
            
            # Get existing labels to avoid duplicates
            existing_labels = [label.name for label in pr.labels]
            new_labels = [label for label in labels if label not in existing_labels]
            
            if new_labels:
                pr.add_to_labels(*new_labels)
                logger.info(f"✅ Added labels: {', '.join(new_labels)}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error adding labels: {e}")
            return False
    
    def _remove_labels(self, pr, labels: List[str]) -> bool:
        """Remove labels from a PR."""
        try:
            if not labels:
                return True
            
            for label in labels:
                try:
                    pr.remove_from_labels(label)
                    logger.info(f"✅ Removed label: {label}")
                except Exception as e:
                    logger.warning(f"⚠️ Could not remove label {label}: {e}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error removing labels: {e}")
            return False
    
    def _update_pr_description(self, pr, analysis: Dict, labels_added: List[str]) -> bool:
        """Update PR description with label summary."""
        try:
            if not labels_added:
                return True
            
            # Create label summary
            label_summary = f"""
## 🤖 Auto-Labeling Summary

This PR has been automatically labeled by the Smart PR Labeler:

**Labels Added:** {', '.join(labels_added)}
**Analysis:** {self._generate_analysis_summary(analysis)}

---
*Labels are automatically managed by the autonomous system. Use `[skip-auto]` in commit messages to disable.*
"""
            
            # Check if description already has auto-labeling section
            current_body = pr.body or ''
            if '## 🤖 Auto-Labeling Summary' not in current_body:
                new_body = current_body + label_summary
                pr.edit(body=new_body)
                logger.info("✅ Updated PR description with label summary")
            
            return True
            
        except Exception as e:
            logger.warning(f"⚠️ Could not update PR description: {e}")
            return False
    
    def _generate_analysis_summary(self, analysis: Dict) -> str:
        """Generate a human-readable analysis summary."""
        summary_parts = []
        
        if analysis['is_draft']:
            summary_parts.append("Draft PR")
        elif analysis['is_ready']:
            summary_parts.append("Ready for review")
        
        if analysis['files']:
            file_count = len(analysis['files'])
            total_changes = sum(file['changes'] for file in analysis['files'])
            summary_parts.append(f"{file_count} files changed ({total_changes} total changes)")
        
        if analysis['commits']:
            commit_count = len(analysis['commits'])
            summary_parts.append(f"{commit_count} commits")
        
        return "; ".join(summary_parts) if summary_parts else "Standard PR"
    
    def create_missing_labels(self) -> bool:
        """Create any missing labels that the system needs."""
        try:
            logger.info("🏷️ Creating missing labels...")
            
            # Get existing labels
            existing_labels = {label.name for label in self.repo.get_labels()}
            
            # Define required labels with colors and descriptions
            required_labels = {
                'urgent': {'color': 'ff0000', 'description': 'High priority, requires immediate attention'},
                'high': {'color': 'ff6b6b', 'description': 'High priority'},
                'medium': {'color': 'ffd93d', 'description': 'Medium priority'},
                'low': {'color': '6bcf7f', 'description': 'Low priority'},
                'feature': {'color': '0e8a16', 'description': 'New feature or enhancement'},
                'bugfix': {'color': 'd73a4a', 'description': 'Bug fix'},
                'documentation': {'color': '0075ca', 'description': 'Documentation changes'},
                'refactor': {'color': 'fbca04', 'description': 'Code refactoring'},
                'test': {'color': '0052cc', 'description': 'Test changes'},
                'chore': {'color': '5319e7', 'description': 'Maintenance tasks'},
                'security': {'color': 'ff0000', 'description': 'Security-related changes'},
                'performance': {'color': '00ff00', 'description': 'Performance improvements'},
                'frontend': {'color': '1d76db', 'description': 'Frontend changes'},
                'backend': {'color': '0e8a16', 'description': 'Backend changes'},
                'infrastructure': {'color': '5319e7', 'description': 'Infrastructure changes'},
                'mobile': {'color': 'ff6b6b', 'description': 'Mobile app changes'},
                'simple': {'color': '6bcf7f', 'description': 'Simple changes'},
                'moderate': {'color': 'ffd93d', 'description': 'Moderate complexity'},
                'complex': {'color': 'ff6b6b', 'description': 'Complex changes'},
                'major': {'color': 'ff0000', 'description': 'Major changes'},
                'auto-merge': {'color': '00ff00', 'description': 'Ready for automatic merge'},
                'needs-review': {'color': 'ffd93d', 'description': 'Requires human review'},
                'no-auto': {'color': 'ff0000', 'description': 'Do not auto-merge'},
                'wip': {'color': 'ff6b6b', 'description': 'Work in progress'},
                'breaking-change': {'color': 'ff0000', 'description': 'Breaking changes'},
                'dependencies': {'color': '5319e7', 'description': 'Dependency updates'},
                'accessibility': {'color': '00ff00', 'description': 'Accessibility improvements'}
            }
            
            created_count = 0
            for label_name, label_config in required_labels.items():
                if label_name not in existing_labels:
                    try:
                        self.repo.create_label(
                            name=label_name,
                            color=label_config['color'],
                            description=label_config['description']
                        )
                        created_count += 1
                        logger.info(f"✅ Created label: {label_name}")
                    except Exception as e:
                        logger.warning(f"⚠️ Could not create label {label_name}: {e}")
            
            logger.info(f"✅ Created {created_count} missing labels")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error creating missing labels: {e}")
            return False

def load_config() -> Dict:
    """Load configuration from environment variables."""
    config = {
        'github_token': os.environ.get('GITHUB_TOKEN'),
        'repository': os.environ.get('GITHUB_REPOSITORY')
    }
    
    return config

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Smart PR Labeler for Autonomous Repository Management')
    parser.add_argument('--repository', required=True, help='GitHub repository (owner/repo)')
    parser.add_argument('--pr-number', required=True, type=int, help='PR number to label')
    parser.add_argument('--action', default='labeled', help='GitHub action that triggered labeling')
    parser.add_argument('--create-labels', action='store_true', help='Create missing labels')
    
    args = parser.parse_args()
    
    # Set environment variables for config
    os.environ['GITHUB_REPOSITORY'] = args.repository
    
    # Load configuration
    config = load_config()
    
    # Validate required configuration
    if not config['github_token']:
        logger.error("❌ GITHUB_TOKEN environment variable is required")
        sys.exit(1)
    
    if not config['repository']:
        logger.error("❌ GITHUB_REPOSITORY environment variable is required")
        sys.exit(1)
    
    # Create labeler
    labeler = SmartPRLabeler(config)
    
    try:
        # Create missing labels if requested
        if args.create_labels:
            if not labeler.create_missing_labels():
                logger.error("❌ Failed to create missing labels")
                sys.exit(1)
        
        # Label the PR
        if labeler.label_pr(args.pr_number, args.action):
            logger.info("🎉 PR labeling completed successfully")
        else:
            logger.error("❌ Failed to label PR")
            sys.exit(1)
        
    except Exception as e:
        logger.error(f"❌ Fatal error in smart labeler: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()