export const createLink = (
  data: BlobPart[],
  filename: string,
  action: 'download' | 'print' = 'download'
): HTMLAnchorElement => {
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(new Blob(data))
  link.setAttribute(action, filename)
  link.setAttribute('data-cy', `created-${action}-link`)
  link.target = '_blank'
  document.body.appendChild(link)

  return link
}
