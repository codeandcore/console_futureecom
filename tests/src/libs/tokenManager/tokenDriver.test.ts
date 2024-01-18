import { mockedEnvs } from '~/tests/mocks/mockedEnvs'
import type { TokenDriver } from '@/types/TokenDriver'

describe('Driver manager tests', () => {
  let strategies: TokenDriver

  beforeEach(() => {
    strategies = { get: jest.fn(), set: jest.fn() }
  })

  afterEach(() => jest.resetModules())

  it('instantiates token driver with cookies', () => {
    mockedEnvs({ TOKEN: { STRATEGY: 'cookie' } })

    jest.doMock('@/libs/tokenManager/strategies/cookie', () => ({
      cookieStrategy: strategies
    }))

    const driver = require('@/libs/tokenManager/driver').tokenDriver()

    driver.get('access_token')
    driver.set('access_token', 'foo_bar')
    expect(strategies.get).toBeCalledWith('access_token')
    expect(strategies.set).toBeCalledWith('access_token', 'foo_bar')
  })

  it('instantiates token driver with session storage', () => {
    mockedEnvs({ TOKEN: { STRATEGY: 'session' } })

    jest.doMock('@/libs/tokenManager/strategies/sessionStorage', () => ({
      sessionStorageStrategy: strategies
    }))

    const driver = require('@/libs/tokenManager/driver').tokenDriver()

    driver.get('access_token')
    driver.set('access_token', 'foo_bar')
    expect(strategies.get).toBeCalledWith('access_token')
    expect(strategies.set).toBeCalledWith('access_token', 'foo_bar')
  })

  it('instantiates token driver with local storage', () => {
    mockedEnvs({ TOKEN: { STRATEGY: 'localStorage' } })

    jest.doMock('@/libs/tokenManager/strategies/localStorage', () => ({
      localStorageStrategy: strategies
    }))

    const driver = require('@/libs/tokenManager/driver').tokenDriver()

    driver.get('access_token')
    driver.set('access_token', 'foo_bar')
    expect(strategies.get).toBeCalledWith('access_token')
    expect(strategies.set).toBeCalledWith('access_token', 'foo_bar')
  })
})
