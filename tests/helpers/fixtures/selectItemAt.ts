import { fireEvent } from '@testing-library/vue'

export const selectItemClass = '.v-list-item.v-list-item--link'
export const selectGridItemClass = '.v-input--selection-controls__input'

export const selectItemAt = async (container: Element, index: number) => {
  await fireEvent.click(container.querySelectorAll(selectItemClass)[index])
}

export const selectGridItemAt = async (container: Element, index: number) => {
  await fireEvent.click(container.querySelectorAll(selectGridItemClass)[index])
}
