<template>
  <v-select
    v-bind="$attrs"
    v-model="disableForGuest"
    :items="options"
    :label="$t('Disable For Guest')"
    item-text="text"
    item-value="value"
    outlined
    hide-details="auto"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CheckoutSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

interface DisableForGuestOptions {
  text: string | TranslateResult
  value: CheckoutSettings['disable_for_guest']
}

export default defineComponent({
  name: 'GeneralSettingCheckoutDisabledForGuest',

  props: {
    value: {
      type: Object as PropType<CheckoutSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const disableForGuest = computed({
      get: () => props.value.disable_for_guest,
      set: (disable_for_guest) => emit('input', { ...props.value, disable_for_guest })
    })

    const options = computed((ctx): DisableForGuestOptions[] => [
      { text: ctx.$t('Full'), value: 'full' },
      { text: ctx.$t('Partial'), value: 'partial' },
      { text: ctx.$t('None'), value: 'none' }
    ])

    return {
      disableForGuest,
      options
    }
  }
})
</script>
