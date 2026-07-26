export const CHARACTER_LEDGER_FIELDS = Object.freeze([
  "titleId",
  "characterId",
  "titleLabelAtBrief",
  "assetVersion",
  "productionStatus",
  "sceneIntent",
  "catReferenceKind",
  "catReferencePath",
  "referenceRightsNote",
  "pose",
  "gazeTarget",
  "props",
  "prohibitedRepresentationCheck",
  "sourcePngPath",
  "sourceSha256",
  "deliveryWebpPath",
  "deliverySha256",
  "width",
  "height",
  "byteLength",
  "webpEncoder",
  "webpSettings",
  "alt",
  "artReviewStatus",
  "anatomyReviewStatus",
  "technicalReviewStatus",
  "accessibilityReviewStatus",
  "approvedBy",
  "approvedAt",
  "rejectionReason",
  "notes",
]);

const PRODUCTION_STATUSES = new Set([
  "brief",
  "generated",
  "art-approved",
  "converted",
  "technical-approved",
  "released",
]);
const REVIEW_STATUSES = new Set(["approved", "rejected"]);
const SCOPE_ENTRY_COUNTS = Object.freeze({
  brief: 0,
  pilot: 3,
  "pilot-converted": 3,
  baseline11: 11,
  pair01: 21,
  pair02: 31,
  pair03: 41,
  pair04: 51,
  "release-assets": 51,
  release: 51,
});

function invalid(message) {
  throw new TypeError(`CHARACTER_LEDGER_INVALID: ${message}`);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertExactKeys(value, keys, label) {
  if (!isPlainObject(value)) invalid(`${label} must be an object`);
  const actualKeys = Object.keys(value);
  if (actualKeys.length !== keys.length || actualKeys.some((key, index) => key !== keys[index])) {
    invalid(`${label} has unknown, missing, or unordered fields`);
  }
}

function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") invalid(`${label} must be a non-empty string`);
}

function assertNullableString(value, label) {
  if (value !== null) assertNonEmptyString(value, `${label}`);
}

function assertNullableInteger(value, label) {
  if (value !== null && (!Number.isInteger(value) || value < 0)) invalid(`${label} must be a non-negative integer or null`);
}

function assertNullableBoolean(value, label) {
  if (value !== null && typeof value !== "boolean") invalid(`${label} must be a boolean or null`);
}

function assertNullableReviewStatus(value, label) {
  if (value !== null && !REVIEW_STATUSES.has(value)) invalid(`${label} must be an approved/rejected status or null`);
}

function assertNullableAssetPath(value, label, expectedPath) {
  if (value === null) return;
  assertNonEmptyString(value, label);
  if (value !== expectedPath || /[\\?#]/.test(value)) invalid(`${label} must be ${expectedPath}`);
}

function assertNullableSha256(value, label) {
  if (value === null) return;
  if (typeof value !== "string" || !/^sha256-[A-Za-z0-9+/]{43}=$/.test(value)) {
    invalid(`${label} must be a sha256-Base64 digest or null`);
  }
}

function assertNullableIsoTimestamp(value, label) {
  if (value === null) return;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) || Number.isNaN(Date.parse(value))) {
    invalid(`${label} must be an ISO-8601 UTC timestamp or null`);
  }
}

function assertStageValue(entry, field, label) {
  if (entry[field] === null) invalid(`${label} requires ${field}`);
  if (typeof entry[field] === "string") assertNonEmptyString(entry[field], `${label}.${field}`);
}

function assertApproved(entry, field, label) {
  if (entry[field] !== "approved") invalid(`${label} requires ${field}=approved`);
}

function assertGenerated(entry, label) {
  assertStageValue(entry, "sourcePngPath", label);
  assertStageValue(entry, "sourceSha256", label);
}

function assertArtApproved(entry, label) {
  assertGenerated(entry, label);
  assertApproved(entry, "artReviewStatus", label);
  assertApproved(entry, "anatomyReviewStatus", label);
  assertStageValue(entry, "approvedBy", label);
  assertStageValue(entry, "approvedAt", label);
}

