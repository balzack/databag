# Install Databag on Raspberry Pi Zero (1)

## These instructions assume you have the following setup:
  - reverse proxy with an assigned hostname and certificate forwarding to your Raspberry Pi
  - micro usb to ethernet adapter
  - address reservation on your router
  - reasonably large micro sd card (~64 GB)

## Step 1: setup the hardware
  Download the DietPi OS and select the ARMv6 32-bit image:
    https://dietpi.com/downloads/images/DietPi_RPi-ARMv6-Bullseye.7z
  Extract the img file with 7-zip
  Write the img file to the sd card with Rufus
  Insert the sd card in the pi and turn it on

## Step 2: install the OS
  SSH into the pi with root:dietpi
  Watch it update and reboot
  Install the minimal image

## Step 3: install databag dependencies
  apt-get -y install curl
  apt-get -y install net-tools
  apt-get -y install jq
  apt-get -y install netcat
  apt-get -y install unzip
  apt-get -y install wget
  apt-get -y install git 
  apt-get -y install vim 
  apt-get -y install fail2ban
  apt-get -y install imagemagick-6.q16
  apt-get -y install ffmpeg
  apt-get -y install build-essential
  apt-get -y install sqlite3
  apt-get -y install openssh-client

## Step 4: install golang
  Download the armv6l version:
    https://go.dev/dl/go1.19.linux-armv6l.tar.gz
  Extract it to /usr/local
    tar -C /usr/local -xzf go1.19.linux-armv6l.tar.gz

## Step 5: setup databag paths
  mkdir -p /var/lib/databag
  mkdir -p /opt/databag/transform
  cp /app/databag/net/container/transform/* /opt/databag/transform/

## Step 6: initialize the internal datbase
  sqlite3 /var/lib/databag/databag.db "VACUUM;"
  sqlite3 /var/lib/databag/databag.db "CREATE TABLE IF NOT EXISTS 'configs' ('id' integer NOT NULL UNIQUE,'config_id' text NOT NULL,'str_value' text,'num_value' integer,'bool_value' numeric,'bin_value' blob,PRIMARY KEY ('id'));"
  sqlite3 /var/lib/databag/databag.db "CREATE UNIQUE INDEX IF NOT EXISTS 'idx_configs_config_id' ON 'configs'('config_id');"
  sqlite3 /var/lib/databag/databag.db "insert into configs (config_id, str_value) values ('asset_path', '/var/lib/databag/');"
  sqlite3 /var/lib/databag/databag.db "insert into configs (config_id, str_value) values ('script_path', '/opt/databag/transform/');"

## Step 7: clone and build the server
  mkdir /app
  cd /app
  git clone https://github.com/balzack/databag.git
  cd /app/databag/net/server
  /usr/local/go/bin/go build databag

## Step 8: download the webapp
  // because the react toolchain isn't available for the pi zero, the webapp is build in a github action
  Download webapp.zip from the most recent build:
    https://github.com/balzack/databag/actions/runs/2981276524
  SCP webapp.zip into the pi
  Extract it into the web/build directory
    mkdir /app/databag/net/web/build
    unzip webapp.zip -d /app/databag/net/web/build/

## Step 9: launch the server
  cd /app/databag/net/server
  nohup /usr/local/go/bin/go run databag

## Step 10: configure the server
  Open your brower to the pi hostname
  Click the 'cog' in the upper right
  Set an admin password
  Select the 'cog' to bring up the settings modal
    - set your hostname
    - set the key to RSA 2048
    - enable images
    - disable audio
    - disable video

## Step 11: create accounts
  Still in the admin dashboard
  Click the 'add-user' button
  Open the link in a new tab
  Set a username and password
  Setup your profile
  Connect with contacts on federated instances

## Step 12: host for your friends and family
  Back in the admin dashboard
  Click the 'add-user' and send the link to anyone you want to host


