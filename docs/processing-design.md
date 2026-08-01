# Big Five自己理解支援ツール 処理設計

| 項目 | 内容 |
|---|---|
| 設計版 | 0.9 |
| 作成日 | 2026-07-20 |
| 更新日 | 2026-07-31 |
| 入力要件 | 要件定義書v1.29 |
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

中断・再開は次のように処理する。

1. 回答画面の`中断してトップへ`は新しいドメイン状態を作らず、直近の保存結果を確認して開始画面へ遷移する。保存失敗が既知の場合は、離脱で回答を失うことを確認してから遷移する。
2. 1〜19問と21〜49問は最初の未回答設問、20問完答・`undecided`は20問分岐へ再開する。
3. `preview20`・`showPreview`・20回答の互換ProgressRecordは、開始画面で`残り30問を再開する`と表示し、`continueAfterPreview`を1回適用して21問目へ進める。
4. 簡易プレビューの`簡易プレビューで終了する`は、保存済みResultSnapshotを維持し、対応する互換ProgressRecordだけを削除する。削除失敗時は結果画面に留まり、終了済みと誤表示せず、再試行できる通知を出す。ResultSnapshotが履歴へ保存できていないlive結果ではこの操作を有効化せず、結果を失わない`中断してトップへ`または`あと30問続ける`を案内する。
5. 互換ProgressRecordがある新規開始は、利用者の確認後だけ同じ診断種別の進捗を新規ProgressRecordへ置き換える。取消では書込みを行わず、ResultSnapshotには触れない。

### 3.3 T-004の公開シーム

- `response-state` はDOM・ブラウザAPIに依存しない。新規ProgressRecord、現在設問への回答、戻る、置換、20問出口、50問終端を純粋値として返す。
- 回答入力は current question ID と own data property の整数 `1..5` だけを受け入れる。未知ID、過去設問、継承値、accessor、欠損、範囲外、小数は `RESPONSE_INVALID_INPUT` として拒否する。
- 20問完答の `showPreview` は `preview-ready` を返すだけで採点・画面生成を行わない。`continueHidden` は `detail-continued` と進捗だけを返す。50問目の `detail-complete` は保存可能な完答進捗と50件の回答地図を返し、結果画面・履歴・共有はT-005以降の責務とする。
- `progress-storage` は注入されたストレージを使う。`STORAGE_CORRUPT`、`STORAGE_INCOMPATIBLE`、`STORAGE_UNAVAILABLE`、`STORAGE_SAVE_FAILED`、`STORAGE_DELETE_FAILED` と `PROGRESS_INCOMPATIBLE` を安定した内部コードとして返し、例外を呼出側へ漏らさない。
- `persistTransition`、`answerAndSave`、`transitionAndSave` は遷移eventのProgressRecordを直ちに保存する。保存失敗でもeventとメモリ上の進捗を返す。50問完答後にResultSnapshotを保存してProgressRecordを削除する処理はT-005の呼出側責務とする。
- S-002表示層は設問phaseと20問分岐phaseだけを受ける。設問phaseは5件法と現在位置、戻る、中断、破棄を、分岐phaseは`showPreview`と`continueHidden`、中断、破棄を描画する。中断はProgressRecordを保持し、破棄は確認後に削除する別callbackとする。保存失敗は両phaseで通知するが回答操作を無効化しない。分岐phaseへスコア、因子、称号、キャラクター、パレット、共有モデルを渡さない。

### 3.4 CSVコンテンツ作成からruntimeへの移行境界

Q-006およびT-005/F-002/F-005/F-006/F-016のコンテンツ作成基盤として、`content/source/`のCSV、3つのrelease schema、4つのコンパイラ、決定的な7 JSON builder、atomic writer、CSV/ES Modules parity testを実装した。人はCSVだけを編集し、生成`app/content/` JSONを編集・コミットしない。

