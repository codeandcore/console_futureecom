<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Organisations') }" :grid-props="{ perPage: -1 }">
    <template #actions>
      <v-btn
        v-if="canCreate"
        data-cy="add-new-organisation"
        depressed
        color="primary"
        :to="{ name: 'organisation-create' }"
      >
        {{ $t('Add new organisation') }}
      </v-btn>
    </template>
    <template #item.name="{ item }">
      <router-link :to="{ name: 'organisation-update', params: { id: item.id } }">
        {{ item.name }}
      </router-link>
    </template>
    <template #item.console.domains="{ item }">
      <div class="d-flex my-2">
        <organisation-domain-links class="d-flex" :value="item.domains" app="console" />
      </div>
    </template>
    <template #item.pos.domains="{ item }">
      <div class="d-flex my-2">
        <organisation-domain-links class="d-flex" :value="item.domains" app="pos" />
      </div>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'organisation-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <organisation-action-delete :value="item" icon @success="fetchOrganisations" @error="onRequestError" />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { HTTPResponseCode } from '@/libs/HTTPResponseCodes'
import { computed, defineComponent } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useOrganisations } from '@/composable/repositories/useOrganisations'
import { useQueryFromUrl } from '@/composable/useQueryFromUrl'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import OrganisationActionDelete from '@/components/domains/organisations/actions/OrganisationActionDelete.vue'
import OrganisationDomainLinks from '@/components/domains/organisations/OrganisationDomainLinks.vue'
import type { Grid } from '@/types/Grids'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'Organisations',

  components: {
    GridLayout,
    OrganisationActionDelete,
    ButtonAction,
    OrganisationDomainLinks
  },

  setup() {
    const { collection, loadingOrganisations, fetchOrganisations } = useOrganisations()

    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const { canCreate, canUpdate, canDelete } = useCrudChecker('settings\\organisation')

    const grid = computed((): Partial<Grid> => ({ data: collection.value, loading: loadingOrganisations.value }))

    const params = useQueryFromUrl<Record<string, never>>({})

    const onRequestError = (err: any) => {
      const { status, data } = err.response || {}
      if (status === HTTPResponseCode.NOT_FOUND) {
        addErrorToast('Resource not found')
        fetchOrganisations()
      } else {
        addErrorToast(data.message)
      }
    }

    fetchOrganisations()

    const options = computed((): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: t('ID'), value: 'id', sortable: false },
        { text: t('Name'), value: 'name', sortable: false },
        { text: t('Code'), value: 'code', sortable: false },
        { text: t('Console Domains'), value: 'console.domains', sortable: false },
        { text: t('POS Domains'), value: 'pos.domains', sortable: false }
      ]

      if (canUpdate.value || canDelete.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      return {
        headers
      }
    })

    return {
      grid,
      canCreate,
      params,
      options,
      fetchOrganisations,
      onRequestError
    }
  }
})
</script>
