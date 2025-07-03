#!/usr/bin/env python3

import os
import re
import glob

def update_button_patterns(file_path):
    """Update button padding patterns in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Common button patterns to update
        patterns = [
            # px-X py-Y patterns
            (r'px-(\d+)\s+py-[1-9]\d*\s+', r'px-\1 py-0 whitespace-nowrap '),
            (r'py-[1-9]\d*\s+px-(\d+)\s+', r'py-0 whitespace-nowrap px-\1 '),
            
            # Specific button class patterns
            (r'px-(\d+)\s+py-[1-9]\d*\s+rounded', r'px-\1 py-0 rounded whitespace-nowrap'),
            (r'py-[1-9]\d*\s+px-(\d+)\s+rounded', r'py-0 whitespace-nowrap px-\1 rounded'),
            
            # Template literal patterns
            (r'px-(\d+)\s+py-[1-9]\d*\s+rounded-lg', r'px-\1 py-0 rounded-lg whitespace-nowrap'),
            (r'px-(\d+)\s+py-[1-9]\d*\s+rounded-xl', r'px-\1 py-0 rounded-xl whitespace-nowrap'),
            (r'px-(\d+)\s+py-[1-9]\d*\s+rounded-full', r'px-\1 py-0 rounded-full whitespace-nowrap'),
            
            # Button with text-sm
            (r'px-(\d+)\s+py-[1-9]\d*\s+rounded-lg\s+text-sm', r'px-\1 py-0 rounded-lg text-sm whitespace-nowrap'),
            (r'px-(\d+)\s+py-[1-9]\d*\s+text-sm', r'px-\1 py-0 text-sm whitespace-nowrap'),
        ]
        
        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path}")
            return True
        return False
        
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    # Find all React files
    react_files = []
    for pattern in ['src/**/*.jsx', 'src/**/*.js', 'src/**/*.tsx', 'src/**/*.ts']:
        react_files.extend(glob.glob(pattern, recursive=True))
    
    updated_count = 0
    for file_path in react_files:
        if update_button_patterns(file_path):
            updated_count += 1
    
    print(f"\nUpdated {updated_count} files with button pattern changes")

if __name__ == "__main__":
    main()