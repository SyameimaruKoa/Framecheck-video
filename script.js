window.addEventListener('DOMContentLoaded', function () {

    var videos = document.getElementsByTagName("video");
    if (videos.length < 2) return;
    
    var video60 = videos[0];
    var video24 = videos[1];

    var btn_60 = document.getElementById("btn_60");
    var btn_60_90 = document.getElementById("btn_60_90");
    var btn_60_120 = document.getElementById("btn_60_120");
    var btn_60_180 = document.getElementById("btn_60_180");

    var btn_24 = document.getElementById("btn_24");
    var btn_24_48 = document.getElementById("btn_24_48");
    var btn_24_72 = document.getElementById("btn_24_72");
    var btn_24_96 = document.getElementById("btn_24_96");
    var btn_24_144 = document.getElementById("btn_24_144");

    function setPlaybackRate(video, rate) {
        if (typeof video.playbackRate !== 'undefined') {
            video.playbackRate = rate;
        } else {
            alert("お使いのブラウザは動画の倍速再生に対応していません。");
        }
    }

    // 60fps
    if (btn_60) btn_60.onclick = function() { setPlaybackRate(video60, 1.0); };
    if (btn_60_90) btn_60_90.onclick = function() { setPlaybackRate(video60, 1.5); };
    if (btn_60_120) btn_60_120.onclick = function() { setPlaybackRate(video60, 2.0); };
    if (btn_60_180) btn_60_180.onclick = function() { setPlaybackRate(video60, 3.0); };

    // 24fps
    if (btn_24) btn_24.onclick = function() { setPlaybackRate(video24, 1.0); };
    if (btn_24_48) btn_24_48.onclick = function() { setPlaybackRate(video24, 2.0); };
    if (btn_24_72) btn_24_72.onclick = function() { setPlaybackRate(video24, 3.0); };
    if (btn_24_96) btn_24_96.onclick = function() { setPlaybackRate(video24, 4.0); };
    if (btn_24_144) btn_24_144.onclick = function() { setPlaybackRate(video24, 6.0); };
});