import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import AddressPreview from '@/components/common/AddressPreview.vue'

export const attributes = {
  component: 'address-preview'
}

export const fixtures = () => ({
  getComponent: () => screen.getByTestId(attributes.component)
})

describe('AddressPreview component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount AddressPreview component correctly', () => {
    const value = {
      given_name: 'Name',
      family_name: 'Surname',
      address_line1: '',
      address_line2: '',
      administrative_area: '',
      postal_code: '',
      is_default: true
    }

    renderWithMainApp(AddressPreview, { propsData: { value, 'data-cy': attributes.component } })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })
})
