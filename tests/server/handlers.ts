import { gridFactory } from '~/tests/factories/collectionFactory'
import { orderCommentFactory, orderDocumentFactory, orderFactory } from '~/tests/factories/orders/orderFactories'
import { rest } from 'msw'
import { transactionFactory } from '~/tests/factories/payment/transactionFactories'
import { vatFactory } from '~/tests/factories/taxes/taxFactories'
import type { RestHandler } from 'msw'

location.replace('http://localhost')

export const orderHandlers: RestHandler[] = [
  rest.get('/orders/orders/:id', (req, res, ctx) => {
    return res(ctx.json(orderFactory()), ctx.status(200))
  }),
  rest.patch('/orders/orders/:id/paid', (req, res, ctx) => {
    return res(ctx.status(202))
  }),
  rest.patch('/orders/orders/:id/refund', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  rest.patch('/orders/orders/:id/archive', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  rest.patch('/orders/orders/:id/cancel', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  rest.patch('/orders/orders/:id/void', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  rest.patch('/orders/orders/:id/hold', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  rest.patch('/orders/orders/:id/release', (req, res, ctx) => {
    return res(ctx.status(204))
  }),
  rest.post('/orders/orders/:id/comments', (req, res, ctx) => {
    return res(ctx.status(201))
  }),
  rest.put('/orders/orders/:id/comments/:commentId', (req, res, ctx) => {
    return res(ctx.json(orderCommentFactory()), ctx.status(200))
  }),
  rest.get('/orders/orders/:id/comments', (req, res, ctx) => {
    return res(ctx.json(orderCommentFactory()), ctx.status(200))
  }),
  rest.get('/orders/orders/:id/documents', (req, res, ctx) => {
    return res(ctx.json(orderDocumentFactory()), ctx.status(200))
  }),
  rest.post('/orders/orders/:id/documents/:document', async (req, res, ctx) => {
    if (req.headers.get('x-organisation-id') === '0' || req.headers.get('x-store-id') === '0') {
      return res.networkError('Network error')
    }
    return res(ctx.status(200))
  }),
  rest.delete('/orders/orders/:id', async (req, res, ctx) => {
    if (req.headers.get('x-organisation-id') === '0' || req.headers.get('x-store-id') === '0') {
      return res.networkError('Network error')
    }
    return res(ctx.status(204))
  }),
  rest.post('/payments/authorizations/:id/capture', async (req, res, ctx) => {
    return res(ctx.json(transactionFactory()), ctx.status(202))
  })
]

export const vatRatesHandlers: RestHandler[] = [
  rest.get('/taxes/vat', (req, res, ctx) => {
    return res(ctx.json(gridFactory(vatFactory)), ctx.status(200))
  }),
  rest.get('/taxes/vat/:id', (req, res, ctx) => {
    return res(ctx.json(vatFactory()), ctx.status(200))
  }),
  rest.post('/taxes/vat', (req, res, ctx) => {
    return res(ctx.json(vatFactory()), ctx.status(202))
  }),
  rest.put('/taxes/vat/:id', (req, res, ctx) => {
    return res(ctx.json(vatFactory()), ctx.status(202))
  }),
  rest.delete('/taxes/vat/:id', (req, res, ctx) => {
    return res(ctx.status(204))
  })
]

export const serverHandlers: RestHandler[] = [...orderHandlers, ...vatRatesHandlers]
