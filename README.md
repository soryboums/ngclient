# ngclient

ngclient is a kickstarter for [AngularJS](https://angularjs.org) projects. This is a clone of Josh David Miller project on github [ngbp](https://github.com/ngbp/ngbp) with packages up to date and the exclusive use of npm intsead of using both npm and bower.

In this project I also implement an user management using json web token on an [Express](https://expressjs.com/) / [NodeJS](https://nodejs.org) server.

***

## Quick Start with Vagrant

Install [Vagrant](https://www.vagrantup.com/) and then:

```sh
$ cd ngclient
$ vagrant up
$ vagrant ssh
$ cd /vagrant
$ npm start
```
Finally, go to [`http://localhost:9090/#/home`](http://localhost:9090/#/home).

***

## Standalone Quick Start

Install [Node.js](https://nodejs.org) and then:

```sh
$ cd ngclient
$ sudo npm -g install grunt-cli karma
$ npm install
$ grunt watch
```

Now open `file:///path/to/ngclient-folder/build/index.html` in your browser.
Happy coding!
