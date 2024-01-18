import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { getElemErrorMessage, getErrorMessageElement } from '~/tests/helpers/fixtures/getElemErrorMessage'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import DescriptionInput from '@/components/foundation/DescriptionInput.vue'

const attributes = {
  component: 'description-input'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)

  return {
    getComponent
  }
}

describe('DescriptionInput component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount DescriptionInput component correctly', () => {
    renderWithMainApp(DescriptionInput, { propsData: { value: { description: '' } } })

    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('displays validation error when it is provided', async () => {
    const value = { description: '' }

    renderWithMainApp(DescriptionInput, { propsData: { value, errorMessage: 'The error' } })
    expect(getElemErrorMessage(fixtures().getComponent())).toBe('The error')
  })

  it('does not show validation error if not provided', async () => {
    const value = { description: '' }

    renderWithMainApp(DescriptionInput, { propsData: { value, errorMessage: '' } })
    expect(getErrorMessageElement(fixtures().getComponent())).toBeFalsy()
  })
})