function assertTechnicalApproved(entry, label) {
  assertArtApproved(entry, label);
  for (const field of [
    "deliveryWebpPath",
    "deliverySha256",
    "width",
    "height",
    "byteLength",
    "webpEncoder",
    "webpSettings",
  ]) {
    assertStageValue(entry, field, label);
  }
  assertApproved(entry, "technicalReviewStatus", label);
}

function assertFieldsNull(entry, fields, label) {
  for (const field of fields) {
    if (entry[field] !== null) invalid(`${label} requires ${field}=null`);
  }
}

function assertStatusOwnership(entry, label) {
  const laterThanBrief = [
    "catReferenceKind",
    "catReferencePath",
    "referenceRightsNote",
    "prohibitedRepresentationCheck",
    "sourcePngPath",
    "sourceSha256",
    "deliveryWebpPath",
    "deliverySha256",
    "width",
    "height",
    "byteLength",
    "webpEncoder",
    "webpSettings",
    "artReviewStatus",
    "anatomyReviewStatus",
    "technicalReviewStatus",
    "accessibilityReviewStatus",
    "approvedBy",
    "approvedAt",
    "rejectionReason",
  ];
  if (entry.productionStatus === "brief") {
    assertFieldsNull(entry, laterThanBrief, label);
    return;
  }

  const laterThanArt = [
    "deliveryWebpPath",
    "deliverySha256",
    "width",
    "height",
    "byteLength",
    "webpEncoder",
    "webpSettings",
    "technicalReviewStatus",
    "accessibilityReviewStatus",
  ];
  const laterThanGenerated = [
    ...laterThanArt,
    "approvedBy",
    "approvedAt",
  ];
  if (entry.productionStatus === "generated") {
    assertGenerated(entry, label);
    assertFieldsNull(entry, laterThanGenerated, label);
    for (const field of ["artReviewStatus", "anatomyReviewStatus"]) {
      if (entry[field] !== null && entry[field] !== "rejected") {
        invalid(`${label} requires ${field}=null or rejected while generated`);
      }
    }
    if (entry.artReviewStatus === "rejected" || entry.anatomyReviewStatus === "rejected") {
      assertStageValue(entry, "rejectionReason", label);
    } else {
      assertFieldsNull(entry, ["rejectionReason"], label);
    }
    return;
  }

  if (entry.productionStatus === "art-approved") {
    assertArtApproved(entry, label);
    assertFieldsNull(entry, [...laterThanArt, "rejectionReason"], label);
    return;
  }

  if (entry.productionStatus === "converted") {
    assertArtApproved(entry, label);
    for (const field of [
      "deliveryWebpPath",
      "deliverySha256",
      "width",
      "height",
      "byteLength",
      "webpEncoder",
      "webpSettings",
    ]) assertStageValue(entry, field, label);
    assertFieldsNull(entry, ["technicalReviewStatus", "accessibilityReviewStatus", "rejectionReason"], label);
    return;
  }

  if (entry.productionStatus === "technical-approved") {
    assertTechnicalApproved(entry, label);
    assertFieldsNull(entry, ["accessibilityReviewStatus", "rejectionReason"], label);
    return;
  }

  assertTechnicalApproved(entry, label);
  assertApproved(entry, "accessibilityReviewStatus", label);
  assertFieldsNull(entry, ["rejectionReason"], label);
}

