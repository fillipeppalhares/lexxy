const CLASS_PREFIX = "lexxy-content__table--"
const VALID_NAME = /^[a-z][a-z0-9-]*$/
const RESERVED_NAMES = [ "selection" ]

export function tableStyleClassName(name) {
  return `${CLASS_PREFIX}${name}`
}

export function tableStyleNameFromClassList(classList) {
  const className = Array.from(classList).find(name => name.startsWith(CLASS_PREFIX))
  return className?.slice(CLASS_PREFIX.length) ?? null
}

export function validatedTableStyles(styles) {
  const names = new Set()

  for (const { name } of styles) {
    if (!VALID_NAME.test(name) || RESERVED_NAMES.includes(name)) {
      throw new Error(`Invalid table style name "${name}": use lowercase letters, digits and dashes, starting with a letter (reserved: ${RESERVED_NAMES.join(", ")})`)
    }

    if (names.has(name)) {
      throw new Error(`Duplicate table style name "${name}"`)
    }

    names.add(name)
  }

  return styles
}
