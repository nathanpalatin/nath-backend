import { Database } from './database.js'
import { randomUUID } from 'node:crypto'

import { config } from 'dotenv'

config()

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { buildRoutePath } from './utils/build-route-path.js'

const secretKey = process.env.AUTHKEY_JWT

const database = new Database()

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

      const { name, email, password, avatar, username, created_at, updated_at } = req.body

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

      database.update('users', id, {
        name,
        email,
        password,
        username,
        avatar
      })

      return res.writeHead(204).end(`Usuário atualizado com sucesso!`)

    }
  },
]