export function validateCharacterLedger(ledger, titleProfiles) {
  assertExactKeys(ledger, ["schemaVersion", "entries"], "ledger");
  if (ledger.schemaVersion !== 1) invalid("schemaVersion must be 1");
  if (!Array.isArray(ledger.entries) || ledger.entries.length !== 51) invalid("entries must contain exactly 51 rows");
  if (!Array.isArray(titleProfiles) || titleProfiles.length !== 51) invalid("title profiles must contain exactly 51 rows");

  const seenTitleIds = new Set();
  const seenCharacterIds = new Set();
  ledger.entries.forEach((entry, index) => {
    const label = `entries[${index}]`;
    assertExactKeys(entry, CHARACTER_LEDGER_FIELDS, label);
    const titleProfile = titleProfiles[index];
    if (!isPlainObject(titleProfile)) invalid(`${label} has no title profile`);

    for (const field of ["titleId", "characterId", "titleLabelAtBrief", "assetVersion", "sceneIntent", "pose", "gazeTarget", "alt"]) {
      assertNonEmptyString(entry[field], `${label}.${field}`);
    }
    if (!PRODUCTION_STATUSES.has(entry.productionStatus)) invalid(`${label}.productionStatus is invalid`);
    if (!Array.isArray(entry.props) || entry.props.length < 1 || entry.props.length > 2 || entry.props.some((prop) => typeof prop !== "string" || prop.trim() === "")) {
      invalid(`${label}.props must contain one or two non-empty strings`);
    }

    for (const field of [
      "catReferenceKind",
      "catReferencePath",
      "referenceRightsNote",
      "sourcePngPath",
      "sourceSha256",
      "deliveryWebpPath",
      "deliverySha256",
      "webpEncoder",
      "webpSettings",
      "approvedBy",
      "approvedAt",
      "rejectionReason",
      "notes",
    ]) assertNullableString(entry[field], `${label}.${field}`);
    for (const field of ["width", "height", "byteLength"]) assertNullableInteger(entry[field], `${label}.${field}`);
    assertNullableBoolean(entry.prohibitedRepresentationCheck, `${label}.prohibitedRepresentationCheck`);
    for (const field of ["artReviewStatus", "anatomyReviewStatus", "technicalReviewStatus", "accessibilityReviewStatus"]) {
      assertNullableReviewStatus(entry[field], `${label}.${field}`);
    }
    assertNullableAssetPath(
      entry.sourcePngPath,
      `${label}.sourcePngPath`,
      `docs/assets/character-production/source-png/${entry.characterId}.png`,
    );
    assertNullableAssetPath(
      entry.deliveryWebpPath,
      `${label}.deliveryWebpPath`,
      `app/assets/characters/${entry.characterId}.webp`,
    );
    assertNullableSha256(entry.sourceSha256, `${label}.sourceSha256`);
    assertNullableSha256(entry.deliverySha256, `${label}.deliverySha256`);
    assertNullableIsoTimestamp(entry.approvedAt, `${label}.approvedAt`);
    assertStatusOwnership(entry, label);

    if (entry.titleId !== titleProfile.titleId || entry.characterId !== titleProfile.characterId) {
      invalid(`${label} does not match title profile order or IDs`);
    }
    if (seenTitleIds.has(entry.titleId) || seenCharacterIds.has(entry.characterId)) invalid(`${label} duplicates an ID`);
    seenTitleIds.add(entry.titleId);
    seenCharacterIds.add(entry.characterId);
  });

  return ledger;
}

export function validateLedgerScope(ledger, scope) {
  if (!(scope in SCOPE_ENTRY_COUNTS)) invalid(`unknown scope ${scope}`);
  const requiredCount = SCOPE_ENTRY_COUNTS[scope];
  ledger.entries.forEach((entry, index) => {
    const label = `entries[${index}] for ${scope}`;
    if (index >= requiredCount) {
      if (entry.productionStatus !== "brief") invalid(`${label} must remain brief`);
      return;
    }
    if (scope === "pilot") {
      if (entry.productionStatus !== "art-approved") invalid(`${label} must be art-approved`);
      assertArtApproved(entry, label);
      return;
    }
    if (scope === "brief") return;
    if (scope === "release") {
      if (entry.productionStatus !== "released") invalid(`${label} must be released`);
      assertTechnicalApproved(entry, label);
      assertApproved(entry, "accessibilityReviewStatus", label);
      return;
    }
    if (entry.productionStatus !== "technical-approved") invalid(`${label} must be technical-approved`);
    assertTechnicalApproved(entry, label);
  });
  return ledger;
}
