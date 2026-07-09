import type { VercelRequest, VercelResponse } from '@vercel/node'
import { searchOffers } from './_duffel'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  try {
    const { status, payload } = await searchOffers(req.body)
    res.status(status).json(payload)
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach Duffel', detail: String(err) })
  }
}
