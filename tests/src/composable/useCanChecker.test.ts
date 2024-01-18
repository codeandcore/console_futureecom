import '~/tests/configs/vue-composition-api-config.ts'

import { can, canAny } from '@/composable/useCanChecker'
import { generateAccessToken } from '~/tests/helpers/token'
import { useStores } from '@/composable/repositories/useStores'

import { apiTestConfig } from '~/tests/configs/api-config'
import futureecom from '@futureecom/futureecom-js/dist/futureecom'

import * as libsApi from '@/libs/api'

describe('Composable Can/CanAny checker', () => {
  const orgCode = 'olsonnet'
  const storeCode = 'blandainfo'
  let api: futureecom

  beforeAll(() => {
    jest.doMock('@/libs/api', () =>
      jest.fn().mockReturnValue({
        ...jest.requireActual('@/libs/api'),
        tokenRef: jest.fn()
      })
    )

    jest.doMock('@/composable/repositories/useStores', () => ({
      useStores: () => ({
        currentStore: jest.fn()
      })
    }))

    api = new futureecom(apiTestConfig({ organisationId: 1, storeId: 2 }))
  })

  afterAll(() => jest.resetModules())

  it('checks if every permission is validated on token change', () => {
    const { currentStore } = useStores()
    currentStore.value = {
      name: 'blanda.info',
      code: 'blandainfo',
      domain: {
        default: 'olsonnet-blandainfo.futureecom.io',
        scheme: 'https'
      },
      color: '#063C4E',
      template: 'default',
      id: 1,
      organisation: 1,
      organisation_code: 'olsonnet'
    }

    const requiredScope = ['read,auth\\user', 'read,payments\\method']
    const canWithRequired = can(requiredScope)

    const invalidTokenScope = [`${orgCode}:${storeCode}:read:auth\\user`]
    libsApi.tokenRef.value = generateAccessToken({ api, scope: invalidTokenScope, time: Date.now() / 1000 })
    expect(canWithRequired.value).toBeFalse()

    const validTokenScope = [`${orgCode}:${storeCode}:read:auth\\user`, `${orgCode}:${storeCode}:read:payments\\method`]
    libsApi.tokenRef.value = generateAccessToken({ api, scope: validTokenScope, time: Date.now() / 1000 })
    expect(canWithRequired.value).toBeTrue()
  })

  it('checks if every permission is validated on current store change', () => {
    const { currentStore } = useStores()
    const requiredScope = ['read,auth\\user']
    const canWithRequired = can(requiredScope)
    const invalidTokenScope = [`${orgCode}:${storeCode}:read:auth\\user`]
    libsApi.tokenRef.value = generateAccessToken({ api, scope: invalidTokenScope, time: Date.now() / 1000 })

    currentStore.value = {
      name: 'blanda.info',
      code: 'invalid',
      domain: {
        default: 'olsonnet-blandainfo.futureecom.io',
        scheme: 'https'
      },
      color: '#063C4E',
      template: 'default',
      id: 1,
      organisation: 1,
      organisation_code: 'invalid'
    }

    expect(canWithRequired.value).toBeFalse()

    currentStore.value = {
      name: 'blanda.info',
      code: 'blandainfo',
      domain: {
        default: 'olsonnet-blandainfo.futureecom.io',
        scheme: 'https'
      },
      color: '#063C4E',
      template: 'default',
      id: 1,
      organisation: 1,
      organisation_code: 'olsonnet'
    }

    expect(can(requiredScope).value).toBeTrue()
  })

  it('checks if some of permissions are validated on token change', () => {
    const { currentStore } = useStores()

    currentStore.value = {
      name: 'blanda.info',
      code: 'blandainfo',
      domain: {
        default: 'olsonnet-blandainfo.futureecom.io',
        scheme: 'https'
      },
      color: '#063C4E',
      template: 'default',
      id: 1,
      organisation: 1,
      organisation_code: 'olsonnet'
    }

    const acceptableScope = ['create,payments\\method', 'read,payments\\method']
    const canWithAcceptable = canAny(acceptableScope)

    const invalidTokenScope = [`${orgCode}:${storeCode}:read:auth\\user`]
    libsApi.tokenRef.value = generateAccessToken({ api, scope: invalidTokenScope, time: Date.now() / 1000 })
    expect(canWithAcceptable.value).toBeFalse()

    const validTokenScope = [`${orgCode}:${storeCode}:read:auth\\user`, `${orgCode}:${storeCode}:read:payments\\method`]
    libsApi.tokenRef.value = generateAccessToken({ api, scope: validTokenScope, time: Date.now() / 1000 })
    expect(canWithAcceptable.value).toBeTrue()
  })

  it('checks if some of permissions are validated on current store change', () => {
    const { currentStore } = useStores()

    const acceptableScope = ['create,payments\\method', 'read,auth\\user']
    const canWithAcceptable = canAny(acceptableScope)

    const validTokenScope = [`${orgCode}:${storeCode}:read:auth\\user`]
    libsApi.tokenRef.value = generateAccessToken({ api, scope: validTokenScope, time: Date.now() / 1000 })

    currentStore.value = {
      name: 'blanda.info',
      code: 'invalid',
      domain: {
        default: 'olsonnet-blandainfo.futureecom.io',
        scheme: 'https'
      },
      color: '#063C4E',
      template: 'default',
      id: 1,
      organisation: 1,
      organisation_code: 'invalid'
    }

    expect(canWithAcceptable.value).toBeFalse()

    currentStore.value = {
      name: 'blanda.info',
      code: 'blandainfo',
      domain: {
        default: 'olsonnet-blandainfo.futureecom.io',
        scheme: 'https'
      },
      color: '#063C4E',
      template: 'default',
      id: 1,
      organisation: 1,
      organisation_code: 'olsonnet'
    }
    expect(canWithAcceptable.value).toBeTrue()
  })
})
