export async function auth(req, res) {
  const { method, url } = req

  const buffers = []

  for await (const chunck of req) {
    buffers.push(chunck)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  res.setHeader('Content-Type', 'application/json')
}