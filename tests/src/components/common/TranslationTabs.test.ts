import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { fireEvent } from '@testing-library/vue'
import { languageFactory } from '~/tests/factories/settings/languageFactory'
import { mockedSettings } from '~/tests/mocks/mockedSettings'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import { useTranslationLanguages } from '@/composable/repositories/useTranslationLanguages'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'

mockedSettings({ getSettings: jest.fn().mockReturnValue({ value: 'en' }) })

import TranslationTabs from '@/components/common/TranslationTabs.vue'

export const attributes = {
  component: 'translation-tabs',
  translationTab: 'translation-tabs-language',
  translationTabError: 'translation-tabs-error',
  translationTabContent: 'translation-tabs-content'
}

export const fixtures = () => {
  const getAttrWithLangCode = (attr: string, langCode?: string) => {
    return langCode ? `${attr}-${langCode.toLowerCase()}` : attr
  }

  const getComponent = () => screen.getByTestId(attributes.component)
  const getTranslationTab = (langCode?: string) => {
    return screen.queryByTestId(getAttrWithLangCode(attributes.translationTab, langCode))
  }

  const getTranslationTabError = (langCode?: string) => {
    return screen.queryByTestId(getAttrWithLangCode(attributes.translationTabError, langCode))
  }

  const getTranslationTabContent = (langCode?: string) => {
    return screen.queryByTestId(getAttrWithLangCode(attributes.translationTabContent, langCode))
  }

  const openTab = async (langCode: string) => {
    const val = getTranslationTab(langCode)
    if (val) {
      await fireEvent.click(val)
    }
  }

  return {
    getComponent,
    getTranslationTab,
    getTranslationTabError,
    getTranslationTabContent,
    openTab
  }
}

describe('TranslationTab component test with en language as default', () => {
  const langs: Language[] = []
  const codes = ['en', 'he', 'es', 'de']

  codes.forEach((code) => {
    const lang = languageFactory({ override: { code } })
    langs.push(lang)
    useTranslationLanguages().addLanguage(lang)
  })

  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  it('should mount TranslationTab component correctly', () => {
    const propsData = {
      'data-cy': attributes.component,
      'translatableValues': ['foo', 'bar']
    }

    renderWithMainApp(TranslationTabs, { propsData })
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
    expect(fixtures().getTranslationTabContent('en')).toBeInTheDocument()
  })

  it('should display content inside selected translation tab', async () => {
    const propsData = { translatableValues: ['foo', 'bar'] }

    renderWithMainApp(TranslationTabs, { propsData })

    const { getTranslationTabContent, openTab } = fixtures()
    expect(getTranslationTabContent('en')).toBeVisible()
    expect(getTranslationTabContent('es')).not.toBeVisible()
    expect(getTranslationTabContent('he')).not.toBeVisible()
    expect(getTranslationTabContent('de')).not.toBeVisible()

    await openTab('es')
    expect(getTranslationTabContent('es')).toBeVisible()
    await openTab('he')
    expect(getTranslationTabContent('he')).toBeVisible()
    await openTab('de')
    expect(getTranslationTabContent('de')).toBeVisible()
  })

  it('should display flags and names from translation language lists', () => {
    const propsData = { translatableValues: ['foo', 'bar'] }

    renderWithMainApp(TranslationTabs, { propsData })

    expect(fixtures().getTranslationTab(langs[0].code)?.textContent?.trim()).toBe('Default')
    expect(fixtures().getTranslationTab(langs[1].code)?.textContent?.trim()).toBe(`${langs[1].flag} ${langs[1].name}`)
    expect(fixtures().getTranslationTab(langs[2].code)?.textContent?.trim()).toBe(`${langs[2].flag} ${langs[2].name}`)
    expect(fixtures().getTranslationTab(langs[3].code)?.textContent?.trim()).toBe(`${langs[3].flag} ${langs[3].name}`)
  })

  it('does not display error icon if error is not provided', () => {
    const propsData = { translatableValues: ['foo', 'bar'] }

    renderWithMainApp(TranslationTabs, { propsData })

    langs.forEach((lang) => {
      expect(fixtures().getTranslationTabError(lang.code)).not.toBeInTheDocument()
    })
  })

  it('displays error icon when it is provided', () => {
    const propsData = {
      translatableValues: ['foo', 'bar'],
      errors: {
        'foo': 'An error for code: en',
        'translations.es.foo': 'An error for code: en',
        'translations.he.foo': 'An error for code: he'
      }
    }

    renderWithMainApp(TranslationTabs, { propsData })

    expect(fixtures().getTranslationTabError('en')).toBeInTheDocument()
    expect(fixtures().getTranslationTabError('he')).toBeInTheDocument()
    expect(fixtures().getTranslationTabError('es')).toBeInTheDocument()
    expect(fixtures().getTranslationTabError('de')).not.toBeInTheDocument()
  })
})
