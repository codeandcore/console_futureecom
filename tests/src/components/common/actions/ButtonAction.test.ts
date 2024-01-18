import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import userEvent from '@testing-library/user-event'

export const attributes = {
  component: 'button-action',
  hoverActivator: 'button-action-activator',
  icon: 'button-action-icon',
  label: 'button-action-text',
  tooltipText: 'button-action-tooltip-text'
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getHoverActivator = () => screen.getByTestId(attributes.hoverActivator)
  const getIcon = () => screen.queryByTestId(attributes.icon)
  const getLabel = () => screen.queryByTestId(attributes.label)
  const getTooltipText = () => screen.queryByTestId(attributes.tooltipText)

  const hoverOnButton = async () => {
    const val = getHoverActivator()
    if (val) {
      await userEvent.hover(val)
    }
  }

  return {
    getComponent,
    getHoverActivator,
    getIcon,
    getLabel,
    getTooltipText,
    hoverOnButton
  }
}

describe('ButtonAction component test', () => {
  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    userEvent.setup()
  })

  it('should mount ButtonAction component correctly', () => {
    renderWithMainApp(ButtonAction)
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('displays button with label', () => {
    renderWithMainApp(ButtonAction)
    expect(fixtures().getLabel()).toBeInTheDocument()
    expect(fixtures().getLabel()?.textContent?.trim()).toBe('')
    expect(fixtures().getIcon()).not.toBeInTheDocument()
  })

  it('displays button with label and item counter', () => {
    const propsData = { label: 'Foo', items: [1, 2, 3, 4] }
    renderWithMainApp(ButtonAction, { propsData })
    expect(fixtures().getLabel()).toBeInTheDocument()
    expect(fixtures().getLabel()?.textContent?.trim()).toBe('Foo (4)')
    expect(fixtures().getIcon()).not.toBeInTheDocument()
  })

  it('displays icon and tooltip label on hover', async () => {
    const propsData = { label: 'Foo', items: [1, 2, 3, 4], iconName: 'close' }
    renderWithMainApp(ButtonAction, { propsData })

    const { getLabel, getIcon, getTooltipText, hoverOnButton } = fixtures()

    expect(getLabel()).not.toBeInTheDocument()
    expect(getIcon()).toBeInTheDocument()
    expect(getTooltipText()).not.toBeInTheDocument()

    await hoverOnButton()
    expect(getTooltipText()?.textContent).toBe('Foo')
  })

  it('displays label, but does not show tooltip on hover', async () => {
    const propsData = { label: 'Foo', items: [1, 2, 3, 4], text: false }
    renderWithMainApp(ButtonAction, { propsData })

    const { getLabel, getIcon, getTooltipText, hoverOnButton } = fixtures()

    expect(getIcon()).not.toBeInTheDocument()
    expect(getLabel()).toBeInTheDocument()
    expect(getTooltipText()).not.toBeInTheDocument()

    await hoverOnButton()

    expect(getTooltipText()).not.toBeInTheDocument()
  })
})