ただし、現在はCSVのapproved releaseがなく、release CSVはヘッダーのみである。各コンテンツ行のstatusは、E-0が`approved`、E-1〜E-5が`draft`、T/F/Xの対象行が`reviewed`のままで、Q-006関連行をrelease用の`approved`へ昇格していない。一方、これらの行statusとは別管理のQ-006全18 approval gateは2026-07-28にすべてapprovedとなり、`result-text-v1`のContent Approvalは完了している。現行ES Modules runtimeは`result-text-v2`を使い、v1の基本237件を履歴互換として残した上で、承認済み修正27件とTR-0〜TR-4承認済み`titleReflection`153件を反映する。v2は基本237件＋振り返り153件＝390件、結果文と根拠の対応行は267件であり、実行時の根拠定義自体は固定6件である。Q-013はP-0の153パレットと用途色B（背景84%・表面90%）およびWCAG、P-1の3場面・29香調・25素材・29素材関連、P-2〜P-6の全51称号に属する称号別選択を2026-07-31に承認し、承認済みCSVから`presentation-v2` ES Modules runtimeを決定的に生成・接続済みである。濃度は版付き`palette-usage-mappings.csv`の2列から解決し、基調色・rendererへ固定値を重複させない。approved JSON release未選択、Q-006関連行status未昇格、Q-012正式release未完了はrelease readinessを妨げる別条件として維持する。runtimeは生成済みES Modulesを読み、JSON fetchは行わない。通常モードの外部通信は0件で、CSPの`connect-src 'none'`を変更しない。Actionsによるvalidate/build/deployとruntime JSON loadingは`docs/superpowers/plans/2026-07-26-csv-content-activation-pages.md`で扱う。

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

### 6.1 版付き結果文定義の選択

`ResultEvidenceDefinition`、`ResultTextDefinition`、`TitleProfileDefinition`の参照整合を起動時に検証する。`result-text-v1`はtitle 102件＋factor 135件＝237件の不変な履歴互換定義である。現行`result-text-v2`は基本237件と称号別`titleReflection`153件の合計390件で、基本文面のうち27件はユーザー承認済みのv2修正版である。結果文選択へ生回答、DOM、Canvas、localStorage、ネットワーク、猫色、パレット、香りを渡さない。

### 6.2 `composeResultTexts`

実装: `app/js/domain/result-composer.js`

入力は次のexact 6フィールドとする。

- `definitions`
- `version`
- `mode`
- `questionCount`
- `factors`
- `titleId`

処理:

1. `preview20`と20、`detail50`と50の組だけを許可する。
2. 全定義が要求`version`と一致することを確認し、混在版を拒否する。
3. titleは`titleId`に対する`titleSubtitle`、`titleReason`を各1件だけ選ぶ。v2の`titleReflection`は完全な固定順3件組を得られる場合に限り、previewは1件目、detailは3件すべてを選ぶ。
4. factorは`mode`、`questionCount`、`factorId`、`band`がexact一致する定義を、必要な節ごとに各1件だけ選ぶ。
5. 条件選択後に必要なdefinitionの欠落・重複・件数を検証する。
6. title 2件、選択した`titleReflection`、その後をsection-first、各section内を`FACTOR_ORDER`の固定factor順にする。

`composeResultTexts`の責務はdefinitionの条件選択、欠落・重複・件数、`version`、section-first／`FACTOR_ORDER`のsection・factor順を検証し、`RenderedResultText`の5フィールド（`id`、`version`、`section`、`text`、`evidenceRefs`）だけへ投影することである。v1はpreview 7件／detail 42件、v2の完全定義はpreview 8件／detail 45件である。v2の称号別振り返り定義が0〜2件、順序違い、または重複で完全な3件組にならない場合、composerは振り返りを部分表示せず3件すべてを省略し、称号・因子を維持したpreview 7件／detail 42件を返す。配列、各record、複製した`evidenceRefs`をdeep freezeし、入力を変更・freezeしない。

`result-text-v2`では称号ごとの`titleReflection`を3件追加する。コンパイラは専用CSVから固定順へ投影し、1件目だけをpreview許可とする。`composeResultTexts`はpreviewで1件目、detailで3件を選択し、ランダム値・現在時刻・DOM・香り・色を入力にしない。既存`result-text-v1`の237件と承認状態は上書きしない。51称号分153件はTR-0〜TR-4でユーザー承認済みである。

### 6.3 ResultModelとResultSnapshot

`composeResultModel`はFactorResult、TitleClassification、RenderedResultTextをexact schemaで検証し、5因子、称号・キャラクターID、境界フラグ、表示文を深く複製する。未知フィールド、設問数から到達不能な因子統計、設問数と閾値が矛盾するBoundaryFlagを拒否する。

`createResultSnapshot`は次を実施する。

