import { createLink } from '@/libs/createLink'

describe('createLink util tests', () => {
  it('creates download href element and puts in the document', () => {
    window.URL.createObjectURL = jest.fn().mockReturnValue('')

    const element = createLink([], 'foo.txt', 'download')
    expect(element).toBeInTheDocument()
    expect(element).toHaveAttribute('data-cy', 'created-download-link')
  })
  it('creates print href element and puts in the document', () => {
    window.URL.createObjectURL = jest.fn().mockReturnValue('')

    const element = createLink([], 'foo.txt', 'print')
    expect(element).toBeInTheDocument()
    expect(element).toHaveAttribute('data-cy', 'created-print-link')
  })
})
