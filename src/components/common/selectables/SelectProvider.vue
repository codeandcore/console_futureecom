<template>
  <v-select
    v-bind="$attrs"
    v-model.trim="providers"
    :items="items"
    hide-details="auto"
    outlined
    :label="$t('Provider')"
    clearable
    data-cy="select-provider"
  />
</template>

<script lang="ts">
import { UserType } from '@futureecom/futureecom-js/dist/services/auth-service'
import { computed, defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-bridge'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'SelectProvider',

  props: {
    value: {
      type: [] as PropType<string | string[]>,
      default: undefined
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()

    const providers = computed({
      get: () => props.value,
      set: (providers: string | string[]) => emit('input', providers)
    })

    const items = computed(() => {
      return [
        { value: UserType.GUEST, text: t('Guest') },
        { value: UserType.CUSTOMER, text: t('Customer') },
        { value: UserType.ADMIN, text: t('Admin') },
        { value: UserType.SUPER_ADMIN, text: t('Super Admin') }
      ]
    })

    return {
      items,
      providers
    }
  }
})
</script>
