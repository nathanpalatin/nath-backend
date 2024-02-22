import http from 'node:http'

import { auth } from './middlewares/auth.js'
import { routes } from './routes.js'

const server = http.createServer(async (req, res) => {

  const { method, url } = req

  await auth(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    req.params = { ...routeParams.groups }

    return route.handler(req, res)
  }

  return res
    .writeHead(404)
    .end(`Fala, dev! Essa rota é a de usuarios, preciso do método para executar a Query :).`)
});

server.listen(3333)
console.log('Servidor rodando na porta 3333.')
