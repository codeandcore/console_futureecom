import { attributes, fixtures, grid, options } from '~/tests/src/components/layouts/GridLayout/utils/GridLayoutFixtures'
import { configure } from '@testing-library/dom'
import { hasEmittedEvent } from '~/tests/helpers/getEmittedEventValue'
import { mockLayoutUtils } from '~/tests/mocks/mockLayoutUtils'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'

// Mocking as jsdom doesn't have native window calculation, so we need to simulate the calculated result
mockLayoutUtils({ hasExceededHeight: jest.fn().mockReturnValue(false) })

import GridLayout from '@/components/layouts/GridLayout.vue'

describe('GridLayout component test that fits in the viewport height', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount GridLayout component correctly', async () => {
    const propsData = { title: 'Grid Layout', params: {}, options, grid }

    renderWithMainApp(GridLayout, { propsData })

    const { getComponent, getTitle, getStickyBottom, getNonStickyBottom } = fixtures()

    expect(getComponent()).toHaveAttribute('data-cy', attributes.component)

    expect(getComponent()).toBeInTheDocument()
    expect(getTitle()).toBeInTheDocument()
    expect(getNonStickyBottom()).toBeInTheDocument()
    expect(getStickyBottom()).not.toBeInTheDocument()
  })

  it('emits params change immediately after rendering the component', () => {
    const propsData = { title: 'Grid Layout', params: {}, options, grid }

    const wrapper = renderWithMainApp(GridLayout, { propsData })

    expect(hasEmittedEvent(wrapper, 'paramsChanged')).toBeTrue()
  })

  it('suppresses emitting params change when grid is loading', () => {
    const propsData = { title: 'Grid Layout', params: {}, options, grid: { ...grid, loading: true } }

    const wrapper = renderWithMainApp(GridLayout, { propsData })

    expect(hasEmittedEvent(wrapper, 'paramsChanged')).toBeFalse()
  })

  it('should mounts available grid layout slots + column slots', async () => {
    const propsData = { title: 'Grid Layout', params: {}, options, grid }

    const slots = {
      'title': '<div data-cy="title"/>',
      'subtitle': '<div data-cy="subtitle"/>',
      'actions': '<div data-cy="actions"/>',
      'scrollable.content.top': '<div data-cy="scrollable-content-top"/>',
      'grid.footer.actions': '<div data-cy="grid-footer-actions"/>',
      'grid.footer.pagination': '<div data-cy="grid-footer-pagination"/>',
      'item.name': '<div data-cy="item-name"/>',
      'item.order': '<div data-cy="item-order"/>'
    }

    renderWithMainApp(GridLayout, { propsData, slots })

    const { getSlotWithId, getColumnSlotWithId } = fixtures()

    expect(getSlotWithId('title')).toBeInTheDocument()
    expect(getSlotWithId('subtitle')).toBeInTheDocument()
    expect(getSlotWithId('actions')).toBeInTheDocument()
    expect(getSlotWithId('scrollable-content-top')).toBeInTheDocument()
    expect(getSlotWithId('grid-footer-actions')).toBeInTheDocument()
    expect(getSlotWithId('grid-footer-pagination')).toBeInTheDocument()

    expect(getColumnSlotWithId('item-name').length).toBe(30)
    expect(getColumnSlotWithId('item-order').length).toBe(30)
  })
})
