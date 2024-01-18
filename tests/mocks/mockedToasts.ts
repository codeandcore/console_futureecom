import { mockedReactiveGetter } from '~/tests/helpers/mockedReactiveGetter'

export const mockedUseToast = {
  toasts: mockedReactiveGetter(),
  addSuccessToast: jest.fn(),
  addWarningToast: jest.fn(),
  addErrorToast: jest.fn(),
  addCustomToast: jest.fn()
}

jest.mock('@/composable/useToasts', () => ({
  useToasts: jest.fn().mockReturnValue(mockedUseToast)
}))
