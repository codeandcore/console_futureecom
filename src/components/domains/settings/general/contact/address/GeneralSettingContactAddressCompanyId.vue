<template>
  <v-text-field v-model="companyId" v-bind="$attrs" :label="$t('Company ID')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { AddressContactSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingContactAddressCompanyId',

  props: {
    value: {
      type: Object as PropType<AddressContactSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const companyId = computed({
      get: () => props.value.company_id,
      set: (company_id) => emit('input', { ...props.value, company_id: company_id || null })
    })

    return {
      companyId
    }
  }
})
</script>
