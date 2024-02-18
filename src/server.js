import http from 'node:http'

import { json } from './middlewares/json.js'

import { v4 } from 'uuid'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const payload = { user_id: 123 }
const secretKey = 'suaChaveSecreta'

const token = jwt.sign(payload, secretKey)

const uuid = v4()

const users = []

const server = http.createServer(async (req, res) => {

  const { method, url } = req

  await json(req, res)

  if (method === 'GET' && url === '/users') {
    return res
      .setHeader('Content-Type', 'application/json')
      .end(JSON.stringify(users))
  }

  if (method === 'POST' && url === '/users') {

    const { name, email, avatar, password, username } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    users.push(
      {
        id: uuid,
        name,
        username,
        email,
        password: hashedPassword,
        avatar,
        token
      },
    )

    return res
      .writeHead(201)
      .end(`Usuário criado com sucesso`)
  }

  return res
    .writeHead(404)
    .end(`Fala, dev!`)
});

server.listen(3333)
