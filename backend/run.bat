@echo off
cd /d "%~dp0"
C:\Users\hdega\AppData\Local\Programs\Python\Python312\python.exe -m uvicorn main:app --reload --port 8001
