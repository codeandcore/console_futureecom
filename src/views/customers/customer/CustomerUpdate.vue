<template>
  <form-validator-wrapper @submit="updateHandler">
    <template #default="{ valid }">
      <scrollable-resource :items="sections" class="d-flex flex-column" data-cy="customer-menu" eager>
        <template #header>
          <resource-header
            v-if="item"
            :back-to="{ name: 'customers' }"
            :header="`Customer: ${item.firstname} ${item.lastname}`"
            :subheader="item.id"
          >
            <template #actions>
              <div class="d-flex justify-end flex-gap-16">
                <customer-action-delete
                  v-if="$canAny('manage,customers\\customer', 'delete,customers\\customer')"
                  :value="item"
                  :loading.sync="loading.delete"
                  :disabled="loading.update"
                  @onSuccess="redirectToCustomersGrid"
                />
                <v-btn
                  v-if="$canAny('manage,customers\\customer', 'update,customers\\customer')"
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

        <template v-if="loading.get" #content>
          <div class="d-flex justify-center align-center mt-4">
            <v-progress-circular size="50" color="primary" indeterminate />
          </div>
        </template>

        <template v-for="section in requiredCustomerSections" v-else #[`tab-label-${section}`]="{ item }">
          <span :key="section" class="required">
            <label>{{ item.name }}</label>
          </span>
        </template>

        <template v-for="section in sections" #[`content-${section.code}`]="{ content }">
          <div v-if="item" :key="`content-${section.code}`" class="d-flex flex-column align-center">
            <component :is="content.component" v-model="item" class="my-6 col-10" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { Customer, CustomerResponse } from '@futureecom/futureecom-js/dist/services/customer-service'
import { CustomerSections, requiredCustomerSections } from '@/views/customers/customer/sections/helpers/sections'
import { ScrollableResourceDefinitions } from '@/components/layouts/dashboard/ScrollableResource.vue'
import { TabNavigationRoute } from '@/composable/useTabsRoute'
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import CustomerActionDelete from '@/components/domains/customers/customer/actions/CustomerActionDelete.vue'
import CustomerAddresses from '@/views/customers/customer/sections/CustomerAddresses.vue'
import CustomerDetails from '@/views/customers/customer/sections/CustomerDetails.vue'
import CustomerOrders from '@/views/customers/customer/sections/CustomerOrders.vue'
import CustomerProducts from '@/views/customers/customer/sections/CustomerProducts.vue'
import CustomerSingleGroups from '@/views/customers/customer/sections/CustomerSingleGroups.vue'
import CustomerSubscriptions from '@/views/customers/customer/sections/CustomerSubscriptions.vue'
import CustomerUserSecurity from '@/views/customers/customer/sections/CustomerUserSecurity.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import isCustomerB2B from '@/components/domains/customers/customer/helpers/isCustomerB2B'
import useApi from '@/composable/useApi'

export default defineComponent({
  name: 'CustomerUpdate',

  components: {
    ResourceHeader,
    CustomerActionDelete,
    FormValidatorWrapper,
    ScrollableResource
  },

  setup(props, { root }) {
    const api = useApi()
    const header = ref({ name: '', id: '' })

    const loading = reactive({
      get: false,
      update: false,
      delete: false
    })

    const item = ref<Customer>()

    const canEditSecurity = computed(() => {
      if (root.$can('manage,auth\\user').value) {
        return true
      }
      return root.$can('read,auth\\user').value && root.$can('update,auth\\user').value
    })

    const hasAccessToProducts = computed(() => root.$canAny('manage,catalog\\product', 'read,catalog\\product').value)
    const canCreate = computed(() => root.$canAny('manage,customers\\customer', 'create,customers\\customer').value)

    const sections = computed((): ScrollableResourceDefinitions<CustomerSections>[] => {
      const sections: TabNavigationRoute<CustomerSections>[] = [
        { code: 'details', name: 'Details', component: CustomerDetails }
      ]

      if (canEditSecurity.value) {
        sections.push({ code: 'security', name: 'Security', component: CustomerUserSecurity })
      }

      sections.push(
        { code: 'group', name: 'Group', component: CustomerSingleGroups },
        { code: 'subscription', name: 'Subscription', component: CustomerSubscriptions },
        { code: 'addresses', name: 'Addresses', component: CustomerAddresses },
        { code: 'orders', name: 'Orders', component: CustomerOrders }
      )

      //@ts-expect-error
      if (isCustomerB2B(item.value?.groups || []) && hasAccessToProducts.value) {
        sections.push({ code: 'products', name: 'Products', component: CustomerProducts })
      }

      return sections
    })

    const updateHandler = () => {
      if (!item.value) {
        return
      }

      loading.update = true

      api.customers
        .updateCustomer(item.value.id, item.value)
        .then((val) => {
          root.$toast.addSuccessToast('Updated customer')
          item.value = val
        })
        .catch(() => root.$toast.addErrorToast('Unable to update customer'))
        .finally(() => (loading.update = false))
    }

    const onSuccessFetch = (val: CustomerResponse) => {
      item.value = val
      header.value = { name: `${val.firstname} ${val.lastname}`, id: val.id }
    }

    const onErrorFetch = () => {
      root.$toast.addErrorToast('Customer not found')
      canCreate.value ? redirectToCustomerId('__') : redirectToCustomersGrid()
    }

    const redirectToCustomersGrid = () => root.$router.push({ name: 'customers' })
    const redirectToCustomerId = (id: string) => root.$router.push({ params: { id } }).catch(Boolean)

    api.customers
      .getCustomer(root.$route.params.id)
      .then((val) => onSuccessFetch(val))
      .catch(() => onErrorFetch())
      .finally(() => (loading.get = false))

    return {
      item,
      loading,
      updateHandler,
      sections,
      redirectToCustomersGrid,
      requiredCustomerSections
    }
  }
})
</script>
