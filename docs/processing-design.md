# Big Five自己理解支援ツール 処理設計

| 項目 | 内容 |
|---|---|
| 設計版 | 0.3 |
| 作成日 | 2026-07-20 |
| 更新日 | 2026-07-21 |
| 入力要件 | 要件定義書v1.7 |
| 実行方式 | 通常版はブラウザ内完結。ベータ版だけOCI匿名集計APIを併用 |

## 1. モジュール境界

【想定】正式版は次の責務へ分割する。

| モジュール | 責務 | ブラウザAPI依存 |
|---|---|---|
| definition-validator | 診断・文章・称号・猫・演出定義の整合検証 | なし |
| questionnaire | 固定順、回答、20問分岐、進捗 | なし |
| scoring | 逆転、因子平均、0〜100表示 | なし |
| title-classifier | `title-rule-v1` | なし |
| result-composer | 固定テンプレートから結果モデル生成 | なし |
| compatibility | 履歴比較の互換性判定 | なし |
| storage-adapter | localStorage読込・検証・保存・削除 | あり |
| character-loader | 該当猫の遅延読込 | あり |
| radar-renderer | Canvas/SVG相当のレーダー描画モデル | Canvasのみ描画時 |
| share-card | 共有画像・テキスト生成 | Canvas/Font/Blob |
| capability-detector | Share/Clipboard/Download能力判定 | あり |
| router/controller | ハッシュルートと画面状態 | DOM/History |
| beta-aggregation-client | ベータ通知、完答・カード利用集計、失敗分離 | Fetch/crypto |

ドメイン処理は純粋関数とし、同一入力・同一版から同一結果を返す。

## 2. 起動

1. AppMetaを読む。
2. 診断定義、質問、採点鍵、結果文、称号、猫、色・香り定義を読む。
3. definition-validatorで件数、参照、版、51分類を検証する。
4. 保存データを読んでStorageEnvelopeを検証する。
5. 不正レコードだけを除外し、利用可能な途中回答・履歴を画面モデルへ渡す。
6. ルートと状態を照合し、安全な画面へ遷移する。

静的定義の重大不整合は採点を続行せず、`DEFINITION_INVALID`として説明画面と再読込導線を出す。誤った結果を返すより停止を優先する。

## 3. 回答処理

### 3.1 回答登録

入力:

- questionId
- value: integer 1..5
- progressId
- current questionVersion

処理:

1. 現在の固定設問IDと一致することを検証。
2. 1〜5整数を検証。
3. answers[questionId]を追加または置換。
4. currentIndexとupdatedAtを更新。
5. 端末保存を試行。
6. 保存失敗でもメモリ状態を維持し、次へ進む。

同一設問への再回答は上書きであり、二重レコードを作らない。

### 3.2 20問完答分岐

20問すべてが有効になるまで分岐を出さない。

- `showPreview`: 20問だけで採点し、仮結果を保存・表示。
- `continueHidden`: 20問採点結果をUIへ渡さず、21問目へ進む。

`continueHidden`でも20回答は途中回答として保持し、50問完答時に50問全体を再採点する。

### 3.3 T-004の公開シーム

- `response-state` はDOM・ブラウザAPIに依存しない。新規ProgressRecord、現在設問への回答、戻る、置換、20問出口、50問終端を純粋値として返す。
- 回答入力は current question ID と own data property の整数 `1..5` だけを受け入れる。未知ID、過去設問、継承値、accessor、欠損、範囲外、小数は `RESPONSE_INVALID_INPUT` として拒否する。
- 20問完答の `showPreview` は `preview-ready` を返すだけで採点・画面生成を行わない。`continueHidden` は `detail-continued` と進捗だけを返す。50問目は回答地図だけを持つ `detail-complete` であり、結果画面・履歴・共有はT-005以降の責務とする。
- `progress-storage` は注入されたストレージを使う。`STORAGE_CORRUPT`、`STORAGE_INCOMPATIBLE`、`STORAGE_UNAVAILABLE`、`STORAGE_SAVE_FAILED`、`STORAGE_DELETE_FAILED` と `PROGRESS_INCOMPATIBLE` を安定した内部コードとして返し、例外を呼出側へ漏らさない。
- `persistTransition`、`answerAndSave`、`transitionAndSave` は遷移eventのProgressRecordを直ちに保存する。保存失敗でもeventとメモリ上の進捗を返す。50問完答後にResultSnapshotを保存してProgressRecordを削除する処理はT-005の呼出側責務とする。

