<template>
  <v-sheet ref="total" color="background" flat :style="{ height: height || appContentHeight }" class="scrollable-height">
    <slot v-if="!hideTop" name="sticky-wrapper">
      <div ref="top" class="position-sticky">
        <slot name="sticky" :height-exceeded="heightExceeded" :available-height="availableHeight"
          :internal-height="internalSize.height.value" />
      </div>
    </slot>
    <slot name="scrollable" :available-height="availableHeight">
      <div :style="{ height: `${availableHeight}px` }" class="scrollable-height">
        <div ref="internal">
          <slot name="scrollable-content" :height-exceeded="heightExceeded" />
        </div>
      </div>
    </slot>
    <slot v-if="!hideBottom" name="sticky-bottom-wrapper">
      <div ref="bottom" class="position-sticky-bottom align-end">
        <slot name="sticky-bottom" :height-exceeded="heightExceeded" />
      </div>
    </slot>
  </v-sheet>
</template>

<script lang="ts">
import { calculateAvailableHeight, hasExceededHeight } from '@/libs/layout'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useElementSize } from '@vueuse/core'
import { useVuetify } from '@/composable/useVuetify'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'Scrollable',

  props: {
    height: {
      type: [] as PropType<string | number>,
      default: ''
    },
    hideTop: {
      type: Boolean,
      default: false
    },
    hideBottom: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const vuetify = useVuetify()
    const appContentHeight = computed(() => `calc(100vh - ${vuetify?.application.top || 0}px)`)

    const top = ref(null)
    const bottom = ref(null)
    const total = ref(null)
    const internal = ref(null)

    const totalSize = useElementSize(total)
    const internalSize = useElementSize(internal)

    const topSize = useElementSize(top)
    const bottomSize = useElementSize(bottom)

    const availableHeight = computed(() => {
      return calculateAvailableHeight(
        totalSize.height.value,
        props.hideTop ? 0 : topSize.height.value,
        props.hideBottom ? 0 : bottomSize.height.value
      )
    })

    const heightExceeded = computed(() => {
      return hasExceededHeight(availableHeight.value, internalSize.height.value)
    })

    return {
      top,
      bottom,
      total,
      internalSize,
      appContentHeight,
      availableHeight,
      internal,
      heightExceeded
    }
  }
})
</script>
