#!/bin/bash


while true
do
  docker exec -it liquid elements-cli -datadir=/home/elements/.elements generatetoaddress 1 $(docker exec -it liquid elements-cli -datadir=/home/elements/.elements getnewaddress)
  sleep 8
done
