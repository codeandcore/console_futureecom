import { fireEvent } from '@testing-library/vue'
import { screen } from '@testing-library/dom'
import { selectGridItemAt } from '~/tests/helpers/fixtures/selectItemAt'

export const attributes = {
  component: 'selectable-customer-groups',
  searchCustomerGroup: 'selectable-customer-groups-search-name',
  filters: 'selectable-customer-groups-grid-drawer',
  filterChips: 'selectable-customer-groups-filter-chips',
  selectedCutomerGroups: 'selectable-customer-groups-chips',
  customerGroupsGrid: 'selectable-customer-groups-grid',
  selectedCustomerGroupChip: 'deletable-chips-customer-group'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getSearchCustomerGroup = () => screen.queryByTestId(attributes.searchCustomerGroup)
  const getFilters = () => screen.queryByTestId(attributes.filters)
  const getFilterChips = () => screen.queryByTestId(attributes.filterChips)
  const getSelectedCustomerGroups = () => screen.queryByTestId(attributes.selectedCutomerGroups)
  const getCustomerGroupsGrid = () => screen.queryByTestId(attributes.customerGroupsGrid)
  const getCustomerGroupsGridLoading = () => screen.queryByText('Loading items...')

  const searchCustomerGroup = async (name: string) => {
    const val = await getSearchCustomerGroup()
    if (val) {
      await fireEvent.update(val, name)
    }
  }

  const selectCustomerGroup = async (index: number) => {
    const val = await getCustomerGroupsGrid()
    if (val) {
      await selectGridItemAt(val, index + 1)
    }
  }

  const getSelectedCustomerGroupName = (index: number): string | null | undefined => {
    return screen.queryByTestId(`${attributes.selectedCustomerGroupChip}-${index}`)?.textContent?.trim()
  }

  return {
    getComponent,
    getSearchCustomerGroup,
    getFilters,
    getFilterChips,
    getSelectedCustomerGroups,
    getCustomerGroupsGrid,
    getCustomerGroupsGridLoading,
    searchCustomerGroup,
    selectCustomerGroup,
    getSelectedCustomerGroupName
  }
}
