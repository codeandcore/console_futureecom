<template>
  <v-select
    v-bind="$attrs"
    v-model.trim="applications"
    :items="items"
    item-text="text"
    item-value="value"
    hide-details="auto"
    outlined
    :label="$t('Application')"
    clearable
    data-cy="select-application"
  />
</template>

<script lang="ts">
import { ApplicationType } from '@futureecom/futureecom-js/dist/futureecom'
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SelectApplication',

  props: {
    value: {
      type: [] as PropType<string | string[]>,
      default: undefined
    },
    appTypes: {
      type: Array as PropType<ApplicationType[]>,
      default: () => []
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const applications = computed({
      get: () => props.value,
      set: (applications: string | string[]) => emit('input', applications)
    })

    const items = computed(() => {
      const applicationOptions = [
        { text: t('Storefront'), value: ApplicationType.STOREFRONT },
        { text: t('Console'), value: ApplicationType.CONSOLE },
        { text: t('Point of Sale'), value: ApplicationType.POS },
        { text: t('API'), value: ApplicationType.API },
        { text: t('Overview'), value: ApplicationType.OVERVIEW }
      ]

      return applicationOptions
        .filter((app) => ((props.appTypes || []).length ? props.appTypes.includes(app.value) : true))
        .map((item) => ({ ...item, text: t(item.text) }))
    })

    return {
      applications,
      items
    }
  }
})
</script>