1. exact 9フィールド入力、`preview20`/20または`detail50`/50、厳密ISO日時を検証する。
2. `VersionTuple`の9フィールドと、v1のmode別7件／42件、v2の通常8件／45件またはゼロ-reflection fallback 7件／42件のRenderedResultTextについて、`version`、section・factor順、各位置のexact production record IDをsnapshot境界で検証する。v2の部分的な振り返り組は拒否する。
3. 表示した文章と根拠参照をResultSnapshotへ複製し、後の版付き結果文定義変更から診断時文面を隔離する。
4. manifest全体の`characterManifestVersion`と、選択された1体の`characterAssetVersion`を別フィールドとして維持する。
5. 13フィールドのResultSnapshotをdeep freezeして返す。`diagnosisId`、`answers`、結果定義、`claimKind`、DOM・Canvas状態は含めない。

上記Q-006ドメイン実装と独立レビューは完了している。`result-text-v1`は根拠台帳の全18 gateがapprovedとなり、Content Approvalを2026-07-28に完了した。`result-text-v2`はユーザー承認済み修正27件とTR-0〜TR-4承認済み`titleReflection`153件を含む現行runtime版である。Q-013のP-0〜P-6も全承認済みで、`presentation-v2` ES Modules runtime、S-003/S-004結果DOM、T-007共有Canvasまで接続済みである。`progress-storage.js`へのResultSnapshot保存・履歴・削除・対象1件のパレット更新統合、S-006/S-007初期画面、保存済みsnapshotを`#/result?resultId=...`でS-003/S-004として開く画面と履歴遷移、S-002表示層とlive controller、本番完答callerまで完了した。callerは既存の採点・称号・文面合成を再利用し、選択されたQ-012 manifest entryの`assetVersion`を`characterAssetVersion`へ、該当TitleProfileの`defaultPaletteId`を初期`selectedPaletteId`へ保存する。manifest全体版の流用や仮値を禁止する。approved JSON releaseとQ-012正式releaseは別ゲートである。

診断時に選択した`titleReflection`も同じRenderedResultTextとしてsnapshotへ複製する。後の文面・順序・採否変更で保存済み履歴を再生成しない。純粋共有候補抽出境界`selectShareableResultTexts`は`titleReflection`を除外し、その出力をT-007の共有UI・共有画像・共有テキストへ接続する。

## 7. 履歴保存

`createResultSnapshot`、保存済み13フィールドを再検証する`validateResultSnapshot`、結果保存API`saveResultSnapshot({ storage, snapshot, diagnosisId, definition, meta, now })`、履歴読込API`loadResultHistory({ storage, now })`、個別削除API`deleteResultSnapshot({ storage, resultId, confirmed, now })`、全削除API`deleteAllData({ storage, confirmed, now })`は実装済みである。S-001/S-002のlive controllerは、20問`showPreview`と50問`detail-complete`から本番snapshotを生成し、この保存APIと独立結果画面へ接続する。20問`continueHidden`ではresultId割当・採点・結果保存を行わない。

1. `crypto.randomUUID()`でRFC 4122 UUID形状のresultIdを生成する。
2. ResultSnapshotの13フィールドexact schemaを検証する。`answers`と`diagnosisId`は受け付けない。
3. 対応ProgressRecordが存在する場合、`definition`と`meta`でexact schema・現在版を検証する。破損・版不一致なら既存StorageEnvelopeを上書き・削除しない。
4. 同じresultIdがある場合、同一snapshotなら追加せず既存を返す。内容が異なるID衝突は破損として拒否する。
5. 新しい結果を追加し、表示時にcompletedAt降順、同時刻はresultId辞書順へ並べる。
6. `preview20`の保存では、追加30問へ進めるよう対応ProgressRecordを保持する。
7. `detail50`の保存成功時は、ResultSnapshot追加と対応ProgressRecord削除を1回のStorageEnvelope書込みで原子的に行う。
8. `detail50`のResultSnapshot保存が失敗しても画面結果を維持し、対応ProgressRecordの再読・再検証後に削除を別の最小書込みで試みる。削除も失敗した場合は`STORAGE_DELETE_FAILED`を併記して通知し、完了表示や履歴保存成功とは扱わない。
9. `detail50`の完答処理終了時は、保存成否にかかわらずcallerが回答地図と完答ProgressRecordへのメモリ参照を破棄する。永続化層の返却値へ生回答を含めない。
10. 履歴読込は有効なResultSnapshotだけを返し、破損1件を除外しても残りを表示できる。読込だけではStorageEnvelopeを書き換えない。
11. 履歴順は`completedAt`の実時刻降順、同時刻は`resultId`辞書順とする。返却配列と各snapshotはdeep freezeする。
12. 個別削除は確認後、指定`resultId`と一致する最初の有効ResultSnapshotだけを削除する。途中回答、非対象結果、破損結果の構造と順序を保持し、対象なしでは書き込まない。
13. 全削除は確認後、現行StorageEnvelopeの`progressByDiagnosis`と`results`を空にする。保存成功後に画面controllerの`currentProgress`、`liveResult`、保存状態通知も初期化し、開始画面へ戻った時に再開操作を表示しない。確認取消、壊れたJSON、将来schema、保存失敗では保存値・画面内状態を変更しない。
14. S-006は履歴0件でも`データの管理`から全削除へ到達できる。通常カードは猫サムネイル、称号、実施日時、20問／50問、結果表示導線だけを投影する。比較モードは選択ResultSnapshot IDを最大2件の一時状態として持ち、1件目は取消・再選択でき、互換結果だけを2件目候補として有効化する。2件選択だけでは遷移せず、固定アクションバーの明示実行でS-007へ進む。

