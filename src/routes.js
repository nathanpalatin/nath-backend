import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
const database = new Database()

import { configDotenv } from 'dotenv'

configDotenv()

import { buildRoutePath } from './utils/build-route-path.js'

const secretKey = process.env.AUTHKEY_JWT

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (req, res) => {
      const users = database.select('users')

      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/users'),
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
        created_at: new Date(),
        updated_at: new Date(),
        token
      }

      await database.insert('users', user)

      return res
        .writeHead(201)
        .end(`Usuário criado com sucesso!`)
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {

      const { id } = req.params

      database.delete('users', id)

      return res.writeHead(204).end(`Usuário removido com sucesso!`)

    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler: (req, res) => {

      const { id } = req.params
      const { name, email, password, username, avatar } = req.body

      const user = database.select('users')

      const updated_user = {
        name,
        email,
        password,
        username,
        created_at: user[0].created_at,
        updated_at: new Date(),
        avatar
      }

      database.update('users', id, updated_user)

      return res.writeHead(204).end(`Usuário atualizado com sucesso!`)

    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/login'),
    handler: async (req, res) => {

      const { username, password } = req.body

      const user = database.select('users')

      if (!user[0].username) {
        return res.writeHead(401).end('Usuário não encontrado')
      }

      const validPassword = await bcrypt.compare(password, user[0].password)

      if (!validPassword) {
        return res.writeHead(401).end('Senha incorreta')
      }

      return res.writeHead(200).end(user[0].token)
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/password'),
    handler: async (req, res) => {

      const { credential } = req.body

      const user = database.select('users')

      if (credential !== user[0].username || credential !== user[0].email) {
        return res.writeHead(401).end('Usuário não encontrado')
      }

      return res.writeHead(200).end(user[0].password)
    }
  }
]
