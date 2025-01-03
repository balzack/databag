#!/bin/bash

sudo systemctl stop databag.service
sudo systemctl disable databag.service
sudo rm /etc/systemd/system/databag.service
sudo systemctl reload
sudo rm -rf /app/databag /opt/databag /var/lib/databag

if [ -z "$(ls -A /app)" ]; then
	sudo rmdir /app
fi

echo "Done"
