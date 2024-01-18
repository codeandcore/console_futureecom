export const errorMessageClass = '.v-messages.error--text'

export const getElemErrorMessage = (container: Element): string => {
  return container.querySelectorAll(errorMessageClass)[0]?.textContent?.trim() || ''
}

export const getErrorMessageElement = (container: Element): Element | undefined => {
  return container.querySelectorAll(errorMessageClass)[0] || undefined
}
