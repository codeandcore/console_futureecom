export type CmsParts = 'pages' | 'blocks' | 'settings' | 'base'

export interface CmsImportData {
  file?: null | File
  parts: CmsParts[]
  overwrite?: boolean
}
