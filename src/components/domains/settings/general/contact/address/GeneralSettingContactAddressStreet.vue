<template>
  <v-text-field v-model="street" v-bind="$attrs" :label="$t('Street')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { AddressContactSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingContactAddressStreet',

  props: {
    value: {
      type: Object as PropType<AddressContactSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const street = computed({
      get: () => props.value.street,
      set: (street) => emit('input', { ...props.value, street })
    })

    return {
      street
    }
  }
})
</script>
