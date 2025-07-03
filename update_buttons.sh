#!/bin/bash

# Script to update all button padding to py-0 and add whitespace-nowrap

echo "Updating button padding across the codebase..."

# Find all React files
find src -name "*.jsx" -o -name "*.js" -o -name "*.tsx" -o -name "*.ts" | while read file; do
    echo "Processing: $file"
    
    # Update common button patterns
    sed -i 's/px-[0-9] py-1 /px-\1 py-0 whitespace-nowrap /g' "$file"
    sed -i 's/px-[0-9] py-2 /px-\1 py-0 whitespace-nowrap /g' "$file"
    sed -i 's/px-[0-9] py-3 /px-\1 py-0 whitespace-nowrap /g' "$file"
    sed -i 's/px-[0-9] py-4 /px-\1 py-0 whitespace-nowrap /g' "$file"
    
    # Update patterns with different order
    sed -i 's/py-1 px-/py-0 whitespace-nowrap px-/g' "$file"
    sed -i 's/py-2 px-/py-0 whitespace-nowrap px-/g' "$file"
    sed -i 's/py-3 px-/py-0 whitespace-nowrap px-/g' "$file"
    sed -i 's/py-4 px-/py-0 whitespace-nowrap px-/g' "$file"
    
    # Update patterns in template literals
    sed -i 's/px-[0-9] py-1 rounded/px-\1 py-0 rounded whitespace-nowrap/g' "$file"
    sed -i 's/px-[0-9] py-2 rounded/px-\1 py-0 rounded whitespace-nowrap/g' "$file"
    sed -i 's/px-[0-9] py-3 rounded/px-\1 py-0 rounded whitespace-nowrap/g' "$file"
    sed -i 's/px-[0-9] py-4 rounded/px-\1 py-0 rounded whitespace-nowrap/g' "$file"
done

echo "Button padding update complete!"