import '@/composable/migrateUseRoute'
import { app } from '@/app'
import router from '@/plugins/router'

/** @deprecated Prefer to not use root app, but if needed, use "app" from app.ts **/
export const rootVue = app

router.onReady(() => app.$mount('#app'))
