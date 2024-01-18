import { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'shipping-methods',
    name: 'shipping-methods',
    component: () =>
      import(
        /* webpackChunkName: "shipping" */
        /* webpackMode: "lazy" */
        '@/views/shipping/ShippingMethods.vue'
      ),
    meta: {
      scopes: ['read,cart\\shipping']
    }
  },
  {
    path: 'shipping-methods/__',
    name: 'shipping-method-create',
    component: () =>
      import(
        /* webpackChunkName: "shipping" */
        /* webpackMode: "lazy" */
        '@/views/shipping/ShippingMethodCreate.vue'
      ),
    meta: {
      scopes: ['create,cart\\shipping']
    }
  },
  {
    path: 'shipping-methods/:id',
    name: 'shipping-method-update',
    component: () =>
      import(
        /* webpackChunkName: "shipping" */
        /* webpackMode: "lazy" */
        '@/views/shipping/ShippingMethodUpdate.vue'
      ),
    meta: {
      scopes: ['read,cart\\shipping']
    }
  },
  {
    path: 'zones',
    name: 'zones',
    component: () =>
      import(
        /* webpackChunkName: "zones" */
        /* webpackMode: "lazy" */
        '@/views/zones/Zones.vue'
      ),
    meta: {
      scopes: ['read,zones\\zone']
    }
  },
  {
    path: 'zones/__',
    name: 'zone-create',
    component: () =>
      import(
        /* webpackChunkName: "zones" */
        /* webpackMode: "lazy" */
        '@/views/zones/ZoneCreate.vue'
      ),
    meta: {
      scopes: ['read,zones\\zone']
    }
  },
  {
    path: 'zones/:id',
    name: 'zone-update',
    component: () =>
      import(
        /* webpackChunkName: "zones" */
        /* webpackMode: "lazy" */
        '@/views/zones/ZoneUpdate.vue'
      ),
    meta: {
      scopes: ['read,zones\\zone']
    }
  }
]

export default routes
