const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 24680;
const VIDEOS_DIR = path.join(__dirname, 'videos');
const CACHE_DIR = path.join(VIDEOS_DIR, 'cache');

if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// 起動時に ffmpeg コマンドの存在チェックを行う
exec('ffmpeg -version', (error) => {
    if (error) {
        console.warn('\n\x1b[33m%s\x1b[0m', '======================================================================');
        console.warn('\x1b[33m%s\x1b[0m', '【警告】システムに ffmpeg コマンドがインストールされていないか、PATHが通っていません。');
        console.warn('\x1b[33m%s\x1b[0m', 'Wii UやPSPなどのレガシー機器向けの自動トランスコード配信や、倍速計算は機能しません。');
        console.warn('\x1b[33m%s\x1b[0m', 'npm方式でこれらの機能を使用するには、ホストPCに ffmpeg を導入してください。');
        console.warn('\x1b[33m%s\x1b[0m', '======================================================================\n');
    } else {
        console.log('ffmpeg の起動を確認しました。自動互換トランスコード配信が有効です。');
    }
});

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
    <p>※Wii UはFlashプラグイン非搭載のためFlash版は利用できません。上の通常動画版をご利用ください。PSP等のFlash対応デバイス用です。</p>
    <p><strong>【PSP等でメモリ不足エラーが出る場合】</strong><br>
       HTMLプレイヤーを経由せず、以下のSWFファイルへ直接アクセス（直リンク）してお試しください（HTML等のメモリが削減され起動しやすくなります）：<br>
       ・<a href="videos/Framecount_V2_60fps.swf">60fps版 SWF直接表示 (倍速変更不可)</a><br>
       ・<a href="videos/Framecount_V2_24fps.swf">24fps版 SWF直接表示 (倍速変更不可)</a>
    </p>
    
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

    // アクセス元のUser-Agentに基づくレガシーデバイス判定
    const ua = req.headers['user-agent'] || '';
    const isWiiU = /WiiU/i.test(ua);
    const isPSP = /PSP|PlayStation Portable/i.test(ua);
    const is3DS = /Nintendo 3DS/i.test(ua); // 3DS / New 3DS
    const isLegacyDevice = isWiiU || isPSP || is3DS || /Nintendo|PlayStation/i.test(ua) || req.query.compat === '1';

    // PCやスマホなど、レガシー以外の通常端末での1.0倍速は元ファイルをそのまま送信
    if (speed === 1.0 && !isLegacyDevice) {
        return res.sendFile(sourcePath);
    }

    // デバイスに応じた解像度、フレームレート制限、エンコードプロファイル等の決定
    let devicePrefix = '';
    let scaleFilter = '';
    let fpsLimit = '';
    let profileOption = '-profile:v main -level 3.1'; // デフォルト

    if (is3DS) {
        devicePrefix = 'n3ds_';
        scaleFilter = ",scale=w='min(320,iw)':h=-2"; // 3DSは画面解像度に合わせて最大幅320px
        fpsLimit = '-r 30'; // 3DSデコーダ上限の30fpsに制限
        profileOption = '-profile:v baseline -level 3.0'; // 3DSはBaseline Profileが必須
    } else if (isPSP) {
        devicePrefix = 'psp_';
        scaleFilter = ",scale=w='min(480,iw)':h=-2"; // PSPは最大幅480px
        fpsLimit = '-r 30'; // PSPも最大30fpsに制限
        profileOption = '-profile:v baseline -level 3.0'; // PSPもBaselineが安全
    } else if (isLegacyDevice) {
        devicePrefix = 'legacy_';
        scaleFilter = ",scale=w='min(1280,iw)':h=-2"; // Wii U等は最大幅1280px (720p)
    }

    const cacheFileName = `${devicePrefix}${path.basename(file, '.mp4')}_${speed}x.mp4`;
    const cachePath = path.join(CACHE_DIR, cacheFileName);

    if (fs.existsSync(cachePath)) {
        return res.sendFile(cachePath);
    }

    const pts = (1.0 / speed).toFixed(4);
    
    // FFmpegの起動引数を配列化
    const ffmpegArgs = [
        '-i', sourcePath,
        '-f', 'lavfi',
        '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
        '-filter_complex', `[0:v]setpts=${pts}*PTS${scaleFilter}[v]`,
        '-map', '[v]',
        '-map', '1:a',
        '-c:v', 'libx264'
    ];

    // プロファイル引数をパースして追加
    ffmpegArgs.push(...profileOption.split(' '));

    // フレームレート制限の追加
    if (fpsLimit) {
        ffmpegArgs.push(...fpsLimit.split(' '));
    }

    // 残りの共通引数
    ffmpegArgs.push(
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-shortest',
        '-t', '60', // 出力動画の長さを最大1分(60秒)に制限
        '-preset', 'ultrafast',
        '-y', cachePath
    );

    console.log(`\n[トランスコード開始] ファイル: ${file}, 設定速度: ${speed}x (制限時間: 最大60秒, 互換モード: ${isLegacyDevice ? 'オン' : 'オフ'}${is3DS ? ' [New3DS用最適化]' : ''})`);
    const ffmpegProc = spawn('ffmpeg', ffmpegArgs);

    ffmpegProc.stderr.on('data', (data) => {
        const text = data.toString();
        // FFmpegの進捗出力から frame, time, speed を抽出して上書き表示
        const match = text.match(/frame=\s*(\d+).*time=\s*([\d:.]+).*speed=\s*([\d.x]+)/);
        if (match) {
            const frame = match[1];
            const time = match[2];
            const speedVal = match[3];
            process.stdout.write(`\r[トランスコード進捗] ${file} (${speed}x): frame=${frame}, time=${time}, speed=${speedVal}`);
        }
    });

    ffmpegProc.on('close', (code) => {
        console.log(`\n[トランスコード完了] ファイル: ${file}, 速度: ${speed}x (終了コード: ${code})`);
        if (code === 0) {
            res.sendFile(cachePath);
        } else {
            console.error(`[エラー] ffmpeg が異常終了しました (コード: ${code})`);
            console.log('ffmpegによる変換に失敗したため、元の動画ファイルをフォールバック配信します。');
            res.sendFile(sourcePath);
        }
    });

    ffmpegProc.on('error', (err) => {
        console.error('[エラー] ffmpeg プロセスの起動に失敗しました:', err.message);
        console.log('フォールバック配信として元のファイルを送信します。');
        res.sendFile(sourcePath);
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
