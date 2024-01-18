import { getCurrentInstance } from '@vue/composition-api'

export const useVuetify = () => getCurrentInstance()?.proxy?.$vuetify || undefined
