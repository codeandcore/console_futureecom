import { can } from '@/composable/useCanChecker'
import { computed } from '@vue/composition-api'
import { useStores } from '@/composable/repositories/useStores'
import type { Setting } from '@futureecom/futureecom-js/dist/services/cms-service'

export interface TabSetting {
  code: string
  title: string
  settings: Setting[]
}

export const useFilteredSetting = (tab: string, settings: Setting[]): TabSetting[] => {
  const tabSettings = settings.filter((item: any): boolean => {
    return item.code.startsWith(`${tab}.`)
  })
  const codes = tabSettings.map((setting) => setting.code.replace(`${tab}.`, ''))
  const filteredSettings = [] as TabSetting[]

  codes.forEach((value: string): void => {
    const code = value.includes('.') ? value.split('.')[0] : 'general'
    const setting: Setting = tabSettings.find((obj) => {
      return obj.code === `${tab}.${value}`
    }) as Setting
    const filteredSetting = filteredSettings.find((obj) => {
      return obj.code === code
    })

    if (filteredSetting) {
      filteredSetting.settings.push(setting)
      return
    }

    filteredSettings.push({
      code: code,
      title: code.replaceAll('_', ' ').replaceAll('-', ' '),
      settings: [setting]
    })
  })

  return filteredSettings
}

export const useCmsPresetChecker = (scope: 'block' | 'page' | 'preset' | 'setting' | 'template') => {
  const { currentStore } = useStores()

  const globalPresetPermissions = [
    { perm: 'read,cms\\preset', org: '*', store: '*' },
    { perm: `*,cms\\${scope}`, org: '*', store: '*' },
    { perm: '*,*', org: '*', store: '*' }
  ]

  const canReadStoreOrgPresets = computed(() => {
    return can(['read,cms\\preset'], 'admin_organisation', 'admin_store').value
  })

  const canReadGlobalPresets = computed((): boolean => {
    return (
      canReadStoreOrgPresets.value ||
      globalPresetPermissions.some(({ perm, org, store }) => can([perm], org, store).value)
    )
  })

  const canReadOrganisationPresets = computed(() => {
    return can(['read,cms\\preset'], currentStore.value?.organisation_code || '*', '*').value
  })

  return {
    canReadStoreOrgPresets,
    canReadOrganisationPresets,
    canReadGlobalPresets
  }
}

export const parseJson = (value: any): any => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

export const validJson = (value: any): boolean => {
  if (!value) {
    return true
  }
  if (typeof value !== 'string') {
    value = JSON.stringify(value)
  }
  try {
    JSON.parse(value)
    return true
  } catch (e) {
    return false
  }
}

export const parseJsonToString = (value: any): string => {
  if (typeof value === 'string') {
    return value
  }

  return JSON.stringify(value)
}
