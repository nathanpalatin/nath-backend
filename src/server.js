import http from 'node:http'

const users = []

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    return res
      .setHeader('Content-Type', 'application/json')
      .end(JSON.stringify(users));
  }

  if (method === 'POST' && url === '/users') {
    users.push(
      {
        id: 1,
        name: 'Nathan Palatin',
        username: 'nathanpalatin',
        email: 'nath@gmail.com',
        avatar: 'https://github.com/nathanpalatin.png',
      },
    )

    return res
      .writeHead(201)
      .end('Criação de usuários')
  }

  return res
    .writeHead(404)
    .end('Not Found. 😅')
});

server.listen(3333)
