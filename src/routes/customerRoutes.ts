import { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'customers',
    name: 'customers',
    component: () =>
      import(
        /* webpackChunkName: "customers" */
        /* webpackMode: "lazy" */
        '@/views/customers/customer/Customers.vue'
      ),
    meta: {
      scopes: ['read,customers\\customer']
    }
  },
  {
    path: 'customers/__/:option?',
    name: 'customer-create',
    component: () =>
      import(
        /* webpackChunkName: "customers" */
        /* webpackMode: "lazy" */
        '@/views/customers/customer/CustomerCreate.vue'
      ),
    meta: {
      scopes: ['read,customers\\customer']
    }
  },
  {
    path: 'customers/:id/:option?',
    name: 'customer-update',
    component: () =>
      import(
        /* webpackChunkName: "customers" */
        /* webpackMode: "lazy" */
        '@/views/customers/customer/CustomerUpdate.vue'
      ),
    meta: {
      scopes: ['read,customers\\customer']
    }
  },
  {
    path: 'customer-groups',
    name: 'customer-groups',
    component: () =>
      import(
        /* webpackChunkName: "customer_groups" */
        /* webpackMode: "lazy" */
        '@/views/customers/group/CustomerGroups.vue'
      ),
    meta: {
      scopes: ['read,customers\\group']
    }
  },
  {
    path: 'groups/__',
    name: 'customer-group-create',
    component: () =>
      import(
        /* webpackChunkName: "customer_groups" */
        /* webpackMode: "lazy" */
        '@/views/customers/group/CustomerGroupCreate.vue'
      ),
    meta: {
      scopes: ['read,customers\\group']
    }
  },
  {
    path: 'groups/:id',
    name: 'customer-group-update',
    component: () =>
      import(
        /* webpackChunkName: "customer_groups" */
        /* webpackMode: "lazy" */
        '@/views/customers/group/CustomerGroupUpdate.vue'
      ),
    meta: {
      scopes: ['read,customers\\group']
    }
  }
]

export default routes
