<template>
  <v-text-field v-model="name" v-bind="$attrs" :label="$t('Name')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { CloudinarySettings } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'GeneralSettingCloudinaryName',

  props: {
    value: {
      type: Object as PropType<CloudinarySettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const name = computed({
      get: () => props.value.name,
      set: (name) => emit('input', { ...props.value, name })
    })

    return {
      name
    }
  }
})
</script>
