import { dataLoader } from '@/composable/loaders/dataLoader'
import { ref } from '@vue/composition-api'
import useApi from '@/composable/useApi'
import type { Template } from '@futureecom/futureecom-js/dist/services/cms-service'

interface TemplateOption {
  name: string
  code: string
}

const templateList = ref<Template[]>([])

export const useTemplates = (initTemplateCode: string = '') => {
  const template = ref<TemplateOption>({ name: '', code: initTemplateCode })
  const templateLoader = dataLoader()

  const getTemplates = async (): Promise<Template[]> => {
    const api = useApi()
    await templateLoader.loadData(() => api.cms.templates({ perPage: -1 }))
    templateList.value = [...templateLoader.data.value]

    return templateList.value
  }

  getTemplates().then(() => {
    template.value = { name: getTemplateName(initTemplateCode), code: initTemplateCode }
  })

  const getTemplateName = (templateCode: string): string => {
    return templateList.value.find((item: Template) => item.code === templateCode)?.name || templateCode
  }

  return {
    templateList: templateList,
    templateLoader: templateLoader,
    template
  }
}
