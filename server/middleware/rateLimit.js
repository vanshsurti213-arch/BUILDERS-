const requests = new Map()

export function rateLimiter(req, res, next) {
  const ip = req.ip
  const now = Date.now()
  const windowMs = 60 * 1000   // 1 minute
  const maxRequests = 20

  if (!requests.has(ip)) {
    requests.set(ip, [])
  }

  const timestamps = requests.get(ip).filter(t => now - t < windowMs)
  timestamps.push(now)
  requests.set(ip, timestamps)

  if (timestamps.length > maxRequests) {
    return res.status(429).json({ error: 'Too many requests. Wait a moment.' })
  }

  next()
}