## 4. 採点

### 4.1 項目変換

```text
positive: keyed = answer
negative: keyed = 6 - answer
```

入力値、因子、方向が不正または欠損なら、その結果モードの採点を成立させない。

### 4.2 因子得点

```text
rawMean = sum(keyed answers for factor) / itemCount
displayScore = round((rawMean - 1) / 4 * 100)
```

- 20問: 各因子4項目
- 50問: 各因子10項目
- `rawMean`を判定・比較の正とする。
- `displayScore`は画面・共有だけに使う。
- 採点結果の検証では`keyedSum = round(rawMean * itemCount)`を再構成し、`rawMean === keyedSum / itemCount`のJS厳密同値を要求する。許容差は使わない。
- 分散は`varianceNumerator = itemCount * sum(keyed^2) - keyedSum^2`、`variance = varianceNumerator / itemCount^2`として生成し、判定入力でも同じ整数分子へ厳密に再構成できることを要求する。
- 検証時は回答値1〜5のcount組合せから到達可能統計集合を項目数別に生成し、平均合計・分散分子・方向支持数の同時一致を要求する。項目数が未指定で4・10の両方に平均が適合する場合は、両候補を評価していずれかの全統計一致を採用する。

### 4.3 補助値

因子ごとに次を計算する。

- band:
  - high: rawMean >= 3.5
  - low: rawMean <= 2.5
  - middle: otherwise
- salience: `abs(rawMean - 3.0)`
- directionalSupportCount:
  - high: keyed >= 4 の件数
  - low: keyed <= 2 の件数
  - middle: 0
- variance: 因子内の母分散。完全同点解消だけに使う

## 5. `title-rule-v1`

### 5.1 分類

1. high/low因子だけをsalientFactorsへ入れる。
2. 0件: `balanced`
3. 1件: `single`＋因子＋方向
4. 2件以上: 下記順位で上位2件を選び、`pair`＋2因子の方向
5. TitleProfileDefinitionから完全一致する1件を取得する。
6. 0件または複数件なら定義不整合として停止する。

### 5.2 順位

因子A/Bを次の順で比較する。

1. salienceが大きい
2. directionalSupportCountが大きい
3. varianceが小さい
4. 固定因子順が先

実装上の順位比較は`salience`の浮動値を直接使わず、`abs(keyedSum - 3 * itemCount)`の整数顕著度を使う。分散同点解消も`round(variance * itemCount^2)`の整数分子を使う。

固定因子順:

1. intellectImagination
2. conscientiousness
3. extraversion
4. agreeableness
5. emotionalStability

固定順は再現性確保のみを目的とし、UIで優先順位として説明しない。

### 5.3 境界・僅差

50問:

- `abs(rawMean - 2.5) <= 0.1`または`abs(rawMean - 3.5) <= 0.1`
- 2位と3位のsalience差が0.1以内

20問:

- 上記の0.1を0.25へ置換

境界判定は平均の浮動差を使わない。20問・50問とも各因子で閾値は`keyedSum` 1点分であり、帯境界までの整数距離が1以下、または2位と3位の整数顕著度差が1以下なら包含する。

該当時はBoundaryFlagを生成する。50問のBoundaryFlagは閾値0.1、20問は0.25との組だけを有効とする。称号は変えず、結果モデルへ「複数の傾向が近接している」補足を追加する。

