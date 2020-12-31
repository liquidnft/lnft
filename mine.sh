#!/bin/bash
while true
do
  el generatetoaddress 1 $(el getnewaddress)
  sleep 5
done
