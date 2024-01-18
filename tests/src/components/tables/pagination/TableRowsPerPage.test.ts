import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { selectItemAt } from '~/tests/helpers/fixtures/selectItemAt'
import TableRowsPerPage from '@/components/tables/pagination/TableRowsPerPage.vue'

export const attributes = {
  component: 'table-rows-per-page'
}

const options = [
  { text: '5', value: 5 },
  { text: '10', value: 10 },
  { text: '15', value: 15 },
  { text: 'All', value: -1 }
]

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)

  const selectOption = async (container: Element, value: '5' | '10' | '15' | 'All') => {
    await fireEvent.click(getComponent())
    const index = options.findIndex((option) => option.text === value)

    if (index >= 0) {
      await selectItemAt(container, index)
    }
  }

  return {
    getComponent,
    selectOption
  }
}

describe('TableRowsPerPage component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount TableRowsPerPage component correctly', () => {
    const meta = { current_page: 1, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    renderWithMainApp(TableRowsPerPage, { propsData: { meta } })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('emits value on selection and adjusts page based on selected perPage value', async () => {
    const meta = { current_page: 4, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    const wrapper = renderWithMainApp(TableRowsPerPage, { propsData: { meta } })

    await fixtures().selectOption(wrapper.container, '10')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ page: 2, perPage: 10 })

    await fixtures().selectOption(wrapper.container, 'All')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ page: 1, perPage: -1 })
  })
})
