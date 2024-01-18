<template>
  <v-text-field v-model="preset" v-bind="$attrs" :label="$t('Preset')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CloudinarySettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingCloudinaryPreset',

  props: {
    value: {
      type: Object as PropType<CloudinarySettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const preset = computed({
      get: () => props.value.preset,
      set: (preset) => emit('input', { ...props.value, preset })
    })

    return {
      preset
    }
  }
})
</script>
