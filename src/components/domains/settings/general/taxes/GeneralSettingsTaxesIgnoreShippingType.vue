<template>
  <div>
    <switch-field
      v-bind="$attrs"
      v-model="ignoreShippingType"
      :label="$t('Ignore Shipping Type')"
      hide-details="auto"
    />
    <span class="text-caption">
      {{ $t('general.settings.taxes.shipping_type') }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { TaxesSettings } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'GeneralSettingsTaxesIgnoreShippingType',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<TaxesSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const ignoreShippingType = computed({
      get: () => props.value.ignore_shipping_type,
      set: (ignore_shipping_type) => emit('input', { ...props.value, ignore_shipping_type })
    })

    return {
      ignoreShippingType
    }
  }
})
</script>
