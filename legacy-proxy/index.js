export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        
        // アクセス時のプロトコルを確認
        const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
        const userAgent = request.headers.get('user-agent') || '';
        
        // レガシーデバイス（PSP, 3DS, Wii U）の判定
        const isLegacyDevice = /PlayStation Portable|Nintendo 3DS|Nintendo WiiU/i.test(userAgent);

        // モダンブラウザからのHTTPアクセスは、安全なHTTPSへ自動リダイレクト
        if (proto === 'http' && !isLegacyDevice) {
            url.protocol = 'https:';
            return Response.redirect(url.toString(), 301);
        }
        
        // Cloudflare Pagesの固定URLを環境変数から取得
        const targetDomain = env.PAGES_DOMAIN || "your-project-name.pages.dev";
        
        // Pagesからデータを取得するためのURL書き換え
        const fetchUrl = new URL(request.url);
        fetchUrl.hostname = targetDomain;
        fetchUrl.protocol = "https:"; // Pagesとの内部通信はHTTPS固定

        // Pagesからコンテンツを取得してクライアントへ返す
        const response = await fetch(fetchUrl.toString(), request);
        return response;
    }
};
