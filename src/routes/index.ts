import { RouteConfig } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Restricted from '@/views/Restricted.vue'
import RouterChildView from '@/components/layouts/RouterChildView.vue'
import admin from '@/middleware/admin'
import authRoutes from '@/routes/authRoutes'
import campaignRoutes from '@/routes/campaignRoutes'
import cartRoutes from '@/routes/cartRoutes'
import catalogRoutes from '@/routes/catalogRoutes'
import cmsRoutes from '@/routes/cmsRoutes'
import customerRoutes from '@/routes/customerRoutes'
import init from '@/middleware/init'
import multiguard from 'vue-router-multiguard'
import notificationRoutes from '@/routes/notificationRoutes'
import paymentRoutes from '@/routes/paymentRoutes'
import saleRoutes from '@/routes/saleRoutes'
import settingsRoutes from '@/routes/settingsRoutes'
import shippingRoutes from '@/routes/shippingRoutes'
import taxRoutes from '@/routes/taxRoutes'

const services = {
  auth: authRoutes,
  cart: cartRoutes,
  catalog: catalogRoutes,
  customer: customerRoutes,
  payment: paymentRoutes,
  sale: saleRoutes,
  settings: settingsRoutes,
  shipping: shippingRoutes,
  tax: taxRoutes,
  cms: cmsRoutes,
  campaign: campaignRoutes,
  notifications: notificationRoutes
}

const notFoundRoute = {
  path: '*',
  component: () => import('@/views/NotFound.vue')
}

const servicesRoutes = (): RouteConfig[] => {
  return [
    ...Object.entries(services).map((value) => {
      const [service, routes] = value

      return {
        path: service,
        component: RouterChildView,
        children: routes
      }
    }),
    notFoundRoute
  ]
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('@/components/layouts/FrontpageLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        alias: 'login',
        component: () => import('@/views/Login.vue')
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/views/ForgotPassword.vue')
      },
      {
        path: 'reset-password/:token?',
        name: 'reset-password',
        component: () => import('@/views/PasswordReset.vue')
      }
    ]
  },
  {
    path: '/panel',
    name: 'panel',
    component: () => import('@/layouts/default.vue'),
    beforeEnter: multiguard([admin, init]),
    children: [
      {
        path: ':organisation?/:store?',
        component: RouterChildView,
        children: [
          {
            path: 'dashboard',
            name: 'dashboard',
            component: Dashboard
          },
          {
            path: 'restricted',
            name: 'restricted',
            component: Restricted
          }
        ]
      },
      {
        path: ':organisation/:store',
        component: RouterChildView,
        children: servicesRoutes()
      }
    ]
  },
  notFoundRoute
]
