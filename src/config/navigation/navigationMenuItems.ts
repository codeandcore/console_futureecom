import { useCmsPresetChecker } from '@/composable/useCms'
import { useCrudChecker } from '@/composable/useCrudChecker'
import type { NavigationMenuItem } from '@/types/NavigationMenuItem'

export const menuItems: NavigationMenuItem[] = [
  {
    title: 'Organisations',
    icon: 'supervised_user_circle',
    link: {
      name: 'organisations'
    },
    meta: {
      overview_only: true,
      scope: ['read,settings\\organisations', 'manage,settings\\organisations']
    }
  },
  {
    title: 'Stores',
    icon: 'store',
    link: {
      name: 'stores'
    },
    meta: {
      console_only: true,
      scope: ['read,settings\\stores', 'create,settings\\stores', 'manage,settings\\stores']
    }
  },
  {
    title: 'Sales',
    icon: 'shopping_cart',
    submenu: [
      {
        title: 'Reports',
        link: { name: 'reports' },
        meta: {
          scope: ['read,orders\\order', 'manage,orders\\order']
        }
      },
      {
        title: 'Orders',
        link: { name: 'orders' },
        meta: {
          scope: ['read,orders\\order', 'manage,orders\\order']
        }
      },
      {
        title: 'Carts',
        link: { name: 'carts' },
        meta: {
          scope: ['read,cart\\cart', 'manage,cart\\cart']
        }
      },
      {
        title: 'Quotes',
        link: { name: 'quotes' },
        meta: {
          scope: ['read,cart\\quote', 'manage,cart\\quote']
        }
      },
      {
        title: 'Commissions',
        link: { name: 'commissions' },
        meta: {
          scope: ['read,commission\\commission', 'manage,commission\\commission']
        }
      }
    ]
  },
  {
    title: 'Customers',
    icon: 'supervisor_account',
    submenu: [
      {
        title: 'All customers',
        link: { name: 'customers' },
        meta: {
          scope: ['read,customers\\customer', 'manage,customers\\customer']
        }
      },
      {
        title: 'Groups',
        link: { name: 'customer-groups' },
        meta: {
          scope: ['read,customers\\group', 'manage,customers\\group']
        }
      }
    ]
  },
  {
    title: 'Catalog',
    icon: 'library_books',
    submenu: [
      {
        title: 'Products',
        link: { name: 'products' },
        meta: {
          scope: ['read,catalog\\product', 'manage,catalog\\product']
        }
      },
      {
        title: 'Manage Inventory',
        link: { name: 'inventory' },
        meta: {
          scope: ['read,catalog\\product', 'manage,catalog\\product']
        }
      },
      {
        title: 'Brands',
        link: { name: 'brands' },
        meta: {
          scope: ['read,catalog\\brand', 'manage,catalog\\brand']
        }
      },
      {
        title: 'Tags',
        link: { name: 'tags' },
        meta: {
          scope: ['read,catalog\\tag', 'manage,catalog\\tag']
        }
      },
      {
        title: 'Categories',
        link: { name: 'categories' },
        meta: {
          scope: ['read,catalog\\category', 'manage,catalog\\category']
        }
      },
      {
        title: 'Boxes',
        link: { name: 'boxes' },
        meta: {
          scope: ['read,cart\\box', 'manage,cart\\box']
        }
      },
      {
        title: 'Taxonomy',
        link: { name: 'taxonomy' },
        meta: {
          scope: ['read,catalog\\taxonomy', 'manage,catalog\\taxonomy']
        }
      }
    ]
  },
  {
    title: 'Campaigns',
    icon: 'whatshot',
    link: { name: 'campaigns' },
    meta: {
      scope: ['read,promotions\\promotion', 'manage,promotions\\promotion']
    }
  },
  {
    title: 'Taxes',
    icon: 'attach_money',
    submenu: [
      {
        title: 'Sale tax',
        link: { name: 'sale-taxes' },
        meta: {
          scope: ['read,taxes\\vat', 'manage,taxes\\vat']
        }
      },
      {
        title: 'Sale tax groups',
        link: { name: 'sale-tax-groups' },
        meta: {
          scope: ['read,taxes\\taxgroup', 'manage,taxes\\taxgroup']
        }
      },
      {
        title: 'Vat rates',
        link: { name: 'vat-rates' },
        meta: {
          scope: ['read,taxes\\taxrate', 'manage,taxes\\taxrate']
        }
      }
    ]
  },
  {
    title: 'Shipping',
    icon: 'place',
    submenu: [
      {
        title: 'Zones',
        link: { name: 'zones' },
        meta: {
          scope: ['read,zones\\zone', 'manage,zones\\zone']
        }
      },
      {
        title: 'Methods',
        link: { name: 'shipping-methods' },
        meta: {
          scope: ['read,cart\\shipping', 'manage,cart\\shipping']
        }
      }
    ]
  },
  {
    title: 'Payment methods',
    icon: 'payment',
    link: { name: 'payment-methods' },
    meta: {
      scope: ['read,payments\\method', 'manage,payments\\method']
    }
  },
  {
    title: 'Notifications',
    icon: 'notifications',
    submenu: [
      {
        title: 'Templates',
        link: { name: 'notification-templates' },
        meta: {
          scope: ['read,notifications\\template', 'manage,notifications\\template']
        }
      },
      {
        title: 'Webhooks',
        link: { name: 'webhooks' },
        meta: {
          scope: ['read,notifications\\webhook', 'manage,notifications\\webhook']
        }
      }
    ]
  },
  {
    title: 'Auth',
    icon: 'verified_user',
    submenu: [
      {
        title: 'Clients',
        link: { name: 'clients' },
        meta: {
          scope: ['read,auth\\client', 'manage,auth\\client'],
          overview_available: true
        }
      },
      {
        title: 'Admins',
        link: { name: 'admins' },
        meta: {
          scope: ['read,auth\\user', 'manage,auth\\user'],
          overview_available: true
        }
      },
      {
        title: 'Roles',
        link: { name: 'roles' },
        meta: {
          scope: ['read,auth\\role', 'manage,auth\\role'],
          overview_available: true
        }
      },
      {
        title: 'Permissions',
        link: { name: 'permissions' },
        meta: {
          scope: ['read,auth\\permission', 'manage,auth\\permission'],
          overview_available: true
        }
      }
    ]
  },
  {
    title: 'CMS',
    icon: 'view_quilt',
    submenu: [
      {
        title: 'Media',
        link: { name: 'media' },
        meta: {
          scope: ['read,cms\\media', 'manage,cms\\media']
        }
      },
      {
        title: 'Template',
        submenu: [
          {
            title: 'Pages',
            link: { name: 'pages' },
            meta: {
              scope: ['read,cms\\page', 'manage,cms\\page']
            }
          },
          {
            title: 'Blocks',
            link: { name: 'blocks' },
            meta: {
              scope: ['read,cms\\block', 'manage,cms\\block']
            }
          },
          {
            title: 'Settings',
            link: { name: 'template-settings' },
            meta: {
              scope: ['read,cms\\setting', 'manage,cms\\setting']
            }
          },
          {
            title: 'Templates',
            link: { name: 'templates' },
            meta: {
              scope: ['read,cms\\template', 'manage,cms\\template']
            }
          }
        ]
      },
      {
        title: 'Preset',
        submenu: [
          {
            title: 'Pages',
            link: { name: 'preset-pages' },
            meta: {
              permissionMatcher: () => {
                const { canReadOrganisationPresets } = useCmsPresetChecker('page')
                const { canRead } = useCrudChecker('cms\\page')
                return canReadOrganisationPresets.value && canRead.value
              },
              overview_available: true
            }
          },
          {
            title: 'Blocks',
            link: { name: 'preset-blocks' },
            meta: {
              permissionMatcher: () => {
                const { canReadOrganisationPresets } = useCmsPresetChecker('block')
                const { canRead } = useCrudChecker('cms\\block')
                return canReadOrganisationPresets.value && canRead.value
              },
              overview_available: true
            }
          },
          {
            title: 'Settings',
            link: { name: 'preset-settings' },
            meta: {
              permissionMatcher: () => {
                const { canReadOrganisationPresets } = useCmsPresetChecker('setting')
                const { canRead } = useCrudChecker('cms\\setting')
                return canReadOrganisationPresets.value && canRead.value
              },
              overview_available: true
            }
          },
          {
            title: 'Presets',
            link: { name: 'presets' },
            meta: {
              permissionMatcher: () => {
                const { canReadOrganisationPresets } = useCmsPresetChecker('preset')
                return canReadOrganisationPresets.value
              },
              overview_available: true
            }
          }
        ]
      }
    ]
  }
]