状態遷移:

| mode・event | 結果保存 | ProgressRecord | 画面結果 | 返却 |
|---|---|---|---|---|
| `preview20` / 初回保存 | 1件追加 | 保持 | 維持 | 保存済みsnapshot |
| `preview20` / 同一resultId再実行 | 追加しない | 保持 | 維持 | 既存snapshot |
| `preview20` / 保存失敗 | 追加しない | 保持 | 維持 | `STORAGE_SAVE_FAILED` |
| `detail50` / 初回保存 | 1件追加 | 同一書込みで削除 | 維持 | 保存済みsnapshot |
| `detail50` / 同一resultId再実行 | 追加しない | 残っていれば削除 | 維持 | 既存snapshot |
| `detail50` / 保存失敗・進捗削除成功 | 追加しない | 削除 | 維持 | `STORAGE_SAVE_FAILED`＋cleanup成功 |
| `detail50` / 保存失敗・進捗削除失敗 | 追加しない | 残存の可能性 | 維持 | `STORAGE_SAVE_FAILED`＋`STORAGE_DELETE_FAILED` |
| 対象進捗が破損・版不一致 | 追加しない | 上書き・削除しない | 維持 | `STORAGE_CORRUPT`または`PROGRESS_INCOMPATIBLE` |
| resultId衝突（内容不一致） | 追加しない | modeに従い完答時だけ削除を試行 | 維持 | `STORAGE_CORRUPT` |

live controllerは`#/answer`を正規routeとし、ResultSnapshotをメモリ上にも1件だけ保持できる。結果保存失敗時はlive snapshotを履歴より先に解決して結果画面を成立させ、`結果は表示できましたが、この端末の履歴には保存できませんでした。`を表示する。再読込後はlive snapshotを復元せず、保存履歴にないresultIdは既存の欠落結果フォールバックへ送る。保存済みpreviewは、互換ProgressRecordが`preview20`・`showPreview`・20回答で、snapshotとVersionTupleが完全一致する場合だけ追加30問へ進める。対応進捗がない場合は無反応の継続ボタンを描画しない。

履歴から保存済みpreviewを開き、上記の互換ProgressRecordがある場合は、診断直後のlive previewとは別の操作モデルを使う。ヘッダーと結果操作へ`履歴一覧に戻る`を設定し、結果操作は追加30問の継続と履歴一覧への復帰だけを返す。`中断してトップへ`と`簡易プレビューで終了する`のcallbackは渡さない。

結果画面の表示状態は永続化しない。開いている因子IDと詳細sectionはpresentation層の一時状態とし、次の規則で更新する。

- `openFactorId`は`null`または既知のFactorId 1件。
- `openSection`は`null`または`{ factorId, section }` 1件で、factorIdは`openFactorId`と一致する。
- 別因子を開くと以前の因子と詳細sectionを閉じる。
- 別sectionを開くと同じ因子内の以前のsectionを閉じる。
- 20問ではResultSnapshotに存在しないdetail sectionを生成・補完しない。
- 開閉後は対象見出しへフォーカスを奪わず、見出しがviewport内に残る最小限のスクロール調整だけを行う。

