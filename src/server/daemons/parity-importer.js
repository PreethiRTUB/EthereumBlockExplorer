// import the actual Api class
import Api from '@parity/api'
import config from '../../../config'
import logger from './../utils/logger'
import InputDataDecoder from 'ethereum-input-data-decoder'
import {BigNumber} from 'bignumber.js'

const decoder = new InputDataDecoder(`./config/ERC20-abi.json`)

/**
 * Once this deamon is initialized, it should keep running
 * forever and make sure that the database stays filled with the
 * latest transactions
 */
class importer {
  /**
   * Create a new daemon, start running instantly
   */
  constructor (db) {
    if (process.env.RUN_IMPORTER === '1') {
      this.db = db
      this.provider = new Api.Provider.Http(config.parityAddress)
      this.api = new Api(this.provider)
      this.active = true
      setInterval(this.check.bind(this), config.importInterval)
    }
  }

  /**
   * Check if the daemon is running
   * @return {boolean} isActive
   */
  isActive () {
    return this.active
  }

  /**
   * Function which is runned continuesly to keep the
   * database up-to-date
   */
  async check () {
    let lastLocalBlock = await this.getLastLocalBlock()
    let lastRemoteBlock = await this.getLastRemoteBlock()

    if (lastLocalBlock < lastRemoteBlock) {
      for (let block = lastLocalBlock + 1; block < lastRemoteBlock && block < lastLocalBlock + 2; block++) {
        if (!this.busy) {
          this.importBlock(block)
        }
      }
    } else {
      logger.info(`Local database up-to-date`)
    }
  }

  /**
   * Query the database in oder to see what the lastest
   * imported block is.
   * @return Promise<Number>
   */
  getLastLocalBlock () {
    let that = this
    return new Promise((resolve, reject) => {
      that.db.query(
        `SELECT blockNumber 
        FROM Block 
        ORDER BY blockNumber DESC`,
        {
          params: {},
          limit: 1
        }
      ).then(result => {
        if (result && result[0]) {
          resolve(result[0].blockNumber)
        }
        resolve(0)
      }).catch(console.log)
    })
  }

  /**
   * Access the parity api in order to get the last block available
   * @return Promsie<Number>
   */
  getLastRemoteBlock () {
    return new Promise((resolve, reject) => {
      this.api.eth
        .blockNumber()
        .then(blockNumber => {
          if (blockNumber) {
            resolve(Number(blockNumber))
          }
          resolve(0)
        }).catch(console.log)
    })
  }

  /**
   * Get all the details of a block using traceBlock and import
   * it to our graph database
   */
  importBlock (blockNumber) {
    logger.info(`Importing block ${blockNumber}`)
    this.busy = true
    Promise.all([
      this.api.trace.block(blockNumber),
      this.api.eth.getLogs({
        'fromBlock': blockNumber,
        'toBlock': blockNumber,
        'topics': ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'] // Transfer(address, address, uint256)
      })
    ]).then(async data => {
      logger.info('Data fetched')
      let transactions = data[0]
      let logs = data[1]
      this.db.query(
        `INSERT INTO Block 
          (blockHash, blockNumber)
        VALUES 
          (:blockHash, :blockNumber)`,
        {
          params: {
            blockHash: transactions[0].blockHash,
            blockNumber: blockNumber.toString(10)
          }
        }
      )

      let contractPromises = transactions.filter(transaction => transaction.type === 'create').map(this.importContract.bind(this))
      let transactionPromises = transactions.filter(transaction => transaction.type === 'call').map(this.importTransaction.bind(this))
      let tokenPromises = logs.map(this.importTokenTransfer.bind(this))

      Promise.all([
        ...contractPromises,
        ...transactionPromises,
        ...tokenPromises
      ]).then(() => {
        logger.info(`Finished importing block ${blockNumber}`)
        this.busy = false
        this.check()
      }).catch(err => {
        console.log(err)
        this.busy = false
        this.check()
      })
    }).catch(err => {
      console.log(err)
      this.busy = false
      this.check()
    })
  }

