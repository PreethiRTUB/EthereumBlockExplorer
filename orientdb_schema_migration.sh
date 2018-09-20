#!/bin/sh

set echo true

# Change to orientdb directory
cd $ORIENTDB_HOME/config/

# Change permissions for server config to update password
sudo chmod +X $ORIENTDB_HOME/config/orientdb-server-config.xml

# Create user admin
sudo $ORIENTDB_HOME/bin/console.sh "SET SERVER USER admin admin '*'"

sudo $ORIENTDB_HOME/bin/console.sh "exit"

# Create database if doesn't exists
sudo $ORIENTDB_HOME/bin/console.sh "create database plocal:$ORIENTDB_HOME/databases/EthereumFraudExplorer admin admin plocal graph"

sudo $ORIENTDB_HOME/bin/console.sh "exit"

# Run create orientdb schema creation
sudo $ORIENTDB_HOME/bin/console.sh "CONNECT plocal:$ORIENTDB_HOME/databases/EthereumFraudExplorer admin admin;LOAD SCRIPT /usr/src/db/migrations/Ethereum_orientDB_schema.osql"

sudo $ORIENTDB_HOME/bin/server.sh




