import { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'my-account',
    name: 'my-account',
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        /* webpackMode: "lazy" */
        '@/views/MyAccount.vue'
      ),
    meta: {
      scopes: ['read,auth\\user']
    }
  },
  {
    path: 'admins',
    name: 'admins',
    component: () =>
      import(
        /* webpackChunkName: "admins" */
        /* webpackMode: "lazy" */
        '@/views/auth/admin/Admins.vue'
      ),
    meta: {
      scopes: ['read,auth\\user']
    }
  },
  {
    path: 'admins/__',
    name: 'admin-create',
    component: () =>
      import(
        /* webpackChunkName: "admins" */
        /* webpackMode: "lazy" */
        '@/views/auth/admin/AdminCreate.vue'
      ),
    meta: {
      scopes: ['read,auth\\user']
    }
  },
  {
    path: 'admins/:id',
    name: 'admin-update',
    component: () =>
      import(
        /* webpackChunkName: "admins" */
        /* webpackMode: "lazy" */
        '@/views/auth/admin/AdminUpdate.vue'
      ),
    meta: {
      scopes: ['read,auth\\user']
    }
  },
  {
    path: 'roles',
    name: 'roles',
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        /* webpackMode: "lazy" */
        '@/views/auth/role/Roles.vue'
      ),
    meta: {
      scopes: ['read,auth\\role']
    }
  },
  {
    path: 'roles/__',
    name: 'role-create',
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        /* webpackMode: "lazy" */
        '@/views/auth/role/RoleCreate.vue'
      ),
    meta: {
      scopes: ['create,auth\\role']
    }
  },
  {
    path: 'roles/:id',
    name: 'role-update',
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        /* webpackMode: "lazy" */
        '@/views/auth/role/RoleUpdate.vue'
      ),
    meta: {
      scopes: ['read,auth\\role']
    }
  },
  {
    path: 'permissions',
    name: 'permissions',
    component: () =>
      import(
        /* webpackChunkName: "permissions" */
        /* webpackMode: "lazy" */
        '@/views/auth/permission/Permissions.vue'
      ),
    meta: {
      scopes: ['read,auth\\permission']
    }
  },
  {
    path: 'permissions/__',
    name: 'permission-create',
    component: () =>
      import(
        /* webpackChunkName: "permissions" */
        /* webpackMode: "lazy" */
        '@/views/auth/permission/PermissionCreate.vue'
      ),
    meta: {
      scopes: ['read,auth\\permission']
    }
  },
  {
    path: 'permissions/:id',
    name: 'permission-update',
    component: () =>
      import(
        /* webpackChunkName: "permissions" */
        /* webpackMode: "lazy" */
        '@/views/auth/permission/PermissionUpdate.vue'
      ),
    meta: {
      scopes: ['read,auth\\permission']
    }
  },
  {
    path: 'tos',
    name: 'tos',
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        /* webpackMode: "lazy" */
        '@/views/Restricted.vue'
      ),
    meta: {
      scopes: ['read,tos\\tos']
    }
  },
  {
    path: 'clients',
    name: 'clients',
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        /* webpackMode: "lazy" */
        '@/views/auth/client/Clients.vue'
      ),
    meta: {
      scopes: ['read,auth\\client']
    }
  },
  {
    path: 'clients/__',
    name: 'client-create',
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        /* webpackMode: "lazy" */
        '@/views/auth/client/ClientCreate.vue'
      ),
    meta: {
      scopes: ['create,auth\\client']
    }
  },
  {
    path: 'clients/:id',
    name: 'client-update',
    component: () =>
      import(
        /* webpackChunkName: "auth" */
        /* webpackMode: "lazy" */
        '@/views/auth/client/ClientUpdate.vue'
      ),
    meta: {
      scopes: ['read,auth\\client']
    }
  },
  {
    path: 'admin/:admin/representative/__',
    name: 'representative-create',
    component: () =>
      import(
        /* webpackChunkName: "representative" */
        /* webpackMode: "lazy" */
        '@/views/auth/representative/RepresentativeCreate.vue'
      ),
    meta: {
      scopes: ['read,commission\\representative']
    }
  },
  {
    path: 'admin/:admin/representative/:id',
    name: 'representative-update',
    component: () =>
      import(
        /* webpackChunkName: "representative" */
        /* webpackMode: "lazy" */
        '@/views/auth/representative/RepresentativeUpdate.vue'
      ),
    meta: {
      scopes: ['read,commission\\representative']
    }
  }
]

export default routes
