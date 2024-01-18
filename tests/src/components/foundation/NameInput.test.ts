import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import NameInput from '@/components/foundation/NameInput.vue'

describe('Name common input component test', () => {
  const attribute = 'name-input'

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount Name component correctly', () => {
    renderWithMainApp(NameInput, { propsData: { value: {} } })

    const element = screen.getByTestId(attribute)
    expect(element).toHaveAttribute('data-cy', attribute)
  })

  it('returns proper value based on user inputs', async () => {
    const unchanged = { bar: 'foobar' }
    const value = { ...unchanged, name: '' }

    const wrapper = renderWithMainApp(NameInput, { propsData: { value } })
    const element = await screen.getByTestId(attribute)

    await fireEvent.update(element, '1234')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, name: '1234' })

    await fireEvent.update(element, 'test')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, name: 'test' })

    await fireEvent.update(element, '')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, name: '' })
  })

  it('returns value into given translation code field', async () => {
    const unchanged = { bar: 'foobar' }
    const value = { ...unchanged }

    const wrapper = renderWithMainApp(NameInput, { propsData: { value, translationCode: 'en' } })
    const element = await screen.getByTestId(attribute)

    await fireEvent.update(element, '1234')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      translations: { en: { name: '1234' } }
    })

    await fireEvent.update(element, 'test')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      translations: { en: { name: 'test' } }
    })

    await fireEvent.update(element, '')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      translations: { en: { name: undefined } }
    })
  })
})
