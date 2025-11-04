# Configuration variables
clear

cd mathew.api
dotnet build
cd ..
#!/bin/bash

# Configuration variables
SFTP_USER="site40393"
SFTP_HOST="site40393.siteasp.net"
REMOTE_PATH="/wwwroot"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Define files to upload
FILES=(
  "./mathew.api/bin/Debug/net8.0/mathew.api.dll"
  "./mathew.api/bin/Debug/net8.0/mathew.dll"
)

#clear
echo -e "${BOLD}${MAGENTA}"
echo "╔════════════════════════════════════════╗"
echo "║     SFTP Deployment Script             ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}${BOLD}Files to Upload:${NC}"
printf "${BOLD}%-40s %-20s %s${NC}\n" "File" "Size" "Modified"
echo "─────────────────────────────────────────────────────────────────────────"

export SSHPASS="fT#46eA=-Y9x"

SFTP_COMMANDS=""
FOUND_FILES=0
MISSING_FILES=0

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Get modification date/time (compatible with Linux and macOS)
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
      mod_time=$(stat -c "%y" "$file" | cut -d'.' -f1)
      size=$(stat -c "%s" "$file")
    else  # macOS
      mod_time=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file")
      size=$(stat -f "%z" "$file")
    fi

    # Format size
    if [ $size -gt 1048576 ]; then
      size_formatted="$(echo "scale=2; $size/1048576" | bc) MB"
    elif [ $size -gt 1024 ]; then
      size_formatted="$(echo "scale=2; $size/1024" | bc) KB"
    else
      size_formatted="$size B"
    fi

    echo -e "${GREEN}✓${NC} $(printf "%-38s ${BLUE}%-20s${NC} ${YELLOW}%s${NC}" "$(basename "$file")" "$size_formatted" "$mod_time")"
    SFTP_COMMANDS+="put \"${file}\" \"${REMOTE_PATH}\"\n"
    ((FOUND_FILES++))
  else
    echo -e "${RED}✗ File not found: $(basename "$file")${NC}"
    ((MISSING_FILES++))
  fi
done

echo ""

if [ $MISSING_FILES -gt 0 ]; then
  echo -e "${YELLOW}⚠  Warning: $MISSING_FILES file(s) not found${NC}"
  echo ""
fi

if [ $FOUND_FILES -eq 0 ]; then
  echo -e "${RED}${BOLD}❌ Error: No files to upload!${NC}"
  unset SSHPASS
  exit 1
fi

echo -e "${CYAN}─────────────────────────────────────────────────────────────────────────${NC}"
echo -e "${CYAN}${BOLD}📤 Starting upload to ${SFTP_HOST}...${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────────────────${NC}"
echo ""

# Execute SFTP batch upload and capture output
SFTP_OUTPUT=$(echo -e "${SFTP_COMMANDS}bye" | sshpass -e sftp -oBatchMode=no "${SFTP_USER}@${SFTP_HOST}" 2>&1)
SFTP_EXIT_CODE=$?

# Unset the environment variable immediately after the command
unset SSHPASS

echo ""

if [ $SFTP_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}${BOLD}"
  echo "╔════════════════════════════════════════╗"
  echo "║      ✓ Upload Successful!              ║"
  echo "╚════════════════════════════════════════╝"
  echo -e "${NC}"
  echo -e "${GREEN}📁 Uploaded $FOUND_FILES file(s) to $REMOTE_PATH${NC}"
  echo -e "${BLUE}🕐 Completed at: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
else
  echo -e "${RED}${BOLD}"
  echo "╔════════════════════════════════════════╗"
  echo "║      ✗ Upload Failed!                  ║"
  echo "╚════════════════════════════════════════╝"
  echo -e "${NC}"
  echo -e "${RED}Exit code: $SFTP_EXIT_CODE${NC}"
  echo ""
  echo -e "${YELLOW}${BOLD}Error details:${NC}"
  echo -e "${YELLOW}$SFTP_OUTPUT${NC}"
  exit 1
fi
