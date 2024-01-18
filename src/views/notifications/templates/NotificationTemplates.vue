<template>
  <grid-layout
    v-bind="{ grid, params, options, title: $t('Notification Templates') }"
    @paramsChanged="reloadCollection"
  >
    <template #item.code="{ item }">
      <router-link
        :is="canAccessNotificationTemplate ? 'router-link' : 'span'"
        :to="{ name: 'notification-template-update', params: { id: item.id } }"
      >
        {{ item.code }}
      </router-link>
    </template>
    <template #item.channel="{ item }">
      <span class="text-capitalize">
        <span v-if="item.channel === 'vonage'">{{ $t('SMS') }}</span>
        <span v-else>{{ item.channel }}</span>
      </span>
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
        :to="{ name: 'notification-template-update', params: { id: item.id } }"
      />
    </template>
  </grid-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from '@vue/composition-api'
import { gridTemplate } from '@/libs/tables/grid'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import GridLayout from '@/components/layouts/GridLayout.vue'
import useApi from '@/composable/useApi'
import type { FilterSelectDefinition, FilterTextDefinition } from '@/types/FilterDefinitions'
import type { Grid } from '@/types/Grids'
import type { NotificationChannels } from '@futureecom/futureecom-js/dist/services/setting-service'
import type { NotificationTemplateGridRequest } from '@futureecom/futureecom-js/dist/services/notification-service'
import type { ResourceGridOptions } from '@/types/Grids'

export default defineComponent({
  name: 'NotificationTemplates',

  components: {
    GridLayout,
    ButtonAction
  },

  setup(props, { root }) {
    const params = computed<NotificationTemplateGridRequest>({
      get: () => (Object.keys(root.$route.query).length === 0 ? { sort: ['-created_at'] } : root.$route.query),
      set: (query: any) => root.$router.push({ query }).catch(Boolean)
    })

    const grid = reactive<Grid>(gridTemplate())

    const api = useApi()

    const reloadCollection = (gridParams?: NotificationTemplateGridRequest): void => {
      params.value = { ...params.value, ...gridParams }
      grid.loading = true

      api.notifications
        .templates(params.value)
        .then((value) => {
          grid.data = [...value.data]
          grid.meta = value.meta
        })
        .finally(() => (grid.loading = false))
    }

    const options = computed((ctx): ResourceGridOptions => {
      const headers: ResourceGridOptions['headers'] = [
        { text: ctx.$t('Code'), value: 'code' },
        { text: ctx.$t('Subject'), value: 'subject', sortable: false },
        { text: ctx.$t('Channel'), value: 'channel' },
        { text: ctx.$t('Created At'), value: 'created_at' },
        { text: ctx.$t('Updated At'), value: 'updated_at' }
      ]

      if (canAccessNotificationTemplate.value) {
        headers.push({ text: '', value: 'edit', sortable: false, align: 'center', width: '0px' })
      }

      const filters: (FilterTextDefinition | FilterSelectDefinition)[] = [
        { type: 'text', code: 'code', label: ctx.$t('Code') },
        {
          type: 'select-multiple',
          code: 'channel',
          label: ctx.$t('Channel'),
          options: [
            { text: ctx.$t('Mail'), value: 'mail' },
            { text: ctx.$t('SMS'), value: 'vonage' }
          ] as { text: string; value: NotificationChannels }[]
        },
        { type: 'date', code: 'created_at', label: ctx.$t('Created At') },
        { type: 'date', code: 'updated_at', label: ctx.$t('Updated At') }
      ]

      return {
        headers,
        filters
      }
    })

    const canAccessNotificationTemplate = computed((ctx) => {
      return ctx.$canAny('manage,notifications\\template', 'update,notifications\\template').value
    })

    return {
      params,
      reloadCollection,
      canAccessNotificationTemplate,
      options,
      grid
    }
  }
})
</script>
