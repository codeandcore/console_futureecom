import '@testing-library/jest-dom'
import { ApplicationType } from '@futureecom/futureecom-js/dist/futureecom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { selectItemAt, selectItemClass } from '~/tests/helpers/fixtures/selectItemAt'
import SelectApplication from '@/components/common/selectables/SelectApplication.vue'

const attributes = {
  component: 'select-application'
}

const options: { text: string; value: ApplicationType }[] = [
  { text: 'Storefront', value: ApplicationType.STOREFRONT },
  { text: 'Console', value: ApplicationType.CONSOLE },
  { text: 'Point of Sale', value: ApplicationType.POS },
  { text: 'API', value: ApplicationType.API },
  { text: 'Overview', value: ApplicationType.OVERVIEW }
]

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)

  const open = async () => await fireEvent.click(getComponent())

  const selectApplicationOption = async (container: Element, ...items: ApplicationType[]) => {
    await open()

    for (const item of items) {
      const index = options.findIndex((option) => option.value === item)
      if (index >= 0) {
        await selectItemAt(container, index)
      }
    }
  }

  return {
    getComponent,
    open,
    selectApplicationOption
  }
}

describe('SelectApplication input component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SelectApplication component correctly', async () => {
    const propsData = { value: [], options }
    renderWithMainApp(SelectApplication, { propsData })
    expect(await fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should emit selected items', async () => {
    const propsData = { value: [], options, multiple: true }
    const wrapper = renderWithMainApp(SelectApplication, { propsData })

    await fixtures().selectApplicationOption(wrapper.container, ApplicationType.API, ApplicationType.CONSOLE)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual([ApplicationType.API, ApplicationType.CONSOLE])
  })

  it('shows all options on not provided appTypes props', async () => {
    const propsData = { value: [], options }
    renderWithMainApp(SelectApplication, { propsData })

    await fixtures().open()

    expect(document.querySelectorAll(selectItemClass).length).toBe(5)

    for (const item of options) {
      expect(await screen.findByText(item.text)).toBeInTheDocument()
    }
  })

  it('shows all options on provided in appTypes', async () => {
    const propsData = { value: [], appTypes: [ApplicationType.API, ApplicationType.POS], options }
    renderWithMainApp(SelectApplication, { propsData })

    await fixtures().open()

    expect(document.querySelectorAll(selectItemClass).length).toBe(2)
    expect(await screen.findByText('API')).toBeInTheDocument()
    expect(await screen.findByText('Point of Sale')).toBeInTheDocument()
  })
})
