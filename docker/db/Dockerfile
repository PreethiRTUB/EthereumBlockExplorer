# Create image based on office docker version
FROM orientdb:3.0.0

# Install bash
RUN apk update && apk add bash && apk add sudo

# ENVIRONMET VARIABLES
ENV ORIENTDB_HOME /orientdb

# Switch to directory
WORKDIR /orientdb/bin

# Copy all the code
COPY orientdb_schema_migration.sh /orientdb/bin

RUN mkdir -p /usr/src/db

COPY . /usr/src/db


CMD ["/orientdb/bin/orientdb_schema_migration.sh"]

#Npm run start-importer