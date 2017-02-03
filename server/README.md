# ngclient Project: server side

## Quick Start


```sh
$ cd server
$ npm install
$ cd bin
$ openssl genrsa 1024 > private.key
$ openssl req -new -key private.key -out cert.csr
$ openssl x509 -req -in cert.csr -signkey private.key -out certificate.pem
$ cd ..
$ npm start
```

Finally, go `localhost:3000` in your browser.

You will be redirected on the secure port `localhost:3443`
