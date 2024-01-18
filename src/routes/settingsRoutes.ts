import { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'organisations',
    name: 'organisations',
    component: () =>
      import(
        /* webpackChunkName: "settings" */
        /* webpackMode: "lazy" */
        '@/views/organisations/Organisations.vue'
      ),
    meta: {
      scopes: ['read,settings\\organisations']
    }
  },
  {
    path: 'organisations/__',
    name: 'organisation-create',
    component: () =>
      import(
        /* webpackChunkName: "settings" */
        /* webpackMode: "lazy" */
        '@/views/organisations/OrganisationCreate.vue'
      ),
    meta: {
      scopes: ['manage,settings\\organisations']
    }
  },
  {
    path: 'organisations/:id',
    name: 'organisation-update',
    component: () =>
      import(
        /* webpackChunkName: "settings" */
        /* webpackMode: "lazy" */
        '@/views/organisations/OrganisationUpdate.vue'
      ),
    meta: {
      scopes: ['manage,settings\\organisations']
    }
  },
  {
    path: 'stores',
    name: 'stores',
    component: () =>
      import(
        /* webpackChunkName: "stores" */
        /* webpackMode: "lazy" */
        '@/views/stores/Stores.vue'
      ),
    meta: {
      scopes: ['read,settings\\stores']
    }
  },
  {
    path: 'stores/__',
    name: 'store-create',
    component: () =>
      import(
        /* webpackChunkName: "stores" */
        /* webpackMode: "lazy" */
        '@/views/stores/StoreCreate.vue'
      ),
    meta: {
      scopes: ['read,settings\\stores']
    }
  },
  {
    path: 'stores/:id',
    name: 'store-update',
    component: () =>
      import(
        /* webpackChunkName: "stores" */
        /* webpackMode: "lazy" */
        '@/views/stores/StoreUpdate.vue'
      ),
    meta: {
      scopes: ['read,settings\\stores']
    }
  },
  {
    path: 'settings/general/:option?',
    name: 'settings-general',
    component: () =>
      import(
        /* webpackChunkName: "settings" */
        /* webpackMode: "lazy" */
        '@/views/settings/GeneralSettings.vue'
      ),
    meta: {
      scopes: ['read,settings\\general']
    }
  },
  {
    path: 'settings/plugins/:option',
    name: 'settings-plugins',
    component: () =>
      import(
        /* webpackChunkName: "settings" */
        /* webpackMode: "lazy" */
        '@/views/settings/PluginSettings.vue'
      ),
    meta: {
      scopes: ['read,settings\\general']
    }
  },
  {
    path: 'settings/:option?',
    name: 'settings',
    component: () =>
      import(
        /* webpackChunkName: "settings" */
        /* webpackMode: "lazy" */
        '@/views/settings/Settings.vue'
      ),
    meta: {
      scopes: ['read,settings\\general']
    }
  }
]

export default routes
