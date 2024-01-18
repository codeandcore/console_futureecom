import { cloudinaryResponseFactory } from '~/tests/factories/cloudinaryResponseFactory'
import { faker } from '@faker-js/faker'
import { imageFileFactory } from '~/tests/factories/imageFactory'
import { mockedSettings } from '~/tests/mocks/mockedSettings'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import type { SetupServer } from 'msw/node'

describe('Composable useCloudinary', () => {
  const server: SetupServer = setupServer()

  const setSettings = (val: unknown) => ({ getSettings: jest.fn().mockReturnValue(val) })

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
    jest.clearAllMocks()
  })

  it('checks if useCloudinary uses general.cloudinary settings', () => {
    const mock = setSettings({ value: {} })
    mockedSettings(mock)

    const { useCloudinary } = require('@/composable/useCloudinary')

    useCloudinary()

    expect(mock.getSettings).toBeCalled()
    expect(mock.getSettings).toBeCalledWith('general.cloudinary')
  })

  it('checks if cloudinary is not uploadable on empty name', () => {
    mockedSettings(setSettings({ value: { name: '', preset: 'foo' } }))
    const { isUploadable } = require('@/composable/useCloudinary').useCloudinary()
    expect(isUploadable.value).toBeFalse()
  })

  it('checks if cloudinary is not uploadable on empty preset', () => {
    mockedSettings(setSettings({ value: { name: 'foo', preset: '' } }))
    const { isUploadable } = require('@/composable/useCloudinary').useCloudinary()
    expect(isUploadable.value).toBeFalse()
  })

  it('checks if cloudinary is not uploadable on empty name and preset', () => {
    mockedSettings(setSettings({ value: { name: '', preset: '' } }))
    const { isUploadable } = require('@/composable/useCloudinary').useCloudinary()
    expect(isUploadable.value).toBeFalse()
  })

  it('checks if cloudinary is uploadable on filled name and preset', () => {
    mockedSettings(setSettings({ value: { name: 'foo', preset: 'bar' } }))
    const { isUploadable } = require('@/composable/useCloudinary').useCloudinary()
    expect(isUploadable.value).toBeTrue()
  })

  it('checks if cloudinary is uploading, when settings arent valid and trying to upload file', async () => {
    mockedSettings(setSettings({ value: { name: '', preset: '' } }))
    const { uploadImage } = require('@/composable/useCloudinary').useCloudinary()
    await expect(uploadImage(imageFileFactory())).rejects.toBe('Set up cloudinary first')
  })

  it('checks if cloudinary is rejects the upload on network error', async () => {
    mockedSettings(setSettings({ value: { name: 'foo', preset: 'bar' } }))

    server.use(
      rest.post('https://api.cloudinary.com/v1_1/foo/upload', (req, res, ctx) => {
        return res(ctx.status(400), ctx.text('An error occurred'))
      })
    )

    const { uploadImage } = require('@/composable/useCloudinary').useCloudinary()

    await expect(uploadImage(imageFileFactory())).toReject()
  })

  it('checks if cloudinary is uploading a file with valid settings and returns non-empty value', async () => {
    mockedSettings(setSettings({ value: { name: 'foo', preset: 'bar' } }))

    server.use(
      rest.post('https://api.cloudinary.com/v1_1/foo/upload', (req, res, ctx) => {
        return res(ctx.json(cloudinaryResponseFactory()), ctx.status(200))
      })
    )

    const { uploadImage } = require('@/composable/useCloudinary').useCloudinary()

    const val = await uploadImage(imageFileFactory())
    expect(val).toBeString()
    expect(val).toBeTruthy()
  })

  it('returns a string when string is given, regardless of settings', async () => {
    mockedSettings(setSettings({ value: { name: '', preset: '' } }))
    const { uploadImage } = require('@/composable/useCloudinary').useCloudinary()

    const image = faker.image.url()
    await expect(uploadImage(image)).resolves.toBe(image)
  })
})
