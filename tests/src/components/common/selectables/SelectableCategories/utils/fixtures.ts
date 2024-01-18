import { fireEvent } from '@testing-library/vue'
import { screen } from '@testing-library/dom'
import { selectGridItemAt } from '~/tests/helpers/fixtures/selectItemAt'

export const attributes = {
  component: 'selectable-categories',
  searchCategory: 'selectable-categories-search-name',
  filters: 'selectable-categories-grid-drawer',
  filterChips: 'selectable-categories-filter-chips',
  selectedCategories: 'selectable-categories-chips',
  categoriesGrid: 'selectable-categories-grid',
  selectedCategoryChip: 'deletable-chips-category'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getSearchCategory = () => screen.queryByTestId(attributes.searchCategory)
  const getFilters = () => screen.queryByTestId(attributes.filters)
  const getFilterChips = () => screen.queryByTestId(attributes.filterChips)
  const getSelectedCategories = () => screen.queryByTestId(attributes.selectedCategories)
  const getCategoriesGrid = () => screen.queryByTestId(attributes.categoriesGrid)
  const getCategoriesGridLoading = () => screen.queryByText('Loading items...')

  const searchCategory = async (name: string) => {
    const val = await getSearchCategory()
    if (val) {
      await fireEvent.update(val, name)
    }
  }

  const selectCategory = async (index: number) => {
    const val = await getCategoriesGrid()
    if (val) {
      await selectGridItemAt(val, index + 1)
    }
  }

  const getSelectedCategoryName = (index: number): string | null | undefined => {
    return screen.queryByTestId(`${attributes.selectedCategoryChip}-${index}`)?.textContent?.trim()
  }

  return {
    getComponent,
    getSearchCategory,
    getFilters,
    getFilterChips,
    getSelectedCategories,
    getCategoriesGrid,
    getCategoriesGridLoading,
    searchCategory,
    selectCategory,
    getSelectedCategoryName
  }
}
