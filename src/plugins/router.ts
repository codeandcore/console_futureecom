import { default as VueRouter } from '@intlify/vue-router-bridge'
import { decodeRouteQuery } from '@/libs/router/parseRouteQuery'
import { filterRouteQuery } from '@/libs/router/stringifyRouteQuery'
import { parse, stringify } from 'qs'
import { routes } from '@/routes'
import Vue from 'vue'
import type { AsyncComponent, Component } from 'vue'
import type { abilities } from '@/types/Abilities'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  stringifyQuery: (query?: any): string =>
    stringify(query, {
      encode: false,
      addQueryPrefix: true,
      filter: filterRouteQuery
    }),
  parseQuery: (query: string): Record<string, unknown> => parse(query, { decoder: decodeRouteQuery }),
  routes
})

export interface Route {
  path: string
  name: string
  component: Component | AsyncComponent
  meta?: {
    scopes?: abilities[]
  }
}

export default router
