<template>
  <telephone-field v-model="telephone" />
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import TelephoneField from '@/components/common/TelephoneField.vue'
import type { CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'AddressTelephone',
  components: { TelephoneField },
  props: {
    value: {
      type: Object as PropType<CustomerAddress>,
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
