import type { TranslateResult } from 'vue-i18n'

export type Toast = { type: string; msg: string | TranslateResult; uuid: string; visible: boolean }
