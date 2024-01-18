export const mockedReactiveGetter = (val?: unknown) => ({
  get value() {
    return val !== undefined ? val : jest.fn()
  }
})
