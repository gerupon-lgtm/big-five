import { FACTOR_ORDER } from "./factor-order.js";

const DIRECTIONS = ["high", "low"];

const SINGLE_LABELS = {
  intellectImagination: {
    high: "おいかける探究者",
    low: "手ざわりをたどる散策者",
  },
  conscientiousness: {
    high: "整然たる計画者",
    low: "風向きに道を変える漂泊者",
  },
  extraversion: {
    high: "にぎわいへ進む交遊者",
    low: "静謐なる滞在者",
  },
  agreeableness: {
    high: "歩幅をそろえる同伴者",
    low: "自分の歩幅で進む同行者",
  },
  emotionalStability: {
    high: "静かなる航行者",
    low: "そよ風に振り向く感受者",
  },
};

const PAIR_LABELS = {
  "intellectImagination-high--conscientiousness-high": "星座盤に印を置く記録者",
  "intellectImagination-high--conscientiousness-low": "風まかせの空想者",
  "intellectImagination-low--conscientiousness-high": "素朴な継続者",
  "intellectImagination-low--conscientiousness-low": "気ままな遊歩者",
  "intellectImagination-high--extraversion-high": "新風を運ぶ伝達者",
  "intellectImagination-high--extraversion-low": "静寂に星座盤を見つめる探索者",
  "intellectImagination-low--extraversion-high": "にぎわいの談話者",
  "intellectImagination-low--extraversion-low": "窓辺の逗留者",
  "intellectImagination-high--agreeableness-high": "寄り添う共鳴者",
  "intellectImagination-high--agreeableness-low": "独歩の開拓者",
  "intellectImagination-low--agreeableness-high": "分かち合う同席者",
  "intellectImagination-low--agreeableness-low": "標を示す表明者",
  "intellectImagination-high--emotionalStability-high": "凪空を仰ぐ観望者",
  "intellectImagination-high--emotionalStability-low": "鈴音に振り向く探訪者",
  "intellectImagination-low--emotionalStability-high": "日だまりの静観者",
  "intellectImagination-low--emotionalStability-low": "雨音に振り向く歩行者",
  "conscientiousness-high--extraversion-high": "刻限に集う交流者",
  "conscientiousness-high--extraversion-low": "灯下の記録者",
  "conscientiousness-low--extraversion-high": "道草の合流者",
  "conscientiousness-low--extraversion-low": "余白を楽しむ散策者",
  "conscientiousness-high--agreeableness-high": "輪を整える準備者",
  "conscientiousness-high--agreeableness-low": "線を引く整頓者",
  "conscientiousness-low--agreeableness-high": "寄り道をともにする同行者",
  "conscientiousness-low--agreeableness-low": "自由な独行者",
  "conscientiousness-high--emotionalStability-high": "凪の計画者",
  "conscientiousness-high--emotionalStability-low": "揺れ灯の整頓者",
  "conscientiousness-low--emotionalStability-high": "流れをゆく漂泊者",
  "conscientiousness-low--emotionalStability-low": "揺れ影の遊歩者",
  "extraversion-high--agreeableness-high": "輪舞へ踏み出す共演者",
  "extraversion-high--agreeableness-low": "自分の色を掲げる表明者",
  "extraversion-low--agreeableness-high": "寄り添う静観者",
  "extraversion-low--agreeableness-low": "一席を選ぶ滞在者",
  "extraversion-high--emotionalStability-high": "寛ぐ交遊者",
  "extraversion-high--emotionalStability-low": "ざわめきへ振り向く参加者",
  "extraversion-low--emotionalStability-high": "芽吹きを待つ滞在者",
  "extraversion-low--emotionalStability-low": "薄明に耳を向ける逗留者",
  "agreeableness-high--emotionalStability-high": "ふたつの杯の相席者",
  "agreeableness-high--emotionalStability-low": "揺れ布に並ぶ同伴者",
  "agreeableness-low--emotionalStability-high": "淡々たる表明者",
  "agreeableness-low--emotionalStability-low": "風鳴る戸口の掲示者",
};

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nestedValue of Object.values(value)) deepFreeze(nestedValue);
  }
  return value;
}

