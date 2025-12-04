#!/bin/bash
clear
nvm use 24
ng build --configuration=production

# Configuration variables
SFTP_USER="site40371"
SFTP_HOST="site40371.siteasp.net"
REMOTE_PATH="/wwwroot"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

# ==================================================
# CONFIGURATION
# ==================================================

# Upload mode: "files" or "folder"
UPLOAD_MODE="folder"  # Change to "folder" to upload entire directory

# For UPLOAD_MODE="files": List specific files
FILES=(
"./dist/sakai-ng/browser/chunk-3AA73ZDB.js"
)

# For UPLOAD_MODE="folder": Specify folder path
UPLOAD_FOLDER="./dist/sakai-ng/browser"

# Files to exclude when uploading folder (regex patterns)
EXCLUDE_PATTERNS=(
  "*.pdb"
)

# Delete before upload
ENABLE_DELETE="true"
DELETE_PATTERNS=(
  "*.css"
  "*.js"
  "*.html"
  "*.woff2"
  "*.png"
  "*.svg"
  "*.woff"
  "*.eot"
)

# Advanced options
DELETE_ALL_BEFORE_UPLOAD="true"  # Set to "true" to delete everything in remote folder first
CREATE_BACKUP="false"              # Set to "true" to rename existing files with .bak extension

echo -e "${BOLD}${MAGENTA}"
echo "╔════════════════════════════════════════╗"
echo "║     SFTP Deployment Script             ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Validate configuration
echo -e "${CYAN}${BOLD}🔍 Validating configuration...${NC}"

if [ "$UPLOAD_MODE" = "folder" ]; then
  if [ -z "$UPLOAD_FOLDER" ]; then
    echo -e "${RED}❌ Error: UPLOAD_FOLDER is not defined${NC}"
    echo -e "${YELLOW}Please set UPLOAD_FOLDER variable in the configuration section${NC}"
    exit 1
  fi

  if [ ! -d "$UPLOAD_FOLDER" ]; then
    echo -e "${RED}❌ Error: Folder does not exist: $UPLOAD_FOLDER${NC}"
    echo -e "${YELLOW}Please check the path and try again${NC}"
    exit 1
  fi

  echo -e "${GREEN}✓ Upload mode: folder${NC}"
  echo -e "${GREEN}✓ Source folder: $UPLOAD_FOLDER${NC}"

