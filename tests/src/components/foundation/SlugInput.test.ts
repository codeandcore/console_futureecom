import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import {
  attributes as slugAttributes,
  fixtures as slugFixtures
} from '~/tests/src/components/common/actions/GenerateSlugButtonAction.test'
import SlugInput from '@/components/foundation/SlugInput.vue'

const attributes = {
  component: 'slug-input',
  button: slugAttributes.component
}

export const fixtures = () => {
  const { getComponent: getButton, generateSlug } = slugFixtures()

  const getComponent = () => screen.queryByTestId(attributes.component)

  const fillInput = async (val: string) => {
    const component = getComponent()
    if (component) {
      await fireEvent.update(component, val)
    }
  }

  return {
    getComponent,
    getButton,
    fillInput,
    generateSlug
  }
}

describe('Slug input component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount Slug component correctly', () => {
    renderWithMainApp(SlugInput, { propsData: { value: {} } })

    const component = screen.getByTestId(attributes.component)
    const button = screen.getByTestId(attributes.button)

    expect(component).toHaveAttribute('data-cy', attributes.component)
    expect(button).toHaveAttribute('data-cy', attributes.button)
  })

  it('returns proper value based on user inputs', async () => {
    const unchanged = { bar: 'foobar' }
    const value = { ...unchanged }

    const { fillInput } = fixtures()

    const wrapper = renderWithMainApp(SlugInput, { propsData: { value } })

    await fillInput('1234')

    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, slug: '1234' })

    await fillInput('test-1234')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, slug: 'test-1234' })

    await fillInput('test')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, slug: 'test' })

    await fillInput('')
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, slug: '' })
  })

  it('does not emit anything on generate slug button click with empty name', async () => {
    const unchanged = { bar: 'foobar', name: '' }
    const value = { ...unchanged }

    const { generateSlug } = fixtures()

    const wrapper = renderWithMainApp(SlugInput, { propsData: { value } })

    await generateSlug()
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual(undefined)
  })

  it('returns a slug after generate click, based on name prop', async () => {
    const unchanged = { bar: 'foobar', name: 'foo bar' }
    const value = { ...unchanged }

    const { generateSlug } = fixtures()

    const wrapper = renderWithMainApp(SlugInput, { propsData: { value } })

    await generateSlug()
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({ ...unchanged, slug: 'foo-bar' })
  })

  it('returns a slug after generate click into given translation code field', async () => {
    const unchanged = { bar: 'foobar', name: 'foo bar', translations: { ca: { name: 'foo bar 2' } } }
    const value = { ...unchanged }

    const { generateSlug } = fixtures()

    const wrapper = renderWithMainApp(SlugInput, { propsData: { value, translationCode: 'ca' } })

    await generateSlug()
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      translations: {
        ca: {
          name: 'foo bar 2',
          slug: 'foo-bar-2'
        }
      }
    })
  })

  it('returns translated slug with different key than name', async () => {
    const unchanged = {
      bar: 'foobar',
      foo: 'foo bar',
      translations: { ca: { name: 'foo bar 2', foo: 'to be sluggified' } }
    }
    const value = { ...unchanged }

    const { generateSlug } = fixtures()

    const wrapper = renderWithMainApp(SlugInput, { propsData: { value, translationCode: 'ca', slugifyKey: 'foo' } })

    await generateSlug()
    expect(getEmittedEventValue(wrapper, 'input')).toStrictEqual({
      ...unchanged,
      translations: {
        ca: {
          name: 'foo bar 2',
          foo: 'to be sluggified',
          slug: 'to-be-sluggified'
        }
      }
    })
  })
})
