import { faker } from '@faker-js/faker'
import { gridFactoryMeta } from '~/tests/factories/collectionFactory'
import { screen } from '@testing-library/dom'
import type { Grid, ResourceGridOptions } from '@/types/Grids'

export const attributes = {
  component: 'grid-layout',
  title: 'grid-layout-title',
  nonStickyBottom: 'grid-layout-non-sticky-bottom',
  stickyBottom: 'grid-layout-sticky-bottom',
  resourceGrid: 'grid-layout-resources-grid'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getTitle = () => screen.queryByTestId(attributes.title)
  const getNonStickyBottom = () => screen.queryByTestId(attributes.nonStickyBottom)
  const getStickyBottom = () => screen.queryByTestId(attributes.stickyBottom)
  const getResourceGrid = () => screen.queryByTestId(attributes.resourceGrid)

  const getSlotWithId = (id: string) => screen.queryByTestId(id)
  const getColumnSlotWithId = (id: string) => screen.queryAllByTestId(id)

  return {
    getComponent,
    getTitle,
    getNonStickyBottom,
    getStickyBottom,
    getResourceGrid,
    getSlotWithId,
    getColumnSlotWithId
  }
}

const dataSampleFactory = () => ({ name: faker.lorem.word(), order: faker.number.int() })
const data = faker.helpers.multiple(() => dataSampleFactory(), { count: 30 })

export const grid: Grid = { loading: false, data, meta: gridFactoryMeta(data, { override: { per_page: -1 } }) }
export const options: ResourceGridOptions = {
  headers: [
    { text: 'name', value: 'name' },
    { text: 'order', value: 'order' }
  ]
}