function profileId(kind, factors) {
  const suffix = factors.map(({ factorId, direction }) => `${factorId}-${direction}`).join("--");
  return suffix ? `${kind}-${suffix}` : kind;
}

function makeProfile(kind, factors, label) {
  const stableId = profileId(kind, factors);
  return {
    titleId: `title-${stableId}`,
    label,
    kind,
    factors,
    characterId: `character-${stableId}`,
    summaryTextId: `result-text-${stableId}`,
    defaultPaletteId: "palette-default",
  };
}

const profileDefinitions = [
  makeProfile("balanced", [], "五つの風を見渡す観測者"),
  ...FACTOR_ORDER.flatMap((factorId) => DIRECTIONS.map((direction) =>
    makeProfile("single", [{ factorId, direction }], SINGLE_LABELS[factorId][direction]))),
  ...FACTOR_ORDER.flatMap((firstFactorId, firstIndex) => FACTOR_ORDER.slice(firstIndex + 1).flatMap((secondFactorId) =>
    DIRECTIONS.flatMap((firstDirection) => DIRECTIONS.map((secondDirection) => {
      const factors = [
        { factorId: firstFactorId, direction: firstDirection },
        { factorId: secondFactorId, direction: secondDirection },
      ];
      const labelKey = `${firstFactorId}-${firstDirection}--${secondFactorId}-${secondDirection}`;
      return makeProfile("pair", factors, PAIR_LABELS[labelKey]);
    })),
  )),
];

function invalidProfiles() {
  throw new TypeError("TITLE_PROFILE_INVALID");
}

function hasExactFields(value, fields) {
  return value !== null && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === fields.length && fields.every((field) => Object.hasOwn(value, field));
}

function profileKey(kind, factors) {
  return `${kind}:${factors.map(({ factorId, direction }) => `${factorId}/${direction}`).join(",")}`;
}

function expectedProfileKeys() {
  return profileDefinitions.map(({ kind, factors }) => profileKey(kind, factors));
}

export function validateTitleProfileDefinitions(value) {
  const fields = ["titleId", "label", "kind", "factors", "characterId", "summaryTextId", "defaultPaletteId"];
  if (!Array.isArray(value) || value.length !== 51 || !value.every((profile) => hasExactFields(profile, fields))) invalidProfiles();
  if (!value.every(({ titleId, label, kind, factors, characterId, summaryTextId, defaultPaletteId }) =>
    [titleId, label, characterId, summaryTextId, defaultPaletteId].every((item) => typeof item === "string" && item.length > 0) &&
    ["balanced", "single", "pair"].includes(kind) &&
    Array.isArray(factors) && factors.length === (kind === "balanced" ? 0 : kind === "single" ? 1 : 2) &&
    factors.every((factor) => hasExactFields(factor, ["factorId", "direction"]) && FACTOR_ORDER.includes(factor.factorId) && DIRECTIONS.includes(factor.direction)) &&
    new Set(factors.map(({ factorId }) => factorId)).size === factors.length &&
    factors.every((factor, index) => index === 0 || FACTOR_ORDER.indexOf(factors[index - 1].factorId) < FACTOR_ORDER.indexOf(factor.factorId)))) invalidProfiles();

  const titleIds = value.map(({ titleId }) => titleId);
  const characterIds = value.map(({ characterId }) => characterId);
  const keys = value.map(({ kind, factors }) => profileKey(kind, factors));
  if (new Set(titleIds).size !== 51 || new Set(characterIds).size !== 51 || new Set(keys).size !== 51 || !expectedProfileKeys().every((key) => keys.includes(key))) invalidProfiles();
  return value;
}

export const TitleProfileDefinitions = deepFreeze(profileDefinitions);
