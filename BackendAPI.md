# Block Explorer Backend API

baseUrl = http://localhost:3000

## Response format
```
{
	data: ...,
	success: true or false,
	errorMessage: ... // if success=false
}

```

# Block

## Block List
Request
```
URL: /block
Method: get
Parameters: {
	pageNum: 1,2...n start from 1
	pageSize: 50 default
}
```
Response
```
{
	data: {
		list: [{
			blockNumber: ...,
			blockHash: ...
		}],
		pageNum: 1,
		total: 5647386  // total number of blocks
	},
	success: true
}
```

## Block List
Request
```
URL: /block/byRange
Method: get
Parameters: {
	start: 5647385,
	end: 5647386, // optional. if end === undefined, range will be [start, latest block number]
}
```
Response
```
{
	data: {
		list: [{
			blockNumber: ...,
			blockHash: ...
		}]
	},
	success: true
}
```

## Single Block
Request
```
URL: /block/:blockId, // blockId could be either blockNumber or blockHash
Method: get
Parameters: none
```
Response
```
{
	data: {
		blockNumber: ...,
		blockHash: ...
	},
	success: true
}
```

## Transaction list in a single block
Request
```
URL: /block/:blockId/transaction
// blockId could be either blockNumber or blockHash, currently only hash
Method: get
Parameters: {
	pageNum: 1,2...n
	pageSize
}
```
Response
```
{
	data: {
		list: [{
			"fromAddress": "0x10BA8C7D9d53Da6f7d54e1c1630bf99b4bCFbe73",
			"toAddress": "0xAa949E436CF343F46bC0fD64a234b82f1E79e4D9",
			"blockNumber": null,
			"blockHash": "0x78f4594b946411f9e1f80009b239339144f0732632faafd35f8c7b7ec771f1bb",
			"transactionHash": "0x25644d24c989568841bb61568539bd961273ff43eca77ae5a439c403ff71cdb2",
			"type": "call",
			"traceAddress": [],
			"subtraces": null,
			"result": {
				"@class": "result",
				"@type": "d",
				"output": "0x",
				"gasUsed": "{s=1, c=[0], e=0}"
			}
		}],
		pageNum: 1,
		total: 5647386  // total number of transactions
	},
	success: true
}
```

## Internal Transaction list in a single block
Request
```
URL: /block/:blockId/intTrans
// blockId could be either blockNumber or blockHash, currently only hash
Method: get
Parameters: {
	pageNum: 1,2...n
}
```
Response
```
{
	data: { list: [{
		"fromAddress": "0x2BD2326c993DFaeF84f696526064FF22eba5b362",
		"toAddress": "0x9554EFa1669014C25070BC23C2dF262825704228",
		"blockNumber": null,
		"blockHash": "0x78f4594b946411f9e1f80009b239339144f0732632faafd35f8c7b7ec771f1bb",
		"transactionHash": "0xe4b4371b3c1925180691d9bff9c1f4dc1b5d4e7cef76c06021256470c2bf89f0",
		"type": "call",
		"traceAddress": [
		  null
		],
		"subtraces": null,
		"result": {
			"@class": "result",
			"@type": "d",
			"output": "0x0000000000000000000000000000000000000000000000000000000000000001",
			"gasUsed": "{s=1, c=[387], e=2}"
		}
		}]
		pageNum: 1,
		total: 11,
	},
	success: true
}
```

# Transaction

## Single Transaction
Request
```
URL: /transaction/:transactionHash
Method: get
Parameters: none
```
Response
```
{
	"data": {
		"fromAddress": "0x9554EFa1669014C25070BC23C2dF262825704228",
		"toAddress": "0x97A08341a99959661C516AfC7a89725F8Ad233f1",
		"blockNumber": null,
		"blockHash": "0x78f4594b946411f9e1f80009b239339144f0732632faafd35f8c7b7ec771f1bb",
		"transactionHash": "0xe4b4371b3c1925180691d9bff9c1f4dc1b5d4e7cef76c06021256470c2bf89f0",
		"type": "call",
		"traceAddress": [],
		"subtraces": null,
		"result": {
			"@class": "result",
			"@type": "d",
			"output": "0x0000000000000000000000000000000000000000000000000000000000000001",
			"gasUsed": "{s=1, c=[9208], e=3}"
		}
	},
	"success": true
}
```

## Internal transaction list of a Single Transaction
Request
```
URL: /transaction/:transactionHash/intTrans
Method: get
Parameters: none
```
Response
```
same...
```

# Address
## Transaction list of an address
Request
```
URL: /address/:hash/transaction
Method: get
Parameters: {
	pageNum: 1,2...n
}
```
Response
```
same...
```
## Internal Transaction list of an address
Request
```
URL: /address/:hash/intTrans
Method: get
Parameters: {
	pageNum: 1,2...n
}
```
Response
```
same...
```