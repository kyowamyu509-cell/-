# 日常ケア記録アプリ

施設の日常ケアを記録・管理するiPad対応Webアプリです。

## 機能

- **1F・2F 各10部屋**（100番台・200番台）に対応
- **名前ベースDB**：お名前を入力すると過去データを自動呼び起こし
- **日付引き継ぎ**：翌日は前日データを「引継」として自動表示
- **リアルタイム同期**：Firebase Realtime Database で2台のiPad間を即時同期
- **ダッシュボード**：入力状況・排便分布・申し送り一覧をチャート表示
- **部屋ごとリセット**：名前を残して本日データのみクリア
- **PWA対応**：Safariの「ホーム画面に追加」でアプリとして使用可能

---

## 入力項目（部屋ごと）

| 項目 | 種別 |
|------|------|
| お名前 | テキスト入力 |
| 連絡帳 | プルダウン（未選択・有・無） |
| 薬変更 | プルダウン（未選択・有・無） |
| 目薬 | プルダウン（未選択・有・無） |
| 軟膏処置 | プルダウン（未選択・有・無） |
| 最終排便 | プルダウン（不明・-1〜-10） |
| 申し送り内容 | テキストエリア（自由記入） |

---

## セットアップ手順

### 1. このリポジトリをクローン

```bash
git clone https://github.com/YOUR_USERNAME/care-record.git
cd care-record
```

### 2. Firebaseプロジェクトを作成（2台同期に必要）

1. [Firebase Console](https://console.firebase.google.com) にアクセス
2. 「プロジェクトを追加」→ プロジェクト名を入力（例：care-record）
3. Googleアナリティクスはオフで作成

### 3. Realtime Databaseを有効化

1. 左メニュー「構築」→「Realtime Database」
2. 「データベースを作成」をクリック
3. ロケーション：**asia-southeast1（シンガポール）** を選択
4. セキュリティルール：「**テストモードで開始**」を選択 → 有効化

### 4. セキュリティルールを設定（本番運用時）

Realtime Database の「ルール」タブで以下に変更：

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> ⚠️ 施設内LANのみで使用する場合はテストモードのままで問題ありません。

### 5. Firebase設定値を取得

1. プロジェクトの設定（⚙️）→「マイアプリ」
2. 「ウェブアプリを追加」→ アプリ名を入力 → 登録
3. 表示された `firebaseConfig` の値をコピー

### 6. index.html を書き換え

`index.html` の以下の部分を書き換えます：

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",          // ← コピーした値
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "YOUR_PROJECT",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

---

## iPadへの導入方法

### 方法A：GitHub Pages を使う（推奨）

1. GitHubでリポジトリを作成（`care-record`）
2. `index.html` をプッシュ
3. リポジトリの **Settings → Pages** → Source を `main` ブランチに設定
4. `https://YOUR_USERNAME.github.io/care-record/` でアクセス可能になる
5. iPadのSafariでそのURLを開く
6. 画面下の **共有ボタン（□↑）→「ホーム画面に追加」**
7. 2台のiPad両方で同じ手順を実行 → 自動同期開始！

### 方法B：ファイルを直接転送

1. `index.html` をダウンロード
2. AirDrop または USB で iPad に転送
3. 「ファイル」アプリに保存 → Safariで開く
4. 「ホーム画面に追加」でアプリ化

> ⚠️ 方法Bはローカルファイルのため、Firebase同期には **方法A（HTTPS必須）** が必要です。

---

## ファイル構成

```
care-record/
├── index.html   # メインアプリ（全機能）
└── README.md    # このファイル
```

---

## データ保存の仕組み

| キー | 内容 |
|------|------|
| `rooms/{room}/name` | 部屋番号と名前のひも付け（永続） |
| `residents/{name}/dates/{date}` | 名前×日付のケアデータ |
| `residents/{name}/latest` | その名前の最新データ（翌日引き継ぎ用） |

Firebase未設定時は `localStorage` に同様の構造で保存します。

---

## 技術スタック

- HTML / CSS / Vanilla JavaScript（フレームワークなし）
- [Chart.js](https://www.chartjs.org/) — ダッシュボードチャート
- [Firebase Realtime Database](https://firebase.google.com/) — リアルタイム同期
- PWA（Progressive Web App）— ホーム画面追加でアプリ化
