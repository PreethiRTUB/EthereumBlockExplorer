import Router from 'koa-router'
import mountController from '../middlewares/mountController'

const router = new Router()

/**
 *  Calculate the person correlation score between two items in a dataset.
 *
 *  @param  {object}  prefs The dataset containing data about both items that
 *                    are being compared.
 *  @param  {string}  p1 Item one for comparison.
 *  @param  {string}  p2 Item two for comparison.
 *  @return {float}  The pearson correlation score.
 */
function pearsonCorrelation (prefs, p1, p2) {
  var si = []
  for (var key in prefs[p1]) {
    if (prefs[p2][key]) si.push(key)
  }

  var n = si.length

  if (n === 0) return 0

  let sum1 = 0
  for (let i = 0; i < si.length; i++) sum1 += prefs[p1][si[i]]

  let sum2 = 0
  for (let i = 0; i < si.length; i++) sum2 += prefs[p2][si[i]]

  let sum1Sq = 0
  for (let i = 0; i < si.length; i++) {
    sum1Sq += Math.pow(prefs[p1][si[i]], 2)
  }

  let sum2Sq = 0
  for (let i = 0; i < si.length; i++) {
    sum2Sq += Math.pow(prefs[p2][si[i]], 2)
  }

  let pSum = 0
  for (let i = 0; i < si.length; i++) {
    pSum += prefs[p1][si[i]] * prefs[p2][si[i]]
  }

  let num = pSum - (sum1 * sum2 / n)
  let den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) *
      (sum2Sq - Math.pow(sum2, 2) / n))

  if (den === 0) return 0

  return num / den
}

router.get('/:address', mountController(async (params, query, body, context) => {
  const { address } = params
  const incoming = await context.db.query(
    `SELECT inE().outV().address, inE().value, inE().blockNumber
    FROM Address
    WHERE address = :address`,
    {
      params: {
        address
      }
    }
  )

  const outgoing = await context.db.query(
    `SELECT outE().inV().address, outE().value, outE().blockNumber
    FROM Address
    WHERE address = :address`,
    {
      params: {
        address
      }
    }
  )

  let transactionMap = {}
  let minBlock = 10e100
  let maxBlock = 0
  let totalValue = 0

  for (let i = 0; i < incoming[0].inE2.length; i++) {
    transactionMap[incoming[0].inE[i]] = transactionMap[incoming[0].inE[i]] || []
    transactionMap[incoming[0].inE[i]].push({
      amount: incoming[0].inE2[i],
      blockNumber: incoming[0].inE23[i]
    })
    minBlock = Math.min(incoming[0].inE23[i], minBlock)
    maxBlock = Math.max(incoming[0].inE23[i], maxBlock)
    totalValue += incoming[0].inE2[i]
  }

  for (let i = 0; i < outgoing[0].outE2.length; i++) {
    transactionMap[outgoing[0].outE[i]] = transactionMap[outgoing[0].outE[i]] || []
    transactionMap[outgoing[0].outE[i]].push({
      amount: outgoing[0].outE2[i] * -1,
      blockNumber: outgoing[0].outE23[i]
    })
    minBlock = Math.min(outgoing[0].outE23[i], minBlock)
    maxBlock = Math.max(outgoing[0].outE23[i], maxBlock)
  }

  let analysis = []
  Object.keys(transactionMap).forEach(key => {
    let firstSeen = (transactionMap[key][0].blockNumber - minBlock) / (maxBlock - minBlock)
    let score = transactionMap[key].reduce((value, transaction) => {
      let relativeTime = (transaction.blockNumber - minBlock) / (maxBlock - minBlock)
      let timeCorrectedPayment = ((transaction.amount * Math.pow(2.71, 1 + relativeTime * 10)) / totalValue) || 0
      return value + timeCorrectedPayment
    }, 0)

    analysis.push({
      firstSeen,
      score
    })
  })
  let data = analysis.sort((a, b) => a.score - b.score)

  let preprocessed = [[], []]
  data.forEach(item => {
    preprocessed[0].push(item.firstSeen)
    preprocessed[1].push(item.score)
  })

  if (data.length < 30) {
    throw new Error('Not enough data')
  }

  return {
    data: pearsonCorrelation(preprocessed, 0, 1)
  }
}))

export default router