現行presentationは、称号・猫heroと`titleReason`を独立sectionにし、その直後へ`titleReflection`を置き、名前付きレーダーの下へ固定順5因子のコンパクトな行・棒・数値を表示する。完全なv2結果はpreview20の8件、detail50の45件を保存順を変えず表示モデルへ投影する。ゼロ-reflection fallbackでは従来どおり7件／42件を表示し、称号・因子結果を維持する。部分的な振り返り組を画面だけで補完または表示しない。

称号別`titleReflection`の開閉はpresentation層の一時状態とする。1件目は常時表示し、50問だけ残り2件を1つの`ほかのヒントを見る`で一括開閉する。因子詳細の開閉状態とは独立させ、第三階層を作らない。

ResultSnapshotの因子文（preview 5件／detail 40件）はsection-firstのhistorical copyを維持し、表示時だけ固定因子順のfactor-firstへ不変投影する。`observation`、`strength`、`tradeoff`、`work`、`relationship`、`stress`は各1record、`question`と`action`は同じ「振り返りと行動ヒント」カテゴリの2recordsとして扱う。因子行を1回展開すると、カテゴリ見出しと元の`RenderedResultText`を直接表示する。カテゴリごとの汎用サマリ、二段目の開閉、文章ごとの内部`evidenceRefs`表示は作らず、尺度・採点・限界・出典は最下部の「結果の根拠と見方」へ集約する。スコア棒はCSPで無効になるインラインstyleへ依存せず、`progress`の`value`へ0〜100の表示整数を渡す。

`因子ごとの設問構成を見る`はDiagnosticDefinitionとQuestionDefinitionから、現在modeの固定questionId集合を因子・`keyedDirection`別に件数集計する純粋モデルを使う。設問本文、回答、スコア、称号を出力へ含めない。測定の土台等の固定説明は診断定義版とmodeだけを入力とし、ResultSnapshotの称号・数値で分岐しない。

50問結果の`トップへ戻る`は保存済みsnapshotなら新規ProgressRecordを作らず`#/start`へ遷移する。保存失敗したlive snapshotでは確認を要求し、取消時は画面・メモリ上のsnapshotを維持する。`もう一度診断する`だけが新規ProgressRecordを生成する。

履歴の`データの管理`はモーダル状態をpresentation層だけに持つ。起動時に明示closeへフォーカスを移し、close、`event.target === dialog`のbackdrop click、native `cancel`またはfallback keydownのEscapeで閉じる。内部タップをbackdrop扱いせず、閉じた後は起動元へフォーカスを戻す。`showModal`がない、または例外となるfallbackでは、dialog外の背景分岐を`inert`＋`aria-hidden`で隔離し、Tab／Shift+Tabをdialog内の先頭・末尾へ循環させ、close時に元の背景状態を復元する。個別削除・全削除の確認とストレージ処理は従来のdomain APIを再利用する。

2026-07-27の実ブラウザ検証では、360pxで新規開始、20問分岐、preview、選択猫1体のviewport遅延読込、追加30問、detailまで通過し、320pxの200%相当狭幅でも横overflowなし・42文面維持を確認した。強制storage失敗でも20回答とpreview結果をメモリ上で維持し、指定通知を表示した。preview結果の資産inventoryは同一originのscript 35件、stylesheet 1件、選択猫画像1件だけで、外部資産0件だった。

2026-07-28の最終実ブラウザ検証では、320px、360px、960pxの結果・履歴で横overflowなし、360×800で履歴管理dialog全体がviewport内に収まることを確認した。因子・詳細の単一開閉、設問構成sheet、4方法sheet、50問結果のトップ直接遷移、履歴から保存済み結果への直接遷移、dialogの明示close・正確なbackdrop click・Escape・focus入場／復帰を通過し、console error／warningは0件だった。追加の自動回帰検証では、未登録の履歴診断版で現行方法情報を流用しないこと、ボトムシートのインラインfallback、保存結果を含む履歴fallbackの到達可能なfocus循環と全viewport surface、承認済み結果開示ラベルを含む全465件、`npm.cmd run check`、`git diff --check`に成功した。

`selectResultPalette`はResultSnapshotと標準1＋代替2の許可パレットを再検証し、`selectedPaletteId`だけを変更したdeep-freeze済みsnapshotを返す。`updateResultPaletteSelection`はschema 1の保存領域から対象の有効ResultSnapshotを1件だけ特定し、他の有効・破損・将来レコードと途中回答を保持したまま同フィールドだけを更新する。保存失敗時はcontrollerが純粋関数の返却snapshotを画面内に維持して通知する。スコア、称号、文章、猫、香り候補、版を変更しない。

