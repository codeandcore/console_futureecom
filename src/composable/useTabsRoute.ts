import { ref, watch } from '@vue/composition-api'
import { rootVue } from '@/main'
import type { Ref, WatchStopHandle } from '@vue/composition-api'
import type { abilities } from '@/types/Abilities'

export type TabNavigationRoute<T = string> = TabNavigationComponent<T> | TabNavigationRedirect<T>

export interface TabNavigationBase<T> {
  code: T
  name: string
}

export interface TabNavigationComponent<T> extends TabNavigationBase<T> {
  component: any
  submit?: boolean
  header?: string
  permissions?: abilities[]
  hasRequired?: boolean
}

export interface TabNavigationRedirect<T> extends TabNavigationBase<T> {
  to?: any
  forwarding?: boolean
}

export const useTabsRoute = (tabs: TabNavigationRoute[], initTabName: string = ''): UseTabsRoute => {
  const item = tabs.find((item) => item.code && item.code === initTabName) as TabNavigationComponent<string>

  let route

  if ((item as TabNavigationComponent<string>)?.component) {
    route = tabs.findIndex((item) => item.code && item.code === initTabName)
  } else {
    route = tabs.findIndex((item) => (item as TabNavigationComponent<string>)?.component)
  }

  const selectedTabIndex = ref(route)

  const tabRouteWatcher = (callback: Function): WatchStopHandle => {
    return watch([() => rootVue.$route, selectedTabIndex], () => callback())
  }

  return {
    tabRouteWatcher,
    selectedTabIndex
  }
}

interface UseTabsRoute {
  tabRouteWatcher: Function
  selectedTabIndex: Ref<number>
}
