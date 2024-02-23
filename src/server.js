import http from 'node:http'

import { auth } from './middlewares/auth.js'
import { routes } from './routes.js'

import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {

  const { method, url } = req

  await auth(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res
    .writeHead(404)
    .end(`Fala, dev! Essa rota é a de usuarios, preciso do método para executar a Query :).`)
});

server.listen(3333)
