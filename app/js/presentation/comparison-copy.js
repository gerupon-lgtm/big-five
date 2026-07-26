import { COMPARE_ERROR } from "../domain/result-comparison.js";

const compareErrorMessages = Object.freeze({
  [COMPARE_ERROR.SCALE_MISMATCH]: "尺度の版が異なるため比較できません。",
  [COMPARE_ERROR.QUESTION_VERSION_MISMATCH]: "設問の版が異なるため比較できません。",
  [COMPARE_ERROR.SCORING_VERSION_MISMATCH]: "採点の版が異なるため比較できません。",
  [COMPARE_ERROR.QUESTION_COUNT_MISMATCH]: "設問数が異なるため比較できません。",
  [COMPARE_ERROR.SCORE_INVALID]: "比較に必要なスコアを確認できません。",
});

export function comparisonErrorMessage(code) {
  return compareErrorMessages[code] ?? "選択した結果は比較できません。";
}
