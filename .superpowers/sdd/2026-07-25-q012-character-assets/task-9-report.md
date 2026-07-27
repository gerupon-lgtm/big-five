# Task 9 Report: Pair Batch 4 Preparation

## 結果

- Catalog rows 42–51のproject-owner承認済み候補PNG 10枚を、`review-candidates/`に保持したまま同名の正典`source-png/`へ非破壊コピーした。
- 固定設定`encoder=sharp;quality=82;alphaQuality=100;effort=6;metadata=none;size=1024`でpair04のWebP 10枚を生成した。
- 台帳rows 42–51を`converted`へ更新し、実ファイルから得たsource/delivery SHA-256、1024×1024の寸法、byteLength、`sharp@0.35.3/libvips@8.18.3`を記録した。
- 原画・解剖承認は全10件を`project-owner`、`2026-07-27T00:00:58.840Z`で記録した。
- `technicalReviewStatus`、`accessibilityReviewStatus`、`rejectionReason`は全10件で`null`を維持し、`technical-approved`への昇格は行っていない。

## 変更ファイル

- `docs/assets/character-production/review-candidates/{characterId}-candidate.png` 10枚
- `docs/assets/character-production/source-png/{characterId}.png` 10枚
- `app/assets/characters/{characterId}.webp` 10枚
- `docs/assets/character-production/ledger.json`のrows 42–51のみ
- `.superpowers/sdd/2026-07-25-q012-character-assets/task-9-report.md`

対象の`characterId`は次の10件。

1. `character-pair-extraversion-low--agreeableness-high`
2. `character-pair-extraversion-low--agreeableness-low`
3. `character-pair-extraversion-high--emotionalStability-high`
4. `character-pair-extraversion-high--emotionalStability-low`
5. `character-pair-extraversion-low--emotionalStability-high`
6. `character-pair-extraversion-low--emotionalStability-low`
7. `character-pair-agreeableness-high--emotionalStability-high`
8. `character-pair-agreeableness-high--emotionalStability-low`
9. `character-pair-agreeableness-low--emotionalStability-high`
10. `character-pair-agreeableness-low--emotionalStability-low`

## 実行した検証と結果

| 検証 | 結果 |
|---|---|
| 変更前`node scripts/characters/validate-ledger.mjs pair04` | 契約どおり期待FAIL。`entries[41] for pair04 must be technical-approved` |
| `npm.cmd run character:convert -- --scope pair04 --settings scripts/characters/encoder-settings.json` | PASS。10件変換、設定変更なし |
| `npm.cmd run character:inspect -- --scope pair04` | PASS。10件すべて1024×1024、WebP、alphaあり、透明画素あり、端接触なし、250,000 bytes以下 |
| `validateCharacterLedger(...)`による全51行のschema/stage検証 | PASS |
| ledger/file parity検証 | PASS。source/delivery SHA-256、寸法、byteLengthが実ファイルと一致 |
| candidate/source同一性検証 | PASS。10件すべてSHA-256一致し、候補も保持 |
| base commitとのrows 1–41比較 | PASS。rows 1–41は不変 |
| `node --test app/tests/character-ledger.test.js app/tests/character-assets.test.js` | PASS。12 tests、12 pass、0 fail |
| `npm.cmd test` | PASS。371 tests、371 pass、0 fail |
| `npm.cmd run check` | PASS。36 JavaScript files |
| `git diff --check` | PASS。空白エラーなし |

WebP byteLengthは99,498–163,154 bytesで、全件250,000 bytes以下だった。

## 判断したこと

- 人手承認契約に従い、10件で同一の有効なUTC `approvedAt`を使用した。
- 制作来歴を保存する更新契約に従い、候補PNGを削除せず、候補・正典source・deliveryをすべてcommit対象に含める。
- 通常のpair04 gateは`technical-approved`を要求するため、この準備段階の最終検証にはscope gateではなく全51行のschema/stage検証とpair04 asset inspectionを使用した。
- Asset versionは全件`{characterId}-v1`のまま維持した。

## 未解決・リスク

- WebP比較のproject-owner承認は未実施。controllerによる比較提示と明示承認後にのみ、rows 42–51を`technical-approved`へ昇格できる。
- 51件全体のrelease accessibility gateは未実施で、`accessibilityReviewStatus`は全件このTaskの対象外。
