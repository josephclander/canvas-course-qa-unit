function expectIfDefined(actual, expected) {
  if (expected === undefined) return;
  expect(actual).toBe(expected);
}

function expectPresence(actual, required) {
  if (required === true) {
    expect(actual).not.toBeNull();
  }
  if (required === false) {
    expect(actual).toBeNull();
  }
}

/**
 * Assert multiple boolean fields share the same expected value.
 * Optionally assert an inverse field.
 */
function expectBooleanGroup(actualObj, expected, fields, inverseField) {
  if (expected === undefined) return;

  fields.forEach((field) => {
    expect(actualObj[field]).toBe(expected);
  });

  if (inverseField) {
    expect(actualObj[inverseField]).toBe(!expected);
  }
}

module.exports = {
  expectIfDefined,
  expectPresence,
  expectBooleanGroup,
};
