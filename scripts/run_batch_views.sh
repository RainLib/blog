#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Check if requests is installed
python3 -c "import requests" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing 'requests' library..."
    pip3 install requests
fi

echo "Starting HIGH-SPEED multi-threaded view simulation..."
# Increase workers to 100 for maximum speed
python3 "$SCRIPT_DIR/increase_views.py" --config "$SCRIPT_DIR/views_config.json" --workers 100
