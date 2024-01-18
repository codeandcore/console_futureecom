<template>
  <v-alert type="info" dismissible>
    <template #close>
      <v-btn depressed icon small class="align-self-start" @click="visible = !visible">
        <v-icon>{{ visible ? 'expand_less' : 'expand_more' }}</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('This product is used with bundle(s)') }}</span>
    <v-slide-y-transition>
      <v-progress-circular v-if="bundlesLoading" class="mx-4" size="24" color="white" indeterminate />
    </v-slide-y-transition>
    <div v-if="visible">
      <v-slide-y-reverse-transition group>
        <div v-for="(product, index) in bundles" :key="product.id" class="mt-2">
          <v-divider v-if="index > 0" class="my-2" />
          <div class="d-flex justify-space-between align-center">
            <span class="font-weight-bold">{{ product.name }} ({{ product.sku }})</span>
            <v-btn depressed icon small fab :to="{ name: 'product-update', params: { id: product.id } }">
              <v-icon>chevron_right</v-icon>
            </v-btn>
          </div>
        </div>
      </v-slide-y-reverse-transition>
      <v-divider class="my-2" />
      <span>
        {{ $t('To delete this product, remove or replace the component from bundle or delete bundle first') }}
      </span>
    </div>
  </v-alert>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import collectionLoader from '@/composable/loaders/collectionLoader'
import useApi from '@/composable/useApi'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductBundleWarning',

  props: {
    items: {
      type: Array as PropType<string[]>,
      default: () => []
    }
  },

  setup(props) {
    const api = useApi()
    const associatedLoader = collectionLoader()

    const visible = ref(true)

    associatedLoader.loadCollection(() => api.catalog.products({ filter: { id: props.items }, perPage: -1 }))

    return {
      visible,
      bundles: associatedLoader.data,
      bundlesLoading: associatedLoader.loading
    }
  }
})
</script>
