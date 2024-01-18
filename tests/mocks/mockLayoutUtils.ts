export const mockLayoutUtils = (val: any) =>
  jest.doMock('@/libs/layout', () => ({
    __esModule: true,
    ...jest.requireActual('@/libs/layout'),
    ...val
  }))
