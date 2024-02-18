import http from 'node:http'

const users = []

const server = http.createServer((req, res) => {

  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    return res.end('Listagem de usuários')
  }


  if (method === 'POST' && url === '/users') {

    users.push({
      id: 1,
      name: 'Nathan Palatin',
      username: 'nathanpalatin',
      email: 'nath.palatin@gmail.com',
      avatar: 'https://github.com/nathanpalatin.png'
    })

    res.end('Criação de usuários')

  }

  return res.end('Hello world!')

})

server.listen(3333)