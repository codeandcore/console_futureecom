<template>
  <v-tooltip bottom :disabled="!iconName" data-cy="button-action">
    <template #activator="{ on, attrs }">
      <v-btn
        depressed
        v-bind="{ ...attrs, ...$attrs, icon: !!iconName, text: !iconName }"
        data-cy="button-action-activator"
        v-on="{ ...$listeners, ...on }"
      >
        <v-icon v-if="iconName" data-cy="button-action-icon">
          {{ iconName }}
        </v-icon>
        <span v-else data-cy="button-action-text">{{ $attrs.label }}{{ itemsCountLabel }}</span>
      </v-btn>
    </template>
    <span v-if="iconName" data-cy="button-action-tooltip-text">{{ $attrs.label }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'ButtonAction',

  inheritAttrs: false,

  props: {
    iconName: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    }
  },

  setup(props) {
    const itemsCountLabel = computed(() => (props.items.length ? ` (${props.items.length})` : undefined))
    return {
      itemsCountLabel
    }
  }
})
</script>
