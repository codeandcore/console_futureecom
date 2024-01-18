<template>
  <v-icon data-cy="rtl-chevron-icon" v-bind="$attrs" v-on="$listeners">
    {{ icon }}
  </v-icon>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useVuetify } from '@/composable/useVuetify'

export default defineComponent({
  name: 'RtlChevronIcon',

  props: {
    reversed: {
      type: Boolean,
      default: false
    },
    doubled: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const vuetify = useVuetify()

    const direction = computed((): 'left' | 'right' => {
      return (!vuetify?.rtl && !props.reversed) || (vuetify?.rtl && props.reversed) ? 'right' : 'left'
    })

    const icon = computed(() => {
      if (props.doubled) {
        return direction.value === 'right' ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'
      }
      return direction.value === 'right' ? 'chevron_right' : 'chevron_left'
    })

    return {
      icon
    }
  }
})
</script>
