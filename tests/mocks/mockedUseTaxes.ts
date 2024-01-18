export const mockedTaxes = (val: Record<string, unknown>) => {
  jest.mock('@/composable/useTaxes', () => ({
    useTaxes: jest.fn().mockReturnValue(val)
  }))
}
