import { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'templates',
    name: 'notification-templates',
    component: () =>
      import(
        /* webpackChunkName: "notifications" */
        /* webpackMode: "lazy" */
        '@/views/notifications/templates/NotificationTemplates.vue'
      ),
    meta: {
      scopes: ['read,notifications\\template']
    }
  },
  {
    path: 'templates/:id',
    name: 'notification-template-update',
    component: () =>
      import(
        /* webpackChunkName: "notifications" */
        /* webpackMode: "lazy" */
        '@/views/notifications/templates/NotificationTemplateUpdate.vue'
      ),
    meta: {
      scopes: ['read,notifications\\template']
    }
  },
  {
    path: 'webhooks',
    name: 'webhooks',
    component: () =>
      import(
        /* webpackChunkName: "notifications" */
        /* webpackMode: "lazy" */
        '@/views/notifications/webhook/Webhooks.vue'
      ),
    meta: {
      scopes: ['read,notifications\\webhook']
    }
  },
  {
    path: 'webhooks/__',
    name: 'webhook-create',
    component: () =>
      import(
        /* webpackChunkName: "notifications" */
        /* webpackMode: "lazy" */
        '@/views/notifications/webhook/WebhookCreate.vue'
      )
  },
  {
    path: 'webhooks/:id',
    name: 'webhook-update',
    component: () =>
      import(
        /* webpackChunkName: "notifications" */
        /* webpackMode: "lazy" */
        '@/views/notifications/webhook/WebhookUpdate.vue'
      )
  }
]

export default routes
