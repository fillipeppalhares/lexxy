import { TableNode } from "@lexical/table"
import { createElement } from "../helpers/html_helper"
import { tableStyleClassName, tableStyleNameFromClassList } from "../helpers/table_style_helper"

export class WrappedTableNode extends TableNode {
  __tableStyle

  $config() {
    return this.config("wrapped_table_node", { extends: TableNode })
  }

  static importDOM() {
    const { table } = super.importDOM()

    return {
      table: (element) => {
        const importer = table(element)

        return {
          ...importer,
          priority: importer.priority + 1,
          conversion: (tableElement) => {
            const output = importer.conversion(tableElement)
            output.node.setTableStyle(tableStyleNameFromClassList(tableElement.classList))
            return output
          }
        }
      }
    }
  }

  afterCloneFrom(prevNode) {
    super.afterCloneFrom(prevNode)
    this.__tableStyle = prevNode.__tableStyle
  }

  exportJSON() {
    return { ...super.exportJSON(), tableStyle: this.getTableStyle() ?? undefined }
  }

  updateFromJSON(serializedNode) {
    return super.updateFromJSON(serializedNode).setTableStyle(serializedNode.tableStyle ?? null)
  }

  getTableStyle() {
    return this.getLatest().__tableStyle ?? null
  }

  setTableStyle(name) {
    const self = this.getWritable()
    self.__tableStyle = name
    return self
  }

  createDOM(config, editor) {
    const dom = super.createDOM(config, editor)
    this.#applyTableStyle(dom, null)
    return dom
  }

  updateDOM(prevNode, dom, config) {
    const needsReplacement = super.updateDOM(prevNode, dom, config)

    if (!needsReplacement) {
      this.#applyTableStyle(dom, prevNode.__tableStyle)
    }

    return needsReplacement
  }

  canInsertTextBefore() {
    return false
  }

  canInsertTextAfter() {
    return false
  }

  exportDOM(editor) {
    const superExport = super.exportDOM(editor)

    return {
      ...superExport,
      after: (tableElement) => {
        if (superExport.after) {
          tableElement = superExport.after(tableElement)
          const clonedTable = tableElement.cloneNode(true)
          const wrappedTable = createElement("figure", { className: "lexxy-content__table-wrapper" }, clonedTable.outerHTML)
          return wrappedTable
        }

        return tableElement
      }
    }
  }

  #applyTableStyle(dom, previousName) {
    const tableElement = dom.matches("table") ? dom : dom.querySelector("table")

    if (previousName) {
      tableElement.classList.remove(tableStyleClassName(previousName))
    }

    if (this.__tableStyle) {
      tableElement.classList.add(tableStyleClassName(this.__tableStyle))
    }
  }
}
