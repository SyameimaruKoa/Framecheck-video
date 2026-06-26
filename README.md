# フレームカウント動画 ウェブプレイヤー

モニターの残像やすべてのフレームが正常に表示されているかを調べる動画を、PC・スマホから古いゲーム機（Wii U, 3DS, PSP）まで幅広いデバイスで閲覧できるようにしたWebプレイヤーです。

## プレビュー

<video src="videos/Framecount_V2_60fps.mp4" width="320" controls></video>
<br>
<video src="videos/Framecount_V2_24fps.mp4" width="320" controls></video>

---

## 特徴

- **とことんシンプルなUI**: 余計な装飾を省き、どのデバイスでも崩れないCSS2ベースの軽量デザイン。
- **個別倍速機能**: 60fps版、24fps版のそれぞれの動画に対して独立して再生速度を変更可能。
- **レガシーデバイス対応**: 
  - **Wii U / 3DS**: 最新のJS機能を使わず（ES5準拠）、エラーで止まらないように設計。倍速非対応の場合は親切なアラートを表示。
  - **PSP**: HTML5非対応のため、Flash Player (`.swf`) による再生フォールバック機能を搭載。

---

## デプロイと運用方法 (Cloudflare)

このプロジェクトは、**モダンデバイス向けのCloudflare Pages**と、暗号化通信(HTTPS)ができない**レガシーデバイス向けのCloudflare Workers (プロキシ)**を組み合わせて運用します。

### 1. サイト本体のデプロイ (モダンデバイス向け)

このリポジトリをGitHubにプッシュし、Cloudflare Pagesと連携して通常通りデプロイします。
デプロイ後に発行される本番用の固定アドレス（例: `https://your-project-name.pages.dev`）を控えてください。

### 2. 全デバイス共通URLにするためのプロキシデプロイ

PCやスマホと、PSP等の古いゲーム機で**全く同じURL（例: `test.yourdomain.com` などのサブドメイン）**を使うための設定です。このプロキシがアクセス元の端末を自動判別し、適切な通信方式に振り分けます。

1. `legacy-proxy/wrangler.toml` を開き、`PAGES_DOMAIN` の値を先ほど控えたCloudflare Pagesの本番アドレスに変更します。
2. ターミナルで `legacy-proxy` ディレクトリに移動し、プロキシ用Workerをデプロイします。

   ```bash
   cd legacy-proxy
   npx wrangler deploy
   ```

3. Cloudflareのダッシュボードで、デプロイしたWorker（`legacy-device-proxy`）を開きます。
4. 「トリガー」タブから、公開したいご自身のカスタムドメイン・サブドメイン（例: `test.yourdomain.com/*`）を追加します。
5. **【最重要】** Cloudflareの「ページルール (Page Rules)」を開き、その公開用サブドメインに対して **「常に HTTPS を使用する (Always Use HTTPS)」を無効(オフ)** に設定してください。

#### プロキシ（自動振り分け）の動作について

この設定を行うことで、1つのURLだけで全デバイスに完全対応できます。

- PCやスマホが `http://` でアクセスした場合: 安全な `https://` へ**自動的にリダイレクト**されます。
- PSPやWii U等の古い機器が `http://` でアクセスした場合: リダイレクトせずに暗号化なしのまま通信し、サイトを正常に表示します。
