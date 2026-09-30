import { expect, test } from "vitest"
import { tableStyleClassName, tableStyleNameFromClassList, validatedTableStyles } from "src/helpers/table_style_helper"

test("builds a prefixed class name", () => {
  expect(tableStyleClassName("borderless")).toBe("lexxy-content__table--borderless")
})

test("reads the style name from a class list", () => {
  const classList = [ "other", "lexxy-content__table--borderless" ]
  expect(tableStyleNameFromClassList(classList)).toBe("borderless")
})

test("reads no style name when the class list has none", () => {
  expect(tableStyleNameFromClassList([ "other" ])).toBeNull()
})

test("accepts valid, unique names", () => {
  const styles = [ { name: "borderless", label: "No borders" }, { name: "compact-2", label: "Compact" } ]
  expect(validatedTableStyles(styles)).toEqual(styles)
})

test("rejects invalid names", () => {
  for (const name of [ "Borderless", "2cols", "with space", "under_score", "" ]) {
    expect(() => validatedTableStyles([ { name, label: "x" } ])).toThrow(/Invalid table style name/)
  }
})

test("rejects the reserved selection name", () => {
  expect(() => validatedTableStyles([ { name: "selection", label: "x" } ])).toThrow(/reserved/)
})

test("rejects duplicate names", () => {
  const styles = [ { name: "a", label: "A" }, { name: "a", label: "B" } ]
  expect(() => validatedTableStyles(styles)).toThrow(/Duplicate/)
})
