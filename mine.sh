#!/bin/bash

alias el="elements-cli -datadir=$PWD/hasura/liquidregtest/liquid-config -rpcport=7045"
while true
do
  el generatetoaddress 1 $(el getnewaddress)
  sleep 5
done
