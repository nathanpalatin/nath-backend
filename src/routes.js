import { Database } from './database.js'
import { randomUUID } from 'node:crypto'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const secretKey = 'Mudaromundo2024'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: '/users',
    handler: (req, res) => {
      const users = database.select('users')

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler: async (req, res) => {

      const { name, email, password, avatar, username } = req.body

      const hashedPassword = await bcrypt.hash(password, 10)

      const id = randomUUID()

      const token = jwt.sign({ id }, secretKey)

      const user = {
        id,
        name,
        email,
        password: hashedPassword,
        avatar,
        username,
        token
      }

      await database.insert('users', user)

      return res
        .writeHead(201)
        .end(`Usuário criado com sucesso! ${token}`)
    }
  }
]
