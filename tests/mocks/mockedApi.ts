import { mockedReactiveGetter } from '~/tests/helpers/mockedReactiveGetter'

jest.mock('@/libs/api', () => ({
  accessToken: mockedReactiveGetter(),
  refreshToken: mockedReactiveGetter(),
  api: jest.fn(),
  setApiConfig: jest.fn()
}))