  /**
   * Import the contract in JSON format with is passed
   * by the argument
   * @param {JSON} contract
   */
  async importContract (transaction) {
    return new Promise(async (resolve, reject) => {
      transaction.result = transaction.result || {}
      if (typeof transaction.result.address === 'undefined') {
        return resolve()
      }
      this.db.query(
        `INSERT INTO Contract
          (address, blockHash, blockNumber, traceAddress, transactionHash, type, gas, value, code)
        VALUES
          (:address, :blockHash, :blockNumber, :traceAddress, :transactionHash, :type, :gas, :value, :code)`,
        {
          params: {
            address: transaction.result.address.toLowerCase(),
            blockHash: transaction.blockHash,
            blockNumber: transaction.blockNumber.toString(10),
            traceAddress: transaction.traceAddress,
            transactionHash: transaction.transactionHash,
            type: transaction.type,
            gas: transaction.action.gas ? transaction.action.gas.toString(10) : 0,
            value: transaction.action.value ? transaction.action.value.toString(10) : 0,
            code: transaction.result.code
          }
        }
      ).then(resolve).catch(err => {
        console.log(err)
        resolve()
      })
    })
  }

  /**
   * Import the transaction in JSON format with is passed
   * by the argument using OrientDB batches.
   * a and b are the addresses that are being upserted
   * @param {JSON} transaction
   */
  async importTransaction (transaction) {
    return new Promise(async (resolve, reject) => {
      transaction.result = transaction.result || {}
      if (typeof transaction.action === 'undefined') {
        return resolve()
      }
      transaction.action.from = transaction.action.from.toLowerCase()
      transaction.action.to = transaction.action.to.toLowerCase()
      this.db.query(
        `begin
        let a = UPDATE Address SET address = '${transaction.action.from}' UPSERT RETURN AFTER WHERE address = '${transaction.action.from}'
        let b = UPDATE Address SET address = '${transaction.action.to}' UPSERT RETURN AFTER WHERE address = '${transaction.action.to}'
        CREATE EDGE Transaction FROM $a TO $b SET blockHash = :blockHash, blockNumber = :blockNumber, subtraces = :subtraces, traceAddress = :traceAddress, transactionHash = :transactionHash, transactionPosition = :transactionPosition, type = :type, callType = :callType, gas = :gas, input = :input, value = :value, gasUsed = :gasUsed 
        commit`,
        {
          params: {
            blockHash: transaction.blockHash,
            blockNumber: transaction.blockNumber.toString(10),
            subtraces: transaction.subtraces,
            traceAddress: transaction.traceAddress,
            transactionHash: transaction.transactionHash,
            transactionPosition: transaction.transactionPosition,
            type: transaction.type,
            callType: transaction.action.callType,
            gas: transaction.action.gas ? transaction.action.gas.toString(10) : 0,
            input: transaction.action.input,
            value: transaction.action.value ? transaction.action.value.toString(10) : 0,
            gasUsed: transaction.result.gasUsed ? transaction.result.gasUsed.toString(10) : 0
          },
          class: 's'
        }
      ).then(resolve).catch(err => {
        console.log(err)
        resolve()
      })
    })
  }

  /**
   * Import the token transefer by using the log that is beïng
   * generated.
   * @param {JSON} transaction
   * @param {JSON} logs
   */
  async importTokenTransfer (transactionLog) {
    return new Promise(async (resolve, reject) => {
      if (transactionLog.topics.length < 3) {
        return resolve()
      }
      let fromAddress = '0x' + transactionLog.topics[1].slice(-40).toLowerCase()
      let toAddress = '0x' + transactionLog.topics[2].slice(-40).toLowerCase()
      this.db.query(
        `begin
        let a = UPDATE Address SET address = '${fromAddress}' UPSERT RETURN AFTER WHERE address = '${fromAddress}'
        let b = UPDATE Address SET address = '${toAddress}' UPSERT RETURN AFTER WHERE address = '${toAddress}'
        CREATE EDGE TokenTransfer FROM $a TO $b SET address = :address, blockHash = :blockHash, blockNumber = :blockNumber, topics = :topics, data = :data, transactionHash = :transactionHash
        commit`,
        {
          params: {
            address: transactionLog.address,
            blockHash: transactionLog.blockHash,
            blockNumber: transactionLog.blockNumber ? transactionLog.blockNumber.toString(10) : 0,
            topics: [
              fromAddress,
              toAddress
            ],
            data: new BigNumber(transactionLog.data, 16).toString() !== 'NaN' ? new BigNumber(transactionLog.data, 16).toString() : 0,
            transactionHash: transactionLog.transactionHash
          },
          class: 's'
        }
      ).then(resolve).catch(err => {
        console.log(err)
        resolve()
      })
    })
  }

  /**
   * Check if we are dealing with a token transfer. Based on ECR20
   * compatibility and transfer function being called.
   * @param {JSON} transaction
   */
  isTokenTransfer (transaction) {
    let result = decoder.decodeData(transaction.action.input)
    return result.name === 'transfer'
  }
}

export default importer
