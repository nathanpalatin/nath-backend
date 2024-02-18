import http from 'node:http'

const users = []

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify(users));
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

    res.setHeader('Content-Type', 'text/plain')
    return res.end('Criação de usuários')
  }

  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello world!')
});

server.listen(3333);
