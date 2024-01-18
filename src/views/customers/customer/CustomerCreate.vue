<template>
  <form-validator-wrapper @submit="createHandler">
    <template #default="{ valid, loading }">
      <scrollable-resource :items="sections" class="d-flex flex-column" data-cy="customer-menu" eager>
        <template #header>
          <resource-header :back-to="{ name: 'customers' }" :header="$t('Add new customer')">
            <template #actions>
              <div v-if="item" class="d-flex justify-end flex-gap-16">
                <v-btn v-bind="$attrs" :disabled="!valid" depressed color="primary" :loading="loading" type="submit">
                  {{ $t('Create') }}
                </v-btn>
              </div>
            </template>
          </resource-header>
          <v-divider />
        </template>
        <template v-for="section in requiredCustomerSections" #[`tab-label-${section}`]="{ item }">
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
import { computed, defineComponent, ref } from '@vue/composition-api'
import { customerBuilder } from '@/views/customers/customer/builders/customer'
import { requiredCustomerSections } from '@/views/customers/customer/sections/helpers/sections'
import CustomerDetails from '@/views/customers/customer/sections/CustomerDetails.vue'
import CustomerProducts from '@/views/customers/customer/sections/CustomerProducts.vue'
import CustomerSecurity from '@/views/customers/customer/sections/CustomerSecurity.vue'
import CustomerSingleGroups from '@/views/customers/customer/sections/CustomerSingleGroups.vue'
import CustomerSubscriptions from '@/views/customers/customer/sections/CustomerSubscriptions.vue'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import ScrollableWrapper from '@/components/common/ScrollableWrapper.vue'
import TabNavigationRouteMenu from '@/components/layouts/dashboard/TabNavigationRouteMenu.vue'
import isCustomerB2B from '@/components/domains/customers/customer/helpers/isCustomerB2B'
import useApi from '@/composable/useApi'
import type { CreateCustomerRequest } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { CustomerSections } from '@/views/customers/customer/sections/helpers/sections'
import type { ScrollableResourceDefinitions } from '@/components/layouts/dashboard/ScrollableResource.vue'
import type { TabNavigationRoute } from '@/composable/useTabsRoute'

export default defineComponent({
  name: 'CustomerCreate',

  components: {
    ResourceHeader,
    ScrollableResource,
    FormValidatorWrapper,
    Scrollable,
    TabNavigationRouteMenu,
    ScrollableWrapper
  },

  setup(props, { root }) {
    const loading = ref(false)
    const item = ref<CreateCustomerRequest>(customerBuilder())

    const hasAccessToProducts = computed(() => root.$canAny('manage,catalog\\product', 'read,catalog\\product').value)

    const sections = computed((): ScrollableResourceDefinitions<CustomerSections>[] => {
      if (!item.value) {
        return []
      }

      const sections: TabNavigationRoute<CustomerSections>[] = [
        { code: 'details', name: 'Details', component: CustomerDetails },
        { code: 'security', name: 'Security', component: CustomerSecurity },
        { code: 'group', name: 'Group', component: CustomerSingleGroups },
        { code: 'subscription', name: 'Subscription', component: CustomerSubscriptions }
      ]

      if (isCustomerB2B(item.value.groups || []) && hasAccessToProducts.value) {
        sections.push({ code: 'products', name: 'Products', component: CustomerProducts })
      }

      return sections
    })

    const createHandler = () => {
      loading.value = true

      useApi()
        .customers.createCustomer(item.value)
        .then(({ id }) => {
          root.$toast.addSuccessToast('Created customer')
          root.$router.push({ name: 'customer-update', params: { id } }).catch()
        })
        .catch(() => root.$toast.addErrorToast('Unable to create customer'))
        .finally(() => (loading.value = false))
    }

    return {
      sections,
      item,
      requiredCustomerSections,
      createHandler
    }
  }
})
</script>
