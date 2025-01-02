#!/bin/sh
set -e

if [[ "/app/databag" != $(pwd) ]]; then
   echo "Building databag must be done from /app/databag"
   echo "Please reclone the github repository into /app/databag, like so:"
   echo "mkdir -p /app; https://github.com/balzack/databag /app/databag"
   exit 1
fi

if ![[ -z $(which yarn) ]]; then
   echo "Yarn is not installed, installing..."
	npm install --global yarn
fi

echo "Building frontend files..."
cd net/web
yarn --frozen-lockfile
yarn run build
cd ../..

echo "Building backend files..."
cd net/server
CGO_ENABLED=1 go build -o databag .
cd ../..

echo "Creating databag locations..."
RUN mkdir -p /opt/databag
RUN mkdir -p /var/lib/databag

echo "Copying transform scripts..."
mkdir -p /opt/databag/transform
cp net/transform/*.sh /opt/databag/transform/

echo "Consider using the databag.service file as an example to run databag."
echo ""
echo "Done."
