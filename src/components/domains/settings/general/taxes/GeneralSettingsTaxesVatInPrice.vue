<template>
  <div>
    <switch-field v-bind="$attrs" v-model="vatInPrice" :label="$t('VAT in Price')" hide-details="auto" />
    <span class="text-caption">
      {{ $t('general.settings.taxes.vat_in_price') }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { TaxesSettings } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'GeneralSettingsTaxesVatInPrice',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<TaxesSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const vatInPrice = computed({
      get: () => props.value.vat_in_price,
      set: (vat_in_price) => emit('input', { ...props.value, vat_in_price })
    })

    return {
      vatInPrice
    }
  }
})
</script>
