# 貢献ガイド

[Mission / Concept](PRODUCT_CONCEPT.md) に沿って、GitHub を初めて使う人が「何をする場所・操作か」を理解できる表現を提案してください。一般 UI の自然な日本語化と、GitHub 固有概念の意味変換の両方を維持します。

## 用語追加の判断基準

1. **GitHub 公式 UI か確認する。** どの画面のどのナビゲーション、ボタン、設定項目、案内文、tooltip、aria-label、placeholder に出るかを示してください。見た目が同じ語でも、ユーザーの投稿・名前・入力値なら対象外です。判断できない場合は変換しません。
2. **一般 UI は自然で短い日本語にする。** 例：Settings →「設定」、Search →「検索」。Chrome 標準翻訳との重複を理由に削除しません。
3. **GitHub 固有の概念は操作の意味を優先する。** 例：Issues →「課題と相談」、Pull requests →「変更の提案」、Fork →「自分用にコピー」。単なるカタカナ化で意味が伝わらない場合は避けます。`description` に短い説明を添え、tooltip で正式な原語も確認できるようにして、学習や検索を妨げないようにします。
4. **固有名称は無理に置換しない。** Git、Copilot、Codespaces、MCP などは名称を維持し、必要なら tooltip で「何か」「何ができるか」を補います。
5. **適用範囲を狭く保つ。** `src/terminology.ts` には確認した UI 文言を追加し、画面や公式 UI の構造で適用先を限定します。可変文言は、必要な場合だけ境界を固定したパターンと確認済みの選択肢で扱い、任意の部分一致やページ全体への置換を避けます。Protection Layer を緩めて翻訳件数を増やしません。
6. **保護と復元を同時に確認する。** 対象 UI の英語→日本語を assert し、username、リポジトリ・組織名、README、Markdown、Issue・PR のタイトル・本文・コメント、Discussions 本文、commit message、release notes、コード、ファイル・ディレクトリ名、フォーム入力値が変わらないことを確認します。ON→OFF→ON、SPA 遷移、動的追加が関係する場合はそれらもテストします。

PR には、元の英語、提案する日本語、表示画面、公式 UI と判断した根拠、保護対象への影響、確認結果を書いてください。既存の GitHub 翻訳拡張のソースや辞書はコピーせず、GitHub の公式 UI とドキュメントを参考に独自の表現を提案してください。

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

可能ならログイン済みの実ブラウザで、対象画面の表示、操作、ユーザーコンテンツの保護も確認してください。
