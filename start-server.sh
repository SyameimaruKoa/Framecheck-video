#!/bin/bash

show_help() {
    echo "=================================================="
    echo " ヘルプ: start-server.sh"
    echo "=================================================="
    echo "概要:"
    echo "  このスクリプトは、旧ゲーム機やレトロ機器向けにローカルネットワーク上で"
    echo "  HTTPサーバーを一時公開するためのものです。"
    echo " "
    echo "使い方:"
    echo "  ./start-server.sh [オプション]"
    echo " "
    echo "オプション:"
    echo "  -h, --help    このヘルプメッセージを表示して終了します。"
    echo " "
    echo "起動モードについて:"
    echo "  1. Docker Compose: "
    echo "     Dockerを利用してNode.jsとFFmpegが導入されたコンテナを起動します。"
    echo "     ホストPCにNode.jsやFFmpegをインストールすることなく、JS非対応ブラウザ向けの"
    echo "     サーバー側倍速動画計算が完全に動作します。(推奨)"
    echo " "
    echo "  2. Node.js / npm:"
    echo "     ホストPCのNode.jsを使用してサーバーを起動します。"
    echo "     ※サーバー側倍速計算を動かすには、ホストPCに別途ffmpegコマンドが必要です。"
    echo " "
    echo "  3. Python / 4. PHP:"
    echo "     それぞれPythonおよびPHPの内蔵Webサーバーを使って静的配信を行います。"
    echo "     ※倍速動画のサーバー側計算機能は利用できません。"
    echo "=================================================="
}

if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

echo "=================================================="
echo " ローカルHTTPサーバー起動スクリプト (Linux/Ubuntu用)"
echo "=================================================="
echo "起動方法を選択してください:"
echo "[1] Docker Compose (Node.js + FFmpeg サーバー - 推奨)"
echo "[2] Node.js / npm (ローカル環境にNode.jsとFFmpegが必要)"
echo "[3] Python (静的ファイル配信のみ - FFmpegなし)"
echo "[4] PHP (静的ファイル配信のみ - FFmpegなし)"
echo "[5] ヘルプを表示"
echo "[6] 終了"
echo "=================================================="
read -p "番号を入力してください (1-6): " CHOICE

case "$CHOICE" in
    1)
        echo "Docker Composeでサーバーを起動します..."
        docker-compose up
        ;;
    2)
        echo "npmサーバーを起動します..."
        if [ ! -d "node_modules" ]; then
            echo "依存関係をインストールしています..."
            npm install
        fi
        npm start
        ;;
    3)
        echo "Pythonで簡易サーバーを起動します (ポート 24680)..."
        echo "旧ゲーム機からは http://[IPアドレス]:24680/ でアクセスしてください。"
        python3 -m http.server 24680 2>/dev/null || python -m http.server 24680
        ;;
    4)
        echo "PHPで簡易サーバーを起動します (ポート 24680)..."
        echo "旧ゲーム機からは http://[IPアドレス]:24680/ でアクセスしてください。"
        php -S 0.0.0.0:24680
        ;;
    5)
        show_help
        ;;
    6)
        exit 0
        ;;
    *)
        echo "無効な入力です。"
        exit 1
        ;;
esac
