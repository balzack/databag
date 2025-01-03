#!/bin/bash
set -e

function confirm() {
	read -p "Are you sure you want to continue? [Y/n] " reply
	if [ "$reply" != "Y" ] && [ "$reply" != "y" ]; then
		echo "Aborting"
		exit 1
	fi
}

if ! id "databag" >/dev/null 2>&1; then
	echo "User databag not found, creating..."
	confirm
	sudo useradd databag
fi

if [[ ! -d "/app/databag" ]]; then
	echo "Creating app directory for databag, this requires sudo permissions"
	sudo rm -rf /app/databag || true
	sudo mkdir -p /app/databag

	echo "Downloading databag repository into /app/databag"
	git clone --depth 1 https://github.com/balzack/databag.git /app/databag
	sudo chown -R databag:databag /app/databag
fi
cd /app/databag

# You might be running this script from the root of this repository
if [[ "/app/databag" != $(pwd) ]]; then
	cd ../..
fi

if [[ "/app/databag" != $(pwd) ]]; then
	echo "Install databag must be done from /app/databag"
	echo "Please re-clone the github repository into /app/databag, like so:"
	echo "mkdir -p /app; https://github.com/balzack/databag /app/databag"
	exit 1
fi

if [[ -z $(which yarn) ]]; then
	echo "Yarn is not installed, installing..."
	npm install --global yarn
fi

echo "Building frontend files..."
cd net/web
yarn --frozen-lockfile
echo "Removing old frontend files, requires sudo permissions..."
sudo rm -rf build
yarn run build
sudo chown -R databag:databag build
cd ../..

echo "Building backend files..."
cd net/server
CGO_ENABLED=1 go build -o databag .
cd ../..

echo "Creating databag locations..."
sudo mkdir -p /opt/databag
sudo mkdir -p /var/lib/databag
sudo chown -R databag:databag /var/lib/databag

echo "Copying transform scripts..."
sudo mkdir -p /opt/databag/transform
sudo cp net/transform/*.sh /opt/databag/transform/
sudo chmod +x /opt/databag/transform/*.sh

if [[ ! -f /etc/systemd/system/databag.service ]]; then
	function createService() {
		echo "Creating databag service, requires sudo permissions..."
		sudo cp examples/linux/databag.service /etc/systemd/system/databag.service
		sudo chmod 664 /etc/systemd/system/databag.service
		sudo systemctl daemon-reload
	}
	function startService() {
		echo "Starting databag service..."
		sudo systemctl start databag.service
	}
	createService $? "Failed to install databag service"
	startService $? "Failed to start databag service"
fi
echo ""
echo "Done"
