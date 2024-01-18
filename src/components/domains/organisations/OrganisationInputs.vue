<template>
  <div>
    <organisation-name
      v-model="organisation"
      :disabled="!!organisation.id"
      :error-messages="errors['name']"
      :label="$t('Code')"
    />
    <organisation-domain-custom v-model="organisation" app="console" :error-messages="errors['console_domain']" />
    <organisation-domain-custom v-model="organisation" app="pos" :error-messages="errors['pos_domain']" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import NameInput from '@/components/foundation/NameInput.vue'
import OrganisationDomainCustom from '@/components/domains/organisations/OrganisationDomainCustom.vue'
import type { Organisation } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { PropType } from '@vue/composition-api'
import type { ValidationErrors } from '@/types/validator'

export default defineComponent({
  name: 'OrganisationInputs',

  components: {
    OrganisationName: NameInput,
    OrganisationDomainCustom
  },

  props: {
    value: {
      type: Object as PropType<Organisation>,
      required: true
    },
    errors: {
      type: Object as PropType<ValidationErrors>,
      required: true
    }
  },

  setup(props, { emit }) {
    const organisation = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })

    return {
      organisation
    }
  }
})
</script>