## 8. 比較

### 8.1 互換判定

`app/js/domain/result-comparison.js`の`compareResultSnapshots(first, second)`は、`docs/data-model.md`の比較互換性を満たす異なる2件だけを比較する純粋関数である。入力ResultSnapshotを再検証し、入力を変更しない。

返却:

```js
{
  compatible: true,
  beforeResultId,
  afterResultId,
  beforeCompletedAt,
  afterCompletedAt,
  factorDeltas: [
    { factorId, beforeRawMean, afterRawMean, deltaRawMean }
  ]
}
```

または安定コード:

- COMPARE_SCALE_MISMATCH
- COMPARE_QUESTION_VERSION_MISMATCH
- COMPARE_SCORING_VERSION_MISMATCH
- COMPARE_QUESTION_COUNT_MISMATCH
- COMPARE_SCORE_INVALID

### 8.2 並びと差

- completedAtが古い方をbefore、新しい方をafterとする。
- 同時刻ならresultIdの辞書順で安定化する。
- 差はrawMean同士で計算し、表示時だけ0〜100相当へ変換・丸める。
- S-007表示モデルは前回と今回の`rawMean`をそれぞれ既存の0〜100表示式で整数化し、差も同じ0〜100軸の符号付き整数として表示する。比較互換判定と差の正は`rawMean`のまま維持し、表示整数をドメイン判定へ戻さない。
- 差表示は`{ signedValue, changeLabel }`相当の別フィールドへ分け、数値行と状態行を別DOMにする。整数表示では`±0`、小数表示を将来採用する場合は小数点以下2桁固定の`±0.00`とし、CSSの固定桁数字で位置をそろえる。
- 比較条件は連結済み文字列ではなく、`questionCount`、`scaleVersion`、`questionVersion`、`scoringVersion`を利用者向けラベル付きの4項目へ投影する。
- 互換結果と因子差分配列はdeep freezeし、生回答、表示整数、ResultSnapshot全体を返さない。
- 「上がった／下がった」だけでなく、「回答時の状況でも変動する」と表示する。
- S-007は保存履歴から両IDを再検証し、欠落・削除済み・破損・非互換では差を計算しない。ID不足の直接URLはS-006へ戻す。
- 結果文・称号・猫manifest・個別猫アセット・演出・カード・アプリ版が異なってもスコア互換なら比較し、表示表現の版差を補足する。

## 9. レーダーチャート

- 入力は5つのdisplayScore。
- 軸順をFactorDefinitionで固定。
- 外枠、5軸、25/50/75補助線、因子名、数値を描画する。
- 0〜100外、NaN、欠損は描画せず、テキスト表だけを表示する。
- Canvasとは別に、同じ値をHTMLリストまたは表で必ず提供する。
- レーダー面積を総合点として計算・表示しない。

## 10. 猫アセット

1. titleIdからcharacterIdを取得。
2. TitleProfileDefinitions固定順と51件manifestの完全対応、版、integrityを検証する。
3. `resolveCharacterEntry`でmanifestの該当1件だけを解決する。未知IDは画像なしの代替表示へ変換し、結果画面全体を失敗させない。
4. 結果画面は承認済みaltをneutral frameへ先に表示し、IntersectionObserver相当でframeがviewportへ入るまでdecodeを開始しない。
5. `loadCharacterImage`は注入されたdecoderへ選択済みpathを1回だけ渡す。読込成功時は透明WebP 1件を比率維持・`contain`で全体表示し、元のaltと1024×1024寸法を付与する。
6. 404・decode失敗時は`unavailable`へ変換し、承認済みalt、称号、5因子、結果文、根拠参照、palette metadata、既存actionを維持する。共有カード固有の猫なしレイアウトはT-007/T-008で接続する。

51画像を開始時にプリロードしない。

neutral frame、明暗を兼ねる内側outline、猫画像のshadowは猫を再配色せず背景色との視認性を補助する。360pxおよび200%相当の狭幅確認では横スクロールを発生させず、画像全体を維持する。palette別カード合成はQ-013/T-007/T-008の後続ゲートであり、Q-012完了条件には含めない。

## 11. 色・香り

### 色

