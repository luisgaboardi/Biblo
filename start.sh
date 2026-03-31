#!/bin/bash
# Pega o IP local automaticamente
IP_LOCAL=$(hostname -I | awk '{print $1}')
echo "VITE_API_BASE_URL=http://$IP_LOCAL:8000" > frontend/.env
docker compose up --build