## 6. 結果モデル生成

入力:

- mode、questionCount
- FactorResult[5]
- TitleClassification
- VersionTuple
- ResultTextDefinition
- TitleProfileDefinition
- CharacterManifest
- PaletteDefinition
- FragranceSuggestion

出力:

- ResultSnapshot
- ResultViewModel

処理:

1. TitleProfileDefinitionを取得。
2. 結果文版を一致させ、`mode`、`questionCount`、`factorId`、`band`、`titleId`の明示条件がすべて一致する固定結果文を定義順で取得する。20問では`previewAllowed = false`を除外する。
3. 5因子すべての文章を組み立てる。
4. 20問では詳細節を抑制し、簡易プレビューと限界を明示。
5. 境界補足を追加。
6. 猫IDと標準パレットを設定。
7. 香調候補を利用場面別に複数設定。
8. 表示した文章をResultSnapshotへ複製して当時性を保存。
9. 生回答をResultSnapshotへ渡さない。

FactorResult、TitleClassification、RenderedResultTextはexact schemaで検証し、未知フィールドやネストした生回答、設問数から到達不能な因子平均、設問数と閾値が矛盾するBoundaryFlagを拒否する。Q-006未確定時は本番結果文を完成扱いにしない。

## 7. 履歴保存

1. `crypto.randomUUID()`でresultIdを生成。
2. ResultSnapshotを検証。
3. 同じresultIdがある場合は追加せず、既存を返す。
4. 新しい結果を追加し、表示時にcompletedAt降順へ並べる。
5. 保存成功後、対応ProgressRecordを削除する。
6. 保存失敗時も画面結果を維持し、生回答はメモリ上の完答処理終了時に破棄する。

パレット変更は該当ResultSnapshotのselectedPaletteIdだけを更新する。スコア、称号、文章、猫、版を変更しない。

## 8. 比較

### 8.1 互換判定

`docs/data-model.md`の比較互換性を満たす2件だけを比較する。

返却:

```js
{ compatible: true }
```

または安定コード:

- COMPARE_DIAGNOSIS_MISMATCH
- COMPARE_SCALE_MISMATCH
- COMPARE_QUESTION_VERSION_MISMATCH
- COMPARE_SCORING_VERSION_MISMATCH
- COMPARE_QUESTION_COUNT_MISMATCH
- COMPARE_SCORE_INVALID

### 8.2 並びと差

- completedAtが古い方をbefore、新しい方をafterとする。
- 同時刻ならresultIdの辞書順で安定化する。
- 差はrawMean同士で計算し、表示時だけ0〜100相当へ変換・丸める。
- 「上がった／下がった」だけでなく、「回答時の状況でも変動する」と表示する。

## 9. レーダーチャート

- 入力は5つのdisplayScore。
- 軸順をFactorDefinitionで固定。
- 外枠、5軸、25/50/75補助線、因子名、数値を描画する。
- 0〜100外、NaN、欠損は描画せず、テキスト表だけを表示する。
- Canvasとは別に、同じ値をHTMLリストまたは表で必ず提供する。
- レーダー面積を総合点として計算・表示しない。

## 10. 猫アセット

1. titleIdからcharacterIdを取得。
2. manifestの1件だけを読み込む。
3. `loading=lazy`相当で必要時にロード。
4. 読込成功時は比率維持で表示。
5. 失敗時はalt、称号、結果文を維持し、共有カードは猫なしレイアウトへ切り替える。

51画像を開始時にプリロードしない。

## 11. 色・香り

### 色

- 結果モデルに標準＋複数候補を含める。
- 利用者選択はpresentation stateとselectedPaletteIdだけを更新。
- 配色適用前に必要な色キーとコントラスト検証フラグを確認。
- 不正パレットは標準へ戻す。

### 香り

