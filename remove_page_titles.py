#!/usr/bin/env python3

import os
import re
import glob

def remove_page_titles_from_file(file_path):
    """Remove page titles (h1-h6 elements) from a JSX file"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Common page title patterns to remove
    patterns_to_remove = [
        # Page titles with various classes
        r'<h[1-6][^>]*className="[^"]*page-title[^"]*"[^>]*>.*?</h[1-6]>',
        r'<h[1-6][^>]*className="[^"]*main-title[^"]*"[^>]*>.*?</h[1-6]>',
        r'<h[1-6][^>]*className="[^"]*title[^"]*"[^>]*>.*?</h[1-6]>',
        
        # Headers with specific text patterns
        r'<h[1-6][^>]*>\s*(?:Welcome to|Page Title|Main Title|Dashboard|Portal|Center|Platform|Demo|Showcase|Explorer|Search|Builder|Creator|Manager|Panel|Hub|Guide|Rules|Tournament|Matchmaking|Game|Card|Deck|Battle|Live|Enhanced|Advanced|Mobile|Unified|Comprehensive|Streamlined|Industry|Singularity|Organization|Player|Judge|Admin|AI|Consciousness|KONIVRER|KonivrER)[^<]*</h[1-6]>',
        
        # Generic page headers
        r'<h1[^>]*>\s*[^<]*(?:Page|Dashboard|Portal|Center|Platform|Demo|Showcase|Explorer|Search|Builder|Creator|Manager|Panel|Hub|Guide|Rules|Tournament|Matchmaking|Game|Card|Deck|Battle|Live|Enhanced|Advanced|Mobile|Unified|Comprehensive|Streamlined|Industry|Singularity|Organization|Player|Judge|Admin|AI|Consciousness|KONIVRER|KonivrER)[^<]*\s*</h1>',
        
        # Headers that are clearly page titles (standalone h1-h3 elements)
        r'<h[1-3][^>]*>\s*[A-Z][^<]{10,80}\s*</h[1-3]>(?=\s*(?:<div|<section|<main|<article|<p|<ul|<ol|<form|<table|$))',
        
        # Headers with common page title words
        r'<h[1-6][^>]*>\s*(?:Welcome|Dashboard|Portal|Center|Platform|Demo|Showcase|Explorer|Search|Builder|Creator|Manager|Panel|Hub|Guide|Rules|Tournament|Matchmaking|Game|Card|Deck|Battle|Live|Enhanced|Advanced|Mobile|Unified|Comprehensive|Streamlined|Industry|Singularity|Organization|Player|Judge|Admin|AI|Consciousness|KONIVRER|KonivrER)\s*</h[1-6]>',
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
    """Remove page titles from all JSX files in src/pages"""
    
    pages_dir = 'src/pages'
    jsx_files = glob.glob(f'{pages_dir}/*.jsx')
    
    modified_files = []
    
    for file_path in jsx_files:
        # Skip backup files
        if 'backup' in file_path.lower():
            continue
            
        print(f"Processing {file_path}...")
        
        if remove_page_titles_from_file(file_path):
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