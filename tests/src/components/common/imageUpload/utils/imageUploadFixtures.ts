import { fixtures as ImageUploadFileFixtures } from '~/tests/src/components/common/imageUpload/ImageUploadFile.test'
import { fixtures as ImageUploadPreviewFixtures } from '~/tests/src/components/common/imageUpload/ImageUploadPreview.test'
import { fixtures as ImageUploadUrl } from '~/tests/src/components/common/imageUpload/ImageUploadUrl.test'
import { fireEvent } from '@testing-library/vue'
import { screen } from '@testing-library/dom'

export const attributes = {
  component: 'image-upload',
  uploadBtn: 'image-upload-btn'
}
export const fixtures = () => {
  const getComponent = () => screen.getByTestId(attributes.component)

  const getUploadButton = () => screen.queryByTestId(attributes.uploadBtn)

  const clickUpload = async () => {
    const btn = getUploadButton()
    if (btn) {
      await fireEvent.click(btn)
    }
  }

  return {
    getComponent,
    getUploadButton,
    clickUpload,
    imageUploadUrl: ImageUploadUrl(),
    imageUploadFile: ImageUploadFileFixtures(),
    imageUploadPreview: ImageUploadPreviewFixtures()
  }
}
