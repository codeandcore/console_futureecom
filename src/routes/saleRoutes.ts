import type { Route } from '@/plugins/router'

export enum SaleRouteNameEnums {
  REPORTS = 'reports',
  REPORT_DETAILS_ITEMS = 'report-details-items',
  REPORT_DETAILS = 'report-details',
  ORDERS = 'orders',
  SINGLE_ORDER = 'single-order',
  COMMISSIONS = 'commissions'
}

const routes: Route[] = [
  {
    path: 'reports',
    name: SaleRouteNameEnums.REPORTS,
    component: () =>
      import(
        /* webpackChunkName: "reports" */
        /* webpackMode: "lazy" */
        '@/views/reports/SalesReport.vue'
      ),
    meta: {
      scopes: ['read,orders\\order']
    }
  },
  {
    path: 'reports/items/details',
    name: SaleRouteNameEnums.REPORT_DETAILS_ITEMS,
    component: () =>
      import(
        /* webpackChunkName: "reports" */
        /* webpackMode: "lazy" */
        '@/views/reports/SalesReportItemsDetails.vue'
      ),
    meta: {
      scopes: ['read,orders\\order']
    }
  },
  {
    path: 'reports/details',
    name: SaleRouteNameEnums.REPORT_DETAILS,
    component: () =>
      import(
        /* webpackChunkName: "reports" */
        /* webpackMode: "lazy" */
        '@/views/reports/SalesReportDetails.vue'
      ),
    meta: {
      scopes: ['read,orders\\order']
    }
  },
  {
    path: 'orders',
    name: SaleRouteNameEnums.ORDERS,
    component: () =>
      import(
        /* webpackChunkName: "orders" */
        /* webpackMode: "lazy" */
        '@/views/orders/Orders.vue'
      ),
    meta: {
      scopes: ['read,orders\\order']
    }
  },
  {
    path: 'orders/:id/:option?',
    name: SaleRouteNameEnums.SINGLE_ORDER,
    component: () =>
      import(
        /* webpackChunkName: "orders" */
        /* webpackMode: "lazy" */
        '@/views/orders/OrderSingle.vue'
      ),
    meta: {
      scopes: ['read,orders\\order']
    }
  },
  {
    path: 'commissions',
    name: SaleRouteNameEnums.COMMISSIONS,
    component: () =>
      import(
        /* webpackChunkName: "commissions" */
        /* webpackMode: "lazy" */
        '@/views/commissions/Commissions.vue'
      ),
    meta: {
      scopes: ['read,commission\\commission']
    }
  }
]

export default routes
