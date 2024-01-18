import type { TranslateResult } from 'vue-i18n'

export interface DropdownOptions<T> {
  text: string | TranslateResult
  value: T
}
