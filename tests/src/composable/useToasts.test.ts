import '~/tests/configs/vue-composition-api-config.ts'

import { useToasts } from '@/composable/useToasts'

describe('Composable Toasts', () => {
  beforeEach(() => (useToasts().toasts.value = []))

  it('adds success toast to the queue', () => {
    const { toasts, addSuccessToast } = useToasts()
    const toast = addSuccessToast('success toast')
    expect(toasts.value[0]).toEqual(toast)
  })

  it('adds warning toast to the queue', () => {
    const { toasts, addWarningToast } = useToasts()
    const toast = addWarningToast('warning toast')
    expect(toasts.value[0]).toEqual(toast)
  })

  it('adds error toast to the queue', () => {
    const { toasts, addErrorToast } = useToasts()
    const toast = addErrorToast('error toast')
    expect(toasts.value[0]).toEqual(toast)
  })

  it('adds custom toast to the queue', () => {
    const { toasts, addCustomToast } = useToasts()
    const toast = addCustomToast('custom', 'custom toast')
    expect(toasts.value[0]).toEqual(toast)
  })

  it('clears all toasts after fast-forwarding timers', () => {
    jest.useFakeTimers()

    const { toasts, addSuccessToast } = useToasts()
    addSuccessToast('success toast 1')
    addSuccessToast('success toast 2')
    addSuccessToast('success toast 3')
    addSuccessToast('success toast 4')
    expect(toasts.value.length).toEqual(4)

    jest.runAllTimers()

    expect(toasts.value.length).toEqual(0)
  })
})
