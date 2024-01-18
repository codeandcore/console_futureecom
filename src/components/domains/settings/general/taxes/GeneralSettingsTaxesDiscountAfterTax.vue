<template>
  <div>
    <switch-field v-bind="$attrs" v-model="discountAfterTax" :label="$t('Discount After Tax')" hide-details="auto" />
    <span class="text-caption">
      {{ $t('general.settings.taxes.discount_after') }}
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { TaxesSettings } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'GeneralSettingsTaxesDiscountAfterTax',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<TaxesSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const discountAfterTax = computed({
      get: () => props.value.discount_after_tax,
      set: (discount_after_tax) => emit('input', { ...props.value, discount_after_tax })
    })

    return {
      discountAfterTax
    }
  }
})
</script>
