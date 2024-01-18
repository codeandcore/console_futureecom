<template>
  <div>
    <div class="d-flex justify-end">
      <v-dialog
        v-if="$canAny('create,customers\\address', 'manage,customers\\address')"
        v-model="showDialog.create"
        max-width="600"
        scrollable
      >
        <template #activator="{ attrs, on }">
          <v-btn color="primary" depressed small v-bind="attrs" v-on="on">
            {{ $t('Add new address') }}
          </v-btn>
        </template>
        <customer-address-create :customer="value" @onCreated="onSubmit">
          <template #header>
            <v-card-title class="d-flex justify-space-between">
              <span>{{ $t('Create address for') }} {{ value.firstname }} {{ value.lastname }}</span>
              <v-icon size="32" @click="showDialog.create = false">close</v-icon>
            </v-card-title>
          </template>
        </customer-address-create>
      </v-dialog>
    </div>
    <v-dialog v-model="showDialog.update" max-width="600" scrollable>
      <customer-address-update
        v-if="updateAddress"
        :key="updateAddress.id"
        :value="updateAddress"
        :customer="value"
        @onUpdated="onSubmit"
        @onDeleted="onDeleted(updateAddress.id)"
      >
        <template #header>
          <v-card-title class="d-flex justify-space-between">
            <span>{{ $t('Update address') }}</span>
            <v-icon size="32" @click="showDialog.update = false">close</v-icon>
          </v-card-title>
        </template>
      </customer-address-update>
    </v-dialog>

    <selectable-card
      v-for="address in visibleAddresses"
      :key="address.id"
      :loading="loading && selectedId === address.id"
      :class="{ 'v-card__active': selectedAddressId === address.id }"
      @onSelect="onSelect(address.id)"
    >
      <div class="d-flex justify-space-between align-start flex-gap-32">
        <full-address-preview :value="address" />
        <div class="d-flex align-center flex-gap-16">
          <button-action
            v-if="$canAny('update,customers\\address', 'manage,customers\\address')"
            icon-name="edit"
            icon
            :label="$t('Edit')"
            depressed
            small
            @click.stop="onSelectToUpdate(address)"
          />
          <address-action-delete
            v-if="!address.is_default"
            :id="address.id"
            :customer="value"
            icon
            @onSuccess="onDeleted(address.id)"
          />
        </div>
      </div>
    </selectable-card>
    <v-pagination
      v-if="addressesPageCount > 1"
      v-model="currentAddressPage"
      :length="addressesPageCount"
      :total-visible="5"
      class="elevation-0"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import AddressActionDelete from '@/components/domains/customers/customer/actions/AddressActionDelete.vue'
import ButtonAction from '@/components/common/actions/ButtonAction.vue'
import CustomerAddressCreate from '@/views/customers/customer/CustomerAddressCreate.vue'
import CustomerAddressUpdate from '@/views/customers/customer/CustomerAddressUpdate.vue'
import FullAddressPreview from '@/components/common/AddressPreview.vue'
import SelectableCard from '@/components/common/selectables/SelectableCard.vue'
import remapDefaultAddresses from '@/components/domains/customers/customer/helpers/remapDefaultAddresses'
import useApi from '@/composable/useApi'
import type { Customer, CustomerAddress } from '@futureecom/futureecom-js/dist/services/customer-service'
import type { PropType } from '@vue/composition-api'

export default defineComponent({
  name: 'CartCustomerAddressesManager',

  components: {
    ButtonAction,
    CustomerAddressUpdate,
    CustomerAddressCreate,
    AddressActionDelete,
    SelectableCard,
    FullAddressPreview
  },
  props: {
    value: {
      type: Object as PropType<Customer>,
      required: true
    },
    selectedAddressId: {
      type: [] as PropType<string | undefined | null>,
      default: undefined
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { root, emit }) {
    const api = useApi()
    const selectedId = ref('')
    const updateAddress = ref<CustomerAddress>()
    const allowedCountries = useSettings().getStoreSetting('localisation.countries.allowed_list') || []

    const loading = ref(true)

    const showDialog = reactive({
      create: false,
      update: false
    })

    const addresses = computed({
      get: () => {
        const addresses = props.value.addresses || []
        if (allowedCountries.length > 0) {
          return addresses.filter((address) => allowedCountries.includes(address.country_code))
        }
        return addresses
      },
      set: (addresses) => emit('input', { ...props.value, addresses })
    })

    const cardsCount = 5

    const currentAddressPage = ref(1)
    const addressesPageCount = computed(() => Math.ceil(addresses.value.length / cardsCount))

    const visibleAddresses = computed(() => {
      const startAt = (currentAddressPage.value - 1) * cardsCount
      return [...addresses.value].slice(startAt, startAt + cardsCount)
    })

    const onSelectToUpdate = (address: CustomerAddress) => {
      updateAddress.value = address
      showDialog.update = true
    }

    const onSelect = (addressId: string) => {
      selectedId.value = addressId
      emit('onSelect', addressId)
    }

    const onSubmit = (value: CustomerAddress) => {
      addresses.value = remapDefaultAddresses(value, addresses.value)
      showDialog.create = false
      showDialog.update = false
    }

    const onDeleted = (id: string) => {
      addresses.value = [...addresses.value].filter((address) => address.id !== id)
      showDialog.update = false
    }

    api.customers
      .addresses(props.value.id)
      .then((value) => (addresses.value = value))
      .catch((err) => root.$toast.addErrorToast(err.response?.data.message || root.$t('Unable to fetch addresses')))
      .finally(() => (loading.value = false))

    return {
      selectedId,
      currentAddressPage,
      addressesPageCount,
      visibleAddresses,
      showDialog,
      updateAddress,
      onSelectToUpdate,
      onSelect,
      onSubmit,
      onDeleted
    }
  }
})
</script>