- 利用場面別の候補を同時表示。
- ユーザー状態を推測する入力・処理を持たない。
- 商品、具体使用法、治療・改善効果のデータを定義スキーマで禁止する。

## 12. 共有カード

### 12.1 生成

1. ResultSnapshotと選択／標準PaletteDefinitionを検証。
2. Q-007で確定した寸法のCanvasを作成。
3. 日本語フォントの準備を待つ。
4. 選択パレットを変更せず背景と装飾へ適用する。
5. 猫と隣接背景の分離状態を評価し、必要なら明暗二重縁取り、影、ニュートラル背景プレートを決定的に適用する。
6. 背景、称号、猫、レーダー、短文、モード、香調候補、注意、版を描画。
7. 猫は同一オリジンの静的アセットだけを使い、再配色・トリミングをしない。
8. PNG Blobへ変換。
9. 共有テキストを別生成。

生回答、氏名、端末情報、公開結果URLを受け取る引数を設けない。
同じResultSnapshot、猫アセット版、パレット版、カードテンプレート版からは同じ視認性補助を選び、共有前プレビューと完成PNGを一致させる。

### 12.2 能力判定

| 能力 | 判定 | 提示 |
|---|---|---|
| ファイル共有 | `navigator.canShare({files})`相当 | OS標準共有 |
| ダウンロード | Blob URLとdownload属性 | 画像保存 |
| テキストコピー | Clipboard API | コピー |
| すべて不可 | 常に可能なDOMテキスト | 手動選択 |

共有キャンセルはエラー扱いせず元画面へ戻る。Blob URLは使用後に解放する。

### 12.3 安定コード

- SHARE_IMAGE_GENERATION_FAILED
- SHARE_FONT_UNAVAILABLE
- SHARE_FILE_UNSUPPORTED
- SHARE_CANCELLED
- CLIPBOARD_DENIED
- DOWNLOAD_UNAVAILABLE

## 13. 削除

- 途中回答破棄: 対象diagnosisIdのProgressRecordだけを削除。
- 履歴個別削除: resultId一致1件だけを削除し、確認を要求。
- 全削除: progressByDiagnosisとresultsを空にし、確認を要求。
- 削除後の復元機能は提供しない。
- 保存API失敗時は削除完了と表示せず、再試行または安全な戻り先を示す。

## 14. ベータ匿名集計

### 14.1 機能分離

- AppMetaの`deploymentMode=beta`かつ`betaAggregationEnabled=true`のときだけ集計クライアントを有効化する。
- 通常公開版はAPI URLを参照せず、完答・カード利用のいずれでもネットワーク送信しない。
- ベータ開始前にS-009で目的、送信項目、非保存項目、OCI送信、通常版非送信、外部フォーム別同意を表示する。

### 14.2 完答集計

1. 20問結果表示または50問結果確定後、画面表示を先に成立させる。
2. その完答単位でランダムな`requestId`を生成し、端末内に送信状態`pending`を記録する。【想定】
3. 設問セット版、採点版、判定ルール版、設問数、設問IDと選択肢、称号IDを`POST /api/v1/beta/aggregates/completions`へ1回送る。
4. 204受信時だけ`sent`へ更新する。同じ完答の再描画では送信しない。
5. 通信失敗時は結果を維持し、自動連続再送しない。利用者が明示的に再試行する場合は同じ`requestId`を使う。

サーバーは全項目を検証し、設問選択肢、称号、完了数、冪等キーを1トランザクションで原子的に加算する。個人単位イベントは保存しない。

### 14.3 色付きカード利用集計

1. 色を選んだだけでは送信しない。
2. 選択色を反映した画像の保存開始に成功した場合は`download`、OS共有が成功完了した場合は`share`として送る。
3. カード生成失敗、保存不可、共有キャンセル、共有失敗は加算しない。
4. 同じ利用操作の再試行には同じ`requestId`を使い、二重加算を防ぐ。

### 14.4 感想収集

