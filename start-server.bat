@echo off
rem 下部にヘルプの実装があります
chcp 932 > nul

if "%~1"=="-h" goto help
if "%~1"=="--help" goto help

:menu
echo ==================================================
echo  ローカルHTTPサーバー起動スクリプト (Windows用)
echo ==================================================
echo 起動方法を選択してください:
echo [1] Docker Compose (Node.js + FFmpeg サーバー - 推奨)
echo [2] Node.js / npm (ローカル環境にNode.jsとFFmpegが必要)
echo [3] Python (静的ファイル配信のみ - FFmpegなし)
echo [4] PHP (静的ファイル配信のみ - FFmpegなし)
echo [5] ヘルプを表示
echo [6] 終了
echo ==================================================
set /p CHOICE="番号を入力してください (1-6): "

if "%CHOICE%"=="1" goto run_docker
if "%CHOICE%"=="2" goto run_npm
if "%CHOICE%"=="3" goto run_python
if "%CHOICE%"=="4" goto run_php
if "%CHOICE%"=="5" goto help
if "%CHOICE%"=="6" exit /b
echo 無効な入力です。もう一度入力してください。
goto menu

:run_docker
echo Docker Composeでサーバーを起動します...
docker-compose up
goto end

:run_npm
echo npmサーバーを起動します...
if not exist node_modules (
    echo 依存関係をインストールしています...
    npm install
)
npm start
goto end

:run_python
echo Pythonで簡易サーバーを起動します (ポート 24680)...
echo 旧ゲーム機からは http://[IPアドレス]:24680/ でアクセスしてください。
python -m http.server 24680
goto end

:run_php
echo PHPで簡易サーバーを起動します (ポート 24680)...
echo 旧ゲーム機からは http://[IPアドレス]:24680/ でアクセスしてください。
php -S 0.0.0.0:24680
goto end

:help
echo ==================================================
echo  ヘルプ: start-server.bat
echo ==================================================
echo 概要:
echo   このスクリプトは、旧ゲーム機やレトロ機器向けにローカルネットワーク上で
echo   HTTPサーバーを一時公開するためのものです。
echo.
echo 使い方:
echo   start-server.bat [オプション]
echo.
echo オプション:
echo   -h, --help    このヘルプメッセージを表示して終了します。
echo.
echo 起動モードについて:
echo   1. Docker Compose: 
echo      Dockerを利用してNode.jsとFFmpegが導入されたコンテナを起動します。
echo      ホストPCにNode.jsやFFmpegをインストールすることなく、JS非対応ブラウザ向けの
echo      サーバー側倍速動画計算が完全に動作します。(推奨)
echo.
echo   2. Node.js / npm:
echo      ホストPCのNode.jsを使用してサーバーを起動します。
echo      ※サーバーは 24680 番ポートで起動します。
echo      ※サーバー側倍速計算を動かすには、ホストPCに別途ffmpegコマンドが必要です。
echo.
echo   3. Python / 4. PHP:
echo      それぞれPythonおよびPHPの内蔵Webサーバーを使って静的配信を行います。
echo      ※サーバーは 24680 番ポートで起動します。
echo      ※倍速動画のサーバー側計算機能は利用できません。
echo ==================================================
if "%~1"=="" (
    echo スクリプトを終了するには何かキーを押してください...
    pause > nul
)
exit /b

:end
pause
