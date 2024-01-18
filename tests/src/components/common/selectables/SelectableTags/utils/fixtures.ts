import { fireEvent } from '@testing-library/vue'
import { screen } from '@testing-library/dom'
import { selectGridItemAt } from '~/tests/helpers/fixtures/selectItemAt'

export const attributes = {
  component: 'selectable-tags',
  searchTag: 'selectable-tags-search-name',
  filters: 'selectable-tags-grid-drawer',
  filterChips: 'selectable-tags-filter-chips',
  selectedTags: 'selectable-tags-chips',
  tagsGrid: 'selectable-tags-grid',
  selectedTagChip: 'deletable-chips-tag'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getSearchTag = () => screen.queryByTestId(attributes.searchTag)
  const getFilters = () => screen.queryByTestId(attributes.filters)
  const getFilterChips = () => screen.queryByTestId(attributes.filterChips)
  const getSelectedTags = () => screen.queryByTestId(attributes.selectedTags)
  const getTagsGrid = () => screen.queryByTestId(attributes.tagsGrid)
  const getTagsGridLoading = () => screen.queryByText('Loading items...')

  const searchTag = async (name: string) => {
    const val = await getSearchTag()
    if (val) {
      await fireEvent.update(val, name)
    }
  }

  const selectTag = async (index: number) => {
    const val = await getTagsGrid()
    if (val) {
      await selectGridItemAt(val, index + 1)
    }
  }

  const getSelectedTagName = (index: number): string | null | undefined => {
    return screen.queryByTestId(`${attributes.selectedTagChip}-${index}`)?.textContent?.trim()
  }

  return {
    getComponent,
    getSearchTag,
    getFilters,
    getFilterChips,
    getSelectedTags,
    getTagsGrid,
    getTagsGridLoading,
    searchTag,
    selectTag,
    getSelectedTagName
  }
}
