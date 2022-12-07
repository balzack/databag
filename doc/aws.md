# Install Databag in AWS

These instructions assume you have the following setup:
  - an AMD64 Ubuntu EC2 instance with incoming ports 443 and 80<br/>
  - an EFS instance<br/>
  - a domain name pointing the the IP of your EC2 instance<br/>

## Step 1: obtain cert
  sudo apt-get install certbot<br/>
  sudo certbot certonly --standalone -d [dns name]<br/>

## Step 2: install databag dependencies
  sudo apt-get -y install ffmpeg<br/>
  sudo apt-get -y install curl<br/>
  sudo apt-get -y install net-tools<br/>
  sudo apt-get -y install jq<br/>
  sudo apt-get -y install netcat<br/>
  sudo apt-get -y install unzip<br/>
  sudo apt-get -y install wget<br/>
  sudo apt-get -y install git<br/>
  sudo apt-get -y install vim<br/>
  sudo apt-get -y install fail2ban<br/>
  sudo apt-get -y install imagemagick-6.q16<br/>
  sudo apt-get -y install build-essential<br/>
  sudo apt-get -y install sqlite3<br/>
  sudo apt-get -y install openssh-client<br/>
  apt-get -y install npm<br/>
  apt-get -y upgrade<br/>
  npm install --global yarn<br/>
  npm install -g n<br/>
  n stable<br/>

## Step 3: download and install golang
  wget https://go.dev/dl/go1.19.3.linux-amd64.tar.gz<br/>
  sudo tar -C /usr/local -xzf go1.19.3.linux-amd64.tar.gz<br/>

## Step 4: clone and build the server
  mkdir /app<br/>
  cd /app<br/>
  git clone https://github.com/balzack/databag.git<br/>
  cd /app/databag/net/web<br/>
  yarn config set network-timeout 300000<br/>
  yarn --cwd /app/databag/net/web install<br/>
  yarn --cwd /app/databag/net/web build<br/>
  cd /app/databag/net/server<br/>
  /usr/local/go/bin/go build databag<br/>
  
## Step 5: setup databag paths
  mkdir -p /var/lib/databag/assets<br/>
  mkdir -p /opt/databag/transform<br/>
  cp /app/databag/net/container/transform/* /opt/databag/transform/<br/>

## Step 6: mount EFS to store assets
  sudo apt-get update<br/>
  sudo apt-get -y install git binutils<br/>
  git clone https://github.com/aws/efs-utils<br/>
  cd efs-utils<br/>
  ./build-deb.sh<br/>
  sudo apt-get -y install ./build/amazon-efs-utils*deb<br/>
  sudo mount -t efs file-system-id /var/lib/databag/assets<br/>

## Step 7: initialize the internal datbase
  sqlite3 /var/lib/databag/databag.db "VACUUM;"<br/>
  sqlite3 /var/lib/databag/databag.db "CREATE TABLE IF NOT EXISTS 'configs' ('id' integer NOT NULL UNIQUE,'config_id' text NOT NULL,'str_value' text,'num_value' integer,'bool_value' numeric,'bin_value' blob,PRIMARY KEY ('id'));"<br/>
  sqlite3 /var/lib/databag/databag.db "CREATE UNIQUE INDEX IF NOT EXISTS 'idx_configs_config_id' ON 'configs'('config_id');"<br/>
  sqlite3 /var/lib/databag/databag.db "insert into configs (config_id, str_value) values ('asset_path', '/var/lib/databag/assets');"<br/>
  sqlite3 /var/lib/databag/databag.db "insert into configs (config_id, str_value) values ('script_path', '/opt/databag/transform/');"<br/>

## Step 8: launch the server
  cd /app/databag/net/server<br/>
  nohup nice -n -5 /usr/local/go/bin/go run databag [dns name] &<br/>

## Step 9: configure the server
  Open your brower to https://[dns name]<br/>
  Click the 'cog' in the upper right<br/>
  Set an admin password<br/>
  Select the 'cog' to bring up the settings modal<br/>
    - set your hostname as [dns name]<br/>
    - set the key to RSA 2048<br/>
    - enable push notifications<br/>
    - enable images<br/>
    - disable audio<br/>
    - disable video<br/>

## Step 10: create accounts
  Still in the admin dashboard<br/>
  Click the 'add-user' button<br/>
  Open the link in a new tab<br/>
  Set a username and password<br/>
  Setup your profile<br/>
  Connect with contacts on other federated instances<br/>

## Step 11: host for your friends and family
  Back in the admin dashboard<br/>
  Click the 'add-user' and send the link to anyone you want to host<br/>


