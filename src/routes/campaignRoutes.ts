import { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'campaigns',
    name: 'campaigns',
    component: () =>
      import(
        /* webpackChunkName: "campaigns" */
        /* webpackMode: "lazy" */
        '@/views/coupons/Coupons.vue'
      ),
    meta: {
      scopes: ['read,promotions\\promotion']
    }
  },
  {
    path: 'campaigns/__/:option?',
    name: 'campaign-create',
    component: () =>
      import(
        /* webpackChunkName: "campaigns" */
        /* webpackMode: "lazy" */
        '@/views/coupons/CampaignCreate.vue'
      ),
    meta: {
      scopes: ['read,promotions\\promotion']
    }
  },
  {
    path: 'campaigns/:id/:option?',
    name: 'campaign-update',
    component: () =>
      import(
        /* webpackChunkName: "campaigns" */
        /* webpackMode: "lazy" */
        '@/views/coupons/CampaignUpdate.vue'
      ),
    meta: {
      scopes: ['read,promotions\\promotion']
    }
  }
]

export default routes
