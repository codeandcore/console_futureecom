import { fireEvent } from '@testing-library/vue'
import { screen } from '@testing-library/dom'
import { selectGridItemAt } from '~/tests/helpers/fixtures/selectItemAt'
import movePointerPosition from '@/libs/movePointerPosition'
import type { TaxRate } from '@futureecom/futureecom-js/dist/services/tax-service'

export const attributes = {
  component: 'selectable-sale-taxes',
  searchSaleTax: 'selectable-sale-taxes-search-name',
  filters: 'selectable-sale-taxes-grid-drawer',
  filterChips: 'selectable-sale-taxes-filter-chips',
  selectedSaleTaxes: 'selectable-sale-taxes-chips',
  customerGroupsGrid: 'selectable-sale-taxes-grid',
  selectedSaleTaxChip: 'deletable-chips-sale-tax'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getSearchSaleTax = () => screen.queryByTestId(attributes.searchSaleTax)
  const getFilters = () => screen.queryByTestId(attributes.filters)
  const getFilterChips = () => screen.queryByTestId(attributes.filterChips)
  const getSelectedSaleTaxes = () => screen.queryByTestId(attributes.selectedSaleTaxes)
  const getSaleTaxesGrid = () => screen.queryByTestId(attributes.customerGroupsGrid)
  const getSaleTaxesGridLoading = () => screen.queryByText('Loading items...')

  const searchSaleTax = async (name: string) => {
    const val = await getSearchSaleTax()
    if (val) {
      await fireEvent.update(val, name)
    }
  }

  const selectSaleTax = async (index: number) => {
    const val = await getSaleTaxesGrid()
    if (val) {
      await selectGridItemAt(val, index + 1)
    }
  }

  const getSelectedSaleTaxName = (index: number): string | null | undefined => {
    return screen.queryByTestId(`${attributes.selectedSaleTaxChip}-${index}`)?.textContent?.trim()
  }

  return {
    getComponent,
    getSearchSaleTax,
    getFilters,
    getFilterChips,
    getSelectedSaleTaxes,
    getSaleTaxesGrid,
    getSaleTaxesGridLoading,
    searchSaleTax,
    selectSaleTax,
    getSelectedSaleTaxName,
    transformToChipText: (val: TaxRate) => `${val.name} (${movePointerPosition(val.rate, 2)}%)`
  }
}
