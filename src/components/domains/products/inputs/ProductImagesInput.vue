<template>
  <div>
    <div class="d-flex justify-space-between">
      <span class="grey--text text--darken-2">{{ $t('Images') }}</span>
      <product-image-create :value="value" @created="onImageCreated">
        <template #activator="{ attrs, on }">
          <v-btn
            v-if="canCreate && (canReadMedia || canCreateMedia)"
            v-bind="attrs"
            depressed
            small
            color="primary"
            v-on="on"
          >
            {{ $t('Add image') }}
          </v-btn>
        </template>
      </product-image-create>
    </div>

    <v-data-table :headers="headers" :items="images" hide-default-footer item-key="key" :items-per-page="-1">
      <template #item.url="{ item }">
        <image-zoom>
          <template #thumbnail>
            <product-image-preview :value="item.url" height="40" width="40" class="my-3 rounded-lg" />
          </template>
          <template #zoom>
            <product-image-preview :value="item.url" max-width="300" />
          </template>
        </image-zoom>
      </template>
      <template #item.edit="{ item }">
        <product-image-update :value="item" :product="value" @updated="onImageUpdate">
          <template #activator="{ attrs, on }">
            <button-action icon-name="edit" icon :label="$t('Edit')" v-bind="attrs" v-on="on" />
          </template>
        </product-image-update>
      </template>
      <template #item.delete="{ item }">
        <product-action-delete-image
          v-if="value.id"
          icon
          :product-id="value.id"
          :value="item"
          @success="onImageDelete(item)"
          @error="onDeleteError"
        />
        <delete-button v-else suppress-confirmation :icon="true" @click="onImageDelete(item)" />
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api'
import { useCrudChecker } from '@/composable/useCrudChecker'
import { useI18n } from 'vue-i18n-bridge'
import { useToasts } from '@/composable/useToasts'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import DeleteButton from '@/components/common/actions/DeleteButton.vue'
import ImageZoom from '@/components/common/ImageZoom.vue'
import ProductActionDeleteImage from '@/components/domains/products/actions/ProductActionDeleteImage.vue'
import ProductImageCreate from '@/views/catalog/product/ProductImageCreate.vue'
import ProductImagePreview from '@/components/common/ProductImagePreview.vue'
import ProductImageUpdate from '@/views/catalog/product/ProductImageUpdate.vue'
import type { Product, ProductImage } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'ProductImagesInput',

  components: {
    ProductActionDeleteImage,
    DeleteButton,
    ProductImageUpdate,
    ButtonAction,
    ProductImageCreate,
    ProductImagePreview,
    ImageZoom
  },

  props: {
    value: {
      type: Object as PropType<Product>,
      required: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n()
    const { addErrorToast } = useToasts()

    const { canCreate, canUpdate, canDelete } = useCrudChecker('catalog\\image')
    const { canRead: canReadMedia, canCreate: canCreateMedia } = useCrudChecker('cms\\media')

    const images = computed({
      get: () => (props.value.images || []).map((item, index) => ({ ...item, key: `${index}-${item.url}` })),
      set: (images) => emit('input', { ...props.value, images: images.map(({ key, ...rest }) => rest) })
    })

    const onImageCreated = (val: ProductImage) => {
      images.value = [...images.value, { ...val, key: `${val.id}-${val.url}` }]
    }

    const onImageUpdate = async (image: ProductImage): Promise<void> => {
      images.value = images.value
        .map((item) => (item.id === image.id ? { ...image } : item))
        .map((item, index) => ({ ...item, key: `${index}-${item.url}` }))
    }

    const onImageDelete = async (image: ProductImage): Promise<void> => {
      images.value = images.value.filter((item) => item.id !== image.id)
    }

    const headers = computed(() => {
      const headers = [
        { text: t('Image'), value: 'url' },
        { text: t('Sort order'), value: 'sort_order' },
        { text: t('Alt'), value: 'alt' }
      ]

      if ((canUpdate.value && props.value.id) || canReadMedia.value || canCreateMedia.value) {
        headers.push({ text: '', value: 'edit' })
      }

      if (canDelete.value && props.value.id) {
        headers.push({ text: '', value: 'delete' })
      }

      return headers
    })

    const onDeleteError = (err: any) => {
      addErrorToast(err.response?.data.message)
    }

    return {
      images,
      headers,
      canCreate,
      canReadMedia,
      canCreateMedia,
      onImageCreated,
      onImageUpdate,
      onImageDelete,
      onDeleteError
    }
  }
})
</script>
