#################################
#Install script for Ubuntu 14.04#
#################################

apt-get update

#install Docker
apt-get install docker.io

#uncomment line below to allow tab-completion of Docker commands in BASH
source /etc/bash_completion.d/docker.io

#make sure APT system can deal with https URLs: the file /usr/lib/apt/methods/https
#should exist. If it doesn't, you need to install the package apt-transport-https

[ -e /usr/lib/apt/methods/https ] || {
  apt-get update
  apt-get install apt-transport-https
}

#Add Docker repository key to local keychain
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9

#
sh -c "echo deb https://get.docker.com/ubuntu docker main\ > /etc/apt/sources.list.d/docker.list"
apt-get update
apt-get install lxc-docker
