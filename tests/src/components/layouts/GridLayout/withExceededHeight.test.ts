import { attributes, fixtures, grid, options } from '~/tests/src/components/layouts/GridLayout/utils/GridLayoutFixtures'
import { configure } from '@testing-library/dom'
import { mockLayoutUtils } from '~/tests/mocks/mockLayoutUtils'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'

// Mocking as jsdom doesn't have native window calculation, so we need to simulate the calculated result
mockLayoutUtils({ hasExceededHeight: jest.fn().mockReturnValue(true) })

import GridLayout from '@/components/layouts/GridLayout.vue'

describe('GridLayout component test that does not fit in the viewport height', () => {
  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
  })

  it('should mount GridLayout component correctly', async () => {
    const propsData = { title: 'Grid Layout', params: {}, options, grid }

    renderWithMainApp(GridLayout, { propsData })

    const { getComponent, getTitle, getStickyBottom, getNonStickyBottom } = fixtures()

    expect(getComponent()).toHaveAttribute('data-cy', attributes.component)

    expect(getComponent()).toBeInTheDocument()
    expect(getTitle()).toBeInTheDocument()
    expect(getStickyBottom()).toBeInTheDocument()
    expect(getNonStickyBottom()).not.toBeInTheDocument()
  })

  it('should mounts footer slots when grid exceeds height', async () => {
    const propsData = { title: 'Grid Layout', params: {}, options, grid }

    const slots = {
      'grid.footer.actions': '<div data-cy="grid-footer-actions"/>',
      'grid.footer.pagination': '<div data-cy="grid-footer-pagination"/>'
    }

    renderWithMainApp(GridLayout, { propsData, slots })

    const { getSlotWithId } = fixtures()

    expect(getSlotWithId('grid-footer-actions')).toBeInTheDocument()
    expect(getSlotWithId('grid-footer-pagination')).toBeInTheDocument()
  })
})
