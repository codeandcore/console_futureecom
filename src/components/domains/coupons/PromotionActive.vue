<template>
  <switch-field v-bind="$attrs" v-model="active" :label="$t('Active')" hide-details="auto" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Promotion } from '@futureecom/futureecom-js/dist/services/promotion-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'PromotionActive',

  components: { SwitchField },

  props: {
    value: {
      type: Object as PropType<Promotion>,
      required: true
    }
  },

  setup(props, { emit }) {
    const active = computed({
      get: () => props.value.active,
      set: (active) => emit('input', { ...props.value, active })
    })

    return {
      active
    }
  }
})
</script>
