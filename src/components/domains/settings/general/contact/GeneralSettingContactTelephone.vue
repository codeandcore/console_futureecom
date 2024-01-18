<template>
  <v-text-field
    v-model="telephone"
    v-bind="$attrs"
    :label="$t('Telephone')"
    outlined
    hide-details="auto"
    type="number"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { ContactSettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingContactTelephone',
  props: {
    value: {
      type: Object as PropType<ContactSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const telephone = computed({
      get: () => props.value.telephone,
      set: (telephone) => emit('input', { ...props.value, telephone })
    })

    return {
      telephone
    }
  }
})
</script>