- `selectPresentation`はTitleProfileDefinitionとPresentationDefinitionSetだけを受け取る純粋関数とし、生回答、得点、因子band、猫色、DOM、Canvas、localStorage、ネットワークを受け取らない。
- 結果モデルは`standard`に標準1件、`alternatives`に代替2件を分けて保持し、画面では標準、代替1、代替2の固定順で表示する。
- presentation層は`openSuggestionPanel`を`null`、`palette`、`aroma`のいずれかとして一時保持する。初期値は`null`とし、`ココロパレット`を開いた時だけ3候補を縦1列で描画する。色選択による同一結果の再描画では`palette`を維持し、別パネルを開いた場合は従来どおり相互排他で閉じる。開閉状態はResultSnapshotへ保存しない。
- 利用者選択はpresentation stateとselectedPaletteIdだけを更新。
- `resolvePaletteUsage`で主・副・差の3基調色を背景、表面、アクセント、文字、グラフへ決定的に展開し、コントラストと猫用の分離補助を確認する。
- 不正パレットは標準へ戻す。
- 同系色の猫でも候補を除外、差替え、再配色しない。

### 香り

- `pause`、`reset`、`quiet-focus`の固定順で、各2件、合計6件を持つ。
- `ココロアロマ`の初期状態は外側を閉じる。外側を開いた直後は3場面をすべて閉じ、`openAromaSceneId`は`null`とする。場面を開くと同時に以前の場面を閉じる。`ココロパレット`を開くとアロマ外側と場面を閉じる。
- 共有は各場面の`shareFragranceId`を1件、合計3件へ要約する。
- `scenes.csv`の固定`icon_id`、`fragrances.csv`の8値`family_id`、`fragrance-material-examples.csv`の素材ID 1〜2件をcompilerで結合する。
- selectorは素材IDから表示名を解決し、結果用6候補と共有カード用代表3件を生成する。共有カード画像には素材名と短い印象を含めるが、共有テキストには素材名を含めない。
- 純粋監査は`FRAGRANCE_TITLE_MATERIAL_DUPLICATE`、`FRAGRANCE_TITLE_SET_DUPLICATE`、`FRAGRANCE_SCENE_FAMILY_DUPLICATE`、`FRAGRANCE_SHARE_TRIPLE_OVERUSED`、`FRAGRANCE_USAGE_OVER_LIMIT`、`FRAGRANCE_SCENE_REUSE_OVER_LIMIT`、`FRAGRANCE_SCENE_COPY_DUPLICATE`、`FRAGRANCE_PROHIBITED_COPY`、`FRAGRANCE_SHARE_COPY_OVERFLOW`の9安定コードを返す。
- ユーザー状態を推測する入力・処理を持たない。
- 植物・精油名は香り素材マスタの`displayName`だけに許可する。商品、ブランド、購入URL、適合推奨、量、滴数、濃度、配合、摂取、塗布、ディフューザー等の使用法、治療・改善・能力向上効果のデータを定義スキーマで禁止する。
- S-003/S-004では固定3場面を縦に並べ、各2件の香調名、素材名1〜2件、説明を表示する。現在の心理状態や効果を示すものではなく、使用方法を案内しない共通注記を添える。T-007では各場面の共有代表1件を正式共有Canvasへ縦に接続する。

## 12. 共有カード

T-007ではResultSnapshotから共有候補を抽出し、純粋な`createShareCardModel`でカードモデルと共有テキストを構成し、`renderShareCard`でPNG Blobを生成する。S-005は同じBlobのObject URLを`card`、`details`、`zoom`で再利用し、ルート離脱時に解放する。2026-07-31に縦構成と代表3体の実ブラウザ確認を完了した。その後、猫周囲のリース表現を再調整対象とし、2026-08-01に最終参考画像を基準とする実装へ更新した。更新後は代表1体の実画像を確認済みで、ユーザーによる実装後の最終確認は未完了である。

画面内のObject URL表示に限ってCSPの`img-src`へ`blob:`を追加する。外部通信能力は追加せず、通常版の`connect-src 'none'`を維持する。正式カードには称号ラベルと称号を表示し、詳細な称号理由は表示しない。

### 12.1 生成

