@echo off
echo Starting InsureIQ Backend...
cd backend
uvicorn main:app --reload --port 5000
