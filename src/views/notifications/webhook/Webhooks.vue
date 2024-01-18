<template>
  <grid-layout v-bind="{ grid, params, options, title: $t('Webhooks') }" @paramsChanged="reloadCollection">
    <template #actions>
      <v-btn
        v-if="$canAny('manage,notifications\\webhook', 'create,notifications\\webhook')"
        data-cy="add-new-webhook"
        depressed
        color="primary"
        :to="{ name: 'webhook-create' }"
      >
        {{ $t('Create Webhook') }}
      </v-btn>
    </template>
    <template #item.id="{ item }">
      <router-link
        :is="canAccessWebhook ? 'router-link' : 'span'"
        :to="{ name: 'webhook-update', params: { id: item.id } }"
      >
        {{ getShortId(item.id) }}
      </router-link>
    </template>
    <template #item.events="{ item }">
      <div v-if="item.events" class="d-flex flex-wrap flex-gap-8 my-2">
        <v-chip v-for="(event, index) in item.events" :key="`event-${index}`" small>
          {{ event }}
        </v-chip>
      </div>
    </template>
    <template #item.url="{ item }">
      <external-link :label="item.url" :value="item.url" />
    </template>
    <template #item.created_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.updated_at="{ item }">
      <span>{{ $format.timezone.getFormattedTime(item.created_at) }}</span>
    </template>
    <template #item.edit="{ item }">
      <button-action
        icon-name="edit"
        icon
        :label="$t('Edit')"
        :disabled="grid.loading"
        :to="{ name: 'webhook-update', params: { id: item.id } }"
      />
    </template>
    <template #item.delete="{ item }">
      <webhook-action-delete icon :value="item" @onSuccess="onDeleteSuccess" />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate, paginateCollection } from '@/libs/tables/grid'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import ExternalLink from '@/components/common/ExternalLink.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import WebhookActionDelete from '@/components/domains/webhooks/actions/WebhookActionDelete.vue'
import getShortId from '@/libs/getShortId'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid, ResourceGridOptions } from '@/types/Grids'
import type { WebhookGridRequest } from '@futureecom/futureecom-js/dist/services/notification-service'

export default defineComponent({
  name: 'Orders',

  components: {
    ExternalLink,
    WebhookActionDelete,
    GridLayout,
    ButtonAction
  },

  setup(props, { root }) {
    const params = computed<WebhookGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const grid = reactive<Grid>(gridTemplate())

    const api = useApi()

    const onDeleteSuccess = (deletedCount: number = 1) => {
      const { per_page: perPage, total, current_page: currentPage } = grid.meta
      reloadCollection({ page: paginateCollection(total - deletedCount, currentPage, perPage).current_page })
    }

    const reloadCollection = (gridParams?: WebhookGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.notifications
        .webhooks(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Id'), value: 'id', sortable: false },
        { text: ctx.$t('Events'), value: 'events' },
        { text: ctx.$t('URL'), value: 'url', sortable: false },
        { text: ctx.$t('Client ID'), value: 'client_id' },
        { text: ctx.$t('Client Organisation'), value: 'client_organisation', sortable: false },
        { text: ctx.$t('Created At'), value: 'created_at' },
        { text: ctx.$t('Updated At'), value: 'updated_at' }
      ]

      if (canAccessWebhook.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      if (canDelete.value) {
        headers.push({ text: '', value: 'delete', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'id', label: ctx.$t('ID') },
        { type: 'array', code: 'events', label: ctx.$t('Events') },
        { type: 'text', code: 'client_id', label: ctx.$t('Client ID') }
      ]

      return {
        headers,
        filters
      }
    })

    const canAccessWebhook = computed((ctx) => {
      return ctx.$canAny(
        'manage,notifications\\webhook',
        'delete,notifications\\webhook',
        'update,notifications\\webhook'
      ).value
    })

    const canDelete = computed((ctx) => {
      return ctx.$canAny('manage,notifications\\webhook', 'delete,notifications\\webhook').value
    })

    return {
      params,
      reloadCollection,
      canAccessWebhook,
      options,
      grid,
      getShortId,
      onDeleteSuccess
    }
  }
})
</script>
