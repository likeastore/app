# Likeastore.

API and Web Client of awesome Likeastore. application.

## How to install?

Install few things required for development.

Mocha is used for unit testing,

```
$ npm install -g mocha
```

Client package manager,

```
$ npm install -g bower
```

Grunt build system,

```
$ npm install -g grunt-cli
```

After all developer depedencies are installed,

```
$ npm install
$ bower install
$ grunt
```

Run application,

```
$ node app.js
```

## Running collector

Application requires `collector` component to be up and running, to collect users data.

Clone collector app,

```
$ git clone git@github.com:likeastore/collector.git
```

Run tests,

```
$ mocha
```

Run collector,

```
$ node app.js
```

## Useful tools / tips

* To quickly clean up developers database, run

```
$ node tools/cleanDb.js
```