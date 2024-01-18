import { Route } from '@/plugins/router'

const routes: Route[] = [
  {
    path: 'categories',
    name: 'categories',
    component: () =>
      import(
        /* webpackChunkName: "category" */
        /* webpackMode: "lazy" */
        '@/views/catalog/category/Categories.vue'
      ),
    meta: {
      scopes: ['read,catalog\\category']
    }
  },
  {
    path: 'categories/__',
    name: 'category-create',
    component: () =>
      import(
        /* webpackChunkName: "category" */
        /* webpackMode: "lazy" */
        '@/views/catalog/category/CategoryCreate.vue'
      ),
    meta: {
      scopes: ['read,catalog\\category']
    }
  },
  {
    path: 'categories/:id',
    name: 'category-update',
    component: () =>
      import(
        /* webpackChunkName: "category" */
        /* webpackMode: "lazy" */
        '@/views/catalog/category/CategoryUpdate.vue'
      ),
    meta: {
      scopes: ['read,catalog\\category']
    }
  },
  {
    path: 'products',
    name: 'products',
    component: () =>
      import(
        /* webpackChunkName: "product" */
        /* webpackMode: "lazy" */
        '@/views/catalog/product/Products.vue'
      ),
    meta: {
      scopes: ['read,catalog\\product']
    }
  },
  {
    path: 'product/__/:option?',
    name: 'product-create',
    component: () =>
      import(
        /* webpackChunkName: "product" */
        /* webpackMode: "lazy" */
        '@/views/catalog/product/ProductCreate.vue'
      ),
    meta: {
      scopes: ['read,catalog\\product']
    }
  },
  {
    path: 'product/:id/:option?',
    name: 'product-update',
    component: () =>
      import(
        /* webpackChunkName: "product" */
        /* webpackMode: "lazy" */
        '@/views/catalog/product/ProductUpdate.vue'
      ),
    meta: {
      scopes: ['read,catalog\\product']
    }
  },
  {
    path: 'taxonomy',
    name: 'taxonomy',
    component: () =>
      import(
        /* webpackChunkName: "taxonomy" */
        /* webpackMode: "lazy" */
        '@/views/catalog/taxonomy/Taxonomies.vue'
      ),
    meta: {
      scopes: ['read,catalog\\taxonomy']
    }
  },
  {
    path: 'taxonomy/__/:option?',
    name: 'taxonomy-create',
    component: () =>
      import(
        /* webpackChunkName: "taxonomy" */
        /* webpackMode: "lazy" */
        '@/views/catalog/taxonomy/TaxonomyCreate.vue'
      ),
    meta: {
      scopes: ['read,catalog\\taxonomy']
    }
  },
  {
    path: 'taxonomy/:id/:option?',
    name: 'taxonomy-update',
    component: () =>
      import(
        /* webpackChunkName: "taxonomy" */
        /* webpackMode: "lazy" */
        '@/views/catalog/taxonomy/TaxonomyUpdate.vue'
      ),
    meta: {
      scopes: ['read,catalog\\taxonomy']
    }
  },
  {
    path: 'inventory',
    name: 'inventory',
    component: () =>
      import(
        /* webpackChunkName: "taxonomy" */
        /* webpackMode: "lazy" */
        '@/views/catalog/ManageInventory.vue'
      ),
    meta: {
      scopes: ['read,catalog\\product']
    }
  },
  {
    path: 'boxes',
    name: 'boxes',
    component: () =>
      import(
        /* webpackChunkName: "boxes" */
        /* webpackMode: "lazy" */
        '@/views/cart/boxes/Boxes.vue'
      ),
    meta: {
      scopes: ['read,cart\\box']
    }
  },
  {
    path: 'boxes/__',
    name: 'box-create',
    component: () =>
      import(
        /* webpackChunkName: "boxes" */
        /* webpackMode: "lazy" */
        '@/views/cart/boxes/BoxCreate.vue'
      ),
    meta: {
      scopes: ['read,cart\\box']
    }
  },
  {
    path: 'boxes/:id',
    name: 'box-update',
    component: () =>
      import(
        /* webpackChunkName: "boxes" */
        /* webpackMode: "lazy" */
        '@/views/cart/boxes/BoxUpdate.vue'
      ),
    meta: {
      scopes: ['read,cart\\box']
    }
  },
  {
    path: 'brands',
    name: 'brands',
    component: () =>
      import(
        /* webpackChunkName: "brands" */
        /* webpackMode: "lazy" */
        '@/views/catalog/brands/Brands.vue'
      ),
    meta: {
      scopes: ['read,catalog\\brand']
    }
  },
  {
    path: 'brands/__',
    name: 'brand-create',
    component: () =>
      import(
        /* webpackChunkName: "brands" */
        /* webpackMode: "lazy" */
        '@/views/catalog/brands/BrandCreate.vue'
      ),
    meta: {
      scopes: ['read,catalog\\brand']
    }
  },
  {
    path: 'brands/:id',
    name: 'brand-update',
    component: () =>
      import(
        /* webpackChunkName: "brands" */
        /* webpackMode: "lazy" */
        '@/views/catalog/brands/BrandUpdate.vue'
      ),
    meta: {
      scopes: ['read,catalog\\brand']
    }
  },
  {
    path: 'tags',
    name: 'tags',
    component: () =>
      import(
        /* webpackChunkName: "tags" */
        /* webpackMode: "lazy" */
        '@/views/catalog/tags/Tags.vue'
      ),
    meta: {
      scopes: ['read,catalog\\tag']
    }
  },
  {
    path: 'tags/__',
    name: 'tag-create',
    component: () =>
      import(
        /* webpackChunkName: "tags" */
        /* webpackMode: "lazy" */
        '@/views/catalog/tags/TagCreate.vue'
      ),
    meta: {
      scopes: ['read,catalog\\tag']
    }
  },
  {
    path: 'tags/:id',
    name: 'tag-update',
    component: () =>
      import(
        /* webpackChunkName: "tags" */
        /* webpackMode: "lazy" */
        '@/views/catalog/tags/TagUpdate.vue'
      ),
    meta: {
      scopes: ['read,catalog\\tag']
    }
  }
]

export default routes
