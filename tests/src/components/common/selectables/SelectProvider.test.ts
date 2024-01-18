import '@testing-library/jest-dom'
import { UserType } from '@futureecom/futureecom-js/dist/services/auth-service'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { selectItemAt } from '~/tests/helpers/fixtures/selectItemAt'
import SelectProvider from '@/components/common/selectables/SelectProvider.vue'

const attributes = {
  component: 'select-provider'
}

const options: { text: string; value: UserType }[] = [
  { text: 'Guest', value: UserType.GUEST },
  { text: 'Customer', value: UserType.CUSTOMER },
  { text: 'Admin', value: UserType.ADMIN },
  { text: 'Super Admin', value: UserType.SUPER_ADMIN }
]

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)

  const selectUserTypeOption = async (container: Element, ...items: UserType[]) => {
    await fireEvent.click(getComponent())

    for (const item of items) {
      const index = options.findIndex((option) => option.value === item)
      if (index >= 0) {
        await selectItemAt(container, index)
      }
    }
  }

  return {
    getComponent,
    selectUserTypeOption
  }
}

describe('SelectProvider input component test', () => {
  const getComponent = () => screen.getByTestId(attributes.component)

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount SelectProvider component correctly', async () => {
    const propsData = { value: { providers: [] }, options }
    renderWithMainApp(SelectProvider, { propsData })
    expect(await getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should emit selected items', async () => {
    const propsData = { value: [], options, multiple: true }
    const wrapper = renderWithMainApp(SelectProvider, { propsData })

    await fixtures().selectUserTypeOption(wrapper.container, UserType.GUEST, UserType.CUSTOMER)

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(['guest', 'customer'])
  })
})
