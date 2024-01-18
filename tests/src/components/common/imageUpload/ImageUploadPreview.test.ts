import '@testing-library/jest-dom'
import { configure, screen } from '@testing-library/dom'
import { faker } from '@faker-js/faker'
import { fireEvent } from '@testing-library/vue'
import { getEmittedEventValue } from '~/tests/helpers/getEmittedEventValue'
import { renderWithMainApp } from '~/tests/configs/vue-test-config'
import ImageUploadPreview from '@/components/common/imageUpload/ImageUploadPreview.vue'

const attributes = {
  component: 'image-upload-preview',
  imagePreview: 'image-upload-preview-img',
  deleteBtn: 'image-delete-btn',
  previewError: 'image-upload-preview-error'
}

export const fixtures = () => {
  const getComponent = () => screen.queryByTestId(attributes.component)
  const getImagePreview = () => screen.queryByTestId(attributes.imagePreview)
  const getErrorPreview = () => screen.queryByTestId(attributes.previewError)
  const getDeleteBtn = () => screen.queryByTestId(attributes.deleteBtn)

  const triggerLoadingImage = async () => {
    const img = getImagePreview()
    if (img) {
      await fireEvent.load(img)
    }
  }

  const deleteImage = async () => {
    const component = getDeleteBtn()
    if (component) {
      await fireEvent.click(component)
    }
  }

  return {
    getComponent,
    getErrorPreview,
    getDeleteBtn,
    getImagePreview,
    deleteImage,
    triggerLoadingImage
  }
}

describe('ImageUploadPreview component test', () => {
  beforeAll(() => configure({ testIdAttribute: 'data-cy' }))

  afterAll(() => jest.clearAllMocks())

  it('should mount ImageUploadPreview component correctly', () => {
    renderWithMainApp(ImageUploadPreview)
    expect(fixtures().getComponent()).toHaveAttribute('data-cy', attributes.component)
  })

  it('should not display error nor image when value is not provided', async () => {
    const propsData = { value: '' }
    renderWithMainApp(ImageUploadPreview, { propsData })

    expect(fixtures().getErrorPreview()).not.toBeInTheDocument()
    expect(fixtures().getImagePreview()).not.toBeInTheDocument()
  })

  it('should display image component and button to delete after successful load', async () => {
    const propsData = { value: faker.image.url() }
    renderWithMainApp(ImageUploadPreview, { propsData })

    const { getImagePreview, getDeleteBtn, triggerLoadingImage } = fixtures()

    expect(getImagePreview()).toBeInTheDocument()
    expect(getDeleteBtn()).not.toBeInTheDocument()

    await triggerLoadingImage()

    expect(getImagePreview()).toBeInTheDocument()
    expect(getDeleteBtn()).toBeInTheDocument()
  })

  it('should display image from file as string', async () => {
    // URL.createObjectURL does not exist in the jest-dom scope, so we have to fake it.
    window.URL.createObjectURL = jest.fn().mockReturnValue(faker.image.dataUri())

    const propsData = { value: faker.image.dataUri() }
    renderWithMainApp(ImageUploadPreview, { propsData })

    fixtures().getImagePreview()
    expect(fixtures().getImagePreview()).toBeInTheDocument()
  })

  it('should emit input event with undefined value on image delete', async () => {
    const propsData = { value: faker.image.url() }

    const wrapper = renderWithMainApp(ImageUploadPreview, { propsData })

    const { deleteImage, triggerLoadingImage } = fixtures()
    await triggerLoadingImage()

    await deleteImage()

    expect(getEmittedEventValue(wrapper, 'input')).toBe(null)
  })
})
