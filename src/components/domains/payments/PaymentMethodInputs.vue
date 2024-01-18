<template>
  <div>
    <payment-method-enabled v-model="paymentMethod" />
    <translation-tabs :translatable-values="['name', 'description']" :errors="errors">
      <template #default.name>
        <payment-method-name v-model="paymentMethod" class="required" :error-messages="errors['name']" />
      </template>
      <template #default.description>
        <payment-method-description v-model="paymentMethod" />
      </template>
      <template #name="{ code }">
        <payment-method-name v-model="paymentMethod" :translation-code="code" />
      </template>
      <template #description="{ code }">
        <payment-method-description v-model="paymentMethod" :translation-code="code" />
      </template>
    </translation-tabs>
    <payment-method-code
      v-model="paymentMethod"
      :disabled="!!paymentMethod.id"
      class="required"
      :error-messages="errors['code']"
    />

    <payment-method-application v-model="paymentMethod" />
    <payment-method-image v-model="paymentMethod" />
    <payment-method-order v-model="paymentMethod" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CodeInput from '@/components/foundation/CodeInput.vue'
import DescriptionInput from '@/components/foundation/DescriptionInput.vue'
import ImageUrlInput from '@/components/foundation/ImageUrlInput.vue'
import NameInput from '@/components/foundation/NameInput.vue'
import PaymentMethodApplication from '@/components/domains/payments/common/PaymentMethodApplication.vue'
import PaymentMethodEnabled from '@/components/domains/payments/common/PaymentMethodEnabled.vue'
import SortOrderInput from '@/components/foundation/SortOrderInput.vue'
import TranslationTabs from '@/components/common/TranslationTabs.vue'
import type { PaymentMethodProvider } from '@futureecom/futureecom-js/dist/services/payment-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'PaymentMethodInputs',

  components: {
    TranslationTabs,
    PaymentMethodDescription: DescriptionInput,
    PaymentMethodName: NameInput,
    PaymentMethodOrder: SortOrderInput,
    PaymentMethodImage: ImageUrlInput,
    PaymentMethodCode: CodeInput,
    PaymentMethodApplication,
    PaymentMethodEnabled
  },

  props: {
    value: {
      type: Object as PropType<PaymentMethodProvider>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const paymentMethod = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    return {
      paymentMethod
    }
  }
})
</script>
