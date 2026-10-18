# BEY LAB — 全モード統合後の監査記録 (2026-10-18)

## 現行画面と保存先
| 画面 | ファイル | localStorage |
|---|---|---|
| ホーム | index.html | bey-lab-environment-v1 |
| 勝ち抜き | arena.html | bey-lab-arena-v2-{test,official} |
| 1on1 | lab-migration.html | bey-lab-migration-1on1-v1-{test,official} |
| 3on3 | league.html | bey-lab-3on3-v2-{test,official} |
| パーツ管理 | hands.html / bey-hands.js | bey-lab-migration-hands-v1, bey-lab-migration-presets-v1, bey-lab-part-structure-v1 |
| 記録室 | records.html | 上記3モードの現行保存先を読む |
| 戦闘傾向分析 | biological-report.html | 上記3モードのフィニッシュ記録を読む |
| データ管理室 | data.html | 上記3モードの現行記録を管理、全bey-lab-*キーを一括バックアップ可 |
| お題箱 | extra.html | ページ独自の挙動 |

## 監査・修正事項
- 勝ち抜き記録室: 旧V1参照からV2のrooms[].resultsへ修正。
- 3on3記録室: 旧V1参照からV2のcompletedへ修正。勝敗、得点ブレード、直近試合を表示。
- 1on1記録室: 現行保存先を確認（完了試合 + 現在の完了マッチ）。
- 戦闘傾向分析: 勝ち抜き/1on1/3on3のフィニッシュを対象にし、TEST/ OFFICIAL共有設定を利用。
- パーツ一体型: ブレード＋ラチェット、ラチェット＋ビットの両方を共通パーツ保存/勝ち抜き/1on1/3on3に対応。
- データ管理室: 旧版管理ツールを退避。V2データ対応に更新。誤った旧データ自動コピーを廃止。
- バックアップ: 全モード・全環境・パーツ管理・旧版・設定を含むbey-lab-*ローカルストレージのJSON出力を追加。
- データ削除: 自動実行なし。操作は3回の明示確認＋事前バックアップ確認が必要。
- オフライン: sw.js キャッシュ更新 (v43)。現行1on1/戦闘傾向分析をプリキャッシュ対象へ追加。
- HTML/JS横断監査: 現行主要13ファイルのインラインJavaScript構文チェックを通過。現行リンクのリポジトリ内ターゲットを照合。
- データ管理室のモックデータ検証: 勝ち抜き/1on1/3on3各1件の一覧・集計を確認。

## 保管・整理方針
- **旧ページは削除しない。** Git上に残すことで再検証とロールバックを可能にする。
- 以前の3on3: league-legacy-backup.html (バックアップ)。現行: league.html。検証: league-v2-test.html。
- 以前のデータ管理室: data-legacy-backup.html。現行: data.html。
- その他試作ファイル: arena-mickey17.html / lab-17.html / lab.html / lab-legacy-backup.html / foundation-test.html。現行ナビゲーションには載せない。
- localStorage上の旧記録は端末側の財産なので無断削除しない。必要ならデータ管理室で旧形式をJSONとして保全可能。
- Git履歴と退避済みHTMLがあり、完全削除よりも「導線から外し保全」を優先。

## 既知の注意点
- ユーザー実機上の個別記録について、ブラウザの実ストレージ内容はGitHubからは閲覧できない。動作確認はユーザーのiPad側で行う。
- JSON出力はバックアップ／保管用。データ管理室でのJSON再インポートは未実装（無断上書き事故を避けるため）。
- 3on3のTEST/OFFICIALと独立した league-v2-test.html の実験用保存先は別物。
- 記録室のブレード別得点は3on3の出撃CASEの機体名（「 · 」区切り）からブレード名を抽出。
- GitHub Pages とPWAキャッシュの更新反映にはブラウザの再読み込みが必要な場合あり。
