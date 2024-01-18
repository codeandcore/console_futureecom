import '~/tests/configs/vue-composition-api-config.ts'

import { generateAccessToken } from '~/tests/helpers/token'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useStores } from '@/composable/repositories/useStores'

import { apiTestConfig } from '~/tests/configs/api-config'
import futureecom from '@futureecom/futureecom-js/dist/futureecom'

import * as libsApi from '@/libs/api'

import type { CrudChecker } from '@/types/CrudChecker'

describe('Composable crud permission checker', () => {
  const orgCode = 'olsonnet'
  const storeCode = 'blandainfo'
  const abilities: Record<string, CrudChecker> = {
    create: 'canCreate',
    read: 'canRead',
    update: 'canUpdate',
    delete: 'canDelete'
  }

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
  })

  beforeEach(() => (api = new futureecom(apiTestConfig({ organisationId: 1, storeId: 2 }))))
  afterAll(() => jest.resetModules())

  it('checks if crud permissions have changed on token change', () => {
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

    const checker = useCrudChecker('auth\\user')

    Object.entries(abilities).forEach(([ability, crudChecker]) => {
      const invalidScope = [`${orgCode}:${storeCode}:${ability}:payments\\method`]
      libsApi.tokenRef.value = generateAccessToken({ api, scope: invalidScope, time: Date.now() / 1000 })

      expect(checker[crudChecker].value).toBeFalse()

      const crudAbilityOnlyScope = [`${orgCode}:${storeCode}:${ability}:auth\\user`]
      libsApi.tokenRef.value = generateAccessToken({ api, scope: crudAbilityOnlyScope, time: Date.now() / 1000 })

      expect(checker[crudChecker].value).toBeTrue()

      const manageOnlyScope = [`${orgCode}:${storeCode}:manage:auth\\user`]
      libsApi.tokenRef.value = generateAccessToken({ api, scope: manageOnlyScope, time: Date.now() / 1000 })

      expect(checker[crudChecker].value).toBeTrue()

      const abilityAndManageScope = [
        `${orgCode}:${storeCode}:${ability}:auth\\user`,
        `${orgCode}:${storeCode}:manage:auth\\user`
      ]
      libsApi.tokenRef.value = generateAccessToken({ api, scope: abilityAndManageScope, time: Date.now() / 1000 })

      expect(checker[crudChecker].value).toBeTrue()
    })
  })

  it('checks if crud permissions have changed on current store change', () => {
    const checker = useCrudChecker('auth\\user')
    const { currentStore } = useStores()

    const validTokenScope = [`${orgCode}:${storeCode}:read:auth\\user`]
    libsApi.tokenRef.value = generateAccessToken({ api, scope: validTokenScope, time: Date.now() / 1000 })

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
      organisation_code: 'invalid'
    }

    expect(checker.canCreate.value).toBeFalse()
    expect(checker.canRead.value).toBeFalse()
    expect(checker.canUpdate.value).toBeFalse()
    expect(checker.canDelete.value).toBeFalse()

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

    expect(checker.canCreate.value).toBeFalse()
    expect(checker.canUpdate.value).toBeFalse()
    expect(checker.canDelete.value).toBeFalse()

    expect(checker.canRead.value).toBeTrue()
  })
})
