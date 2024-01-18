import { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'templates',
    name: 'templates',
    component: () =>
      import(
        /* webpackChunkName: "template" */
        /* webpackMode: "lazy" */
        '@/views/cms/template/Templates.vue'
      ),
    meta: {
      scopes: ['read,cms\\template']
    }
  },
  {
    path: 'templates/__',
    name: 'template-create',
    component: () =>
      import(
        /* webpackChunkName: "template" */
        /* webpackMode: "lazy" */
        '@/views/cms/template/TemplateCreate.vue'
      ),
    meta: {
      scopes: ['read,cms\\block']
    }
  },
  {
    path: 'templates/:id',
    name: 'template-update',
    component: () =>
      import(
        /* webpackChunkName: "template" */
        /* webpackMode: "lazy" */
        '@/views/cms/template/TemplateUpdate.vue'
      ),
    meta: {
      scopes: ['read,cms\\block']
    }
  },
  {
    path: 'preset/pages',
    name: 'preset-pages',
    component: () =>
      import(
        /* webpackChunkName: "preset" */
        /* webpackMode: "lazy" */
        '@/views/cms/preset/PresetPages.vue'
      ),
    meta: {
      scopes: ['read,cms\\page']
    }
  },
  {
    path: 'preset/pages/:preset/__',
    name: 'preset-page-create',
    component: () =>
      import(
        /* webpackChunkName: "preset" */
        /* webpackMode: "lazy" */
        '@/views/cms/preset/PresetPageCreate.vue'
      ),
    meta: {
      scopes: ['read,cms\\page']
    }
  },
  {
    path: 'preset/pages/:preset/:id',
    name: 'preset-page-update',
    component: () =>
      import(
        /* webpackChunkName: "preset" */
        /* webpackMode: "lazy" */
        '@/views/cms/preset/PresetPageUpdate.vue'
      ),
    meta: {
      scopes: ['read,cms\\page']
    }
  },
  {
    path: 'preset/blocks',
    name: 'preset-blocks',
    component: () =>
      import(
        /* webpackChunkName: "preset" */
        /* webpackMode: "lazy" */
        '@/views/cms/preset/PresetBlocks.vue'
      ),
    meta: {
      scopes: ['read,cms\\block']
    }
  },
  {
    path: 'preset/blocks/:preset/:id',
    name: 'preset-block-update',
    component: () =>
      import(
        /* webpackChunkName: "preset" */
        /* webpackMode: "lazy" */
        '@/views/cms/preset/PresetBlockUpdate.vue'
      ),
    meta: {
      scopes: ['read,cms\\block']
    }
  },
  {
    path: 'preset/settings/:preset?/:option?',
    name: 'preset-settings',
    component: () =>
      import(
        /* webpackChunkName: "preset" */
        /* webpackMode: "lazy" */
        '@/views/cms/preset/PresetTemplateSettings.vue'
      ),
    meta: {
      scopes: ['read,cms\\setting']
    }
  },
  {
    path: 'settings/:template?/:option?',
    name: 'template-settings',
    component: () =>
      import(
        /* webpackChunkName: "template" */
        /* webpackMode: "lazy" */
        '@/views/cms/template/TemplateSettings.vue'
      ),
    meta: {
      scopes: ['read,cms\\setting']
    }
  },
  {
    path: 'blocks',
    name: 'blocks',
    component: () =>
      import(
        /* webpackChunkName: "template" */
        /* webpackMode: "lazy" */
        '@/views/cms/template/Blocks.vue'
      ),
    meta: {
      scopes: ['read,cms\\block']
    }
  },
  {
    path: 'blocks/:template/:id',
    name: 'block-update',
    component: () =>
      import(
        /* webpackChunkName: "template" */
        /* webpackMode: "lazy" */
        '@/views/cms/template/BlockUpdate.vue'
      ),
    meta: {
      scopes: ['read,cms\\block']
    }
  },
  {
    path: 'pages',
    name: 'pages',
    component: () =>
      import(
        /* webpackChunkName: "template" */
        /* webpackMode: "lazy" */
        '@/views/cms/template/Pages.vue'
      ),
    meta: {
      scopes: ['read,cms\\page']
    }
  },
  {
    path: 'pages/:template/__',
    name: 'page-create',
    component: () =>
      import(
        /* webpackChunkName: "template" */
        /* webpackMode: "lazy" */
        '@/views/cms/template/PageCreate.vue'
      ),
    meta: {
      scopes: ['read,cms\\page']
    }
  },
  {
    path: 'pages/:template/:id',
    name: 'page-update',
    component: () =>
      import(
        /* webpackChunkName: "template" */
        /* webpackMode: "lazy" */
        '@/views/cms/template/PageUpdate.vue'
      ),
    meta: {
      scopes: ['read,cms\\page']
    }
  },
  {
    path: 'presets',
    name: 'presets',
    component: () =>
      import(
        /* webpackChunkName: "preset" */
        /* webpackMode: "lazy" */
        '@/views/cms/preset/Presets.vue'
      ),
    meta: {
      scopes: ['read,cms\\preset']
    }
  },
  {
    path: 'media',
    name: 'media',
    component: () =>
      import(
        /* webpackChunkName: "media" */
        /* webpackMode: "lazy" */
        '@/views/cms/media/Medias.vue'
      ),
    meta: {
      scopes: ['read,cms\\media']
    }
  },
  {
    path: 'media/__',
    name: 'media-create',
    component: () =>
      import(
        /* webpackChunkName: "media" */
        /* webpackMode: "lazy" */
        '@/views/cms/media/MediaCreate.vue'
      ),
    meta: {
      scopes: ['read,cms\\media']
    }
  },
  {
    path: 'media/:id',
    name: 'media-update',
    component: () =>
      import(
        /* webpackChunkName: "media" */
        /* webpackMode: "lazy" */
        '@/views/cms/media/MediaUpdate.vue'
      ),
    meta: {
      scopes: ['read,cms\\media']
    }
  }
]

export default routes
