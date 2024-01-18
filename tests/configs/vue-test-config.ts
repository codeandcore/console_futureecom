import Vue from 'vue'
import Vuetify from 'vuetify'
import type { ComponentOptions } from 'vue'
import type { ConfigurationCallback, RenderOptions, RenderResult } from '@testing-library/vue'

Vue.use(Vuetify)

//@TODO: remove after migration to Vue 2.7 AND Vite
Vue.config.silent = true

import { appPlugins } from '@/app'
import { render } from '@testing-library/vue'

import { loadConsolePlugins } from '@/config/consolePluginsLoader'

loadConsolePlugins()

export const renderWithMainApp = (
  component: ComponentOptions<any>,
  options?: RenderOptions<any>,
  callback?: ConfigurationCallback<any>
): RenderResult => {
  const root = document.createElement('div')
  root.setAttribute('data-app', 'true')

  return render(
    component,
    {
      container: document.body.appendChild(root),
      ...appPlugins,
      vuetify: new Vuetify(),
      ...options
    },
    callback
  )
}

import { config } from '@vue/test-utils'

config.stubs['quill-editor'] = {
  template: `<input type='text' data-cy='wysiswyg-html-editor' />`
}
