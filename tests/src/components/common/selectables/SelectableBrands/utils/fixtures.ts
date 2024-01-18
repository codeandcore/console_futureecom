import { fireEvent } from '@testing-library/vue'
import { screen } from '@testing-library/dom'
import { selectGridItemAt } from '~/tests/helpers/fixtures/selectItemAt'

export const attributes = {
  component: 'selectable-brands',
  searchBrand: 'selectable-brands-search-name',
  filters: 'selectable-brands-grid-drawer',
  filterChips: 'selectable-brands-filter-chips',
  selectedProducts: 'selectable-brands-chips',
  brandsGrid: 'selectable-brands-grid',
  selectedBrandChip: 'deletable-chips-brand'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getSearchBrand = () => screen.queryByTestId(attributes.searchBrand)
  const getFilters = () => screen.queryByTestId(attributes.filters)
  const getFilterChips = () => screen.queryByTestId(attributes.filterChips)
  const getSelectedBrands = () => screen.queryByTestId(attributes.selectedProducts)
  const getBrandsGrid = () => screen.queryByTestId(attributes.brandsGrid)
  const getBrandsGridLoading = () => screen.queryByText('Loading items...')

  const searchBrand = async (name: string) => {
    const val = await getSearchBrand()
    if (val) {
      await fireEvent.update(val, name)
    }
  }

  const selectBrand = async (index: number) => {
    const val = await getBrandsGrid()
    if (val) {
      await selectGridItemAt(val, index + 1)
    }
  }

  const getSelectedBrandName = (index: number): string | null | undefined => {
    return screen.queryByTestId(`${attributes.selectedBrandChip}-${index}`)?.textContent?.trim()
  }

  return {
    getComponent,
    getSearchBrand,
    getFilters,
    getFilterChips,
    getSelectedBrands,
    getBrandsGrid,
    getBrandsGridLoading,
    searchBrand,
    selectBrand,
    getSelectedBrandName
  }
}
