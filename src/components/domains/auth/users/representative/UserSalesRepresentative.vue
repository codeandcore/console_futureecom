<template>
  <resource-grid
    :options="representativeOptions"
    :items="representatives"
    class="ma-4 justify-center"
    @onParamsChange="reloadCollection"
  >
    <template #item.commission_percentage="{ item }">
      <span class="d-flex justify-center">{{ item.commission_percentage }}%</span>
    </template>
    <template #item.customer_id="{ item }">
      <router-link :to="{ name: 'customer-update', params: { id: item.customer_id } }">
        {{ item.customer_id }}
      </router-link>
    </template>
    <template #item.commission_on_shipping="{ item }">
      <div class="d-flex justify-center">
        <v-icon>{{ item.commission_on_shipping ? 'check' : 'close' }}</v-icon>
      </div>
    </template>
    <template #item.commission_on_tax="{ item }">
      <div class="d-flex justify-center">
        <v-icon>{{ item.commission_on_tax ? 'check' : 'close' }}</v-icon>
      </div>
    </template>
    <template #item.actions="{ item }">
      <v-btn
        v-if="canUpdate"
        depressed
        fab
        class="mx-5 my-3"
        small
        :to="{ name: 'representative-update', params: { id: item.id, admin: $route.params.id } }"
      >
        <v-icon small>edit</v-icon>
      </v-btn>
    </template>
  </resource-grid>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import useApi from '@/composable/useApi'
import type {
  Representative,
  RepresentativeGridRequest
} from '@futureecom/futureecom-js/dist/services/commission-service'
import type { ResourceGridOptions } from '@/types/Grids'
import type { ResponseCollection } from '@futureecom/futureecom-js'

export default defineComponent({
  name: 'UserSalesRepresentative',
  components: { ResourceGrid },

  props: {
    id: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const { addErrorToast } = useToasts()
    const { t } = useI18n()

    const api = useApi()
    const loading = ref(false)
    const representativeGrid = ref<ResponseCollection<Representative>>()
    const representatives = computed(() => (representativeGrid.value ? representativeGrid.value.data : []))

    const { canUpdate } = useCrudChecker('commission\\representative')

    const reloadCollection = (params: RepresentativeGridRequest): void => {
      loading.value = true

      api.commissions
        .representatives({
          ...params,
          filter: { user_id: props.id }
        })
        .then((response) => (representativeGrid.value = response))
        .catch(() => addErrorToast(t('Unable to load representatives')))
        .finally(() => (loading.value = false))
    }

    const representativeOptions = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('Customer'), value: 'customer_id', sortable: false },
        { text: t('Commission percentage'), value: 'commission_percentage', sortable: false },
        { text: t('Commission on shipping'), value: 'commission_on_shipping', sortable: true },
        { text: t('Commission on tax'), value: 'commission_on_tax', sortable: true },
        { text: '', value: 'actions', sortable: false, align: 'center' }
      ]

      return {
        headers,
        meta: representativeGrid.value?.meta,
        loading: loading.value
      }
    })

    return {
      canUpdate,
      representativeOptions,
      representatives,
      reloadCollection
    }
  }
})
</script>
