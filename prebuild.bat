@echo off

@if not exist wwwroot md wwwroot
@cd /d wwwroot >nul 1>nul 2>nul
::@for /F "delims=" %%i in ('dir /b') do (rmdir "%%i" /s/q >nul 1>nul 2>nul || del "%%i" /s/q >nul 1>nul 2>nul)

@copy "..\src\favicon.ico" "." >nul 1>nul 2>nul
@copy "..\src\index.html" "." >nul 1>nul 2>nul
@copy "..\src\web.config" "." >nul 1>nul 2>nul
@xcopy "..\src\assets\images\*.*" "assets\images\" /y >nul 1>nul 2>nul

@echo -- Prebuilding is OK --