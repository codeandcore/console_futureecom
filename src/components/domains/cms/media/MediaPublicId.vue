<template>
  <v-text-field v-bind="$attrs" v-model="publicId" hide-details="auto" outlined :label="$t('Public ID')" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'MediaPublicId',

  props: {
    value: {
      type: Object as PropType<{ public_id?: string }>,
      required: true
    }
  },

  setup(props, { emit }) {
    const publicId = computed({
      get: () => props.value.public_id,
      set: (public_id) => emit('input', { ...props.value, public_id })
    })

    return {
      publicId
    }
  }
})
</script>
