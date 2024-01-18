import { mockedReactiveGetter } from '~/tests/helpers/mockedReactiveGetter'

jest.mock('@/composable/repositories/useStores', () => ({
  useStores: jest.fn().mockReturnValue({
    loadingStores: mockedReactiveGetter(),
    currentStore: mockedReactiveGetter(),
    collection: mockedReactiveGetter(),
    fetchStores: jest.fn(),
    getStore: jest.fn(),
    setStores: jest.fn()
  })
}))
