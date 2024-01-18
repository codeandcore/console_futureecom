import { can, canAny } from '@/composable/useCanChecker'
import { useMasks } from '@/composable/useMasks'
import { useMoney } from '@/composable/useMoney'
import { useRequestedDeliveryFormat } from '@/composable/useRequestedDeliveryFormatter'
import { useTimezone } from '@/composable/useTimezone'
import { vMaska } from 'maska'
import PortalVue from 'portal-vue'
import Vue from 'vue'
import VueMask from 'v-mask'

export const loadConsolePlugins = () => {
  Vue.use(PortalVue)
  Vue.use(VueMask)
  Vue.directive('maska', vMaska)

  /** @deprecated aiming for Vue >2.7 changes and reducing global bindings in testing use-cases **/
  Vue.prototype.$format = {
    money: useMoney(),
    timezone: useTimezone(),
    requestedDelivery: useRequestedDeliveryFormat,
    mask: useMasks()
  }

  Vue.prototype.$can = (...scope: string[]) => can(scope)
  Vue.prototype.$canAny = (...scope: string[]) => canAny(scope)
}
