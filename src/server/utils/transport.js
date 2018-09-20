import fs from 'fs'
import path from 'path'
import colors from 'colors'
import moment from 'moment'
import {
  Writable
} from 'stream'

const COLORS = {
  /* error */ 50: 'red',
  /* warn */ 40: 'yellow',
  /* info */ 30: 'cyan',
  /* debug */ 20: 'blue',
  /* trace */ 10: 'grey'
}

export default class RollingFile extends Writable {
  constructor (dirname) {
    super()
    this.dirname = dirname
    this.createFileStream()
  }

  createFileStream () {
    this.currentFileDate = moment()
    this.stream = fs.createWriteStream(path.join(this.dirname, `${this.currentFileDate.format('YYYY-MM-DD')}.log`), { flags: 'a' })
    this.stream.on('error', (err) => {
      console.log(err)
    })
  }

  _write (chunk, encoding, done) {
    if (this.currentFileDate.isBefore(moment(), 'day')) {
      this.createFileStream()
    }
    let msg = chunk.toString()
    const json = JSON.parse(msg)
    msg = JSON.stringify(msg, null, 2)

    this.stream.write(msg)

    if (json.level === 60) {
      console.log(colors.bgRed.white(msg))
    } else {
      console.log(colors[COLORS[json.level]](msg))
    }
    done()
  }
}
