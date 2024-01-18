/** Temporary solution for bridge vue-router missing reactivity in the routes,
 * but were introduced in the vue-router 3.6.0 and requires Vue 2.7 **/

import { reactive } from '@vue/composition-api'
import router from '@/plugins/router'
import type { NavigationGuardNext, Route } from 'vue-router'

const currentRoute = reactive({
  ...router.currentRoute
})

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
  Object.keys(to).forEach((key) => {
    //@ts-expect-error
    currentRoute[key] = to[key]
  })
  next()
})

export function useRoute() {
  return currentRoute
}
