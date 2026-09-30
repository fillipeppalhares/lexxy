import { test } from "../../test_helper.js"
import { expect } from "@playwright/test"

test.describe("Tables — Styles", () => {
  test.beforeEach(async ({ page, editor }) => {
    await page.goto("/table-styles.html")
    await page.waitForSelector("lexxy-editor[connected]")
    await page.waitForSelector("lexxy-toolbar[connected]")
    await editor.clickToolbarButton("insertTable")
    await editor.content.locator("table th").first().click()
  })

  test("choosing a style sets it on the table, and choosing another replaces it", async ({ editor }) => {
    const table = editor.content.locator("table")

    await openStyleMenu(editor)
    await editor.clickTableButton("No borders")
    await expect(table).toHaveClass(/lexxy-content__table--borderless/)

    await openStyleMenu(editor)
    await editor.clickTableButton("Compact")
    await expect(table).toHaveClass(/lexxy-content__table--compact/)
    await expect(table).not.toHaveClass(/lexxy-content__table--borderless/)
  })

  test("Default clears the style", async ({ editor }) => {
    const table = editor.content.locator("table")

    await openStyleMenu(editor)
    await editor.clickTableButton("No borders")
    await openStyleMenu(editor)
    await editor.clickTableButton("Default")

    await expect(table).not.toHaveClass(/lexxy-content__table--/)
  })

  test("the menu marks the current style as checked", async ({ editor }) => {
    await openStyleMenu(editor)
    await editor.clickTableButton("No borders")
    await openStyleMenu(editor)

    const checked = editor.locator.locator("lexxy-table-tools [role='menuitemradio'][aria-checked='true']")
    await expect(checked).toHaveCount(1)
    await expect(checked).toHaveAttribute("aria-label", "No borders")
  })

  test("the style is exported on the table and restored from the value", async ({ editor }) => {
    await openStyleMenu(editor)
    await editor.clickTableButton("No borders")

    const value = await editor.value()
    expect(value).toMatch(/<table class="lexxy-content__table--borderless">/)

    await editor.setValue("<p>reset</p>")
    await editor.setValue(value)

    await expect(editor.content.locator("table")).toHaveClass(/lexxy-content__table--borderless/)
  })

  test("the style is persisted in the editor state JSON", async ({ page, editor }) => {
    await openStyleMenu(editor)
    await editor.clickTableButton("No borders")

    const tableJSON = await page.evaluate(() => {
      const state = document.querySelector("lexxy-editor").editor.getEditorState().toJSON()
      return state.root.children.find(node => node.children.some(child => child.type === "tablerow"))
    })

    expect(tableJSON.tableStyle).toBe("borderless")
  })

  test("undo reverts a style change", async ({ page, editor }) => {
    const table = editor.content.locator("table")

    await openStyleMenu(editor)
    await editor.clickTableButton("No borders")
    await expect(table).toHaveClass(/lexxy-content__table--borderless/)

    await editor.content.locator("table td").first().click()
    await page.keyboard.press("ControlOrMeta+z")

    await expect(table).not.toHaveClass(/lexxy-content__table--borderless/)
  })

  test("an unregistered style in loaded HTML is dropped", async ({ editor }) => {
    await editor.setValue('<figure class="lexxy-content__table-wrapper"><table class="lexxy-content__table--unknown"><tbody><tr><td><p>a</p></td></tr></tbody></table></figure>')

    await expect(editor.content.locator("table")).not.toHaveClass(/lexxy-content__table--unknown/)
  })
})

test.describe("Tables — Styles not configured", () => {
  test("the style menu is absent", async ({ page, editor }) => {
    await page.goto("/")
    await page.waitForSelector("lexxy-editor[connected]")
    await page.waitForSelector("lexxy-toolbar[connected]")
    await editor.clickToolbarButton("insertTable")
    await editor.content.locator("table th").first().click()

    await expect(editor.locator.locator("lexxy-table-tools .lexxy-table-control--style")).toHaveCount(0)
  })
})

async function openStyleMenu(editor) {
  await editor.locator
    .locator("lexxy-table-tools .lexxy-table-control--style [data-dropdown-trigger]")
    .click()
}