elif [ "$UPLOAD_MODE" = "files" ]; then
  if [ ${#FILES[@]} -eq 0 ]; then
    echo -e "${RED}❌ Error: FILES array is empty${NC}"
    echo -e "${YELLOW}Please add files to the FILES array in the configuration section${NC}"
    exit 1
  fi

  echo -e "${GREEN}✓ Upload mode: files${NC}"
  echo -e "${GREEN}✓ Number of files configured: ${#FILES[@]}${NC}"

else
  echo -e "${RED}❌ Error: Invalid UPLOAD_MODE: '$UPLOAD_MODE'${NC}"
  echo -e "${YELLOW}Valid options: 'files' or 'folder'${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Target: ${SFTP_HOST}${REMOTE_PATH}${NC}"
echo ""

export SSHPASS="w?4R2L=mh7J%"

# ===== CLEANUP PHASE =====
if [ "$ENABLE_DELETE" = "true" ] && [ ${#DELETE_PATTERNS[@]} -gt 0 ]; then
  echo -e "${YELLOW}${BOLD}🗑️  Cleanup Phase${NC}"
  echo -e "${YELLOW}─────────────────────────────────────────────────────────────────────────${NC}"
  echo -e "${YELLOW}Deleting matching files:${NC}"

  DELETE_COMMANDS="cd ${REMOTE_PATH}\n"
  for pattern in "${DELETE_PATTERNS[@]}"; do
    echo -e "  ${YELLOW}• $pattern${NC}"
    DELETE_COMMANDS+="rm ${pattern}\n"
  done

  echo ""
  echo -e "${YELLOW}Executing cleanup...${NC}"

  DELETE_OUTPUT=$(echo -e "${DELETE_COMMANDS}bye" | sshpass -e sftp -oBatchMode=no "${SFTP_USER}@${SFTP_HOST}" 2>&1)
  DELETE_EXIT_CODE=$?

  if [ $DELETE_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ Cleanup completed${NC}"
  else
    echo -e "${YELLOW}⚠ Cleanup completed with warnings${NC}"
  fi
  echo ""
fi

# ===== UPLOAD PHASE =====
echo -e "${CYAN}${BOLD}📦 Upload Phase${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────────────────${NC}"

FOUND_FILES=0
MISSING_FILES=0
SFTP_COMMANDS="cd ${REMOTE_PATH}\n"

function format_size() {
  local size=$1
  if [ $size -gt 1048576 ]; then
    echo "$(echo "scale=2; $size/1048576" | bc) MB"
  elif [ $size -gt 1024 ]; then
    echo "$(echo "scale=2; $size/1024" | bc) KB"
  else
    echo "$size B"
  fi
}

function get_file_info() {
  local file=$1
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    mod_time=$(stat -c "%y" "$file" | cut -d'.' -f1)
    size=$(stat -c "%s" "$file")
  else
    mod_time=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file")
    size=$(stat -f "%z" "$file")
  fi
}

if [ "$UPLOAD_MODE" = "folder" ]; then
  echo -e "${CYAN}${BOLD}Uploading folder: ${UPLOAD_FOLDER}${NC}"
  echo ""
  printf "${BOLD}%-40s %-20s %s${NC}\n" "File" "Size" "Modified"
  echo "─────────────────────────────────────────────────────────────────────────"

  # Build commands to create directories and upload files
  SFTP_COMMANDS="cd ${REMOTE_PATH}\n"
  declare -A created_dirs

  while IFS= read -r -d '' file; do
    if [ -f "$file" ]; then
      rel_path="${file#$UPLOAD_FOLDER/}"
      dir_path=$(dirname "$rel_path")

      # Create directory if needed (only once per directory)
      if [ "$dir_path" != "." ] && [ -z "${created_dirs[$dir_path]}" ]; then
        SFTP_COMMANDS+="-mkdir ${dir_path}\n"
        created_dirs[$dir_path]=1
      fi

      get_file_info "$file"
      size_formatted=$(format_size $size)

      echo -e "${GREEN}✓${NC} $(printf "%-38s ${BLUE}%-20s${NC} ${YELLOW}%s${NC}" "$rel_path" "$size_formatted" "$mod_time")"
      SFTP_COMMANDS+="put \"${file}\" \"${rel_path}\"\n"
      ((FOUND_FILES++))
    fi
  done < <(find "$UPLOAD_FOLDER" -type f -print0 | sort -z)

  echo ""
  echo -e "${CYAN}─────────────────────────────────────────────────────────────────────────${NC}"
  echo -e "${CYAN}${BOLD}📤 Uploading ${FOUND_FILES} file(s) to ${SFTP_HOST}...${NC}"
  echo -e "${CYAN}─────────────────────────────────────────────────────────────────────────${NC}"
  echo ""

  SFTP_OUTPUT=$(echo -e "${SFTP_COMMANDS}bye" | sshpass -e sftp -oBatchMode=no "${SFTP_USER}@${SFTP_HOST}" 2>&1)
  SFTP_EXIT_CODE=$?
fi

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
echo -e "${CYAN}${BOLD}📤 Uploading ${FOUND_FILES} file(s) to ${SFTP_HOST}...${NC}"
echo -e "${CYAN}─────────────────────────────────────────────────────────────────────────${NC}"
echo ""

SFTP_OUTPUT=$(echo -e "${SFTP_COMMANDS}bye" | sshpass -e sftp -oBatchMode=no "${SFTP_USER}@${SFTP_HOST}" 2>&1)
SFTP_EXIT_CODE=$?

unset SSHPASS

echo ""

if [ $SFTP_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}${BOLD}"
  echo "╔════════════════════════════════════════╗"
  echo "║      ✓ Deployment Successful!          ║"
  echo "╚════════════════════════════════════════╝"
  echo -e "${NC}"
  echo -e "${GREEN} 📁 Uploaded: $FOUND_FILES file(s)${NC}"
  echo -e "${GREEN} 📂 Target: $REMOTE_PATH${NC}"
  echo -e "${BLUE} 🕐 Completed: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
else
  echo -e "${RED}${BOLD}"
  echo "╔════════════════════════════════════════╗"
  echo "║      ✗ Deployment Failed!              ║"
  echo "╚════════════════════════════════════════╝"
  echo -e "${NC}"
  echo -e "${RED}Exit code: $SFTP_EXIT_CODE${NC}"
  echo ""
  echo -e "${YELLOW}${BOLD}Error details:${NC}"
  echo -e "${YELLOW}$SFTP_OUTPUT${NC}"
  exit 1
fi
