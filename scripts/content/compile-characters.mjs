import { ContentError } from "./content-error.mjs";
import { validateTitleProfileDefinitions } from "../../app/js/domain/title-profile.js";

const STATUSES = new Set(["draft", "reviewed", "approved", "rejected"]);
const REVIEW_FIELDS = ["art_review_status", "anatomy_review_status", "technical_review_status", "accessibility_review_status"];
const ALT_CLAIM_PATTERN = /\b(?:title|type|personality|ability|talent|intelligence|smart|intelligent|rank|breed|best|worst)\b|\b(?:first\s+place|number\s+one|no(?:\.|\s+)1|1st(?:\s+place)?|top(?:-ranked)?|(?:highest|lowest)(?:\s+ranked)?)\b|#1\b|称号|タイトル|タイプ|性格|人格|能力|才能|知性|頭が良い|賢い|順位|第(?:[0-9０-９]+|[一二三四五六七八九十百]+)位|一位|トップ|最上|最高|優秀|劣る|ランク|猫種|品種/i;

function invalid() {
  throw new Error("CHARACTER_CONTENT_INVALID");
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) deepFreeze(nested);
  }
  return value;
}

function validImagePath(value) {
  return typeof value === "string" && value.endsWith(".webp") && !value.startsWith("/") &&
    !value.includes("\\") && !value.includes("?") && !value.includes("#") &&
    !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(value) &&
    !value.split("/").some((segment) => segment === "" || segment === "..");
}

export function isValidCharacterAlt(value) {
  return typeof value === "string" && value.trim() !== "" && !ALT_CLAIM_PATTERN.test(value);
}

function validUtcIso(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value)) return false;
  const date = new Date(value);
  return !Number.isNaN(date.valueOf()) && date.getUTCFullYear() === Number(value.slice(0, 4)) &&
    date.getUTCMonth() + 1 === Number(value.slice(5, 7)) && date.getUTCDate() === Number(value.slice(8, 10));
}

function validRow(row, expectedVersion, profile) {
  return row && row.character_manifest_version === expectedVersion && row.title_id === profile.titleId &&
    row.character_id === profile.characterId && Number.isInteger(row.display_order) && row.display_order >= 1 &&
    typeof row.asset_version === "string" && row.asset_version !== "" && validImagePath(row.delivery_webp_path) &&
    /^[a-f0-9]{64}$/.test(row.delivery_sha256) && row.width === 1024 && row.height === 1024 &&
    Number.isInteger(row.byte_length) && row.byte_length > 0 && row.has_alpha === "true" && isValidCharacterAlt(row.alt) &&
    STATUSES.has(row.status) && REVIEW_FIELDS.every((field) => ["pending", "approved", "rejected"].includes(row[field]));
}

export function compileCharacterContent(input, expectedVersion) {
  try {
    const { rows, titleProfiles } = input;
    if (typeof expectedVersion !== "string" || expectedVersion === "" || !Array.isArray(rows) || rows.length !== 51) invalid();
    validateTitleProfileDefinitions(titleProfiles);
    if (new Set(rows.map(({ title_id }) => title_id)).size !== 51 ||
      new Set(rows.map(({ character_id }) => character_id)).size !== 51 ||
      new Set(rows.map(({ delivery_webp_path }) => delivery_webp_path)).size !== 51 ||
      new Set(rows.map(({ display_order }) => display_order)).size !== 51) invalid();
    const ordered = [...rows].sort((left, right) => left.display_order - right.display_order);
    if (!ordered.every((row, index) => validRow(row, expectedVersion, titleProfiles[index]))) invalid();
    return deepFreeze({
      characterManifestVersion: expectedVersion,
      entries: ordered.map((row) => ({
        characterId: row.character_id,
        assetVersion: row.asset_version,
        imagePath: row.delivery_webp_path,
        width: row.width,
        height: row.height,
        alt: row.alt,
        integrity: `sha256-${Buffer.from(row.delivery_sha256, "hex").toString("base64")}`,
      })),
    });
  } catch {
    throw new ContentError({
      code: "CHARACTER_CONTENT_INVALID",
      message: "キャラクターコンテンツCSV定義が不正です。",
    });
  }
}

export function assertCharacterReleaseEligible(rows) {
  if (!Array.isArray(rows) || rows.length !== 51 || !rows.every((row) => row && row.status === "approved" &&
    REVIEW_FIELDS.every((field) => row[field] === "approved") &&
    typeof row.approved_by === "string" && row.approved_by.trim() !== "" && validUtcIso(row.approved_at) &&
    row.has_alpha === "true")) {
    throw new ContentError({
      code: "CHARACTER_APPROVAL_PENDING",
      message: "キャラクター承認が完了していません。",
    });
  }
  return true;
}
