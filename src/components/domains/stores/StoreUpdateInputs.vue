<template>
  <div>
    <store-name v-model="store" :error-messages="errors['name']" />
    <store-code v-model="store" disabled />
    <store-domain-custom-domain v-model="store" :error-messages="errors['domain.custom']" />
    <store-template v-model="store" />
    <store-color v-model="store" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import CodeInput from '@/components/foundation/CodeInput.vue'
import NameInput from '@/components/foundation/NameInput.vue'
import StoreColor from '@/components/domains/stores/StoreColor.vue'
import StoreDomainCustomDomain from '@/components/domains/stores/StoreDomainCustomDomain.vue'
import StoreTemplate from '@/components/domains/stores/StoreTemplate.vue'
import type { PropType } from '@vue/composition-api'
import type { Store } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'StoreUpdateInputs',

  components: { StoreCode: CodeInput, StoreTemplate, StoreDomainCustomDomain, StoreColor, StoreName: NameInput },

  props: {
    value: {
      type: Object as PropType<Store>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const store = computed({
      get: () => props.value,
      set: (value) => emit('input', value)
    })

    return {
      store
    }
  }
})
</script>
