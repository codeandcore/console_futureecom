<template>
  <v-text-field v-model="city" v-bind="$attrs" :label="$t('City')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { AddressContactSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingContactAddressCity',

  props: {
    value: {
      type: Object as PropType<AddressContactSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const city = computed({
      get: () => props.value.city,
      set: (city) => emit('input', { ...props.value, city })
    })

    return {
      city
    }
  }
})
</script>
