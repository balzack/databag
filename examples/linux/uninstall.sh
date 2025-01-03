#!/bin/bash

function confirm() {
	read -p "Are you sure you want to continue? [Y/n] " reply
	if [ "$reply" != "Y" ] && [ "$reply" != "y" ]; then
		echo "Aborting"
		exit 1
	fi
}

echo "Stopping, disabling and removing databag service..."
confirm
sudo systemctl stop databag.service
sudo systemctl disable databag.service
sudo rm /etc/systemd/system/databag.service
sudo systemctl reload

echo "Removing databag data..."
confirm
sudo rm -rf /app/databag /opt/databag /var/lib/databag
if [ -z "$(ls -A /app)" ]; then
	sudo rmdir /app
fi

echo "Removing databag user..."
confirm
sudo userdel databag

echo "Done"
