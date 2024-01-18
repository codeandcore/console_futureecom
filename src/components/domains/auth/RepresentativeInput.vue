<template>
  <div>
    <v-alert dense outlined type="warning">
      {{
        $t(
          'The Sales Representative user may need special permissions to create orders on behalf of customers. Make sure he has such'
        )
      }}
    </v-alert>
    <representative-commission-on-shipping v-model="representative" />
    <representative-commission-on-tax v-model="representative" />
    <representative-commission-percentage v-model="representative" :error-messages="errors['commission_percentage']" />

    <representative-commission-customer-id
      v-model="representative"
      :readonly="disableCustomer"
      :error-message="errors['customer_id']"
    />
  </div>
</template>

<script lang="ts">
import { ValidationErrors } from '@/types/validator'
import { computed, defineComponent } from '@vue/composition-api'
import RepresentativeCommissionCustomerId from '@/components/domains/auth/representative/RepresentativeCommissionCustomerId.vue'
import RepresentativeCommissionOnShipping from '@/components/domains/auth/representative/RepresentativeCommisionOnShipping.vue'
import RepresentativeCommissionOnTax from '@/components/domains/auth/representative/RepresentativeCommisionOnTax.vue'
import RepresentativeCommissionPercentage from '@/components/domains/auth/representative/RepresentativeCommissionPercentage.vue'
import type {
  NewRepresentative,
  UpdateRepresentative
} from '@futureecom/futureecom-js/dist/services/commission-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'RepresentativeInput',

  components: {
    RepresentativeCommissionCustomerId,
    RepresentativeCommissionPercentage,
    RepresentativeCommissionOnTax,
    RepresentativeCommissionOnShipping
  },

  props: {
    value: {
      type: Object as PropType<NewRepresentative | UpdateRepresentative>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    },
    disableCustomer: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const representative = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    return {
      representative
    }
  }
})
</script>
