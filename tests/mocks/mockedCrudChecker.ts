export const mockedCrudChecker = (val: Record<string, unknown>) => {
  return jest.doMock('@/composable/useCrudChecker', () => ({
    useCrudChecker: jest.fn().mockReturnValue(val)
  }))
}
