export const mockedSettings = (val: Record<string, unknown>) => {
  jest.doMock('@/composable/repositories/useSettings', () => ({
    useSettings: jest.fn().mockReturnValue(val)
  }))
}
