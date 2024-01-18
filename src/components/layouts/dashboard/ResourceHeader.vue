<template>
  <v-card flat data-cy="resource-header">
    <v-card-text class="d-flex justify-space-between align-center">
      <slot name="header">
        <div class="d-flex align-center flex-gap-16">
          <v-btn v-if="backTo" icon small depressed :to="backTo" data-cy="resource-header-back-to">
            <rtl-chevron-icon reversed />
          </v-btn>
          <div class="d-flex flex-column">
            <slot name="header-text">
              <span v-if="header" data-cy="resource-header-title" class="text-body-1 font-weight-medium">
                {{ header }}
              </span>
            </slot>
            <slot name="subheader-text">
              <span v-if="subheader" data-cy="resource-header-subtitle" class="text-caption grey--text">
                {{ subheader }}
              </span>
            </slot>
          </div>
        </div>
      </slot>
      <slot name="actions" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, watch } from '@vue/composition-api'
import { useTitle } from '@vueuse/core'
import RtlChevronIcon from '@/components/common/RtlChevronIcon.vue'
import type { PropType } from '@vue/composition-api'
import type { RawLocation } from 'vue-router/types/router'
import type { TranslateResult } from 'vue-i18n'

export default defineComponent({
  name: 'ResourceHeader',
  components: { RtlChevronIcon },

  props: {
    backTo: {
      type: Object as PropType<RawLocation>,
      default: undefined
    },
    header: {
      type: [] as PropType<string | TranslateResult>,
      default: ''
    },
    subheader: {
      type: [] as PropType<string | TranslateResult>,
      default: ''
    }
  },

  setup(props) {
    const title = useTitle()

    watch(
      () => props.header,
      (val) => (title.value = `${val}`),
      { immediate: true }
    )
  }
})
</script>
