// utils/testAssertions.js
export function expectIfDefined(actual, expected) {
  if (expected === undefined) return;
  expect(actual).toBe(expected);
}

/**
 * Presence helper:
 * - If `required === true`, assert the value is present (not null/undefined).
 * - If `required === false`, assert the value is absent (null or undefined).
 * - If `required === undefined`, no assertion.
 */
export function expectPresence(actual, required = true) {
  const isAbsent = actual === null || actual === undefined;

  if (required === true) {
    expect(isAbsent).toBe(false);
  } else if (required === false) {
    expect(isAbsent).toBe(true);
  } else {
    // Optional: guard against non-boolean junk
    throw new Error(`expectPresence: "required" must be boolean or undefined`);
  }
}

/**
 * Assert multiple boolean fields share the same expected value.
 * Optionally assert an inverse field.
 */
export function expectBooleanGroup(actualObj, expected, fields, inverseField) {
  if (expected === undefined) return;

  for (const field of fields) {
    expect(actualObj[field]).toBe(expected);
  }

  if (inverseField) {
    expect(actualObj[inverseField]).toBe(!expected);
  }
}
