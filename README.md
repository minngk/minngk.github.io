# minngk Portfolio Website

モダンなカフェテーマのポートフォリオサイト - GitHub Pagesで公開

## 🌟 特徴

- **カフェ風デザイン**: 温かみのあるベージュ・ブラウン系の色調
- **レスポンシブ対応**: 全デバイスで最適表示
- **GitHub API連携**: リアルタイムの統計表示
- **テーマ切り替え**: 複数のカラーテーマに対応
- **アクセシビリティ**: WCAG 2.1 AA準拠
- **高パフォーマンス**: Core Web Vitals最適化

## 🚀 技術スタック

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **デザイン**: CSS Grid, Flexbox, CSS Variables  
- **API**: GitHub REST API
- **デプロイ**: GitHub Pages
- **フォント**: Font Awesome 6.0

## 📁 プロジェクト構成

```
minngk.github.io/
├── index.html              # メインHTML
├── css/
│   ├── main.css           # メインスタイル
│   ├── components.css     # コンポーネント
│   └── responsive.css     # レスポンシブ
├── js/
│   ├── main.js           # メイン機能
│   ├── github-api.js     # GitHub API
│   ├── projects.js       # プロジェクト管理
│   └── theme.js          # テーマ管理
├── data/
│   └── projects.json     # プロジェクトデータ
└── assets/
    ├── images/           # 画像ファイル
    └── icons/            # アイコンファイル
```

## 🎨 カラーパレット

```css
/* カフェテーマ */
--primary-bg: linear-gradient(135deg, #f7f3e9 0%, #e8ddd4 100%);
--text-primary: #6b4423;
--text-secondary: #8b6f47;
--accent-primary: #d4a574;
--accent-secondary: #b8956a;
```

## 🛠️ セットアップ

1. **リポジトリのクローン**
```bash
git clone https://github.com/minngk/minngk.github.io.git
cd minngk.github.io
```

2. **ローカル開発サーバー起動**
```bash
# Python 3の場合
python -m http.server 8000

# Node.jsの場合
npx serve .
```

3. **ブラウザでアクセス**
```
http://localhost:8000
```

## 📊 GitHub Pages デプロイ

1. GitHubリポジトリの Settings > Pages
2. Source: Deploy from a branch
3. Branch: main / (root)
4. Save

デプロイ後、`https://minngk.github.io` でアクセス可能

## 🎯 カスタマイズ

### 個人情報の更新

1. **プロフィール情報** (`index.html`)
```html
<h1 class="profile-name">あなたの名前</h1>
<p class="profile-subtitle">あなたの肩書き</p>
```

2. **ソーシャルリンク** (`index.html`)
```html
<a href="mailto:your-email@example.com">Email</a>
<a href="your-twitter-url">Twitter</a>
<a href="your-linkedin-url">LinkedIn</a>
```

3. **About Me** (`index.html`)
```html
<p>あなたの自己紹介文...</p>
```

### プロジェクトの追加

`data/projects.json` に新しいプロジェクトを追加:

```json
{
  "id": "project-id",
  "name": "プロジェクト名",
  "description": "プロジェクトの説明",
  "icon": "fab fa-react",
  "technologies": ["React", "TypeScript"],
  "github": "https://github.com/username/repo",
  "demo": "https://demo-url.com",
  "featured": true
}
```

### テーマのカスタマイズ

CSS変数を変更してテーマをカスタマイズ:

```css
:root {
  --primary-bg: your-gradient;
  --text-primary: your-color;
  --accent-primary: your-accent;
}
```

## 🌐 ブラウザサポート

- Chrome 88+
- Firefox 85+  
- Safari 14+
- Edge 88+

## 📱 レスポンシブ対応

- **デスクトップ**: 1200px+
- **タブレット**: 768px - 1199px
- **モバイル**: 320px - 767px

## ⌨️ キーボードショートカット

- `Ctrl/Cmd + Shift + T`: テーマ切り替え
- `Escape`: モーダル/ドロップダウンを閉じる

## 🔧 開発者向け

### APIの使用

```javascript
// GitHub統計の更新
window.githubApi.updateStats();

// プロジェクトの追加
window.projectsManager.addProject({
  name: "新プロジェクト",
  github: "https://github.com/username/repo"
});

// テーマの変更
window.themeManager.applyTheme('dark');
```

### イベント

```javascript
// GitHub データ読み込み完了
document.addEventListener('githubDataLoaded', (e) => {
  console.log(e.detail);
});

// プロジェクト表示完了  
document.addEventListener('projectsDisplayed', (e) => {
  console.log(e.detail);
});

// テーマ変更
document.addEventListener('themeChanged', (e) => {
  console.log(e.detail);
});
```

## 📈 パフォーマンス

- **LCP**: < 2.5s
- **FID**: < 100ms  
- **CLS**: < 0.1
- **PageSpeed**: 90+点

## 🎯 アクセシビリティ

- セマンティックHTML
- ARIA属性
- キーボードナビゲーション
- 適切なコントラスト比
- スクリーンリーダー対応

## 📝 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

## 👤 作成者

**minngk**
- GitHub: [@minngk](https://github.com/minngk)
- Website: [https://minngk.github.io](https://minngk.github.io)
