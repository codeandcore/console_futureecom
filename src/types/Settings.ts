import type { SettingCode } from '@futureecom/futureecom-js/dist/services/setting-service'

export interface SettingsInterface<T> {
  code: SettingCode
  payload: T
}
