import type { VercelRequest, VercelResponse } from '@vercel/node'
import { placeSuggestions } from './_duffel'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const query = typeof req.query.query === 'string' ? req.query.query.trim() : ''
  if (query.length < 2) {
    res.status(200).json({ data: [] })
    return
  }
  try {
    const { status, payload } = await placeSuggestions(query)
    res.status(status).json(payload)
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach Duffel', detail: String(err) })
  }
}
