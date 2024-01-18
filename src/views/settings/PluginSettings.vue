<template>
  <form-validator-wrapper @submit="updateSetting">
    <template #default="{ valid }">
      <scrollable-resource>
        <template v-if="meta" #header>
          <resource-header
            :back-to="{ name: 'settings', params: { option: 'plugins' } }"
            :header="meta.name"
            :subheader="$t(meta.description || '')"
          >
            <template #actions>
              <v-btn
                v-if="$canAny('manage,settings\\general', 'update,settings\\general')"
                depressed
                color="primary"
                :disabled="!valid"
                :loading="loading"
                type="submit"
              >
                {{ $t('Update') }}
              </v-btn>
            </template>
          </resource-header>
          <v-divider />
        </template>

        <template v-if="settingCode && form" #content>
          <div class="ma-6 d-flex justify-center flex-column align-center">
            <component :is="plugins[settingCode].component" v-model="form" class="col-12 col-lg-10" />
          </div>
        </template>
      </scrollable-resource>
    </template>
  </form-validator-wrapper>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { useSettings } from '@/composable/repositories/useSettings'
import FormValidatorWrapper from '@/components/common/FormValidatorWrapper.vue'
import PluginSettingsAvalara from '@/components/domains/settings/plugins/PluginSettingsAvalara.vue'
import PluginSettingsIcount from '@/components/domains/settings/plugins/PluginSettingsIcount.vue'
import PluginSettingsShippo from '@/components/domains/settings/plugins/PluginSettingsShippo.vue'
import PluginSettingsStarPrinter from '@/components/domains/settings/plugins/PluginSettingsStarPrinter.vue'
import ResourceHeader from '@/components/layouts/dashboard/ResourceHeader.vue'
import ScrollableResource from '@/components/layouts/dashboard/ScrollableResource.vue'
import ScrollableWrapper from '@/components/common/ScrollableWrapper.vue'
import type { AsyncComponent, Component } from 'vue'
import type { AvalaraSettings } from '@/types/plugins/Avalara'
import type { IcountSettings } from '@/types/plugins/ICount'
import type { ShippoSettings } from '@/types/plugins/Shippo'
import type { StarPrinterSettings } from '@/types/plugins/StarPrinter'

interface PluginMeta {
  name: string
  description?: string
  component: Component | AsyncComponent | (() => Component)
  template?: Object
}

type PluginSettings = StarPrinterSettings | IcountSettings | AvalaraSettings | ShippoSettings

export default defineComponent({
  name: 'PluginSettings',

  components: {
    FormValidatorWrapper,
    ScrollableResource,
    ResourceHeader,
    ScrollableWrapper
  },

  setup(props, { root }) {
    const loading = ref(false)

    const settingCode = computed(() => root.$route.params.option)

    const plugins: Record<string, PluginMeta> = {
      icount: {
        name: 'iCount',
        description: 'Configure iCount invoices system',
        component: PluginSettingsIcount
      },
      star_printer: {
        name: 'StarPrinter',
        description: 'Configure StarPrinter integration for automated documents printing.',
        component: PluginSettingsStarPrinter
      },
      avalara: {
        name: 'Avalara Taxes',
        component: PluginSettingsAvalara
      },
      shippo: {
        name: 'Shippo delivery',
        component: PluginSettingsShippo,
        template: {
          enabled: false,
          api_key: '',
          optional_address: {
            name: '',
            region: '',
            postcode: '',
            street: '',
            city: '',
            country_code: '',
            phone: ''
          },
          dimensions: {
            size_unit: 'cm',
            weight_unit: 'g',
            should_convert: false
          },
          fee: {
            type: 'percent',
            amount: ''
          }
        }
      }
    }

    const form = ref<PluginSettings>()
    const meta = ref<Pick<PluginMeta, 'name' | 'description'>>()

    const { updateSettings, getStoreSetting } = useSettings()

    const pluginExists = ['icount', 'star_printer', 'shippo', 'avalara'].find((plugin) => plugin === settingCode.value)

    if (pluginExists) {
      const { name, description, template } = plugins[settingCode.value]
      meta.value = { name, description }
      form.value = { ...template, ...getStoreSetting(`general.${settingCode.value}`) }
    } else {
      root.$toast.addErrorToast(root.$t('Plugin not found'))
      root.$router.push({ name: 'settings', params: { option: 'plugins' } })
    }

    const updateSetting = (): void => {
      loading.value = true
      updateSettings(`general.${settingCode.value}`, form.value)
        .then(() => root.$toast.addSuccessToast(root.$t('Settings updated')))
        .catch(() => root.$toast.addErrorToast(root.$t('Unable to update settings')))
        .finally(() => (loading.value = false))
    }

    return {
      form,
      meta,
      plugins,
      updateSetting,
      loading,
      settingCode
    }
  }
})
</script>
