import { faker } from '@faker-js/faker'

export const imageFileFactory = (): File => {
  return new File([faker.image.dataUri()], 'image.png', { type: 'image/png' })
}

export const imageBlobFactory = (): Blob => {
  return new Blob(['image'], { type: 'image/png' })
}
