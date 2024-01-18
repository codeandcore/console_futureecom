import { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'payment-methods',
    name: 'payment-methods',
    component: () =>
      import(
        /* webpackChunkName: "payment" */
        /* webpackMode: "lazy" */
        '@/views/payment/PaymentMethods.vue'
      ),
    meta: {
      scopes: ['read,payments\\method']
    }
  },
  {
    path: 'payment-methods/__',
    name: 'payment-method-create',
    component: () =>
      import(
        /* webpackChunkName: "payment" */
        /* webpackMode: "lazy" */
        '@/views/payment/PaymentMethodCreate.vue'
      ),
    meta: {
      scopes: ['read,payments\\payment']
    }
  },
  {
    path: 'payment-methods/:code?',
    name: 'payment-method-update',
    component: () =>
      import(
        /* webpackChunkName: "payment" */
        /* webpackMode: "lazy" */
        '@/views/payment/PaymentMethodUpdate.vue'
      ),
    meta: {
      scopes: ['read,payments\\payment']
    }
  }
]

export default routes
