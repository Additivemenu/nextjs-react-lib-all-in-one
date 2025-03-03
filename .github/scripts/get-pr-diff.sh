
#!/bin/bash

# Script to extract PR diff information
# Usage: ./get-pr-diff.sh BASE_SHA HEAD_SHA

BASE_SHA=$1
HEAD_SHA=$2
OUTPUT_FILE="pr_diff.txt"

echo "Comparing $BASE_SHA to $HEAD_SHA"

# Display file changes with status
echo "==== FILE CHANGES WITH STATUS ===="
git diff --name-status --diff-filter=ACMRTD $BASE_SHA $HEAD_SHA

# Get all changed files
CHANGED_FILES=$(git diff --name-only --diff-filter=ACMRTD $BASE_SHA $HEAD_SHA)
echo -e "\n==== ALL CHANGED FILES ===="
echo "$CHANGED_FILES"

# Filter for code files
CODE_FILES=$(echo "$CHANGED_FILES" | grep -E '\.(js|ts|jsx|tsx|py|java|c|cpp|go|rb|php|cs)$' || true)
echo -e "\n==== DETECTED CODE FILES ===="
echo "$CODE_FILES"

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
    
    # Handle file based on its status
    if [ "$FILE_STATUS" = "A" ]; then
      # Added (new) file - get content from PR branch
      echo "Getting content of new file: $file"
      FILE_DIFF="# NEW FILE\n\n$(cat $file)"
    elif [ "$FILE_STATUS" = "D" ]; then
      # Deleted file - get content from base branch
      echo "Getting content of deleted file: $file"
      FILE_DIFF="# DELETED FILE\n\n$(git show $BASE_SHA:$file || echo 'Could not retrieve content of deleted file')"
    elif [ "$FILE_STATUS" = "M" ] || [ "$FILE_STATUS" = "R" ] || [ "$FILE_STATUS" = "T" ]; then
      # Modified, renamed, or changed type - get diff
      echo "Getting diff for modified file: $file"
      FILE_DIFF="$(git diff $BASE_SHA $HEAD_SHA -- $file)"
    else
      # Other cases (copy, etc.) - get diff
      echo "Getting diff for file: $file"
      FILE_DIFF="$(git diff $BASE_SHA $HEAD_SHA -- $file || cat $file)"
    fi
    
    # Add the file diff to the overall diff text with proper formatting
    DIFF_TEXT="${DIFF_TEXT}

File: ${file}
\`\`\`
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