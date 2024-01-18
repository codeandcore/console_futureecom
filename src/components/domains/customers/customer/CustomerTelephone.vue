<template>
  <telephone-field v-bind="$attrs" v-model="telephone" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import TelephoneField from '@/components/common/TelephoneField.vue'
import type { Customer } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CustomerTelephone',
  components: { TelephoneField },
  props: {
    value: {
      type: Object as PropType<Customer>,
      required: true
    }
  },

  setup(props, { emit }) {
    const telephone = computed({
      get: () => props.value.telephone,
      set: (telephone) => emit('input', { ...props.value, telephone })
    })

    return {
      telephone
    }
  }
})
</script>
