<template>
  <div>
    <div v-if="!metadataOnly" class="d-flex flex-column flex-gap-4">
      <span>{{ $t('Name') }}: {{ value.name }}</span>
      <span v-if="value.tags">{{ $t('Tags') }}: {{ `${value.tags}`.replaceAll(',', ', ') }}</span>
      <span v-else>{{ $t('Tags') }}: {{ $t('N/A') }}</span>
      <template v-if="includeTimestamps">
        <span>{{ $t('Created At') }}: {{ getFormattedTime(value.created_at) }}</span>
        <span>{{ $t('Updated At') }}: {{ getFormattedTime(value.updated_at) }}</span>
      </template>
    </div>

    <div class="d-flex flex-column flex-gap-4">
      <span>{{ $t('Resolution') }}: {{ value.meta.width }}x{{ value.meta.height }}</span>
      <span>{{ $t('Version') }}: {{ value.meta.version }}</span>
      <span>{{ $t('Format') }}: {{ value.meta.format }}</span>
      <span>{{ $t('Resource type') }}: {{ value.meta.resource_type }}</span>
      <span v-if="value.folder">{{ $t('Folder') }}: {{ value.folder }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { useTimezone } from '@/composable/useTimezone'
import type { Media } from '@futureecom/futureecom-js/dist/services/cms-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'MediaData',

  props: {
    value: {
      type: Object as PropType<Partial<Media>>,
      required: true
    },
    metadataOnly: {
      type: Boolean,
      default: false
    },
    includeTimestamps: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const { getFormattedTime } = useTimezone()

    return {
      getFormattedTime
    }
  }
})
</script>
