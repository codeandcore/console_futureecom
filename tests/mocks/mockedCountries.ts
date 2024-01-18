export const mockedCountries = (val: Record<string, unknown>) => {
  jest.mock('@/composable/repositories/useCountries', () => ({
    useCountries: jest.fn().mockReturnValue(val)
  }))
}
