<template>
  <div class="d-flex align-center flex-gap-8">
    <v-btn small icon fab color="primary" :disabled="!canDecrement" @click="quantity--">
      <v-icon size="30">remove_circle</v-icon>
    </v-btn>
    <v-text-field v-model.number="quantity" v-bind="$attrs" v-maska:[options] outlined hide-details type="number" />
    <v-btn small icon fab color="primary" :disabled="!canIncrement" @click="quantity++">
      <v-icon size="30">add_circle</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from '@vue/composition-api'

export default defineComponent({
  name: 'QuantityField',

  inheritAttrs: false,

  props: {
    value: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 0
    }
  },

  setup(props, { emit }) {
    const quantity = computed({
      get: (): number => props.value,
      set: (value) => emit('input', value || props.min)
    })

    const canIncrement = computed((): boolean => (props.max ? quantity.value < props.max : true))
    const canDecrement = computed((): boolean => quantity.value > props.min)

    watch(
      () => props.min,
      () => (quantity.value = quantity.value > props.min ? quantity.value : props.min)
    )

    watch(
      () => props.max,
      () => (quantity.value = props.max && quantity.value > props.max ? props.max : quantity.value)
    )

    const options = {
      postProcess: (val: string | number) => {
        const parsedInt = Number(val) || 0

        if (props.max && parsedInt > props.max) {
          return props.max
        }

        return parsedInt <= props.min ? props.min : parsedInt
      }
    }

    return {
      quantity,
      canIncrement,
      canDecrement,
      options
    }
  }
})
</script>
