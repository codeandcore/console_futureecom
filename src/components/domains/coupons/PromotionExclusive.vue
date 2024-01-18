<template>
  <switch-field v-bind="$attrs" v-model="exclusive" :label="$t('Exclusive')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionExclusive',
  components: { SwitchField },
  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const exclusive = computed({
      get: () => props.value.exclusive,
      set: (exclusive) => emit('input', { ...props.value, exclusive })
    })

    return {
      exclusive
    }
  }
})
</script>
