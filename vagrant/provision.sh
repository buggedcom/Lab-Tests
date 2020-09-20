#!/usr/bin/env bash

# Set timezone
ln -sf  /usr/share/zoneinfo/Europe/Helsinki /etc/localtime

# update server
apt-get update

# Install nginx
systemctl disable apache2
systemctl stop apache2
apt-get remove apache2
apt-get install -y nginx
mv /home/vagrant/nginx.conf /etc/nginx/nginx.conf
mv /home/vagrant/app.conf /etc/nginx/sites-enabled/app.conf
rm /etc/nginx/sites-enabled/default
systemctl restart nginx
systemctl enable nginx

# Install nodejs, npm, yarn
apt-get install -y nodejs npm
npm cache clean
npm install n -g
npm install -g npm@latest
npm update -g
n stable
apt-get purge -y nodejs npm
ln -sf /usr/local/bin/node /usr/bin/node
ln -sf /usr/local/bin/npm /usr/bin/npm
npm install -g webpack-dev-server
npm install -g nodemon
npm install -g create-react-app
npm install -g forever
npm install -g yarn

# Install node modules for react frontend
cd /vagrant/www/etc/frontend/
yarn install --dev

# Install node modules for backend
cd /vagrant/www/etc/node
yarn install --dev
export DEBUG='express:*' # for debugging of requests in dev server

# Install chromium dependancies for puppeteer and screenshot regression testing
apt-get install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget imagemagick graphicsmagick
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
rm google-chrome-stable_current_amd64.deb

# Start the node version of the app.
cd /vagrant/www/etc/node
forever start ./bin/www

# restart nginx to allow proxy pass to pass through
service nginx restart

# Add login ascii
cp /vagrant/www/vagrant/motd.txt /etc/motd