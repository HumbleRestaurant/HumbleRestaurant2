#!/usr/bin/env bash
fuser -k 80/tcp
fuser -k 3100/tcp

cd ./HumbleRestaurant-server
npm install
pm2 start server.js &

cd ../HumbleRestaurant-front/
npm install
ng build

cd ././Image-server/
npm install
pm2 start server.js &
