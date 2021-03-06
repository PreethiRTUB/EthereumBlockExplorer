-- Generic

CREATE class BaseBlock
CREATE property BaseBlock.blockHash STRING
CREATE property BaseBlock.blockNumber DECIMAL

CREATE class BaseTransaction
CREATE property BaseTransaction.traceAddress EMBEDDEDLIST INTEGER
CREATE property BaseTransaction.transactionHash STRING
CREATE property BaseTransaction.type STRING

-- Block

CREATE class Block extends BaseBlock, V
CREATE property Block.blockTimestamp STRING
CREATE property Block.parentHash STRING
CREATE property Block.gasLimit INTEGER

-- Transaction

CREATE class Transaction EXTENDS BaseBlock,BaseTransaction, E
CREATE property Transaction.fromAddress STRING
CREATE property Transaction.toAddress STRING
CREATE property Transaction.callType STRING
CREATE property Transaction.gas DECIMAL
CREATE property Transaction.input STRING
CREATE property Transaction.value DECIMAL
CREATE property Transaction.gasUsed DECIMAL

-- Address

CREATE class Address extends V
CREATE property Address.address STRING

-- Contract

CREATE CLASS Contract EXTENDS Address, BaseBlock, BaseTransaction
CREATE property Contract.gas DECIMAL
CREATE property Contract.value DECIMAL
CREATE property Contract.code STRING

-- Token Tranfer

CREATE class TokenTransfer EXTENDS E,BaseBlock,BaseTransaction
CREATE property TokenTransfer.address STRING
CREATE property TokenTransfer.topics EMBEDDEDLIST STRING
CREATE property TokenTransfer.data DECIMAL
