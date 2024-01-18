import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { useVuetify } from '@/composable/useVuetify'
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import Vuetify from 'vuetify'

export const attributes = {
  component: 'rtl-chevron-icon'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)

  return {
    getComponent
  }
}

describe('RtlChevronIcon component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount RtlChevronIcon component correctly', () => {
    renderWithMainApp(RtlChevronIcon)
    const { getComponent } = fixtures()

    expect(getComponent()).toHaveAttribute('data-cy', attributes.component)
    expect(getComponent()).toBeInTheDocument()
  })

  it('shows right/double right chevron icon on default LTR', async () => {
    const vuetify = useVuetify()

    const wrapper = renderWithMainApp(RtlChevronIcon)
    const { getComponent } = fixtures()

    expect(vuetify?.rtl).toBeFalsy()

    expect(getComponent()).toHaveTextContent('chevron_right')

    await wrapper.updateProps({ doubled: true })

    expect(getComponent()).toHaveTextContent('keyboard_double_arrow_right')
  })

  it('reverses direction and shows left/double left chevron icon on default LTR', async () => {
    const unchanged = { reversed: true }
    const propsData = { ...unchanged }

    const wrapper = renderWithMainApp(RtlChevronIcon, { propsData })
    const { getComponent } = fixtures()

    expect(getComponent()).toHaveTextContent('chevron_left')

    await wrapper.updateProps({ ...unchanged, doubled: true })

    expect(getComponent()).toHaveTextContent('keyboard_double_arrow_left')
  })

  it('shows left/double left chevron icon on RTL', async () => {
    const vuetify = new Vuetify({ rtl: true })

    const wrapper = renderWithMainApp(RtlChevronIcon, { vuetify })

    const { getComponent } = fixtures()

    expect(getComponent()).toHaveTextContent('chevron_left')

    await wrapper.updateProps({ doubled: true })

    expect(getComponent()).toHaveTextContent('keyboard_double_arrow_left')
  })

  it('reverses direction and shows right/double right chevron icon on RTL', async () => {
    const vuetify = new Vuetify({ rtl: true })

    const unchanged = { reversed: true }
    const propsData = { ...unchanged }

    const wrapper = renderWithMainApp(RtlChevronIcon, { propsData, vuetify })

    const { getComponent } = fixtures()

    expect(getComponent()).toHaveTextContent('chevron_right')

    await wrapper.updateProps({ ...propsData, doubled: true })

    expect(getComponent()).toHaveTextContent('keyboard_double_arrow_right')
  })
})
