FROM ubuntu:20.04
LABEL maintainer="roland.osborne@gmail.com"

EXPOSE 7000

ENV TZ=America/Los_Angeles
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get update

RUN apt-get -y install curl
RUN apt-get -y install net-tools
RUN apt-get -y install jq
RUN apt-get -y install netcat
RUN apt-get -y install unzip
RUN apt-get -y install wget
RUN apt-get -y install git
RUN apt-get -y install vim
RUN apt-get -y install fail2ban
RUN apt-get -y install imagemagick-6.q16
RUN apt-get -y install ffmpeg
RUN apt-get -y install build-essential
RUN apt-get -y install sqlite3
RUN apt-get -y install npm

RUN apt-get -y upgrade

RUN npm install --global yarn
RUN npm install -g n
RUN n stable

RUN mkdir /app
RUN wget -P /app https://go.dev/dl/go1.17.5.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf /app/go1.17.5.linux-amd64.tar.gz
RUN git  clone https://github.com/balzack/databag.git /app/databag
RUN yarn --cwd /app/databag/net/web install
RUN yarn --cwd /app/databag/net/web build
RUN cd /app/databag/net/server; /usr/local/go/bin/go build databag

RUN mkdir /opt/databag

ADD transform /opt/databag/transform

RUN mkdir -p /var/lib/databag

RUN echo 'export PATH=$PATH:/usr/local/go/bin' >> /root/.bashrc
RUN echo "set expandtab\nset tabstop=2\nset softtabstop=2\nset shiftwidth=2\n" > /root/.vimrc
RUN echo "bind 'set mark-symlinked-directories on'" >> /root/.bashrc

ADD entrypoint.sh /app

ENTRYPOINT ["/app/entrypoint.sh"]

