export const mockedTranslationLanguages = (val: Record<string, unknown>) => {
  jest.doMock('@/composable/repositories/useTranslationLanguages', () => ({
    useTranslationLanguages: jest.fn().mockReturnValue(val)
  }))
}
