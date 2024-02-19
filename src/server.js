import http from 'node:http'


import { auth } from './middlewares/auth.js'
import { routes } from './routes.js'



const server = http.createServer(async (req, res) => {

  const { method, url } = req

  await auth(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path === url
  })

  if (route) {
    return route.handler(req, res)
  }

  return res
    .writeHead(404)
    .end(`Fala, dev! Essa rota é a de usuarios, preciso do método para executar a Query :).`)
});

server.listen(3333)
