#!/bin/bash

tmux new-session -d -s chatkobi

tmux send-keys -t mystartup "cd chatkobi.ai/whatsapp-bot" C-m
tmux send-keys -t chatkobi "python3 -m gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8089 -t 300 whatsapp-backend:app" C-m

tmux split-window -v -t chatkobi

tmux send-keys -t chatkobi "node ./src/index.js" C-m

tmux select-pane -t 0

tmux attach-session -t chatkobi
