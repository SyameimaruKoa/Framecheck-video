const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 24680;
const VIDEOS_DIR = path.join(__dirname, 'videos');
const CACHE_DIR = path.join(VIDEOS_DIR, 'cache');

if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

app.use(express.static(__dirname));

app.get('/nojs', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS非対応ブラウザ向け - フレームカウント動画</title>
</head>
<body style="max-width: 800px; margin: 0 auto; padding: 10px; font-family: sans-serif; box-sizing: border-box;">
    <h1>JS非対応ブラウザ向け プレイヤー</h1>
    <p><a href="index.html">通常ページへ戻る</a></p>
    
    <h2>1. 通常動画版 (サーバー側で倍速計算)</h2>
    <h3>60fps版 (倍速変換済みリンク)</h3>
    <ul>
        <li><a href="/video?file=Framecount_V2_60fps.mp4&speed=1.0">60fps (1.0倍速)</a></li>
        <li><a href="/video?file=Framecount_V2_60fps.mp4&speed=1.5">90fps (1.5倍速)</a></li>
        <li><a href="/video?file=Framecount_V2_60fps.mp4&speed=2.0">120fps (2.0倍速)</a></li>
        <li><a href="/video?file=Framecount_V2_60fps.mp4&speed=3.0">180fps (3.0倍速)</a></li>
    </ul>
    <h3>24fps版 (倍速変換済みリンク)</h3>
    <ul>
        <li><a href="/video?file=Framecount_V2_24fps.mp4&speed=1.0">24fps (1.0倍速)</a></li>
        <li><a href="/video?file=Framecount_V2_24fps.mp4&speed=2.0">48fps (2.0倍速)</a></li>
        <li><a href="/video?file=Framecount_V2_24fps.mp4&speed=3.0">72fps (3.0倍速)</a></li>
        <li><a href="/video?file=Framecount_V2_24fps.mp4&speed=4.0">96fps (4.0倍速)</a></li>
        <li><a href="/video?file=Framecount_V2_24fps.mp4&speed=6.0">144fps (6.0倍速)</a></li>
    </ul>
    <h3>旧バージョン</h3>
    <ul>
        <li><a href="/video?file=frametest_v1.mp4&speed=1.0">V1 60fps (1.0倍速)</a></li>
    </ul>

    <h2>2. Flash版 (ネイティブFlash対応デバイス向け - 速度パラメータ送信)</h2>
    <p>Wii UやPSPなどのFlashプラグイン搭載デバイス向けです。JSの代わりにFlashPlayer側で速度処理をエミュレートします。</p>
    <h3>60fps版 (SWFパラメータリンク)</h3>
    <ul>
        <li><a href="/flash?file=videos/Framecount_V2_60fps.swf&speed=1.0">1.0倍速</a></li>
        <li><a href="/flash?file=videos/Framecount_V2_60fps.swf&speed=1.5">1.5倍速</a></li>
        <li><a href="/flash?file=videos/Framecount_V2_60fps.swf&speed=2.0">2.0倍速</a></li>
        <li><a href="/flash?file=videos/Framecount_V2_60fps.swf&speed=3.0">3.0倍速</a></li>
    </ul>
    <h3>24fps版 (SWFパラメータリンク)</h3>
    <ul>
        <li><a href="/flash?file=videos/Framecount_V2_24fps.swf&speed=1.0">1.0倍速</a></li>
        <li><a href="/flash?file=videos/Framecount_V2_24fps.swf&speed=2.0">2.0倍速</a></li>
        <li><a href="/flash?file=videos/Framecount_V2_24fps.swf&speed=3.0">3.0倍速</a></li>
        <li><a href="/flash?file=videos/Framecount_V2_24fps.swf&speed=4.0">4.0倍速</a></li>
        <li><a href="/flash?file=videos/Framecount_V2_24fps.swf&speed=6.0">6.0倍速</a></li>
    </ul>
</body>
</html>`);
});

app.get('/video', (req, res) => {
    const file = req.query.file;
    const speed = parseFloat(req.query.speed || '1.0');
    const allowedFiles = ['Framecount_V2_60fps.mp4', 'Framecount_V2_24fps.mp4', 'frametest_v1.mp4'];
    const allowedSpeeds = [1.0, 1.5, 2.0, 3.0, 4.0, 6.0];

    if (!allowedFiles.includes(file) || !allowedSpeeds.includes(speed)) {
        return res.status(400).send('Invalid request parameters.');
    }

    const sourcePath = path.join(VIDEOS_DIR, file);
    if (!fs.existsSync(sourcePath)) {
        return res.status(404).send('Source video not found.');
    }

    if (speed === 1.0) {
        return res.sendFile(sourcePath);
    }

    const cacheFileName = `${path.basename(file, '.mp4')}_${speed}x.mp4`;
    const cachePath = path.join(CACHE_DIR, cacheFileName);

    if (fs.existsSync(cachePath)) {
        return res.sendFile(cachePath);
    }

    const pts = (1.0 / speed).toFixed(4);
    const ffmpegCmd = `ffmpeg -i "${sourcePath}" -filter:v "setpts=${pts}*PTS" -c:v libx264 -preset ultrafast -an -y "${cachePath}"`;

    exec(ffmpegCmd, (error) => {
        if (error) {
            console.error(`ffmpeg error: ${error.message}`);
            return res.status(500).send('Server-side video computation failed. Make sure ffmpeg is installed.');
        }
        res.sendFile(cachePath);
    });
});

app.get('/flash', (req, res) => {
    const file = req.query.file || 'videos/Framecount_V2_60fps.swf';
    const speed = req.query.speed || '1.0';
    const allowedSwfFiles = ['videos/Framecount_V2_60fps.swf', 'videos/Framecount_V2_24fps.swf'];

    if (!allowedSwfFiles.includes(file)) {
        return res.status(400).send('Invalid SWF file specified.');
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ネイティブ Flash 再生 - フレームカウント動画</title>
</head>
<body style="max-width: 800px; margin: 0 auto; padding: 10px; font-family: sans-serif; box-sizing: border-box;">
    <h1>ネイティブ Flash プレイヤー (パラメータ埋め込み版)</h1>
    <p><a href="index.html">通常ページへ戻る</a> | <a href="/nojs">JS非対応用ページへ戻る</a></p>
    
    <div id="player-container" style="max-width: 100%; height: auto;">
        <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="480" height="270" id="flashMovie">
            <param name="movie" value="${file}">
            <param name="quality" value="high">
            <param name="loop" value="true">
            <param name="FlashVars" value="speed=${speed}">
            <embed src="${file}" quality="high" width="480" height="270" name="flashMovie" type="application/x-shockwave-flash" FlashVars="speed=${speed}">
        </object>
    </div>

    <div style="margin-top: 10px; font-size: 0.9em; color: #666;">
        再生ファイル: ${file} (設定速度: ${speed}倍)<br>
        ※古いゲーム機の内蔵 Flash Player がこのパラメータを受け取って、JavaScriptの代わりに再生計算を行います。
    </div>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
