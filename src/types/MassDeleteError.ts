import type { TranslateResult } from 'vue-i18n'

export interface MassDeleteError {
  message: string | TranslateResult
  errors?: {
    [uuid: string]: {
      message: string
    }
  }
}
