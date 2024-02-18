// Steams ->

//process.stdin
//.pipe(process.stdout)

import { Readable } from 'node:stream'

class OneHundredStream extends Readable {
  index = 1
  _read() {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null)
      } else {
        const buf = Buffer.from(String(i))
        this.push(buf)
      }
    }, 200)
  }
}

fetch('http://localhost:3333', {
  method: 'POST',
  body: new OneHundredStream()
})