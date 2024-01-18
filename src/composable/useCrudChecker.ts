import { ComputedRef } from '@vue/composition-api'
import { canAny } from '@/composable/useCanChecker'
import type { CrudChecker } from '@/types/CrudChecker'

export const useCrudChecker = (scope: string): Record<CrudChecker, ComputedRef<boolean>> => {
  return {
    canRead: canAny([`read,${scope}`, `manage,${scope}`]),
    canCreate: canAny([`create,${scope}`, `manage,${scope}`]),
    canUpdate: canAny([`update,${scope}`, `manage,${scope}`]),
    canDelete: canAny([`delete,${scope}`, `manage,${scope}`])
  }
}
