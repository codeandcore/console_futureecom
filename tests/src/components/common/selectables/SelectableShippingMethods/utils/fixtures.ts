import { fireEvent } from '@testing-library/vue'
import { screen } from '@testing-library/dom'
import { selectGridItemAt } from '~/tests/helpers/fixtures/selectItemAt'

export const attributes = {
  component: 'selectable-shipping-methods',
  searchShippingMethod: 'selectable-shipping-methods-search-name',
  filters: 'selectable-shipping-methods-grid-drawer',
  filterChips: 'selectable-shipping-methods-filter-chips',
  selectedShippingMethods: 'selectable-shipping-methods-chips',
  shippingMethodsGrid: 'selectable-shipping-methods-grid',
  selectedShippingMethodChip: 'deletable-chips-shipping-method'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getSearchShippingMethod = () => screen.queryByTestId(attributes.searchShippingMethod)
  const getFilters = () => screen.queryByTestId(attributes.filters)
  const getFilterChips = () => screen.queryByTestId(attributes.filterChips)
  const getSelectedShippingMethods = () => screen.queryByTestId(attributes.selectedShippingMethods)
  const getShippingMethodsGrid = () => screen.queryByTestId(attributes.shippingMethodsGrid)
  const getShippingMethodsGridLoading = () => screen.queryByText('Loading items...')

  const searchShippingMethod = async (name: string) => {
    const val = await getSearchShippingMethod()
    if (val) {
      await fireEvent.update(val, name)
    }
  }

  const selectShippingMethod = async (index: number) => {
    const val = await getShippingMethodsGrid()
    if (val) {
      await selectGridItemAt(val, index + 1)
    }
  }

  const getSelectedShippingMethodName = (index: number): string | null | undefined => {
    return screen.queryByTestId(`${attributes.selectedShippingMethodChip}-${index}`)?.textContent?.trim()
  }

  return {
    getComponent,
    getSearchShippingMethod,
    getFilters,
    getFilterChips,
    getSelectedShippingMethods,
    getShippingMethodsGrid,
    getShippingMethodsGridLoading,
    searchShippingMethod,
    selectShippingMethod,
    getSelectedShippingMethodName
  }
}
