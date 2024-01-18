<template>
  <v-text-field v-model="postcode" v-bind="$attrs" :label="$t('Postcode')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { AddressContactSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingContactAddressPostcode',

  props: {
    value: {
      type: Object as PropType<AddressContactSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const postcode = computed({
      get: () => props.value.postcode,
      set: (postcode) => emit('input', { ...props.value, postcode })
    })

    return {
      postcode
    }
  }
})
</script>
