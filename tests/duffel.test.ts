import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { duffelHeaders, searchOffers, placeSuggestions } from '../api/_duffel'

const OLD = process.env.DUFFEL_TOKEN

afterEach(() => {
  process.env.DUFFEL_TOKEN = OLD
})

describe('duffelHeaders', () => {
  it('builds bearer + version headers when token is set', () => {
    process.env.DUFFEL_TOKEN = 'duffel_test_abc'
    const h = duffelHeaders()
    expect(h.Authorization).toBe('Bearer duffel_test_abc')
    expect(h['Duffel-Version']).toBe('v2')
  })

  it('throws when token is missing', () => {
    delete process.env.DUFFEL_TOKEN
    expect(() => duffelHeaders()).toThrow(/DUFFEL_TOKEN/)
  })
})

describe('searchOffers', () => {
  beforeEach(() => {
    process.env.DUFFEL_TOKEN = 'duffel_test_abc'
  })

  it('POSTs to the offer_requests endpoint and returns status + payload', async () => {
    let calledUrl = ''
    let calledInit: any = null
    const fakeFetch = (async (url: string, init: any) => {
      calledUrl = url
      calledInit = init
      return { status: 200, json: async () => ({ data: { offers: [] } }) }
    }) as unknown as typeof fetch

    const body = { data: { slices: [] } }
    const res = await searchOffers(body, fakeFetch)

    expect(calledUrl).toContain('/air/offer_requests')
    expect(calledUrl).toContain('return_offers=true')
    expect(calledInit.method).toBe('POST')
    expect(JSON.parse(calledInit.body)).toEqual(body)
    expect(res.status).toBe(200)
    expect(res.payload).toEqual({ data: { offers: [] } })
  })
})

describe('placeSuggestions', () => {
  beforeEach(() => {
    process.env.DUFFEL_TOKEN = 'duffel_test_abc'
  })

  it('GETs the suggestions endpoint with an encoded query', async () => {
    let calledUrl = ''
    const fakeFetch = (async (url: string) => {
      calledUrl = url
      return { status: 200, json: async () => ({ data: [] }) }
    }) as unknown as typeof fetch

    await placeSuggestions('new york', fakeFetch)
    expect(calledUrl).toContain('/places/suggestions?query=new%20york')
  })
})
