<template>
  <div>
    <v-text-field v-bind="$attrs" v-model="slug" :label="$t('Slug')" outlined hide-details="auto" />
    <generate-slug :disabled="!value.name" :value="value.name" @input="slug = $event" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import GenerateSlug from '@/components/common/actions/GenerateSlugButtonAction.vue'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductSlug',
  components: { GenerateSlug },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const slug = computed({
      get: () => props.value.slug,
      set: (slug) => emit('input', { ...props.value, slug })
    })

    return {
      slug
    }
  }
})
</script>
