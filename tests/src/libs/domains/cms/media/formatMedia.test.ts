import { transformMediaToFormData } from '@/libs/domains/cms/media/formatMedia'

describe('Test for transforming media object to FormData', () => {
  it('transforms new media to proper FormData', () => {
    const media = {
      name: 'foo',
      description: 'bar',
      image: new File([], 'image.png'),
      public_id: 'foo_bar',
      tags: ['foo', 'bar', 'foo_bar', '1234']
    }
    const fd = transformMediaToFormData(media)

    const values = [...fd.entries()]
    expect(values[0][0]).toBe('name')
    expect(values[1][0]).toBe('description')
    expect(values[2][0]).toBe('image')
    expect(values[3][0]).toBe('public_id')

    expect(values[4][0]).toBe('tags[]')
    expect(values[5][0]).toBe('tags[]')
    expect(values[6][0]).toBe('tags[]')
    expect(values[7][0]).toBe('tags[]')

    expect(values[0][1]).toBe('foo')
    expect(values[1][1]).toBe('bar')
    expect(values[2][1]).toBeTruthy()
    expect(values[3][1]).toBe('foo_bar')

    expect(values[4][1]).toBe('foo')
    expect(values[5][1]).toBe('bar')
    expect(values[6][1]).toBe('foo_bar')
    expect(values[7][1]).toBe('1234')
  })

  it('does not include public_id when the media already exists', () => {
    const media = {
      id: '1234-1235-1236',
      name: 'foo',
      description: 'bar',
      image: new File([], 'image.png'),
      public_id: 'foo_bar',
      tags: ['foo', 'bar', 'foo_bar', '1234']
    }
    const fd = transformMediaToFormData(media)

    expect(fd.get('public_id')).toBeNull()
  })

  it('does not include image when it is not provided', () => {
    const fd = transformMediaToFormData({ name: '' })
    expect(fd.get('image')).toBeNull()
  })

  it('puts null tag value on empty array', () => {
    const fd = transformMediaToFormData({ name: '', tags: [] })
    expect(fd.get('tags')).toBe('')
  })
})
