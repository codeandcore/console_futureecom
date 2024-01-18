import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import GenerateSlugButtonAction from '@/components/common/actions/GenerateSlugButtonAction.vue'

export const attributes = {
  component: 'generate-slug-button-action'
}

export const fixtures = () => {
  const getComponent = () => screen.queryByTestId(attributes.component)

  const generateSlug = async () => {
    const button = getComponent()
    if (button) {
      await fireEvent.click(button)
    }
  }

  return {
    getComponent,
    generateSlug
  }
}

describe('GenerateSlugButtonAction.test component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount GenerateSlugButtonAction component correctly', () => {
    renderWithMainApp(GenerateSlugButtonAction)
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('emits slugified string based on given value', async () => {
    const { generateSlug } = fixtures()

    const wrapper = renderWithMainApp(GenerateSlugButtonAction, { propsData: { value: 'foo bar' } })

    await generateSlug()
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual('foo-bar')
  })
})
