import moment from 'moment';
import childProcess from 'child_process';
import path from 'path';
import fs from 'fs';
import {
  Writable
} from 'stream';

class BaseLogger extends Writable {
  constructor(dirName, name) {
    super();
    this.dirName = dirName;
    this.name = name;
    this.creationDate = moment();
  }

  createFileStream () {
    this.fileName = `${this.name}_${this.creationDate.format('YYYY-MM-DD')}.log`;
    this.filePath = path.join(this.dirName, this.fileName);
    childProcess.execSync(`mkdir -p ${this.dirName}`);
    this.stream = fs.createWriteStream(this.filePath, {flags: 'a'});
    this.stream.on('error', (err) => {
      console.error(err);
    })
  }

  static COLORS = {
    /* error */ 50: 'red',
    /* warn */ 40: 'yellow',
    /* info */ 30: 'cyan',
    /* debug */ 20: 'blue',
    /* trace */ 10: 'grey'
  };
}

export default BaseLogger;