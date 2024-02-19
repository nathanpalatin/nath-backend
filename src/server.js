import http from 'node:http'
import { randomUUID } from 'node:crypto'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Database } from './database.js'
import { auth } from './middlewares/auth.js'

const database = new Database()

const payload = { id: randomUUID }
const secretKey = 'Mudaromundo2024'

const token = jwt.sign(payload, secretKey)

const server = http.createServer(async (req, res) => {

  const { method, url } = req

  await json(req, res)

  if (method === 'GET' && url === '/users') {

    const users = database.select('users')

    return res
      .end(JSON.stringify(users))
  }

  if (method === 'POST' && url === '/users') {

    const { name, email, avatar, password, username } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = {
      id: randomUUID(),
      name,
      username,
      email,
      password: hashedPassword,
      avatar,
      token
    }


    database.insert('users', user)

    return res
      .writeHead(201)
      .end(`Usuário criado com sucesso!`)
  }

  return res
    .writeHead(200)
    .end(`Fala, dev! Essa rota é a de usuarios, preciso do método para executar a Query :).`)
});

server.listen(3333)
