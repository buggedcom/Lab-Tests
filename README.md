Terveystalo Laboratory Tests
-------------
* Written by Oliver Lillie <buggedcom@gmail.com>    
* CV - [https://www.dropbox.com/s/e60phexa2mgazty/oliver-lillie-cv-and-projects.pdf?dl=0](https://www.dropbox.com/s/e60phexa2mgazty/oliver-lillie-cv-and-projects.pdf?dl=0)
* LinkedIn - [https://linkedin.com/in/oliverlillie/](https://linkedin.com/in/oliverlillie/)
* This package - [https://www.dropbox.com/sh/9jucgxll841olwm/AADQf9qkJQxNVouvIHHxmJrxa?dl=0](https://www.dropbox.com/sh/9jucgxll841olwm/AADQf9qkJQxNVouvIHHxmJrxa?dl=0)

Brief
-------------
Laboratory test collection consists of multiple different measurements
Laboratory function needs a simple tool to maintain their laboratory test collection
Laboratory test consists of ID, name, unit, reference interval (min and max range for "good values")
For example:
1; Hemoglobin; g/l; 134; 167
2; LDL-Cholestrol; mmol/l; 0; 3

Implement a REST-API which has following features:
* Get laboratory tests
* Add new laboratory test
* Modify existing laboratory test
* Remove laboratory test 

Implement a way to save this information (light implementation like sqlite or text file)
Implement a UI to perform these functions and to check if value given in UI is between reference interval or not

Try to create easy-to-understand code and try to use existing components and consider writing tests

Prerequisites
-------------
Vagrant and Virtualbox are required for this demo.

* `Vagrant` - [https://www.vagrantup.com/downloads.html](https://www.vagrantup.com/downloads.html)
* `Virtualbox` - [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)

Quickstart
-------------
```
cd ~/path/to/directory/
vagrant up server
```

Running the above command will import a vagrant box `ubuntu/xenial64`, provision, and boot the machine. It may take a few minutes to create the machine since none of the node modules required for either the backend or frontend are shipped with the distribution.  

After vagrant setup has completed you should see a box wil final instructions.

However for completeness the frontend has already been built for production and the node app server will have already been started on boot of the machine.

Visit [http://192.168.33.10](http://192.168.33.10) to start.

Run tests
--------------

There are four test suites, however considering this is just a test project they are not all complete to a polished level.

There are two test suits for the frontend.
* React component tests
* UI Regression tests

To run:
```
vagrant up server
vagrant ssh server
cd /vagrant/www/etc/frontend
npm run test-components
npm run test-regression
```

And there two test suites for the node backend, but they are run through the same command.
* API tests
* Model tests

To run:
```
vagrant up server
vagrant ssh server
cd /vagrant/www/etc/node
npm run test
```

Things to note
--------------
I was originally intending to make it 100% ARIA and keyboard accessible, however I have simply ran out of time. If you need to see my utilisations of ARIA or keyboard interaction you can checkout this test project - [DPKG Browser](https://www.dropbox.com/sh/v2y4bitxgqtkgna/AACYtbMCcEfpHGlZeUP_HeIfa?dl=0)  
