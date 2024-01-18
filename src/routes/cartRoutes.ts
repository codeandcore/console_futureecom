import type { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'carts',
    name: 'carts',
    component: () =>
      import(
        /* webpackChunkName: "cart" */
        /* webpackMode: "lazy" */
        '@/views/cart/Carts.vue'
      ),
    meta: {
      scopes: ['read,cart\\cart']
    }
  },
  {
    path: 'create-cart',
    name: 'cart-create',
    component: () =>
      import(
        /* webpackChunkName: "cart" */
        /* webpackMode: "lazy" */
        '@/views/cart/CartCreator.vue'
      ),
    meta: {
      scopes: ['create,cart\\cart']
    }
  },
  {
    path: 'carts/:id',
    name: 'cart-update',
    component: () =>
      import(
        /* webpackChunkName: "cart" */
        /* webpackMode: "lazy" */
        '@/views/cart/CartUpdate.vue'
      ),
    meta: {
      scopes: ['read,cart\\cart']
    }
  },
  {
    path: 'quotes',
    name: 'quotes',
    component: () =>
      import(
        /* webpackChunkName: "quote" */
        /* webpackMode: "lazy" */
        '@/views/cart/Quotes.vue'
      ),
    meta: {
      scopes: ['read,cart\\quote']
    }
  },
  {
    path: 'quotes/:id',
    name: 'quote-update',
    component: () =>
      import(
        /* webpackChunkName: "quote" */
        /* webpackMode: "lazy" */
        '@/views/cart/QuoteUpdate.vue'
      ),
    meta: {
      scopes: ['read,cart\\quote']
    }
  }
]

export default routes
