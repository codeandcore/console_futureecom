import '@testing-library/jest-dom'
import * as TablePaginationControls from '~/tests/src/components/tables/pagination/TablePaginationControls.test'
import * as TableRowsPerPage from '~/tests/src/components/tables/pagination/TableRowsPerPage.test'
import { configure, screen } from '@testing-library/dom'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'

export const attributes = {
  component: 'table-rows-per-page',
  attributesTableRowsPerPage: TableRowsPerPage.attributes,
  attributesTablePaginationControls: TablePaginationControls.attributes
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)

  return {
    getComponent,
    fixturesTableRowsPerPage: TableRowsPerPage.fixtures(),
    fixturesTablePaginationControls: TablePaginationControls.fixtures()
  }
}

describe('TablePagination component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount TablePagination component correctly', () => {
    const meta = { current_page: 1, from: 1, last_page: 4, path: '', per_page: 5, to: 5, total: 20 }
    renderWithMainApp(TablePagination, { propsData: { meta } })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('re-emits changed value and does not remove params', async () => {
    const value = { sort: ['foo'], filters: { name: 'foo' } }
    const meta = { current_page: 1, from: 0, last_page: 8, path: '', per_page: 5, to: 5, total: 40 }
    const wrapper = renderWithMainApp(TablePagination, { propsData: { value, meta } })

    await fixtures().fixturesTableRowsPerPage.selectOption(wrapper.container, '10')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...value, page: 1, perPage: 10 })

    await fixtures().fixturesTablePaginationControls.jumpToNextPage()
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...value, page: 2 })
  })
})
