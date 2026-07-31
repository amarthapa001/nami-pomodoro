SHELL := powershell.exe
.SHELLFLAGS := -NoProfile -ExecutionPolicy Bypass -Command
.DEFAULT_GOAL := help

FRONTEND_URL := http://127.0.0.1:5173
BACKEND_URL := http://localhost:8000
API_CONTRACT := backend/docs/api-contract.yaml
WS_URL := ws://localhost:8000/ws/rooms/{room_id}/?token={access_token}

.PHONY: help urls setup frontend backend start services migrate stop

help:
	@Write-Host ""; Write-Host "Pomodoro development commands"; Write-Host ""; Write-Host "  make setup      Install frontend dependencies"; Write-Host "  make frontend   Start React/Vite frontend in this terminal"; Write-Host "  make backend    Start Django backend with Docker Compose in this terminal"; Write-Host "  make start      Start frontend and backend in separate PowerShell windows"; Write-Host "  make services   Start only Postgres and Redis"; Write-Host "  make migrate    Run backend database migrations through Docker Compose"; Write-Host "  make stop       Stop Docker Compose services"; Write-Host "  make urls       Print relevant local URLs"; Write-Host ""; Write-Host "Frontend:     $(FRONTEND_URL)"; Write-Host "Backend API:  $(BACKEND_URL)"; Write-Host "API contract: $(API_CONTRACT)"; Write-Host "WebSocket:    $(WS_URL)"

urls:
	@Write-Host "Frontend:     $(FRONTEND_URL)"; Write-Host "Backend API:  $(BACKEND_URL)"; Write-Host "API contract: $(API_CONTRACT)"; Write-Host "WebSocket:    $(WS_URL)"

setup:
	@Set-Location frontend; npm install

frontend:
	@Write-Host "Starting frontend at $(FRONTEND_URL)"
	@Set-Location frontend; npm run dev -- --host 127.0.0.1

backend:
	@Write-Host "Starting backend at $(BACKEND_URL)"
	@Set-Location backend; docker compose up

start:
	@Write-Host "Frontend:     $(FRONTEND_URL)"; Write-Host "Backend API:  $(BACKEND_URL)"; Write-Host "API contract: $(API_CONTRACT)"; Write-Host "WebSocket:    $(WS_URL)"
	@Start-Process powershell.exe -WorkingDirectory "$(CURDIR)\backend" -ArgumentList '-NoExit', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', 'docker compose up'
	@Start-Process powershell.exe -WorkingDirectory "$(CURDIR)\frontend" -ArgumentList '-NoExit', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', 'npm install; npm run dev -- --host 127.0.0.1'
	@Write-Host ""
	@Write-Host "Started backend and frontend in separate PowerShell windows."

services:
	@Set-Location backend; docker compose up db redis -d

migrate:
	@Set-Location backend; docker compose run --rm backend python manage.py migrate

stop:
	@Set-Location backend; docker compose down
