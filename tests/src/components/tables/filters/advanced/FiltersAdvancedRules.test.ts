import '@testing-library/jest-dom'
import { FilterEmptyValuesEnums } from '@/types/FilterDefinitions'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import FiltersAdvancedRules from '@/components/tables/filters/advanced/FiltersAdvancedRules.vue'

const attributes = {
  input: 'filters-advanced-rules',
  items: 'filters-advanced-rules-item',
  selected: 'filters-advanced-rules-selection'
}

describe('FiltersAdvancedRules input component test', () => {
  const rules = ['eq', 'neq']

  const getInput = () => screen.getByTestId(attributes.input)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount FiltersAdvancedRules component correctly', () => {
    renderWithMainApp(FiltersAdvancedRules, {
      propsData: {
        value: { rule: 'eq', behaviour: FilterEmptyValuesEnums.EMPTY_ARRAY },
        rules
      }
    })
    expect(getInput()).toHaveAttribute('data-cy', attributes.input)
  })

  it('should bind value to input, open dropdown, emit selected element and update input with selected value', async () => {
    const propsData = {
      value: { rule: 'eq', behaviour: FilterEmptyValuesEnums.EMPTY_ARRAY },
      rules
    }

    const wrapper = renderWithMainApp(FiltersAdvancedRules, { propsData })

    const element = await screen.getByTestId(attributes.selected)
    expect(element.innerText.trim()).toBe('equals')

    await fireEvent.click(getInput())

    const availableOptionElements = screen.getAllByTestId(attributes.items)
    await fireEvent.click(availableOptionElements[1])

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      rule: 'neq',
      behaviour: FilterEmptyValuesEnums.EMPTY_ARRAY
    })
    const updatedElement = await screen.getByTestId(attributes.selected)

    expect(updatedElement.innerText.trim()).toBe('does not equal')
  })
})
