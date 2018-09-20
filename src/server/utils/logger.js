import pino from 'pino'
import colors from 'colors'
import BaseLogger from './baseLogger'
import config from '../../../config'

class RollingFile extends BaseLogger {
  constructor (dirName, name) {
    super(dirName, name)
    this.createFileStream()
  }

  _write (chunk, encoding, done) {
    if (this.creationDate.isBefore(this.creationDate, 'day')) {
      this.createFileStream()
    }
    this.stream.write(chunk)

    const msg = chunk.toString()
    const json = JSON.parse(msg)
    if (json.level === 60) {
      // eslint-disable-next-line
      console.info(colors.bgRed.white(msg));
    } else {
      // eslint-disable-next-line
      console.info(colors[BaseLogger.COLORS[json.level]](msg));
    }
    done()
  }
}

const logger = pino({
  app: 'etherexplorer'
}, new RollingFile(config.log.path, 'explorer'))

logger.level = config.log.level

export default logger
