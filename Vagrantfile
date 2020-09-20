# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

    config.vm.network "private_network", ip: "192.168.33.10"

    # config.vm.network "public_network"

    config.vm.synced_folder ".", "/vagrant/www", mount_options: ['dmode=777', 'fmode=777']

    config.vm.provider :virtualbox do |vb|
        #vb.gui = true
        vb.customize ["modifyvm", :id, "--memory", 8096, "--cpus", 4, "--ioapic", "on"]
    end

    config.vm.provision :file, source: "vagrant/nginx/app.conf", destination: "app.conf"
    config.vm.provision :file, source: "vagrant/nginx/nginx.conf", destination: "nginx.conf"
    config.vm.provision :shell, path: "vagrant/provision.sh"
    config.vm.provision :shell, path: "vagrant/bootstrap.sh", run: 'always'

    config.vm.define "server", primary: true do |server|
        server.vm.box = 'ubuntu/xenial64'
    end

    # used for debugging css inconsitencies in linux chrome which is used
    # for frontend regression testing
    #config.vm.define "desktop", autostart: false do |desktop|
    #    desktop.vm.box = "gusztavvargadr/ubuntu-desktop"
    #
    #    desktop.vm.provider :virtualbox do |vb|
    #        vb.gui = true
    #    end
    #end

end