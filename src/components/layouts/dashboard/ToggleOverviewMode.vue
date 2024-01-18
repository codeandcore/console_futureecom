<template>
  <v-switch v-model="isOverview" :label="$t('Overview mode')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ToggleOverviewMode',

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  setup(props, { emit }) {
    const isOverview = computed({
      get: () => !!props.value,
      set: (val: boolean | null) => emit('input', Boolean(val))
    })
    return {
      isOverview
    }
  }
})
</script>
