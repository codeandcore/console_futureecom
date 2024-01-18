import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { faker } from '@faker-js/faker'
import { fireEvent, waitFor } from '@testing-library/vue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import CopyButtonAction from '@/components/common/actions/CopyButtonAction.vue'
import userEvent from '@testing-library/user-event'

const attributes = {
  component: 'copy-button-action',
  copied: 'copy-button-action-copied',
  icon: 'copy-button-action-icon'
}

const fixtures = () => {
  const getComponent = () => screen.queryByTestId(attributes.component)

  const getIcon = () => screen.queryByTestId(attributes.icon, {})

  const getCopiedIcon = () => screen.queryByTestId(attributes.copied)

  const copy = async () => {
    const val = await getIcon()
    if (val) {
      await fireEvent.click(val)
    }
  }

  return {
    getComponent,
    getIcon,
    getCopiedIcon,
    copy
  }
}

describe('CopyButtonAction component test', () => {
  beforeAll(() => {
    userEvent.setup()
    configure({ testIdAttribute: 'data-cy' })
  })

  it('should mount CopyButtonAction component correctly', () => {
    const valueToCopy = faker.lorem.text()
    const propsData = { 'value': valueToCopy, 'data-cy': attributes.component }

    renderWithMainApp(CopyButtonAction, { propsData })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should copy value on icon click', async () => {
    const valueToCopy = faker.lorem.text()

    const propsData = { 'value': valueToCopy, 'data-cy': attributes.component }
    renderWithMainApp(CopyButtonAction, { propsData })

    await fixtures().copy()

    expect(await navigator.clipboard.readText()).toBe(valueToCopy)
  })

  it('should show the copied status after click on the icon', async () => {
    const propsData = { 'value': faker.lorem.text(), 'data-cy': attributes.component }
    renderWithMainApp(CopyButtonAction, { propsData })

    const { getIcon, getCopiedIcon } = fixtures()

    expect(getIcon()).toBeInTheDocument()
    expect(getCopiedIcon()).not.toBeInTheDocument()

    await fixtures().copy()

    expect(getIcon()).not.toBeInTheDocument()
    expect(getCopiedIcon()).toBeInTheDocument()
  })

  it('should reveal back the icon after click and default useClipboard 1.5s', async () => {
    const propsData = { 'value': faker.lorem.text(), 'data-cy': attributes.component }

    renderWithMainApp(CopyButtonAction, { propsData, stubs: { transition: false } })

    const { getIcon, getCopiedIcon, copy } = fixtures()

    await copy()

    jest.useFakeTimers()
    jest.advanceTimersByTime(2000)

    await waitFor(() => {
      expect(getIcon()).toBeInTheDocument()
      expect(getCopiedIcon()).not.toBeInTheDocument()
    })

    jest.useRealTimers()
  })
})
