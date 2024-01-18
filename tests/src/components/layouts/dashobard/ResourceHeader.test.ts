import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent, waitFor } from '@testing-library/vue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'

export const attributes = {
  component: 'resource-header',
  title: 'resource-header-title',
  subtitle: 'resource-header-subtitle',
  backTo: 'resource-header-back-to'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getTitle = () => screen.queryByTestId(attributes.title)
  const getSubtitle = () => screen.queryByTestId(attributes.subtitle)
  const getBackToButton = () => screen.queryByTestId(attributes.backTo)

  const backToButtonClick = async () => {
    const val = fixtures().getBackToButton()
    if (val) {
      await fireEvent.click(val)
    }
  }

  return {
    getComponent,
    getTitle,
    getSubtitle,
    getBackToButton,
    backToButtonClick
  }
}

describe('ResourceHeader component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount ResourceHeader component correctly', () => {
    renderWithMainApp(ResourceHeader)
    const { getComponent, getTitle, getSubtitle, getBackToButton } = fixtures()

    expect(getComponent()).toHaveAttribute('data-cy', attributes.component)
    expect(getComponent()).toBeInTheDocument()

    expect(getTitle()).not.toBeInTheDocument()
    expect(getSubtitle()).not.toBeInTheDocument()
    expect(getBackToButton()).not.toBeInTheDocument()
  })

  it('displays title, subtitle, back button when provided', async () => {
    const propsData = { header: 'Foo', subheader: 'Bar', backTo: 'foos' }
    renderWithMainApp(ResourceHeader, { propsData })

    const { getTitle, getSubtitle, getBackToButton } = fixtures()

    expect(getTitle()).toBeInTheDocument()
    expect(getTitle()).toHaveTextContent('Foo')

    expect(getSubtitle()).toBeInTheDocument()
    expect(getSubtitle()).toHaveTextContent('Bar')

    expect(getBackToButton()).toBeInTheDocument()
  })

  it('updates document meta title based on provided header', async () => {
    const propsData = { header: 'Foo' }
    const wrapper = renderWithMainApp(ResourceHeader, { propsData })

    await waitFor(() => expect(document.title).toBe('Foo'))

    await wrapper.updateProps({ header: 'Bar' })

    await waitFor(() => expect(document.title).toBe('Bar'))
  })
})
