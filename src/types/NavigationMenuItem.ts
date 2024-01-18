import type { Location } from 'vue-router'
import type { abilities } from '@/types/Abilities'

export interface NavigationMenuItem {
  title: string
  link?: Location
  icon?: string
  submenu?: NavigationMenuItem[]
  meta?: {
    scope?: abilities[]
    permissionMatcher?: () => boolean
    overview_available?: boolean
    overview_only?: boolean
    console_only?: boolean
  }
}
