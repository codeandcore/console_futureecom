<template>
  <v-menu :close-on-content-click="false" offset-y min-width="auto">
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="color"
        :label="label"
        :messages="messages || ''"
        prepend-icon="mdi-palette"
        outlined
        readonly
        v-bind="attrs"
        v-on="on"
      />
    </template>
    <v-color-picker v-model="color" />
  </v-menu>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
export interface Hsla {
  h: number
  s: number
  l: number
  a: number
}

interface Hsva {
  h: number
  s: number
  v: number
  a: number
}

export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

interface ColorObject {
  alpha: number
  hex: string
  hexa: string
  hsla: Hsla
  hsva: Hsva
  hue: number
  rgba: Rgba
}

export default defineComponent({
  name: 'ColorPicker',

  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    messages: {
      type: String,
      default: ''
    }
  },

  setup(props, { emit }) {
    const color = computed({
      get: (): string => props.value,
      set: (val: ColorObject | string): void => emit('input', typeof val === 'string' ? val.slice(0, 7) : val.hex)
    })

    return {
      color
    }
  }
})
</script>
