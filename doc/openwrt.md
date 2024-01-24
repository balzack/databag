# HowTo include Databag in an OpenWrt firmware image

These instructions assume can build an OpenWrt firmware for your hardware:
  - guide: [https://openwrt.org/docs/guide-developer/start](https://openwrt.org/docs/guide-developer/toolchain/use-buildsystem)
  - you will likely also want to install nginx and configure it as a reverse proxy to the databag service

## Databag is currently included as a custom feed
  - in feed.conf at the root of the repository add:
  -     src-git databag https://github.com/balzack/databag.git
  - update the package list by running:
  -     scripts/feeds update databag
  - install the pacakge by running:
  -     scripts/feeds install databag
  - include the pacakge in the firmware by running:
  -     make menuconfig
  - enable databag under net/instant messaging/databag
  - build the firmware by running:
  -     make -j1 V=s package/databag/compile
  - flash and boot the resulting image

## Configure the Databag service
  - change the port as desired
  -     uci set databag.@databag[0].service_port='<port>'
  - change the storage path to your mounted USB path
  -     uci set databag.@databag[0].store_path='<path>'
  - reboot the device
