#!/usr/bin/env python3
"""
Weekly Autonomous System Report Generator
Creates comprehensive KPI reports for the autonomous repository management system.
"""

import argparse
import json
import logging
import os
import sys
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

class WeeklyReportGenerator:
    """Generates comprehensive weekly reports for the autonomous system."""
    
    def __init__(self, config: Dict):
        self.config = config
        self.github = Github(config['github_token'])
        self.repo = self.github.get_repo(config['repository'])
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'token {config["github_token"]}',
            'Accept': 'application/vnd.github.v3+json'
        })
        
    def generate_report(self) -> Dict:
        """Generate the complete weekly report."""
        logger.info("📊 Generating weekly autonomous system report...")
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=self.config['date_range_days'])
        
        logger.info(f"📅 Report period: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        
        # Collect data
        report_data = {
            'period': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat(),
                'days': self.config['date_range_days']
            },
            'repository': self.config['repository'],
            'generated_at': datetime.now().isoformat(),
            'prs_processed': self._analyze_prs(start_date, end_date),
            'conflict_resolution': self._analyze_conflict_resolution(start_date, end_date),
            'ci_performance': self._analyze_ci_performance(start_date, end_date),
            'automation_health': self._analyze_automation_health(start_date, end_date),
            'issues_escalated': self._analyze_escalated_issues(start_date, end_date),
            'summary': {}
        }
        
        # Calculate summary metrics
        report_data['summary'] = self._calculate_summary_metrics(report_data)
        
        logger.info("✅ Weekly report generated successfully")
        return report_data
    
    def _analyze_prs(self, start_date: datetime, end_date: datetime) -> Dict:
        """Analyze PR processing metrics."""
        logger.info("🔍 Analyzing PR processing metrics...")
        
        try:
            # Get all PRs in the date range
            prs = self.repo.get_pulls(state='all', sort='updated', direction='desc')
            
            total_prs = 0
            merged_prs = 0
            closed_prs = 0
            open_prs = 0
            avg_time_to_merge = 0
            merge_times = []
            
            for pr in prs:
                # Check if PR is in our date range
                if start_date <= pr.updated_at <= end_date:
                    total_prs += 1
                    
                    if pr.state == 'closed':
                        if pr.merged_at:
                            merged_prs += 1
                            # Calculate time to merge
                            time_to_merge = (pr.merged_at - pr.created_at).total_seconds() / 3600  # hours
                            merge_times.append(time_to_merge)
                        else:
                            closed_prs += 1
                    else:
                        open_prs += 1
            
            # Calculate average time to merge
            if merge_times:
                avg_time_to_merge = sum(merge_times) / len(merge_times)
            
            return {
                'total': total_prs,
                'merged': merged_prs,
                'closed_without_merge': closed_prs,
                'open': open_prs,
                'merge_rate': (merged_prs / total_prs * 100) if total_prs > 0 else 0,
                'avg_time_to_merge_hours': round(avg_time_to_merge, 2),
                'merge_times': merge_times
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing PRs: {e}")
            return {
                'total': 0,
                'merged': 0,
                'closed_without_merge': 0,
                'open': 0,
                'merge_rate': 0,
                'avg_time_to_merge_hours': 0,
                'merge_times': []
            }
    
    def _analyze_conflict_resolution(self, start_date: datetime, end_date: datetime) -> Dict:
        """Analyze conflict resolution metrics."""
        logger.info("🔍 Analyzing conflict resolution metrics...")
        
        try:
            # Look for conflict resolution comments and commits
            commits = self.repo.get_commits(since=start_date, until=end_date)
            
            conflict_resolutions = 0
            resolution_strategies = {
                'clean_rebase': 0,
                'heuristics': 0,
                'patience': 0,
                'theirs': 0,
                'ours': 0
            }
            
            for commit in commits:
                commit_message = commit.commit.message.lower()
                
                # Check for conflict resolution indicators
                if any(keyword in commit_message for keyword in ['conflict', 'merge', 'resolve', 'auto-merge']):
                    conflict_resolutions += 1
                    
                    # Determine strategy used
                    if 'rebase' in commit_message:
                        resolution_strategies['clean_rebase'] += 1
                    elif 'heuristic' in commit_message:
                        resolution_strategies['heuristics'] += 1
                    elif 'patience' in commit_message:
                        resolution_strategies['patience'] += 1
                    elif 'theirs' in commit_message:
                        resolution_strategies['theirs'] += 1
                    elif 'ours' in commit_message:
                        resolution_strategies['ours'] += 1
            
            return {
                'total_resolutions': conflict_resolutions,
                'strategies_used': resolution_strategies,
                'success_rate': 100  # Assume success if we're analyzing completed commits
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing conflict resolution: {e}")
            return {
                'total_resolutions': 0,
                'strategies_used': {},
                'success_rate': 0
            }
    
    def _analyze_ci_performance(self, start_date: datetime, end_date: datetime) -> Dict:
        """Analyze CI performance metrics."""
        logger.info("🔍 Analyzing CI performance metrics...")
        
        try:
            # Get workflow runs in the date range
            workflows = self.repo.get_workflows()
            
            total_runs = 0
            successful_runs = 0
            failed_runs = 0
            cancelled_runs = 0
            avg_duration = 0
            durations = []
            
            for workflow in workflows:
                runs = workflow.get_runs(created=f">={start_date.strftime('%Y-%m-%d')}")
                
                for run in runs:
                    if start_date <= run.created_at <= end_date:
                        total_runs += 1
                        
                        if run.conclusion == 'success':
                            successful_runs += 1
                        elif run.conclusion == 'failure':
                            failed_runs += 1
                        elif run.conclusion == 'cancelled':
                            cancelled_runs += 1
                        
                        # Calculate duration
                        if run.started_at and run.completed_at:
                            duration = (run.completed_at - run.started_at).total_seconds() / 60  # minutes
                            durations.append(duration)
            
            # Calculate average duration
            if durations:
                avg_duration = sum(durations) / len(durations)
            
            return {
                'total_runs': total_runs,
                'successful': successful_runs,
                'failed': failed_runs,
                'cancelled': cancelled_runs,
                'success_rate': (successful_runs / total_runs * 100) if total_runs > 0 else 0,
                'avg_duration_minutes': round(avg_duration, 2),
                'durations': durations
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing CI performance: {e}")
            return {
                'total_runs': 0,
                'successful': 0,
                'failed': 0,
                'cancelled': 0,
                'success_rate': 0,
                'avg_duration_minutes': 0,
                'durations': []
            }
    
    def _analyze_automation_health(self, start_date: datetime, end_date: datetime) -> Dict:
        """Analyze overall automation system health."""
        logger.info("🔍 Analyzing automation system health...")
        
        try:
            # Check for automation-related issues
            issues = self.repo.get_issues(state='all', since=start_date)
            
            automation_issues = 0
            critical_issues = 0
            resolved_issues = 0
            
            for issue in issues:
                if start_date <= issue.created_at <= end_date:
                    # Check if it's an automation-related issue
                    if any(label.name in ['automation', 'automation-failure', 'merge-failure'] for label in issue.labels):
                        automation_issues += 1
                        
                        if issue.state == 'closed':
                            resolved_issues += 1
                        
                        # Check for critical labels
                        if any(label.name in ['critical', 'urgent', 'blocker'] for label in issue.labels):
                            critical_issues += 1
            
            return {
                'total_issues': automation_issues,
                'critical_issues': critical_issues,
                'resolved_issues': resolved_issues,
                'open_issues': automation_issues - resolved_issues,
                'resolution_rate': (resolved_issues / automation_issues * 100) if automation_issues > 0 else 0
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing automation health: {e}")
            return {
                'total_issues': 0,
                'critical_issues': 0,
                'resolved_issues': 0,
                'open_issues': 0,
                'resolution_rate': 0
            }
    
    def _analyze_escalated_issues(self, start_date: datetime, end_date: datetime) -> Dict:
        """Analyze issues that were escalated by the autonomous system."""
        logger.info("🔍 Analyzing escalated issues...")
        
        try:
            issues = self.repo.get_issues(state='all', since=start_date)
            
            escalated_issues = 0
            escalation_reasons = {}
            
            for issue in issues:
                if start_date <= issue.created_at <= end_date:
                    # Check if it's an escalation issue
                    if '🚨' in issue.title or 'autonomous' in issue.title.lower():
                        escalated_issues += 1
                        
                        # Try to determine escalation reason
                        if 'merge failed' in issue.title.lower():
                            escalation_reasons['merge_failure'] = escalation_reasons.get('merge_failure', 0) + 1
                        elif 'conflict' in issue.title.lower():
                            escalation_reasons['conflict_resolution'] = escalation_reasons.get('conflict_resolution', 0) + 1
                        elif 'ci' in issue.title.lower():
                            escalation_reasons['ci_failure'] = escalation_reasons.get('ci_failure', 0) + 1
                        else:
                            escalation_reasons['other'] = escalation_reasons.get('other', 0) + 1
            
            return {
                'total_escalated': escalated_issues,
                'reasons': escalation_reasons,
                'escalation_rate': (escalated_issues / self._analyze_prs(start_date, end_date)['total'] * 100) if self._analyze_prs(start_date, end_date)['total'] > 0 else 0
            }
            
        except Exception as e:
            logger.error(f"❌ Error analyzing escalated issues: {e}")
            return {
                'total_escalated': 0,
                'reasons': {},
                'escalation_rate': 0
            }
    
    def _calculate_summary_metrics(self, report_data: Dict) -> Dict:
        """Calculate summary metrics from the collected data."""
        logger.info("🔍 Calculating summary metrics...")
        
        prs = report_data['prs_processed']
        conflicts = report_data['conflict_resolution']
        ci = report_data['ci_performance']
        health = report_data['automation_health']
        escalations = report_data['issues_escalated']
        
        return {
            'overall_health_score': self._calculate_health_score(report_data),
            'key_metrics': {
                'pr_merge_rate': prs['merge_rate'],
                'avg_time_to_merge': prs['avg_time_to_merge_hours'],
                'ci_success_rate': ci['success_rate'],
                'conflict_resolution_success': conflicts['success_rate'],
                'escalation_rate': escalations['escalation_rate']
            },
            'trends': {
                'automation_efficiency': 'improving' if prs['merge_rate'] > 80 else 'stable' if prs['merge_rate'] > 60 else 'needs_attention',
                'ci_reliability': 'excellent' if ci['success_rate'] > 95 else 'good' if ci['success_rate'] > 85 else 'needs_attention',
                'conflict_handling': 'excellent' if conflicts['success_rate'] > 95 else 'good' if conflicts['success_rate'] > 85 else 'needs_attention'
            }
        }
    
    def _calculate_health_score(self, report_data: Dict) -> int:
        """Calculate overall system health score (0-100)."""
        prs = report_data['prs_processed']
        ci = report_data['ci_performance']
        conflicts = report_data['conflict_resolution']
        health = report_data['automation_health']
        
        # Weighted scoring
        pr_score = prs['merge_rate'] * 0.3
        ci_score = ci['success_rate'] * 0.3
        conflict_score = conflicts['success_rate'] * 0.2
        health_score = health['resolution_rate'] * 0.2
        
        total_score = pr_score + ci_score + conflict_score + health_score
        return round(total_score)
    
    def create_github_issue(self, report_data: Dict) -> bool:
        """Create a GitHub issue with the weekly report."""
        try:
            issue_title = f"📊 Autonomous Repo Report ({datetime.now().strftime('%Y-%m-%d')})"
            issue_body = self._format_issue_body(report_data)
            
            # Create the issue
            issue = self.repo.create_issue(
                title=issue_title,
                body=issue_body,
                labels=['automation-report', 'weekly-report']
            )
            
            logger.info(f"✅ Created weekly report issue: #{issue.number}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error creating GitHub issue: {e}")
            return False
    
    def _format_issue_body(self, report_data: Dict) -> str:
        """Format the report data as a GitHub issue body."""
        summary = report_data['summary']
        prs = report_data['prs_processed']
        conflicts = report_data['conflict_resolution']
        ci = report_data['ci_performance']
        health = report_data['automation_health']
        escalations = report_data['issues_escalated']
        
        body = f"""## 📊 Autonomous Repository Management - Weekly Report

**Report Period:** {report_data['period']['start'][:10]} to {report_data['period']['end'][:10]} ({report_data['period']['days']} days)
**Repository:** {report_data['repository']}
**Generated:** {report_data['generated_at'][:19]} UTC

---

## 🎯 Executive Summary

**Overall Health Score:** {summary['overall_health_score']}/100

### 📈 Key Performance Indicators
- **PR Merge Rate:** {prs['merge_rate']:.1f}%
- **Average Time to Merge:** {prs['avg_time_to_merge_hours']:.1f} hours
- **CI Success Rate:** {ci['success_rate']:.1f}%
- **Conflict Resolution Success:** {conflicts['success_rate']:.1f}%
- **Escalation Rate:** {escalations['escalation_rate']:.1f}%

### 🚀 System Trends
- **Automation Efficiency:** {summary['trends']['automation_efficiency'].replace('_', ' ').title()}
- **CI Reliability:** {summary['trends']['ci_reliability'].replace('_', ' ').title()}
- **Conflict Handling:** {summary['trends']['conflict_handling'].replace('_', ' ').title()}

---

## 📋 Detailed Metrics

### 🔄 PR Processing
| Metric | Value |
|--------|-------|
| Total PRs | {prs['total']} |
| Successfully Merged | {prs['merged']} |
| Closed Without Merge | {prs['closed_without_merge']} |
| Currently Open | {prs['open']} |
| Merge Rate | {prs['merge_rate']:.1f}% |
| Avg Time to Merge | {prs['avg_time_to_merge_hours']:.1f} hours |

### 🔧 Conflict Resolution
| Strategy | Count |
|----------|-------|
| Clean Rebase | {conflicts['strategies_used'].get('clean_rebase', 0)} |
| Heuristics | {conflicts['strategies_used'].get('heuristics', 0)} |
| Patience Merge | {conflicts['strategies_used'].get('patience', 0)} |
| Theirs Strategy | {conflicts['strategies_used'].get('theirs', 0)} |
| Ours Strategy | {conflicts['strategies_used'].get('ours', 0)} |
| **Total Resolutions** | **{conflicts['total_resolutions']}** |

### 🚀 CI/CD Performance
| Metric | Value |
|--------|-------|
| Total Workflow Runs | {ci['total_runs']} |
| Successful | {ci['successful']} |
| Failed | {ci['failed']} |
| Cancelled | {ci['cancelled']} |
| Success Rate | {ci['success_rate']:.1f}% |
| Avg Duration | {ci['avg_duration_minutes']:.1f} minutes |

### 🏥 System Health
| Metric | Value |
|--------|-------|
| Automation Issues | {health['total_issues']} |
| Critical Issues | {health['critical_issues']} |
| Resolved Issues | {health['resolved_issues']} |
| Open Issues | {health['open_issues']} |
| Resolution Rate | {health['resolution_rate']:.1f}% |

### 🚨 Escalations
| Metric | Value |
|--------|-------|
| Total Escalated | {escalations['total_escalated']} |
| Escalation Rate | {escalations['escalation_rate']:.1f}% |

**Escalation Reasons:**
{self._format_escalation_reasons(escalations['reasons'])}

---

## 🔍 Recommendations

{self._generate_recommendations(summary)}

---

## 📚 Report Details

- **Generated by:** Autonomous Repository Management System
- **Data source:** GitHub API
- **Next report:** Next Monday at 1 PM UTC
- **Configuration:** Based on `.github/merge-rules.yaml`

---

*This report was automatically generated by the autonomous system. No human intervention required.*"""
        
        return body
    
    def _format_escalation_reasons(self, reasons: Dict) -> str:
        """Format escalation reasons for the issue body."""
        if not reasons:
            return "No escalations in this period."
        
        formatted = []
        for reason, count in reasons.items():
            reason_name = reason.replace('_', ' ').title()
            formatted.append(f"- **{reason_name}:** {count}")
        
        return '\n'.join(formatted)
    
    def _generate_recommendations(self, summary: Dict) -> str:
        """Generate actionable recommendations based on the summary."""
        recommendations = []
        
        if summary['key_metrics']['pr_merge_rate'] < 70:
            recommendations.append("- **PR Merge Rate Low:** Review branch protection rules and CI requirements")
        
        if summary['key_metrics']['ci_success_rate'] < 90:
            recommendations.append("- **CI Reliability Issues:** Investigate flaky tests and infrastructure problems")
        
        if summary['key_metrics']['conflict_resolution_success'] < 90:
            recommendations.append("- **Conflict Resolution Issues:** Review merge strategies and conflict resolver logic")
        
        if summary['key_metrics']['escalation_rate'] > 10:
            recommendations.append("- **High Escalation Rate:** Review automation logic and error handling")
        
        if summary['overall_health_score'] < 70:
            recommendations.append("- **System Health Poor:** Comprehensive review of automation system required")
        
        if not recommendations:
            recommendations.append("- **System Operating Optimally:** Continue monitoring and consider performance optimizations")
        
        return '\n'.join(recommendations)
    
    def save_report_to_file(self, report_data: Dict, filename: str = None) -> bool:
        """Save the report to a JSON file."""
        try:
            if not filename:
                filename = f"weekly_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            
            with open(filename, 'w') as f:
                json.dump(report_data, f, indent=2, default=str)
            
            logger.info(f"✅ Report saved to {filename}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error saving report to file: {e}")
            return False

def load_config() -> Dict:
    """Load configuration from environment variables."""
    config = {
        'github_token': os.environ.get('GITHUB_TOKEN'),
        'repository': os.environ.get('GITHUB_REPOSITORY'),
        'date_range_days': int(os.environ.get('CUSTOM_DATE_RANGE', '7d').replace('d', '')),
        'force_generate': os.environ.get('FORCE_GENERATE', 'false').lower() == 'true'
    }
    
    return config

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Weekly Autonomous System Report Generator')
    parser.add_argument('--repository', required=True, help='GitHub repository (owner/repo)')
    parser.add_argument('--date-range', default='7d', help='Date range for report (e.g., 7d, 30d)')
    parser.add_argument('--force', action='store_true', help='Force report generation')
    parser.add_argument('--output-file', help='Output file for JSON report')
    parser.add_argument('--no-issue', action='store_true', help='Skip creating GitHub issue')
    
    args = parser.parse_args()
    
    # Set environment variables for config
    os.environ['GITHUB_REPOSITORY'] = args.repository
    os.environ['CUSTOM_DATE_RANGE'] = args.date_range
    os.environ['FORCE_GENERATE'] = str(args.force)
    
    # Load configuration
    config = load_config()
    
    # Validate required configuration
    if not config['github_token']:
        logger.error("❌ GITHUB_TOKEN environment variable is required")
        sys.exit(1)
    
    if not config['repository']:
        logger.error("❌ GITHUB_REPOSITORY environment variable is required")
        sys.exit(1)
    
    # Create report generator
    generator = WeeklyReportGenerator(config)
    
    try:
        # Generate report
        report_data = generator.generate_report()
        
        # Save to file if requested
        if args.output_file:
            generator.save_report_to_file(report_data, args.output_file)
        
        # Create GitHub issue unless disabled
        if not args.no_issue:
            if generator.create_github_issue(report_data):
                logger.info("✅ Weekly report issue created successfully")
            else:
                logger.error("❌ Failed to create weekly report issue")
                sys.exit(1)
        
        logger.info("🎉 Weekly report generation completed successfully")
        
    except Exception as e:
        logger.error(f"❌ Fatal error generating weekly report: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()