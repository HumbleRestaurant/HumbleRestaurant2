#!/usr/bin/env bash
echo '===========Clear Ports=============='
sudo fuser -k 80/tcp
sudo fuser -k 3000/tcp
sudo fuser -k 3100/tcp

echo '===========Service Image=============='
cd ./Image-server/
sudo npm install
sudo node server.js &

echo '===========Front Build=============='
cd ../HumbleRestaurant-front/
sudo npm install
sudo ng build

echo '===========Service Server=============='
cd ../HumbleRestaurant-server/
sudo npm install
sudo node server.js &
