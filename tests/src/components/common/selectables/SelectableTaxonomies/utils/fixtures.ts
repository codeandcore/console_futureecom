import { fireEvent } from '@testing-library/vue'
import { screen } from '@testing-library/dom'
import { selectGridItemAt } from '~/tests/helpers/fixtures/selectItemAt'

export const attributes = {
  component: 'selectable-taxonomies',
  searchTaxonomy: 'selectable-taxonomies-search-name',
  filters: 'selectable-taxonomies-grid-drawer',
  filterChips: 'selectable-taxonomies-filter-chips',
  selectedTaxonomies: 'selectable-taxonomies-chips',
  taxonomiesGrid: 'selectable-taxonomies-grid',
  selectedTaxonomyChip: 'deletable-chips-taxonomy'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getSearchTaxonomy = () => screen.queryByTestId(attributes.searchTaxonomy)
  const getFilters = () => screen.queryByTestId(attributes.filters)
  const getFilterChips = () => screen.queryByTestId(attributes.filterChips)
  const getSelectedTaxonomies = () => screen.queryByTestId(attributes.selectedTaxonomies)
  const getTaxonomiesGrid = () => screen.queryByTestId(attributes.taxonomiesGrid)
  const getTaxonomiesGridLoading = () => screen.queryByText('Loading items...')

  const searchTaxonomy = async (name: string) => {
    const val = await getSearchTaxonomy()
    if (val) {
      await fireEvent.update(val, name)
    }
  }

  const selectTaxonomy = async (index: number) => {
    const val = await getTaxonomiesGrid()
    if (val) {
      await selectGridItemAt(val, index + 1)
    }
  }

  const getSelectedTaxonomyName = (index: number): string | null | undefined => {
    return screen.queryByTestId(`${attributes.selectedTaxonomyChip}-${index}`)?.textContent?.trim()
  }

  return {
    getComponent,
    getSearchTaxonomy,
    getFilters,
    getFilterChips,
    getSelectedTaxonomies,
    getTaxonomiesGrid,
    getTaxonomiesGridLoading,
    searchTaxonomy,
    selectTaxonomy,
    getSelectedTaxonomyName
  }
}
