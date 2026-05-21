@echo off
echo Starting InsureIQ Full Stack...
echo.
echo Step 1: Starting Docker services (PostgreSQL, Redis)...
docker-compose up -d postgres redis
echo.
echo Step 2: Waiting for services to be ready...
timeout /t 5 /nobreak >nul
echo.
echo Step 3: Starting Backend on port 5000...
start "InsureIQ Backend" cmd /k "cd backend && uvicorn main:app --reload --port 5000"
echo.
echo Step 4: Starting Frontend on port 5173...
start "InsureIQ Frontend" cmd /k "npm run dev"
echo.
echo All services started!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo Swagger Docs: http://localhost:5000/docs
echo.
pause
