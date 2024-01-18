import { countOptions } from '~/tests/factories/helpers/factoryContext'
import { faker } from '@faker-js/faker'
import { languageFactory } from '~/tests/factories/settings/languageFactory'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import type { SetupServer } from 'msw/node'

describe('Composable useTranslationLanguage', () => {
  location.replace(`http://localhost`)

  const server: SetupServer = setupServer()

  beforeEach(() => {
    jest.resetModules()
    require('~/tests/configs/vue-composition-api-config')
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
    server.events.removeAllListeners('request:start')
    server.events.removeAllListeners('request:match')
    server.events.removeAllListeners('request:unhandled')
    jest.resetModules()
  })

  it('adds the language to global translation languages and does not reset on another use', () => {
    const { useTranslationLanguages } = require('@/composable/repositories/useTranslationLanguages')

    const language = languageFactory()
    useTranslationLanguages().addLanguage(language)
    expect(useTranslationLanguages().translationLanguages.value).toStrictEqual([language])

    useTranslationLanguages()

    expect(useTranslationLanguages().translationLanguages.value).toStrictEqual([language])
  })

  it('deletes the language from global translation languages', () => {
    const { useTranslationLanguages } = require('@/composable/repositories/useTranslationLanguages')

    const languages = [
      { ...languageFactory(), code: 'CA' },
      { ...languageFactory(), code: 'DE' },
      { ...languageFactory(), code: 'FR' }
    ]

    useTranslationLanguages().addLanguage(languages[0])
    useTranslationLanguages().addLanguage(languages[1])
    useTranslationLanguages().addLanguage(languages[2])

    useTranslationLanguages().deleteLanguage(languages[1])

    expect(useTranslationLanguages().translationLanguages.value).toStrictEqual([languages[0], languages[2]])
  })

  it('updates the language in the global translation languages', () => {
    const { useTranslationLanguages } = require('@/composable/repositories/useTranslationLanguages')

    const languages = [languageFactory(), languageFactory(), languageFactory()]

    useTranslationLanguages().addLanguage(languages[0])
    useTranslationLanguages().addLanguage(languages[1])
    useTranslationLanguages().addLanguage(languages[2])

    const updatedLanguage = { ...languageFactory(), code: languages[1].code }
    useTranslationLanguages().updateLanguage(updatedLanguage)

    expect(useTranslationLanguages().translationLanguages.value).toStrictEqual([
      languages[0],
      updatedLanguage,
      languages[2]
    ])
  })

  it('fetches languages and sets proper loading status', async () => {
    const { useTranslationLanguages } = require('@/composable/repositories/useTranslationLanguages')

    const languages = faker.helpers.multiple(languageFactory, countOptions)
    server.use(
      rest.get('/settings/languages', (req, res, ctx) => {
        return res(ctx.json({ data: languages }), ctx.status(200))
      })
    )

    const { loading, translationLanguages, fetchTranslationLanguages } = useTranslationLanguages()

    expect(loading.value).toBeFalse()
    const request = fetchTranslationLanguages()

    expect(loading.value).toBeTrue()

    await request

    expect(loading.value).toBeFalse()

    expect(translationLanguages.value).toStrictEqual(languages)
  })

  it('fails to fetch languages and leaves them as empty', async () => {
    const { useTranslationLanguages } = require('@/composable/repositories/useTranslationLanguages')

    server.use(
      rest.get('/settings/languages', (req, res) => {
        return res.networkError('Failed to connect')
      })
    )

    const { loading, translationLanguages, fetchTranslationLanguages } = useTranslationLanguages()

    expect(loading.value).toBeFalse()
    const request = fetchTranslationLanguages()

    expect(loading.value).toBeTrue()

    await request

    expect(loading.value).toBeFalse()

    expect(translationLanguages.value).toStrictEqual([])
  })
})
