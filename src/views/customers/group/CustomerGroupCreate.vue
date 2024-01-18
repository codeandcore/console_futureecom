<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid }">
      <scrollable-resource class="d-flex flex-column">
        <template #header>
          <resource-header :back-to="{ name: 'customer-groups' }" :header="$t('Add new customer group')">
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <v-btn :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
                  {{ $t('Create') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template #scrollable.content>
          <div class="d-flex flex-column align-center">
            <customer-group-inputs v-model="item" class="my-6 col-10 d-flex flex-column flex-gap-32" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import CustomerGroupInputs from '@/components/domains/customers/group/CustomerGroupInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { BaseCustomersGroup } from '@futureecom/futureecom-js/dist/services/customer-service'

export default defineComponent({
  name: 'CustomerGroupCreate',
  components: {
    ResourceHeader,
    FormValidatorWrapper,
    ScrollableResource,
    CustomerGroupInputs
  },

  setup(props, { root }) {
    const api = useApi()
    const loading = ref(false)

    const item = ref<BaseCustomersGroup>({
      name: '',
      code: '',
      customer_ids: []
    })

    const createHandler = () => {
      if (!item.value) {
        return
      }

      loading.value = true

      api.customers
        .createGroup(item.value)
        .then(({ id }) => {
          root.$toast.addSuccessToast('Created customer group')
          root.$router.push({ name: 'customer-group-update', params: { id } }).catch()
        })
        .catch(() => root.$toast.addErrorToast('Unable to create customer group'))
        .finally(() => (loading.value = false))
    }

    return {
      item,
      createHandler,
      loading
    }
  }
})
</script>
