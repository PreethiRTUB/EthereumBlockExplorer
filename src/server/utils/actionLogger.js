import pino from 'pino'
import BaseLogger from './baseLogger'
import _ from 'lodash'
import config from '../../../config'

class File extends BaseLogger {
  constructor (dirName, name) {
    super(dirName, name)
    this.createFileStream()
  }

  _write (chunk, encoding, done) {
    const json = JSON.parse(chunk.toString())
    const data = _.pick(
      json,
      'objectType',
      'objectId',
      'recordTime',
      'businessType',
      'action',
      'content',
      'attachment',
      'recorder',
      'recorderName',
      'recorderType'
    )
    // eslint-disable-next-line
    console.log(data);
    data.objectType = `${data.objectType}`
    data.content = data.content ? JSON.stringify(data.content) : ''
    this.stream.write(`opSyncLog-${JSON.stringify(data)}\n`)
    done()
  }
}

const logger = pino({
}, new File(config.actionLog.path, 'events'))

logger.level = config.actionLog.level

export default logger
