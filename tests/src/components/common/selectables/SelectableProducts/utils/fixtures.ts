import { fireEvent } from '@testing-library/vue'
import { screen } from '@testing-library/dom'
import { selectGridItemAt } from '~/tests/helpers/fixtures/selectItemAt'

export const attributes = {
  component: 'selectable-products',
  searchProduct: 'selectable-products-search-name',
  filters: 'selectable-products-grid-drawer',
  filterChips: 'selectable-products-filter-chips',
  selectedProducts: 'selectable-products-chips',
  productsGrid: 'selectable-products-grid',
  selectedProductChip: 'deletable-chips-product'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getSearchProduct = () => screen.queryByTestId(attributes.searchProduct)
  const getFilters = () => screen.queryByTestId(attributes.filters)
  const getFilterChips = () => screen.queryByTestId(attributes.filterChips)
  const getSelectedProducts = () => screen.queryByTestId(attributes.selectedProducts)
  const getProductsGrid = () => screen.queryByTestId(attributes.productsGrid)
  const getProductsGridLoading = () => screen.queryByText('Loading items...')

  const searchProduct = async (name: string) => {
    const val = await getSearchProduct()
    if (val) {
      await fireEvent.update(val, name)
    }
  }

  const selectProduct = async (index: number) => {
    const val = await getProductsGrid()
    if (val) {
      await selectGridItemAt(val, index + 1)
    }
  }

  const getSelectedProductName = (index: number): string | null | undefined => {
    return screen.queryByTestId(`${attributes.selectedProductChip}-${index}`)?.textContent?.trim()
  }

  return {
    getComponent,
    getSearchProduct,
    getFilters,
    getFilterChips,
    getSelectedProducts,
    getProductsGrid,
    getProductsGridLoading,
    searchProduct,
    selectProduct,
    getSelectedProductName
  }
}
