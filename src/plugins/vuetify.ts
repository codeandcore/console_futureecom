import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import type { UserVuetifyPreset } from 'vuetify'

Vue.use(Vuetify)

const opts: UserVuetifyPreset = {
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: '#5a459c',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        brand_neutral: '#414042',
        brand_primary: '#5a459c'
      }
    }
  }
}

export default new Vuetify(opts)
