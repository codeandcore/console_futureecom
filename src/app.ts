import '@/assets/scss/main.scss'
import '@/plugins/compositionApi'
import '@/plugins/flags'
import { i18n } from '@/plugins/i18n'
import App from '@/App.vue'
import Vue from 'vue'
import router from '@/plugins/router'
import vuetify from '@/plugins/vuetify'
import type { CreateElement, VNode } from 'vue/types/umd'
//@ts-expect-error TODO: Remove this import after Node's upgrade to >15.0.0
import replaceAllInserter from 'string.prototype.replaceall'

replaceAllInserter.shim()

import { useToasts } from '@/composable/useToasts'

Vue.config.productionTip = false

/** @deprecated Instead of using root.$toast or $toast, use useToast() in the components and scripts **/
Vue.prototype.$toast = { ...useToasts() }

export const appPlugins = {
  vuetify,
  router,
  i18n
}

export const app = new Vue({
  ...appPlugins,
  render: (h: CreateElement): VNode => h(App)
})
