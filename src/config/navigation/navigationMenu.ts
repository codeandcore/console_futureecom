import { canAny } from '@/composable/useCanChecker'
import { menuItems } from '@/config/navigation/navigationMenuItems'
import type { NavigationMenuItem } from '@/types/NavigationMenuItem'
import type { Organisation, Store } from '@futureecom/futureecom-js/dist/services/setting-service'

export default (organisation: Organisation, store?: Store): NavigationMenuItem[] => {
  const noStoreRequiredAccess = (item: NavigationMenuItem): boolean => {
    if (item.meta?.overview_only && organisation.id !== 0) {
      return false
    }

    const { permissionMatcher, scope } = item.meta || {}

    if (!permissionMatcher && !scope) {
      return false
    }

    const hasMatchingPermissions = permissionMatcher !== undefined && permissionMatcher()
    const canAccess = hasMatchingPermissions || canAny(scope || [], `${organisation.id}`).value

    if (item.meta?.overview_available && canAccess) {
      return true
    }

    if (item.meta?.overview_only && organisation.id === 0 && canAccess) {
      return true
    }

    return !!(item.meta?.console_only && organisation.id > 0 && canAccess)
  }

  const withStoreRequiredAccess = (item: NavigationMenuItem, store: Store) => {
    if (item.meta?.overview_only) {
      return false
    }

    if (!item.meta?.permissionMatcher && !item.meta?.scope) {
      return false
    }

    const { permissionMatcher, scope } = item.meta

    if (permissionMatcher !== undefined && permissionMatcher()) {
      return true
    }

    return canAny(scope || [], store.organisation_code, store.code).value
  }

  const getFilteredMenu = (items: NavigationMenuItem[]): NavigationMenuItem[] => {
    return items.reduce((previousValue: NavigationMenuItem[], item) => {
      if (!item.submenu?.length) {
        const hasAccess = store ? withStoreRequiredAccess(item, store) : noStoreRequiredAccess(item)
        return hasAccess ? [...previousValue, item] : previousValue
      }

      const filteredSubmenu = getFilteredMenu(item.submenu)

      return filteredSubmenu.length ? [...previousValue, { ...item, submenu: filteredSubmenu }] : previousValue
    }, [])
  }

  return getFilteredMenu(menuItems)
}
