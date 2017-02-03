#!/bin/bash
echo '************************************************************************'
echo '*********************** Installing the bootstrap ***********************'
echo '************************************************************************'
echo '************************** update the system ***************************'
sudo apt-get update
if which node > /dev/null
then
    echo '********************** skip node, npm, grunt installation ***************************'
else 
    echo '*********************** Installing nodejs and npm ***********************'
    sudo apt-get install nodejs npm -y
    sudo ln -s /usr/bin/nodejs /usr/local/bin/node
    sudo ln -s /usr/bin/npm /usr/local/bin/npm
fi

if which git > /dev/null
then
    echo '********************** skip GIT installation ***************************'
else
    echo '************************** Installing GIT **************************'
    sudo apt-get install git -y
fi

if which mongodb > /dev/null
then
    echo '********************** skip mongodb installation ***************************'
else
    echo '************************** Install MongoDB **************************'
    sudo apt-get install mongodb -y
fi

echo '**************************** Installing bower ****************************'
sudo npm install -g bower
echo '**************************** Installing karma ****************************'
sudo npm install -g karma
echo '**************************** Installing grunt ****************************'
sudo npm install -g grunt

echo '*********************** Installing client side requirements ************************'
cd /vagrant/client
npm install --no-bin-links

echo '*********************** Installing server side requirements ************************'
cd /vagrant/server
npm install --no-bin-links

echo '*********************** Starting the server ************************'
npm start