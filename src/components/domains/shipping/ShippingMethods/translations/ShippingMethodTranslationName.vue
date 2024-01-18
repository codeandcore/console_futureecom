<template>
  <v-text-field v-bind="$attrs" v-model="name" :label="$t('Name')" outlined hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import dotProp from 'dot-prop'
import type { PropType } from '@vue/composition-api'
import type { Shipping } from '@futureecom/futureecom-js/dist/services/cart-service'

export default defineComponent({
  name: 'ShippingMethodTranslationName',
  props: {
    value: {
      type: Object as PropType<Shipping>,
      required: true
    },
    translationCode: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const name = computed({
      get: () => dotProp.get(props.value, `translations.${props.translationCode}.name`, ''),
      set: (value) => {
        const val = { ...dotProp.set(props.value, `translations.${props.translationCode}.name`, value || undefined) }
        emit('input', { ...props.value, translations: val.translations })
      }
    })

    return {
      name
    }
  }
})
</script>
