#!/bin/bash
# Git pre-commit hook to prevent secrets from being committed
# Install: cp scripts/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Running pre-commit checks..."

# Check for common secret patterns
SECRETS_PATTERN="(password|secret|token|api_key|private_key|DATABASE_URL)[\s]*=[\s]*['\"]?[a-zA-Z0-9]+"

if git diff --cached --name-only | xargs grep -E -i "$SECRETS_PATTERN" 2>/dev/null; then
  echo -e "${RED}❌ ERROR: Potential secret detected in staged files!${NC}"
  echo -e "${YELLOW}Remove secrets before committing. Use environment variables or Secret Manager.${NC}"
  exit 1
fi

# Check for large files (>5MB)
MAX_FILE_SIZE=5242880 # 5MB in bytes
while IFS= read -r file; do
  if [ -f "$file" ]; then
    size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
    if [ "$size" -gt "$MAX_FILE_SIZE" ]; then
      echo -e "${RED}❌ ERROR: File $file is larger than 5MB (${size} bytes)${NC}"
      echo -e "${YELLOW}Consider using Git LFS or storing in external storage.${NC}"
      exit 1
    fi
  fi
done < <(git diff --cached --name-only)

# Run Biome lint
echo "✅ Running Biome lint..."
npm run lint --silent

# Validate Prisma schema if changed
if git diff --cached --name-only | grep -q "prisma/schema.prisma"; then
  echo "✅ Validating Prisma schema..."
  npx prisma validate
fi

echo "✅ Pre-commit checks passed!"
exit 0
