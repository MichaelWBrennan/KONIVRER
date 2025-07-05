#!/usr/bin/env python3

import os
import re
import glob

def remove_all_headers_from_file(file_path):
    """Remove all h1-h6 elements from a JSX file"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Remove all h1-h6 elements (both self-closing and with content)
    patterns_to_remove = [
        # Headers with content
        r'<h[1-6][^>]*>.*?</h[1-6]>',
        # Self-closing headers (just in case)
        r'<h[1-6][^>]*/>',
    ]
    
    # Apply each pattern
    for pattern in patterns_to_remove:
        content = re.sub(pattern, '', content, flags=re.IGNORECASE | re.DOTALL)
    
    # Clean up extra whitespace left by removed headers
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    content = re.sub(r'^\s*\n', '', content, flags=re.MULTILINE)
    
    # Only write if content changed
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    """Remove all headers from all JSX files in src/pages"""
    
    pages_dir = 'src/pages'
    jsx_files = glob.glob(f'{pages_dir}/*.jsx')
    
    modified_files = []
    
    for file_path in jsx_files:
        # Skip backup files
        if 'backup' in file_path.lower():
            continue
            
        print(f"Processing {file_path}...")
        
        if remove_all_headers_from_file(file_path):
            modified_files.append(file_path)
            print(f"  ✓ Modified {file_path}")
        else:
            print(f"  - No changes needed for {file_path}")
    
    print(f"\nSummary:")
    print(f"Total files processed: {len(jsx_files)}")
    print(f"Files modified: {len(modified_files)}")
    
    if modified_files:
        print(f"\nModified files:")
        for file_path in modified_files:
            print(f"  - {file_path}")

if __name__ == '__main__':
    main()