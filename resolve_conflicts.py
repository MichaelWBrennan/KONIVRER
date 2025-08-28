#!/usr/bin/env python3
"""
Script to automatically resolve merge conflicts by choosing the main branch version
and removing incorrect TypeScript syntax from the HEAD branch.
"""
import os
import re
import subprocess
from pathlib import Path

def get_conflicted_files():
    """Get list of files with unresolved merge conflicts."""
    try:
        result = subprocess.run(['git', 'status', '--porcelain'], 
                              capture_output=True, text=True, check=True)
        conflicted_files = []
        for line in result.stdout.strip().split('\n'):
            if line.startswith('UU '):
                conflicted_files.append(line[3:])
        return conflicted_files
    except subprocess.CalledProcessError:
        return []

def resolve_conflicts_in_file(file_path):
    """Resolve conflicts in a single file by choosing main branch version."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match conflict markers with content
        conflict_pattern = re.compile(
            r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> main',
            re.DOTALL
        )
        
        # Replace conflicts by choosing the main branch version (group 2)
        def replace_conflict(match):
            head_content = match.group(1)
            main_content = match.group(2)
            
            # Always choose main content as it has correct TypeScript syntax
            return main_content
        
        # Apply the replacements
        resolved_content = conflict_pattern.sub(replace_conflict, content)
        
        # Write back the resolved content
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(resolved_content)
        
        print(f"Resolved conflicts in {file_path}")
        return True
        
    except Exception as e:
        print(f"Error resolving conflicts in {file_path}: {e}")
        return False

def main():
    """Main function to resolve all conflicts."""
    conflicted_files = get_conflicted_files()
    
    if not conflicted_files:
        print("No conflicted files found.")
        return
    
    print(f"Found {len(conflicted_files)} files with conflicts:")
    for file_path in conflicted_files:
        print(f"  - {file_path}")
    
    print("\nResolving conflicts...")
    
    resolved_count = 0
    for file_path in conflicted_files:
        if resolve_conflicts_in_file(file_path):
            resolved_count += 1
    
    print(f"\nResolved conflicts in {resolved_count}/{len(conflicted_files)} files.")
    
    # Add all resolved files to git
    try:
        subprocess.run(['git', 'add', '.'], check=True)
        print("Added all resolved files to git staging.")
    except subprocess.CalledProcessError as e:
        print(f"Error adding files to git: {e}")

if __name__ == "__main__":
    main()