- Googleフォーム等はアプリ外の別導線とする。
- フォーム側で目的と送信項目を明示し、別途同意を得る。
- フォームへ診断結果やDB集計キーを自動付与せず、匿名集計と個人単位で結合しない。

### 14.5 送信失敗

- 400/403/409/413は再送しない。
- 429/500/503/タイムアウトは結果を維持し、自動再送を強制しない。
- 失敗文言は「匿名集計を送信できませんでした。診断結果には影響しません」とし、内部コードはログ・テスト用に分離する。
- 詳細な契約は`docs/api-design.md`を正とする。

## 15. セキュリティとプライバシー

- HTTPSと同一オリジン静的アセット。
- 秘密情報・APIキーを配布物へ置かない。
- ユーザー入力をHTMLとして挿入しない。
- CSPで可能な範囲の`default-src 'self'`等を適用する。正確なポリシーは実装時に全資産を列挙して決める。
- URL、通常版ログ、共有モデル、エラー報告に回答・結果を含めない。
- ベータ集計APIは回答を受信時の検証とカウント加算にだけ使い、イベント行・本文ログ・IPログを残さない。
- API用DBロールは集計マスタ参照、カウンターUPSERT、短期冪等キー操作だけに限定する。
- CORSはベータGitHub Pagesの確定オリジンだけを許可し、Cookieと認証情報を使用しない。
- 外部フォントは避けるか、プライバシー・CSP・Canvas再現性を確認して同梱する。【想定】日本語フォントはシステムフォントを基本にする。

## 16. 主要異常系

| 条件 | ドメイン／ブラウザ動作 | UI | 回復 | テスト |
|---|---|---|---|---|
| 保存不可 | メモリ状態を継続 | 保存不可通知 | 同セッションで完答 | API例外を注入 |
| 容量不足 | 結果を返す | 履歴未保存＋削除導線 | 不要履歴削除後に再試行 | QuotaExceededError |
| 定義不整合 | 採点停止 | 結果を作らず説明 | 再読込・更新待ち | 件数・参照破損 |
| 途中回答版不一致 | 再開拒否 | 理由と新規開始 | 旧値を上書きしない | version tuple変更 |
| 猫読込失敗 | 結果を維持 | 代替文 | 猫なし共有 | 404を模擬 |
| Canvas失敗 | 画像なし | テキスト共有 | コピー／手動選択 | toBlob失敗 |
| OS共有なし | 共有ボタン非表示 | 保存・コピー | 段階代替 | capability stub |
| Clipboard拒否 | コピー失敗 | 選択可能文 | 手動コピー | NotAllowedError |
| 比較非互換 | 差を計算しない | 理由表示 | 履歴で再選択 | 各版不一致 |
| 履歴破損1件 | 1件だけ除外 | 残りを表示 | 個別／全削除 | スキーマ違反 |
| ベータAPI通信失敗 | カウントなし、結果処理を継続 | 非阻害メッセージ | 結果へ戻る。手動再試行だけ許可 | timeout/500/503 |
| ベータ要求二重送信 | 同一冪等キーは1回だけ加算 | 成功扱い | 204で終了 | 同一requestIdを2回送信 |
| ベータ要求の一部不正 | 全集計をロールバック | 結果を維持 | 再送しない | 不正設問を混入 |
| 集計同時更新 | 原子的UPSERT | 通常終了 | 非該当 | 100並列加算 |

## 17. 移植・権威データの検証

プロトタイプから移植できるのは状態遷移・エラー観点・画面構成だけである。

- 移植元一致テスト: プロトタイプで確認済みの戻る、再開、比較順、共有フォールバックを正式版でも再現。
- 権威データ一致テスト: IPIP原版の項目ID、因子、方向、採点鍵、20問集合を固定資料と突き合わせる。
- サンプル質問・採点・結果文との一致テストは作らない。正式版の正しさを保証しないため。
