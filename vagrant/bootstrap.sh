#!/usr/bin/env bash

# start nginx
systemctl restart nginx
systemctl enable nginx
service nginx restart


# start the node version of the app.
cd /vagrant/www/etc/node
forever start ./bin/www

cat /vagrant/www/vagrant/motd.txt
