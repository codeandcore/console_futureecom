<template>
  <div>
    <div class="d-flex flex-column">
      <switch-field v-model="form.enabled" :label="$t('Enabled')" />
      <switch-field v-model="form.require_auth" :label="$t('Require Auth')" />

      <v-scroll-y-transition mode="out-in" group>
        <template v-if="form.require_auth">
          <v-text-field key="username" v-model="form.username" :label="$t('Username')" outlined />
          <v-text-field key="password" v-model="form.password" :label="$t('Password')" outlined />
        </template>
      </v-scroll-y-transition>

      <v-divider class="my-4" />

      <span class="text-h6">{{ $t('Printers') }}</span>

      <plugin-star-printer-printers-subresource v-model="form.printers" />
    </div>

    <v-divider class="my-4" />

    <div class="d-flex flex-column">
      <span class="text-h6">{{ $t('Documents') }}</span>
      <span class="text-caption">{{ $t('Documents (invoice/receipt) printing settings') }}</span>

      <v-combobox
        :value="docPrinters"
        class="mt-4"
        :label="$t('List of allowed printers')"
        :items="form.printers || []"
        item-text="name"
        item-value="mac"
        multiple
        chips
        deletable-chips
        outlined
        @input="form.document = $event.map((item) => item.mac)"
      />

      <switch-field v-model="form.automatic_document" :label="$t('Automatic printing')" />
      <v-select
        v-if="form.automatic_document"
        v-model="form.document_events"
        outlined
        :items="events"
        :label="$t('Printing events')"
        multiple
      />

      <v-text-field v-model="form.footer" outlined :label="$t('Footer printed with every document')" />
      <switch-field v-model="form.document_buzzer" :label="$t('Buzz on print')" />
      <switch-field v-model="form.document_drawer" :label="$t('Open cash drawer on print')" />
    </div>

    <v-divider class="my-4" />

    <div class="d-flex flex-column">
      <span class="text-h6">{{ $t('Slips') }}</span>
      <span class="text-caption">{{ $t('Slips printing settings') }}</span>
      <v-combobox
        :value="slipPrinters"
        class="mt-4"
        :label="$t('List of allowed printers')"
        :items="form.printers || []"
        item-text="name"
        item-value="mac"
        multiple
        chips
        deletable-chips
        outlined
        @input="form.slip = $event.map((item) => item.mac)"
      />
      <switch-field v-model="form.automatic_slip" :label="$t('Automatic printing')" />
      <v-select
        v-if="form.automatic_slip"
        v-model="form.slip_events"
        outlined
        :items="events"
        :label="$t('Printing events')"
        multiple
      />

      <switch-field v-model="form.slip_buzzer" :label="$t('Buzz on print')" />
      <switch-field v-model="form.slip_drawer" :label="$t('Open cash drawer on print')" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import PluginStarPrinterPrintersSubresource from '@/components/tables/subresources/PluginStarPrinterPrintersSubresource.vue'
import SwitchField from '@/components/common/SwitchField.vue'
import type { PropType } from '@vue/composition-api'
import type { StarPrinterPrinter, StarPrinterSettings } from '@/types/plugins/StarPrinter'

export default defineComponent({
  name: 'PluginSettingsStarPrinter',
  components: { PluginStarPrinterPrintersSubresource, SwitchField },
  props: {
    value: {
      type: Object as PropType<StarPrinterSettings>,
      required: true
    }
  },

  setup(props, { emit }) {
    const settingsTemplate: StarPrinterSettings = {
      enabled: false,
      require_auth: false,
      username: '',
      password: '',
      footer: '',
      automatic_document: false,
      document_events: [],
      document: [],
      document_buzzer: false,
      document_drawer: false,
      printers: [],
      automatic_slip: false,
      slip_events: [],
      slip: [],
      slip_buzzer: false,
      slip_drawer: false
    }

    const form = ref<StarPrinterSettings>({ ...settingsTemplate, ...(props.value as StarPrinterSettings) })
    const events = ['invoice', 'receipt']

    const docPrinters = computed((): StarPrinterPrinter[] => {
      return (form.value.printers || []).filter((printer) => (form.value.document || []).includes(printer.mac))
    })
    const slipPrinters = computed((): StarPrinterPrinter[] => {
      return (form.value.printers || []).filter((printer) => (form.value.slip || []).includes(printer.mac))
    })

    watch(form, () => emit('input', { ...form.value }), { deep: true })

    return {
      form,
      docPrinters,
      slipPrinters,
      events
    }
  }
})
</script>
