#!/bin/bash

# Fix self-closing label tags
find /workspace/KONIVRER-deck-database/src -name "*.tsx" -exec sed -i 's|<label\(.*\) />|<label\1></label>|g' {} \;

# Fix self-closing div tags
find /workspace/KONIVRER-deck-database/src -name "*.tsx" -exec sed -i 's|<div\(.*\) />|<div\1></div>|g' {} \;

# Fix self-closing p tags
find /workspace/KONIVRER-deck-database/src -name "*.tsx" -exec sed -i 's|<p\(.*\) />|<p\1></p>|g' {} \;

# Fix self-closing span tags
find /workspace/KONIVRER-deck-database/src -name "*.tsx" -exec sed -i 's|<span\(.*\) />|<span\1></span>|g' {} \;

# Fix self-closing button tags
find /workspace/KONIVRER-deck-database/src -name "*.tsx" -exec sed -i 's|<button\(.*\) />|<button\1></button>|g' {} \;

echo "Fixed JSX syntax in all component files"