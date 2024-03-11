cd /root
wget -P /app https://go.dev/dl/go1.18.10.linux-amd64.tar.gz
tar -C /usr/local -xzf /app/go1.18.10.linux-amd64.tar.gz 

apt-get update
apt-get -y install git build-essential npm vim

curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

npm install --global yarn
npm install -g n
n stable

cd /app/databag
git checkout .

yarn --cwd /app/databag/net/web install
yarn --cwd /app/databag/net/web build
cd /app/databag/net/server; /usr/local/go/bin/go build databag
