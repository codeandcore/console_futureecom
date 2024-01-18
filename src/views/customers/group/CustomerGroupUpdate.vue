<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource class="d-flex flex-column">
        <template #header>
          <resource-header
            v-if="item"
            :back-to="{ name: 'customer-groups' }"
            :header="`Customer Group: ${item.name}`"
            :subheader="item.id"
          >
            <template #actions>
              <div v-if="item" class="d-flex justify-end flex-gap-16">
                <customer-group-action-delete
                  v-if="canDelete"
                  :value="item"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToGroupsGrid"
                />
                <v-btn
                  v-if="canUpdate"
                  depressed
                  color="primary"
                  :disabled="!valid"
                  :loading="loading.update"
                  type="submit"
                >
                  {{ $t('Update') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template #scrollable.content>
          <div v-if="item" class="d-flex flex-column align-center">
            <customer-group-inputs v-model="item" class="my-6 col-10 d-flex flex-column flex-gap-32" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import CustomerGroupActionDelete from '@/components/domains/customers/group/actions/CustomerGroupActionDelete.vue'
import CustomerGroupInputs from '@/components/domains/customers/group/CustomerGroupInputs.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import useApi from '@/composable/useApi'
import type { CustomersGroups } from '@futureecom/futureecom-js/dist/services/customer-service'

export default defineComponent({
  name: 'CustomerGroupUpdate',
  components: {
    CustomerGroupActionDelete,
    ResourceHeader,
    FormValidatorWrapper,
    ScrollableResource,
    CustomerGroupInputs
  },

  setup(props, { root }) {
    const api = useApi()
    const loading = reactive({
      get: true,
      update: false,
      delete: false
    })

    const item = ref<CustomersGroups>()

    const canCreate = computed(() => root.$canAny('manage,customers\\group', 'create,customers\\group').value)
    const canUpdate = computed(() => root.$canAny('manage,customers\\group', 'update,customers\\group').value)
    const canDelete = computed(() => root.$canAny('manage,customers\\group', 'delete,customers\\group').value)

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true

      api.customers
        .updateGroup(item.value.id, item.value)
        .then((val) => {
          root.$toast.addSuccessToast('Updated customer group')
          item.value = val
        })
        .catch(() => root.$toast.addErrorToast('Unable to update customer group'))
        .finally(() => (loading.update = false))
    }

    const onErrorFetch = () => {
      root.$toast.addErrorToast('Customer group not found')
      canCreate.value ? root.$router.push({ name: 'customer-group-create' }) : redirectToGroupsGrid()
    }

    const redirectToGroupsGrid = () => root.$router.push({ name: 'customer-groups' })

    api.customers
      .getGroup(root.$route.params.id)
      .then((val) => (item.value = val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      item,
      updateHandler,
      redirectToGroupsGrid,
      loading,
      canUpdate,
      canDelete
    }
  }
})
</script>
