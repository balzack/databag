# Install Databag on Raspberry Pi Zero V1.3

These instructions assume you have the following setup:
  - reverse proxy with an assigned hostname and certificate forwarding to your Raspberry Pi
  - micro usb to ethernet adapter
  - address reservation on your router
  - software tools for writing image (7zip & rufus, or equivalent)
  - reasonably large micro sd card (~16 GB)

## Step 1: setup the hardware
  Download the DietPi OS and select the ARMv6 32-bit image:<br/>
    https://dietpi.com/downloads/images/DietPi_RPi-ARMv6-Bullseye.7z<br/>
  Extract the img file with 7-zip<br/>
  Write the img file to the sd card with Rufus<br/>
  Insert the sd card in the pi and turn it on<br/>

## Step 2: install the OS
  SSH into the pi with root:dietpi<br/>
  Watch it update and reboot<br/>
  Select the minimal image<br/>

## Step 3: install databag dependencies
  apt-get -y install curl<br/>
  apt-get -y install net-tools<br/>
  apt-get -y install jq<br/>
  apt-get -y install netcat<br/>
  apt-get -y install unzip<br/>
  apt-get -y install wget<br/>
  apt-get -y install git<br/>
  apt-get -y install vim<br/>
  apt-get -y install fail2ban<br/>
  apt-get -y install imagemagick-6.q16<br/>
  apt-get -y install build-essential<br/>
  apt-get -y install sqlite3<br/>
  apt-get -y install openssh-client<br/>

## Step 4: install golang
  Download the armv6l version:<br/>
    https://go.dev/dl/go1.19.linux-armv6l.tar.gz<br/>
  Extract it to /usr/local:<br/>
    tar -C /usr/local -xzf go1.19.linux-armv6l.tar.gz<br/>

## Step 5: clone and build the server
  mkdir /app<br/>
  cd /app<br/>
  git clone https://github.com/balzack/databag.git<br/>
  cd /app/databag/net/server<br/>
  /usr/local/go/bin/go build databag<br/>
  
## Step 6: setup databag store path
  mkdir -p /var/lib/databag<br/>

## Step 7: initialize the internal datbase
  sqlite3 /var/lib/databag/databag.db "VACUUM;"<br/>
  sqlite3 /var/lib/databag/databag.db "CREATE TABLE IF NOT EXISTS 'configs' ('id' integer NOT NULL UNIQUE,'config_id' text NOT NULL,'str_value' text,'num_value' integer,'bool_value' numeric,'bin_value' blob,PRIMARY KEY ('id'));"<br/>
  sqlite3 /var/lib/databag/databag.db "CREATE UNIQUE INDEX IF NOT EXISTS 'idx_configs_config_id' ON 'configs'('config_id');"<br/>

## Step 8: download the webapp
  // because the react toolchain isn't available for the pi zero, the webapp is built in a github action<br/>
  Download webapp.tar.gz from the most recent release:<br/>
    https://github.com/balzack/databag/releases/download/v1.1.11/webapp.tar.gz<br/>
  SCP webapp.tar.gz into the pi<br/>
  Extract it into the web/build directory<br/>
    mkdir /app/databag/net/web/build<br/>
    tar xf webapp.tar.gz -C /app/databag/net/web/build/<br/>

## Step 9: launch the server
  cd /app/databag/net/server<br/>
  nohup nice -n -5 /usr/local/go/bin/go run databag -p 443 -s /var/lib/databag -w /app/databag/net/web/build &<br/>

## Step 10: configure the server
  Open your brower to the pi hostname<br/>
  Click the 'cog' in the upper right<br/>
  Set an admin password<br/>
  Select the 'cog' to bring up the settings modal<br/>
    - set your hostname<br/>
    - set the key to RSA 2048<br/>

## Step 11: create accounts
  Still in the admin dashboard<br/>
  Click the 'add-user' button<br/>
  Open the link in a new tab<br/>
  Set a username and password<br/>
  Setup your profile<br/>
  Connect with contacts on other federated instances<br/>

## Step 12: host for your friends and family
  Back in the admin dashboard<br/>
  Click the 'add-user' and send the link to anyone you want to host<br/>


