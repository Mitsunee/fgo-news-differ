#!/usr/bin/env bash
DATE="$(date +%F-%_H-%M-%S)"
DATA_DIR="$(realpath ./data)"
export TARGET_DIR="$DATA_DIR/$DATE"
export PAGE_LINK="https://webview.fate-go.us/"
PRETTIER_IGNORE="$DATA_DIR/.prettierignore"

process_url () {
  local URL=$1
  local URL_PATH="${URL:`expr length $PAGE_LINK`}"
  local FILE_PATH="$TARGET_DIR/${URL_PATH//\//_}.html"
  curl $URL -o $FILE_PATH  
  echo "downloaded: $URL_PATH"
}

export -f process_url

mkdir -p "$TARGET_DIR";
touch $PRETTIER_IGNORE
curl -o "$TARGET_DIR/index.html" "$PAGE_LINK"

pnpm tsx get-urls.ts "$TARGET_DIR/index.html" | xargs -I {} bash -c "process_url {}" _
pnpm prettier --ignore-path $PRETTIER_IGNORE -w "$DATA_DIR"
echo $DATE >> $PRETTIER_IGNORE