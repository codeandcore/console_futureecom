<template>
  <div>
    <span v-if="errors['items']" class="error--text text-caption">{{ $t(errors['items']) }}</span>

    <data-table-resource resource="products" :headers="productsHeaders" read-ability="read,catalog\product">
      <template #item.sku="{ item }">
        <v-btn depressed plain text small :to="{ name: 'product-update', params: { id: item.id } }">
          {{ item.sku }}
        </v-btn>
      </template>
      <template #item.real_price="{ item }">
        <span v-if="item.real_price">{{ $format.money.withStoreCurrency(item.real_price) }}</span>
      </template>
      <template #item.actions="{ item }">
        <orderable-add-product-dialog :id="item.id" v-model="cart">
          <template #default="{ attrs, on }">
            <v-btn v-if="canAdd(item)" depressed color="primary" icon v-bind="attrs" v-on="on">
              <v-icon>shopping_cart</v-icon>
            </v-btn>
          </template>
        </orderable-add-product-dialog>
      </template>
    </data-table-resource>
  </div>
</template>

<script lang="ts">
import { ApplicationType } from '@futureecom/futureecom-js/dist/futureecom'
import { canAddProductToCart } from '@futureecom/futureecom-js/dist/helpers/cart/cart-helpers'
import { computed, defineComponent } from '@vue/composition-api'
import DataTableResource from '@/components/common/selectables/DataTableResource.vue'
import OrderableAddProductDialog from '@/components/domains/carts/actions/OrderableAddProductDialog.vue'
import type { Orderable, OrderableCustomerDetails } from '@futureecom/futureecom-js/dist/services/cart-service'
import type { Product } from '@futureecom/futureecom-js/dist/services/catalog-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartItems',

  components: { OrderableAddProductDialog, DataTableResource },

  props: {
    value: {
      type: Object as PropType<Orderable>,
      required: true
    },
    errors: {
      type: Object as PropType<{ [key: string]: unknown; items: string }>,
      required: true
    }
  },

  setup(props, { root, emit }) {
    const customerGroups = (props.value.customer.groups || []).map((group) => group.code)
    const customerId = (props.value.customer as OrderableCustomerDetails).customer_id

    const canAdd = (product: Product): boolean => {
      const quantity = product.inventory.min_per_order || 1

      const apps = [
        ApplicationType.OVERVIEW,
        ApplicationType.CONSOLE,
        ApplicationType.POS,
        ApplicationType.STOREFRONT,
        ApplicationType.API
      ]

      return apps.some((val) => canAddProductToCart(product, quantity, val, customerId, customerGroups))
    }

    const cart = computed({
      get: () => props.value,
      set: (val: Orderable) => emit('input', val)
    })

    const productsHeaders = computed(() => {
      return [
        { text: root.$t('Name'), sortable: false, value: 'name' },
        { text: root.$t('SKU'), sortable: false, value: 'sku' },
        { text: root.$t('Price'), sortable: false, value: 'real_price' },
        { text: root.$t('Classification'), sortable: false, value: 'classification', width: '25%' },
        { text: '', value: 'actions', sortable: false, align: 'center' }
      ]
    })

    return {
      productsHeaders,
      canAdd,
      cart
    }
  }
})
</script>
