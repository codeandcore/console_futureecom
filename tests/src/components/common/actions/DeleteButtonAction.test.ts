import '@testing-library/jest-dom'
import * as buttonAction from '~/tests/src/components/common/actions/ButtonAction.test'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { hasEmittedEvent } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import DeleteButtonActionAction from '@/components/common/actions/DeleteButton.vue'
import userEvent from '@testing-library/user-event'

const { component, ...buttonActionAttributes } = buttonAction.attributes
const { getComponent, ...buttonActionFixtures } = buttonAction.fixtures()

export const attributes = {
  component: 'delete-button-action-dialog-wrapper',
  closeDialog: 'delete-button-action-close',
  dialogContent: 'delete-button-action-content',
  dialogTitle: 'delete-button-action-title',
  dialogCancel: 'delete-action-no-btn',
  dialogAccept: 'delete-action-yes-btn',
  ...buttonActionAttributes
}

export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)
  const getButtonAction = () => screen.queryByTestId(attributes.hoverActivator)
  const getCloseDialog = () => screen.queryByTestId(attributes.closeDialog)
  const getDialogContent = () => screen.queryByTestId(attributes.dialogContent)
  const getDialogTitle = () => screen.queryByTestId(attributes.dialogTitle)
  const getDialogCancel = () => screen.queryByTestId(attributes.dialogCancel)
  const getDialogAccept = () => screen.queryByTestId(attributes.dialogAccept)

  const openDialog = async () => {
    const val = getButtonAction()
    if (val) {
      await fireEvent.click(val)
    }
  }

  const closeDialog = async () => {
    const val = getCloseDialog()
    if (val) {
      await fireEvent.click(val)
    }
  }

  const accept = async () => {
    const val = getDialogAccept()
    if (val) {
      await fireEvent.click(val)
    }
  }
  const cancel = async () => {
    const val = getDialogCancel()
    if (val) {
      await fireEvent.click(val)
    }
  }

  return {
    getComponent,
    getButtonAction,
    getCloseDialog,
    getDialogContent,
    getDialogTitle,
    getDialogCancel,
    getDialogAccept,
    openDialog,
    closeDialog,
    accept,
    cancel,
    ...buttonActionFixtures
  }
}

describe('DeleteButtonActionAction component test', () => {
  beforeAll(() => {
    configure({ testIdAttribute: 'data-cy' })
    userEvent.setup()
  })

  it('should mount DeleteButtonActionAction component correctly', () => {
    renderWithMainApp(DeleteButtonActionAction)
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should open dialog with content and yes/no buttons after clicking on the button', async () => {
    renderWithMainApp(DeleteButtonActionAction, { propsData: { label: 'foo bar' } })
    const wrapperFixtures = fixtures()

    expect(wrapperFixtures.getDialogContent()).not.toBeInTheDocument()
    expect(wrapperFixtures.getCloseDialog()).not.toBeInTheDocument()
    expect(wrapperFixtures.getDialogAccept()).not.toBeInTheDocument()
    expect(wrapperFixtures.getDialogCancel()).not.toBeInTheDocument()
    expect(wrapperFixtures.getDialogTitle()).not.toBeInTheDocument()

    await wrapperFixtures.openDialog()

    expect(wrapperFixtures.getDialogContent()).toBeInTheDocument()
    expect(wrapperFixtures.getCloseDialog()).toBeInTheDocument()
    expect(wrapperFixtures.getDialogAccept()).toBeInTheDocument()
    expect(wrapperFixtures.getDialogCancel()).toBeInTheDocument()
    expect(wrapperFixtures.getDialogTitle()).toBeInTheDocument()

    expect(wrapperFixtures.getDialogContent()).toBeVisible()
    expect(wrapperFixtures.getCloseDialog()).toBeVisible()
    expect(wrapperFixtures.getDialogAccept()).toBeVisible()
    expect(wrapperFixtures.getDialogCancel()).toBeVisible()
    expect(wrapperFixtures.getDialogTitle()).toBeVisible()
  })

  it('should close dialog after clicking on close icon', async () => {
    renderWithMainApp(DeleteButtonActionAction)

    const { openDialog, getDialogContent, closeDialog } = fixtures()

    await openDialog()
    expect(getDialogContent()).toBeInTheDocument()

    await closeDialog()
    expect(getDialogContent()).not.toBeInTheDocument()
  })

  it('should close dialog after clicking on canceling button', async () => {
    renderWithMainApp(DeleteButtonActionAction)

    const { openDialog, getDialogContent, cancel } = fixtures()

    await openDialog()
    expect(getDialogContent()).toBeInTheDocument()

    await cancel()
    expect(getDialogContent()).not.toBeInTheDocument()
  })

  it('should close dialog after clicking on accept button and emit click event', async () => {
    const wrapper = renderWithMainApp(DeleteButtonActionAction)

    const { openDialog, getDialogContent, accept } = fixtures()

    await openDialog()
    expect(getDialogContent()).toBeInTheDocument()

    await accept()
    expect(getDialogContent()).not.toBeInTheDocument()

    expect(hasEmittedEvent(wrapper, 'click')).toBeTrue()
  })

  it('should not open dialog with suppressed confirmation and call out the given "click" event action', async () => {
    renderWithMainApp(DeleteButtonActionAction, { propsData: { suppressConfirmation: true } })

    const { openDialog, getDialogContent } = fixtures()

    await openDialog()
    expect(getDialogContent()).not.toBeInTheDocument()
  })

  it('displays "delete" icon name if button is supposed to be an icon alike', async () => {
    renderWithMainApp(DeleteButtonActionAction, { propsData: { icon: true } })
    expect(fixtures().getIcon()?.textContent).toBe('delete')
  })

  it('displays "Delete" label if label prop was not provided', async () => {
    renderWithMainApp(DeleteButtonActionAction)
    expect(fixtures().getLabel()?.textContent).toBe('Delete')
  })
  it('displays provided label', async () => {
    renderWithMainApp(DeleteButtonActionAction, { propsData: { label: 'Foo bar' } })
    expect(fixtures().getLabel()?.textContent).toBe('Foo bar')
  })
  it('colors the button to red when it is not an icon', async () => {
    renderWithMainApp(DeleteButtonActionAction)
    expect(fixtures().getHoverActivator()).toHaveClass('error--text')
  })
})
