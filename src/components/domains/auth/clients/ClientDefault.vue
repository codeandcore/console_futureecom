<template>
  <div>
    <switch-field v-bind="$attrs" v-model="isDefault" :label="$t('Default')" data-cy="client-input-default" />
    <div class="d-flex flex-column text-caption grey--text">
      <span>
        {{ $t('Determines if client will be used for domain log in, default client can be only one per application') }}
      </span>
      <span>
        {{ $t('If a default client is already set, then it must be unset before setting this client as default') }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import SwitchField from '@/components/common/SwitchField.vue'
import type { Client } from '@futureecom/futureecom-js/dist/services/auth-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ClientDefault',

  components: { SwitchField },

  inheritAttrs: false,
  props: {
    value: {
      type: Object as PropType<Pick<Client, 'default'>>,
      required: true
    }
  },

  setup(props, { emit }) {
    const isDefault = computed({
      get: () => props.value.default,
      set: (val) => emit('input', { ...props.value, default: val })
    })

    return {
      isDefault
    }
  }
})
</script>