1. ResultSnapshotと選択／標準PaletteDefinitionを検証する。
2. `createShareCardModel`で1080×1800のdeep-freeze済みモデルを生成する。
3. `renderShareCard`が`cardTemplateVersion`を検証し、履歴互換の`card-template-v1`は旧配置、現行`card-template-v2`は調整後配置へ振り分ける。未対応版は画像を生成せず、共有画面の選択可能テキストへフォールバックする。対応版では1080×1800のCanvasを作成し、日本語フォントの準備を待つ。
4. 選択パレットを変更せず背景へ適用し、副色由来の表面色を十分に白へ混ぜた淡い右上装飾へ適用する。右上装飾を暗色の面にはしない。
5. 猫と隣接背景の分離状態を評価し、必要なら明暗二重縁取りまたは影を決定的に適用する。現行`card-template-v2`では猫の背後へ白色・ニュートラル色の円形面や矩形プレートを描かず、内部の`neutral-plate`判定も影による分離へ変換する。
6. 背景と二重枠、中央ブランド、称号ラベルと称号、猫を隠さず自然に囲む視認可能な植物リース、猫、固定順5因子の棒、`ココロアロマ`の見出しと副題、透過素材画付き代表3件（場面、素材例、短い印象）、素材例と短い印象の間の可変装飾点、共通注記、注意、モード、アプリ版を描画する。装飾点、注記、版は隣接文字や枠線と重ねない。
7. 猫は同一オリジンの静的アセットだけを使い、再配色・トリミングをしない。
8. PNG Blobへ変換し、S-005の表示と共有操作へ同じBlobを渡す。
9. 素材例と`titleReflection`を含めない共有テキストを同じカードモデルへ保持する。

生回答、氏名、端末情報、公開結果URLを受け取る引数を設けない。
同じResultSnapshot、猫アセット版、パレット版、カードテンプレート版からは同じ視認性補助を選び、共有前プレビューと完成PNGを一致させる。
同一称号の3候補は独立したパレットとして検証し、同じ3色のprimary／secondary／accentを循環させただけの構成を許可しない。

猫は既存の1024×1024透過WebP、香りの素材画は短辺800px以上の透過PNG、ブランドは`AppMeta.brand.cardIconPath`が指す512px PNGを読み込む。枠、リース、紙調テクスチャ、棒、文字はCanvasへ直接描画する。完成カードや低解像度SVGをラスタライズした画像は制作素材として使わず、プレビューとダウンロードは同じ1080×1800 PNG Blobを使う。因子の棒とアロマ枠は装飾色、数値と香調説明は全承認パレットの背景／表面に対して4.5:1以上となる同系濃色を使う。スコア0では色棒を描画せず、1〜100は表示値に比例した幅で描画する。

### 12.2 能力判定

| 能力 | 判定 | 提示 |
|---|---|---|
| ファイル共有 | `navigator.canShare({files})`相当 | OS標準共有 |
| ダウンロード | Blob URLとdownload属性 | 画像保存 |
| テキストコピー | Clipboard API | コピー |
| すべて不可 | 常に可能なDOMテキスト | 手動選択 |

`detectShareCapabilities`で能力を個別判定し、`sharePng`、`downloadPng`、`copyShareText`を利用可能な時だけ提示する。返却状態は`shared`、`cancelled`、`downloaded`、`copied`、`unavailable`、`failed`である。共有キャンセルはエラー扱いせず画面を維持する。Blob URLは使用後または共有ルート離脱時に解放する。

### 12.3 安定コード

- SHARE_CARD_MODEL_INVALID
- SHARE_CARD_VISIBILITY_INVALID
- SHARE_CANVAS_UNAVAILABLE
- SHARE_FONT_UNAVAILABLE
- SHARE_PNG_UNAVAILABLE

## 13. 削除

- 途中回答破棄: 対象diagnosisIdのProgressRecordだけを削除。
- 履歴個別削除: `deleteResultSnapshot`でresultId一致の有効な1件だけを削除し、確認を要求。途中回答、非対象結果、破損結果を保持する。
- 全削除: `deleteAllData`でprogressByDiagnosisとresultsを空にし、成功時だけcontrollerの途中回答・live結果・保存状態通知も初期化する。確認を要求し、取消・失敗では双方を維持する。
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
| 猫読込失敗 | 結果を維持 | 称号・結果文・根拠を維持 | 猫なし共有と共有テキスト | 404を模擬 |
| Canvas失敗 | 画像なし | 称号・結果文・根拠を維持 | 共有テキストのコピー／手動選択 | toBlob失敗 |
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
