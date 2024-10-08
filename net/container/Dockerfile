FROM ubuntu:20.04 as build
ARG TARGETPLATFORM
LABEL maintainer="roland.osborne@gmail.com"

EXPOSE 7000

ENV TZ=America/Los_Angeles
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN        apt-get   update

RUN apt-get -y install curl net-tools jq netcat unzip wget git vim fail2ban imagemagick-6.q16 ffmpeg build-essential sqlite3 npm

RUN apt-get -y upgrade

RUN npm install --global yarn
RUN npm install -g n
RUN n stable

RUN mkdir /app

RUN if [ "$TARGETPLATFORM" = "linux/amd64" ]; then ARCHITECTURE=amd64; elif [ "$TARGETPLATFORM" = "linux/arm64" ]; then ARCHITECTURE=arm64; elif [ "$TARGETPLATFORM" = "linux/arm64" ]; then ARCHITECTURE=aarch64; else ARCHITECTURE=unsupported; fi \
    && wget -P /app https://go.dev/dl/go1.23.1.linux-${ARCHITECTURE}.tar.gz \
    && tar -C /usr/local -xzf /app/go1.23.1.linux-${ARCHITECTURE}.tar.gz 

RUN git            clone          https://github.com/balzack/databag.git     /app/databag

RUN yarn config set network-timeout 300000
RUN yarn --cwd /app/databag/net/web install
RUN yarn --cwd /app/databag/net/web build
RUN cd /app/databag/net/server; /usr/local/go/bin/go build databag

RUN mkdir /opt/databag

ADD transform /opt/databag/transform

RUN mkdir -p /var/lib/databag

RUN echo 'export PATH=$PATH:/usr/local/go/bin' >> /root/.bashrc
RUN echo "set expandtab\nset tabstop=2\nset softtabstop=2\nset shiftwidth=2\nset encoding=utf-8\nset fileencoding=utf-8\n" > /root/.vimrc
RUN echo "bind 'set mark-symlinked-directories on'" >> /root/.bashrc

ADD entrypoint.sh /app
ADD dev_setup.sh /app

RUN rm -rf /usr/local/go
RUN rm -rf /root/go
RUN rm -rf /app/go*
RUN rm -rf /root/.cache/go*

RUN yarn cache clean
RUN rm -rf /app/databag/app
RUN rm -rf /app/databag/net/web/node_modules

RUN n prune
RUN npm uninstall -g n
RUN rm -rf /usr/local/n
RUN rm -rf /usr/local/bin/node 

RUN apt-get -y remove git build-essential npm vim nodejs linux-libc-dev
RUN rm -rf /var/lib/apt/lists

FROM scratch
COPY --from=build / /

ENTRYPOINT ["/app/entrypoint.sh"]

