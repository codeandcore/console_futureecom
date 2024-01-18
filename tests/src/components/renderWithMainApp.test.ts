import { renderWithMainApp } from '~/tests/configs/vue-test-config'

describe('Test if the components are rendered within the Vuetify wrapper', () => {
  it('should set [data-app] attribute on outer most div', () => {
    const { container } = renderWithMainApp({
      name: 'ShallowComponent',
      template: '<div />'
    })

    expect(container).toHaveAttribute('data-app', 'true')
  })
})
