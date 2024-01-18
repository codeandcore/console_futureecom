export const mockedEnvs = (val: Record<string, unknown>) => {
  jest.doMock('@/config/env', () => ({
    ...jest.requireActual('@/config/env'),
    ...val
  }))
}
