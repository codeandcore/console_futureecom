import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import FiltersChips from '@/components/tables/filters/FiltersChips.vue'

export const attributes = {
  component: 'filter-chips',
  filterRange: 'filter-chip-range',
  filterValue: 'filter-chip-value',
  filterLabel: 'filter-chip-label',
  filterDelete: 'filter-chip-delete'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getFilterRange = (code: string) => screen.queryByTestId(`${attributes.filterRange}-${code}`)
  const getFilterLabel = (code: string) => screen.queryByTestId(`${attributes.filterLabel}-${code}`)
  const getFilterValue = (code: string) => screen.queryByTestId(`${attributes.filterValue}-${code}`)
  const getFilterDelete = (code: string) => screen.queryByTestId(`${attributes.filterDelete}-${code}`)

  const deleteFilter = async (code: string) => {
    const val = getFilterDelete(code)
    if (val) {
      await fireEvent.click(val)
    }
  }

  return {
    getComponent,
    getFilterRange,
    getFilterLabel,
    getFilterValue,
    getFilterDelete,
    deleteFilter
  }
}

describe('FiltersChips input component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount FiltersChips component correctly', () => {
    renderWithMainApp(FiltersChips)
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should display only defined AND applied filters', () => {
    const propsData = {
      value: { filter: { name: 'foo', slug: 'bar', empty: '0', range: { gte: 0, lte: 2 } } },
      definitions: [
        { type: 'text', code: 'name', label: 'Name' },
        { type: 'text', code: 'slug', label: 'Slug' },
        { type: 'range', code: 'range', label: 'From-To' }
      ]
    }
    renderWithMainApp(FiltersChips, { propsData })

    const { getFilterLabel, getFilterValue, getFilterRange } = fixtures()
    expect(getFilterLabel('name')?.textContent).toBe('Name')
    expect(getFilterLabel('slug')?.textContent).toBe('Slug')
    expect(getFilterLabel('empty')?.textContent).toBe(undefined)
    expect(getFilterLabel('range')?.textContent).toBe('From-To')

    expect(getFilterValue('name')?.textContent).toBe('foo')
    expect(getFilterValue('slug')?.textContent).toBe('bar')
    expect(getFilterValue('empty')?.textContent).toBe(undefined)
    expect(getFilterRange('range')?.textContent).not.toBe(undefined)
  })

  it('emits updated filter value on delete chip click and sets page to 1', async () => {
    const propsData = {
      value: { filter: { name: 'foo', slug: 'bar', empty: '0', range: { gte: 0, lte: 2 } } },
      definitions: [
        { type: 'text', code: 'name', label: 'Name' },
        { type: 'text', code: 'slug', label: 'Slug' },
        { type: 'range', code: 'range', label: 'From-To' }
      ]
    }

    const wrapper = renderWithMainApp(FiltersChips, { propsData })

    await fixtures().deleteFilter('slug')

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      filter: { name: 'foo', empty: '0', range: { gte: 0, lte: 2 } },
      page: 1
    })
  })
})
