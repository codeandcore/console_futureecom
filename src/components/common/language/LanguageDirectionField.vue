<template>
  <v-input :label="$t('Text direction')" hide-details="auto">
    <template #append>
      <v-chip-group v-model="dir" mandatory active-class="primary--text">
        <v-chip value="ltr">
          {{ $t('Left-to-Right') }}
        </v-chip>
        <v-chip value="rtl">
          {{ $t('Right-to-Left') }}
        </v-chip>
      </v-chip-group>
    </template>
  </v-input>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import type { Language } from '@futureecom/futureecom-js/dist/services/setting-service'

export default defineComponent({
  name: 'LanguageDirectionField',

  props: {
    value: {
      type: Object as () => Language,
      required: true
    }
  },

  setup(props, { emit }) {
    const dir = computed({
      get: () => props.value.dir,
      set: (dir) => emit('input', { ...props.value, dir })
    })

    return {
      dir
    }
  }
})
</script>
