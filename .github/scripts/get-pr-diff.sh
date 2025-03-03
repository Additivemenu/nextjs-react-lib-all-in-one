#!/bin/bash

# Script to extract PR diff information
# Usage: ./get-pr-diff.sh BASE_SHA HEAD_SHA [MAX_FILES]

BASE_SHA=$1
HEAD_SHA=$2
MAX_FILES=$3
OUTPUT_FILE="pr_diff.txt"

echo "Comparing $BASE_SHA to $HEAD_SHA"

# Display file changes with status
echo "==== FILE CHANGES WITH STATUS ===="
git diff --name-status --diff-filter=ACMRTD $BASE_SHA $HEAD_SHA

# Get all changed files with their change count
echo -e "\n==== GETTING CHANGE COUNTS ===="
CHANGED_FILES_WITH_COUNT=$(git diff --numstat --diff-filter=ACMRTD $BASE_SHA $HEAD_SHA | sort -rn | awk '{print $1 + $2 " " $3}')
echo "$CHANGED_FILES_WITH_COUNT"

# Extract just the filenames, sorted by change count
CHANGED_FILES=$(echo "$CHANGED_FILES_WITH_COUNT" | awk '{print $2}')
echo -e "\n==== ALL CHANGED FILES (SORTED BY CHANGES) ===="
echo "$CHANGED_FILES"

# Filter for code files
CODE_FILES=$(echo "$CHANGED_FILES" | grep -E '\.(js|ts|jsx|tsx|py|java|c|cpp|go|rb|php|cs)$' || true)
echo -e "\n==== DETECTED CODE FILES ===="
echo "$CODE_FILES"

# If MAX_FILES is specified, limit the number of files
if [ -n "$MAX_FILES" ] && [ "$MAX_FILES" -gt 0 ]; then
  echo -e "\n==== LIMITING TO TOP $MAX_FILES FILES ===="
  CODE_FILES=$(echo "$CODE_FILES" | head -n "$MAX_FILES")
  echo "$CODE_FILES"
fi

# Save the files list
echo "files=$(echo "$CODE_FILES" | tr '\n' ' ')" >> "$GITHUB_OUTPUT"
echo "all_files=$(echo "$CHANGED_FILES" | tr '\n' ' ')" >> "$GITHUB_OUTPUT"

# Process each code file
DIFF_TEXT=""
if [ -n "$CODE_FILES" ]; then
  echo "Processing code files..."
  
  # Get the statuses of all files
  FILE_STATUSES=$(git diff --name-status --diff-filter=ACMRTD $BASE_SHA $HEAD_SHA)
  
  # Process each file
  for file in $CODE_FILES; do
    # Get file status (A=Added, M=Modified, D=Deleted, etc.)
    FILE_STATUS=$(echo "$FILE_STATUSES" | grep -E "^[ACMRTD]\s+$file$" | cut -f1)
    echo "Processing $file (Status: $FILE_STATUS)"
    
    # Get number of changes for this file
    CHANGES=$(echo "$CHANGED_FILES_WITH_COUNT" | grep "$file" | awk '{print $1}')
    echo "Number of changes: $CHANGES"
    
    # Handle file based on its status
    if [ "$FILE_STATUS" = "A" ]; then
      # Added (new) file - show full file content with diff markers
      echo "Getting content of new file: $file"
      FILE_CONTENT=$(cat "$file")
      FILE_DIFF=$(echo -e "# NEW FILE (Changes: $CHANGES)\n\n$FILE_CONTENT" | sed 's/^/+ /')
    elif [ "$FILE_STATUS" = "D" ]; then
      # Deleted file - show what was deleted with diff markers
      echo "Getting content of deleted file: $file"
      FILE_CONTENT=$(git show "$BASE_SHA:$file" 2>/dev/null || echo "Could not retrieve content of deleted file")
      FILE_DIFF=$(echo -e "# DELETED FILE (Changes: $CHANGES)\n\n$FILE_CONTENT" | sed 's/^/- /')
    elif [ "$FILE_STATUS" = "M" ] || [ "$FILE_STATUS" = "R" ] || [ "$FILE_STATUS" = "T" ]; then
      # Modified file - get proper diff with context
      echo "Getting diff for modified file: $file"
      FILE_DIFF=$(echo -e "# MODIFIED FILE (Changes: $CHANGES)\n"; git diff --patch --unified=3 "$BASE_SHA" "$HEAD_SHA" -- "$file")
    else
      # Other cases - get proper diff with context
      echo "Getting diff for file: $file"
      FILE_DIFF=$(echo -e "# OTHER CHANGE (Changes: $CHANGES)\n"; git diff --patch --unified=3 "$BASE_SHA" "$HEAD_SHA" -- "$file")
    fi
    
    # Add the file diff to the overall diff text with proper formatting
    DIFF_TEXT="${DIFF_TEXT}

File: ${file}
\`\`\`diff
${FILE_DIFF}
\`\`\`"
  done
else
  echo "No matching code files were changed in this PR."
  
  # List all changes for context
  DIFF_TEXT="No code files matching the filter were found in this PR. Here are all changed files:

$(git diff --name-status --diff-filter=ACMRTD $BASE_SHA $HEAD_SHA)"
fi

# Write the diff to a file
echo "$DIFF_TEXT" > "$OUTPUT_FILE"
echo "Saved diff content to $OUTPUT_FILE ($(wc -l $OUTPUT_FILE | awk '{print $1}') lines)"

# Output the diff for GitHub Actions
echo "diff<<EOF" >> "$GITHUB_OUTPUT"
echo "$DIFF_TEXT" >> "$GITHUB_OUTPUT"
echo "EOF" >> "$GITHUB_OUTPUT"