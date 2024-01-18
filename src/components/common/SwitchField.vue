<template>
  <div data-cy="switch-field" @click.stop="onToggle(!value)">
    <v-input v-bind="$attrs" hide-details="auto" class="align-center">
      <template #label>
        <span role="button" data-cy="switch-field-label">{{ label }}</span>
      </template>
      <template #append>
        <v-switch class="ma-0" :input-value="value" :disabled="disabled" hide-details data-cy="switch-field-toggle" />
      </template>
    </v-input>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import type { PropType } from '@vue/composition-api'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'SwitchField',

  inheritAttrs: false,

  props: {
    label: {
      type: [] as PropType<string | TranslateResult>,
      default: ''
    },
    value: {
      type: [] as PropType<boolean | undefined>,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },

  setup(props, { emit }) {
    const onToggle = (val: boolean | null) => {
      if (!props.disabled) {
        emit('input', Boolean(val))
      }
    }

    return {
      onToggle
    }
  }
})
</script>
