import type { DataOptions, DataTableHeader } from 'vuetify'
import type { LocaleMessageObject, TranslateResult } from 'vue-i18n'

export type DataTableGrid = Pick<DataOptions, 'itemsPerPage' | 'page' | 'sortDesc' | 'sortBy'>

export interface GridHeader extends Omit<DataTableHeader, 'text'> {
  text: string | LocaleMessageObject | TranslateResult
}
