import { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'sale-taxes',
    name: 'sale-taxes',
    component: () =>
      import(
        /* webpackChunkName: "tax" */
        /* webpackMode: "lazy" */
        '@/views/taxes/sale/SaleTaxRates.vue'
      ),
    meta: {
      scopes: ['read,taxes\\taxrate']
    }
  },
  {
    path: 'sale-taxes/__',
    name: 'sale-tax-create',
    component: () =>
      import(
        /* webpackChunkName: "tax" */
        /* webpackMode: "lazy" */
        '@/views/taxes/sale/SaleTaxCreate.vue'
      ),
    meta: {
      scopes: ['create,taxes\\taxrate']
    }
  },
  {
    path: 'sale-taxes/:id',
    name: 'sale-tax-update',
    component: () =>
      import(
        /* webpackChunkName: "tax" */
        /* webpackMode: "lazy" */
        '@/views/taxes/sale/SaleTaxUpdate.vue'
      ),
    meta: {
      scopes: ['read,taxes\\taxrate']
    }
  },
  {
    path: 'vat-rates',
    name: 'vat-rates',
    component: () =>
      import(
        /* webpackChunkName: "tax" */
        /* webpackMode: "lazy" */
        '@/views/taxes/vat/VatRates.vue'
      ),
    meta: {
      scopes: ['read,taxes\\vat']
    }
  },
  {
    path: 'vat-rate/__',
    name: 'vat-rate-create',
    component: () =>
      import(
        /* webpackChunkName: "tax" */
        /* webpackMode: "lazy" */
        '@/views/taxes/vat/VatRateCreate.vue'
      ),
    meta: {
      scopes: ['create,taxes\\vat']
    }
  },
  {
    path: 'vat-rates/:id',
    name: 'vat-rate-update',
    component: () =>
      import(
        /* webpackChunkName: "tax" */
        /* webpackMode: "lazy" */
        '@/views/taxes/vat/VatRateUpdate.vue'
      ),
    meta: {
      scopes: ['read,taxes\\vat']
    }
  },
  {
    path: 'sale-tax-groups',
    name: 'sale-tax-groups',
    component: () =>
      import(
        /* webpackChunkName: "tax" */
        /* webpackMode: "lazy" */
        '@/views/taxes/groups/SaleTaxGroups.vue'
      ),
    meta: {
      scopes: ['read,taxes\\taxgroup']
    }
  },
  {
    path: 'sale-tax-groups/__',
    name: 'sale-tax-group-create',
    component: () =>
      import(
        /* webpackChunkName: "tax" */
        /* webpackMode: "lazy" */
        '@/views/taxes/groups/SaleTaxGroupCreate.vue'
      ),
    meta: {
      scopes: ['read,taxes\\taxgroup']
    }
  },
  {
    path: 'sale-tax-groups/:id',
    name: 'sale-tax-group-update',
    component: () =>
      import(
        /* webpackChunkName: "tax" */
        /* webpackMode: "lazy" */
        '@/views/taxes/groups/SaleTaxGroupUpdate.vue'
      ),
    meta: {
      scopes: ['read,taxes\\taxgroup']
    }
  }
]

export default routes
