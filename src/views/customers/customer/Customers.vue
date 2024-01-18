<template>
  <scrollable>
    <template #sticky>
      <v-card flat>
        <v-card-title class="d-flex justify-space-between">
          <span>{{ $t('Customers') }}</span>
          <v-btn
            v-if="$can('create,customers\\customer')"
            data-cy="add-new-customer"
            depressed
            color="primary"
            :to="{ name: 'customer-create' }"
          >
            {{ $t('Add new customer') }}
          </v-btn>
        </v-card-title>
        <v-divider />
      </v-card>
    </template>

    <template #scrollable-content="{ heightExceeded }">
      <div class="px-4">
        <customer-action-force-mass-delete-dialog
          v-if="errors"
          v-model="errors"
          :items="selected"
          @onSuccess="onMassDeleteSuccess"
        />
        <resource-grid
          v-model="params"
          selectable-key="id"
          :options="options"
          :items="grid.data"
          hide-default-footer
          :selected-items.sync="selected"
          :show-select="canDelete"
          @onParamsChange="reloadCollection"
        >
          <template #item.firstname="{ item }">
            <router-link
              :is="canAccessCustomer ? 'router-link' : 'span'"
              :to="{ name: 'customer-update', params: { id: item.id } }"
            >
              {{ item.firstname }}
            </router-link>
          </template>
          <template #item.lastname="{ item }">
            <router-link
              :is="canAccessCustomer ? 'router-link' : 'span'"
              :to="{ name: 'customer-update', params: { id: item.id } }"
            >
              {{ item.lastname }}
            </router-link>
          </template>
          <template #item.telephone="{ value }">
            <div v-if="value">+{{ value.prefix }} {{ value.number }}</div>
          </template>
          <template #item.created_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
          </template>
          <template #item.updated_at="{ item }">
            <span>{{ $format.timezone.getFormattedTime(item.updated_at) }}</span>
          </template>
          <template #item.groups.code="{ item }">
            <div v-for="(group, index) in item.groups" :key="`${item.id}-group-${index}`" class="d-flex flex-gap-32">
              <router-link
                :is="canAccessCustomer ? 'router-link' : 'span'"
                :to="{ name: 'customer-group-update', params: { id: group.id } }"
              >
                {{ group.name }}
              </router-link>
            </div>
          </template>
          <template #item.edit="{ item }">
            <button-action
              icon-name="edit"
              icon
              :label="$t('Edit')"
              :disabled="grid.loading"
              :to="{ name: 'customer-update', params: { id: item.id } }"
            />
          </template>
          <template #item.delete="{ item }">
            <customer-action-delete v-if="canDelete" :value="item" icon @onSuccess="onDeleteSuccess" />
          </template>
        </resource-grid>
        <v-divider />
        <div v-if="!heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-space-between">
          <div class="d-flex flex-gap-8">
            <customer-action-mass-delete
              v-if="canDelete"
              :items="selected"
              :disabled="grid.loading || !selected.length"
              @onSuccess="onMassDeleteSuccess"
              @onError="errors = $event"
            />
            <button-action
              :label="$t('Force delete')"
              :items="selected"
              text
              :disabled="grid.loading || !selected.length"
              @click="errors = { message: $t('Confirm force delete') }"
            />
          </div>
          <table-pagination v-model="params" :meta="grid.meta" />
        </div>
      </div>
    </template>
    <template #sticky-bottom="{ heightExceeded }">
      <v-divider />
      <v-footer v-if="heightExceeded" class="d-flex align-center pa-4 flex-gap-16 justify-space-between">
        <div class="d-flex flex-gap-8">
          <customer-action-mass-delete
            v-if="canDelete"
            :items="selected"
            :disabled="grid.loading || !selected.length"
            @onSuccess="onMassDeleteSuccess"
            @onError="errors = $event"
          />
          <button-action
            :label="$t('Force delete')"
            :items="selected"
            text
            :disabled="grid.loading || !selected.length"
            @click="errors = { message: $t('Confirm force delete') }"
          />
        </div>
        <table-pagination v-model="params" :meta="grid.meta" />
      </v-footer>
    </template>
  </scrollable>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CustomerActionDelete from '@/components/domains/customers/customer/actions/CustomerActionDelete.vue'
import CustomerActionForceMassDeleteDialog from '@/components/domains/customers/customer/actions/CustomerActionForceMassDeleteDialog.vue'
import CustomerActionMassDelete from '@/components/domains/customers/customer/actions/CustomerActionMassDelete.vue'
import ResourceGrid from '@/components/tables/ResourceGrid.vue'
import Scrollable from '@/components/layouts/Scrollable.vue'
import TablePagination from '@/components/tables/pagination/TablePagination.vue'
import useApi from '@/composable/useApi'
import type { Customer, CustomerGridRequest } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { MassDeleteError } from '@/types/MassDeleteError'

export default defineComponent({
  name: 'Customers',
  components: {
    CustomerActionForceMassDeleteDialog,
    ButtonAction,
    TablePagination,
    Scrollable,
    CustomerActionMassDelete,
    CustomerActionDelete,
    ResourceGrid
  },

  setup(props, { root }) {
    const errors = ref<MassDeleteError>()
    const grid = reactive<Grid>(gridTemplate())
    const selected = ref<Customer[]>([])

    const api = useApi()

    const params = computed<CustomerGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const onMassDeleteSuccess = () => onDeleteSuccess(selected.value.length)

    const reloadCollection = (gridParams?: CustomerGridRequest, deletedCount = 0): void => {
      params.value = { ...params.value, ...gridParams, include: ['groups'] }
      grid.loading = true

      setTimeout(() => {
        api.customers
          .customers(params.value)
          .then((value) => {
            grid.data = [...value.data]
            grid.meta = value.meta
            selected.value = []
          })
          .finally(() => (grid.loading = false))
      }, 1500 * deletedCount)
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('First name'), value: 'firstname' },
        { text: ctx.$t('Last name'), value: 'lastname' },
        { text: ctx.$t('Email'), value: 'email' },
        { text: ctx.$t('DOB'), value: 'dob' },
        { text: ctx.$t('Phone'), value: 'telephone', sortable: false },
        { text: ctx.$t('Groups'), value: 'groups.code', sortable: false },
        { text: ctx.$t('Created At'), value: 'created_at' },
        { text: ctx.$t('Updated At'), value: 'updated_at' }
      ]

      if (canAccessCustomer.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'firstname', label: ctx.$t('First name') },
        { type: 'text', code: 'lastname', label: ctx.$t('Last name') },
        { type: 'text', code: 'email', label: ctx.$t('Email') },
        { type: 'text', code: 'groups.code', label: ctx.$t('Group Code') },
        { type: 'date', code: 'dob', label: ctx.$t('DOB') },
        { type: 'date', code: 'created_at', label: ctx.$t('Created At') },
        { type: 'date', code: 'updated_at', label: ctx.$t('Updated At') }
      ]

      return {
        headers,
        filters,
        meta: grid.meta,
        loading: grid.loading
      }
    })

    const canAccessCustomer = computed((ctx) => {
      return ctx.$canAny('manage,customers\\customer', 'delete,customers\\customer', 'update,customers\\customer').value
    })
    const canDelete = computed((ctx) => {
      return ctx.$canAny('manage,customers\\customer', 'delete,customers\\customer').value
    })

    return {
      params,
      errors,
      reloadCollection,
      options,
      grid,
      onDeleteSuccess,
      onMassDeleteSuccess,
      selected,
      canAccessCustomer,
      canDelete
    }
  }
})
</script>
