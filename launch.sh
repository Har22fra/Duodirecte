#!/bin/bash
# 🚀 Lancer DuDirecte

# MacOS/Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    open index.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open index.html
# Windows (si vous utilisez Git Bash)
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    start index.html
else
    echo "❌ Système non reconnu"
    echo "✅ Solution: Double-cliquez simplement sur index.html!"
fi
