import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import CodeInput from '@/components/foundation/CodeInput.vue'

describe('Code common input component test', () => {
  const attribute = 'code-input'
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount Code component correctly', () => {
    renderWithMainApp(CodeInput, { propsData: { value: {} } })

    const element = screen.getByTestId(attribute)
    expect(element).toHaveAttribute('data-cy', attribute)
  })

  it('returns proper value based on user inputs', async () => {
    const unchanged = { bar: 'foobar' }
    const value = { ...unchanged, code: '' }

    const wrapper = renderWithMainApp(CodeInput, { propsData: { value } })
    const element = await screen.getByTestId(attribute)

    await fireEvent.update(element, '1234')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, code: '1234' })

    await fireEvent.update(element, 'test-1234')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, code: 'test-1234' })

    await fireEvent.update(element, 'test')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, code: 'test' })

    await fireEvent.update(element, '')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, code: '' })
  })
})
