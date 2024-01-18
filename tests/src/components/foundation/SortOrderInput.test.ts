import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import SortOrderInput from '@/components/foundation/SortOrderInput.vue'

describe('SortOrder common input component test', () => {
  const attribute = 'sort-order-input'
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SortOrder component correctly', () => {
    renderWithMainApp(SortOrderInput, { propsData: { value: {} } })

    const element = screen.getByTestId(attribute)
    expect(element).toHaveAttribute('data-cy', attribute)
  })

  it('returns either number or null based on user inputs', async () => {
    const unchanged = { bar: 'foobar' }
    const value = { ...unchanged, order: null }

    const wrapper = renderWithMainApp(SortOrderInput, { propsData: { value } })
    const element = await screen.getByTestId(attribute)

    await fireEvent.update(element, '1234')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, order: 1234 })

    await fireEvent.update(element, '4567')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, order: 4567 })

    await fireEvent.update(element, 'test')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, order: 0 })

    await fireEvent.update(element, '')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, order: 0 })
  })
})
